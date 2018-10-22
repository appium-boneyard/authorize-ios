import { exec } from 'teen_process';
import xcode from 'appium-xcode';
import { fs, logger } from 'appium-support';
import path from 'path';
import _glob from 'glob';
import B from 'bluebird';


const glob = B.promisify(_glob);
const log = logger.getLogger('AuthorizeIOS');

export default async function authorize (insecure) {
  let xcodeDir;
  let user;

  try {
    // enable developer tools
    log.info('Enabling DevToolsSecurity');
    await exec('DevToolsSecurity', ['--enable']);
    // update security db -- removes authorization prompt
    log.info(`Updating security db for ${insecure ? 'insecure' : 'developer'} access`);
    const cmd = 'security';
    const args = [
      'authorizationdb', 'write', 'system.privilege.taskport',
      (insecure ? 'allow' : 'is-developer'),
    ];
    await exec(cmd, args);

    log.info('Granting access to built-in simulator apps');
    if (!process.env.HOME) {
      throw new Error('Could not determine your $HOME');
    }

    user = /\/([^/]+)$/.exec(process.env.HOME)[1];
    xcodeDir = await xcode.getPath();
    log.info(`The xcode directory is: ${xcodeDir}`);
  } catch (e) {
    log.errorAndThrow(e);
  }

  // change permission
  let olderXcodeSimulatorPath = path.resolve(xcodeDir,
                              'Platforms/iPhoneSimulator.platform/' +
                              'Developer/SDKs/iPhoneSimulator*.sdk/Applications');
  let directories = await glob(olderXcodeSimulatorPath);

  let newerXcodeSimulatorPath = path.resolve('/Library/Developer/CoreSimulator/' +
                              'Profiles/Runtimes/iOS *.simruntime/' +
                              'Contents/Resources/RuntimeRoot/Applications/');
  directories = directories.concat(await glob(newerXcodeSimulatorPath));

  directories = directories.filter(async (dir) => {
    return await fs.exists(dir);
  });

  let args = ['-R', `${user}:`, ...directories];

  log.info(`Changing ownership to '${user}' on directories: ${directories.join(', ')}`);
  try {
    await exec('chown', args);
  } catch (err) {
    log.error(`Encountered an issue changing user priveledges ` +
                 `for iOS sim app dirs: ${directories}`);
    log.error(`Error was: ${err.message}`);
  }
}
