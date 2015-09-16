import { getLogger } from 'appium-logger';
import { exec } from 'teen_process';
import { getPath } from 'appium-xcode';
import { fs } from 'appium-support';
import path from 'path';

const logger = getLogger('AuthorizeIOS');

export default async function authorize (insecure) {

  let xcodeDir;
  let user;

  try {
    // enable developer tools
    logger.info('Enabling DevToolsSecurity');
    await exec('DevToolsSecurity', ['--enable']);
    // update security db -- removes authorization prompt
    logger.info(`Updating security db for ` +
                `${insecure ? 'insecure' : 'developer'} access`);
    let cmd = `security authorizationdb write system.privilege.taskport` +
              ` ${insecure ? 'allow' : 'is-developer'}`;
    await exec(cmd);
    logger.info('Granting access to built-in simulator apps');

    if (!process.env.HOME) {
      throw new Error('Could not determine your $HOME');
    }

    user = /\/([^\/]+)$/.exec(process.env.HOME)[1];
    xcodeDir = await getPath();
    logger.info(`The xcode directory is : ${xcodeDir}`);
  } catch (e) {
    logger.errorAndThrow(e);
  }

  // change permission
  let olderXcodeSimulatorPath = path.resolve(xcodeDir,
                              'Platforms/iPhoneSimulator.platform/' +
                              'Developer/SDKs/iPhoneSimulator*.sdk/Applications');

  let newerXcodeSimulatorPath = path.resolve('/Library/Developer/CoreSimulator/' +
                              'Profiles/Runtimes/iOS\\ *.simruntime/' +
                              'Contents/Resources/RuntimeRoot/Applications/');

  let directories = [olderXcodeSimulatorPath, newerXcodeSimulatorPath].filter((dir) => {
    return fs.exists(dir);
  });

  let args = ['-R', `${user}:`, `${directories.join(' ')}`];

  try {
    await exec('chown', args);
  } catch (err) {
    logger.error(`Encountered an issue chmodding iOS sim app dirs: ` +
                 `${directories}` +
                 `error was: ${err.message}`);
  }
};
