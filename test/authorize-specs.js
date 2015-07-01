import authorize from '../lib/authorize';
import 'mochawait';
import * as teen_process from 'teen_process';
import * as xcode from 'appium-xcode';
import path from 'path';
import sinon from 'sinon';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import _ from 'lodash';

chai.should();
chai.use(chaiAsPromised);

let sandbox = null;
let SANDBOX = Symbol();
let mocks = {};
let libs = {teen_process, xcode, path};

describe('Authorize test', () =>{
  beforeEach(() => {
    sandbox = sinon.sandbox.create();  
    mocks[SANDBOX] = sandbox;
    console.log('sandbox' +sandbox);
    for (let [key, value] of _.pairs(libs)) {
      mocks[key] = sandbox.mock(value);
    }
  });

  afterEach(() => {
    sandbox.restore();
  });
  
  it('should throw and error', async () => {
    mocks.teen_process.expects('exec').once().withExactArgs('DevToolsSecurity', ['--enable']).throws('Error');
    await authorize().should.eventually.be.rejectedWith('Error');
    mocks[SANDBOX].verify();
  });

  it('should pass all mocks', async () => {
    mocks.teen_process.expects('exec').once().withExactArgs('DevToolsSecurity', ['--enable']).returns('expected');
    mocks.teen_process.expects('exec').once().withExactArgs('security authorizationdb write system.privilege.taskport is-developer');
    mocks.xcode.expects('getPath').once().returns('xcodeDir/Applications/Xcode.app/Contents/Developer');
    mocks.path.expects('resolve').once().withExactArgs('xcodeDir/Applications/Xcode.app/Contents/Developer',
                              'Platforms/iPhoneSimulator.platform/' +
                              'Developer/SDKs/iPhoneSimulator*.sdk/Applications');
    await authorize();
    mocks[SANDBOX].verify();
  });
});
  


