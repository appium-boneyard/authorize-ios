
# authorize-ios

A little utility that pre-authorizes Instruments to run UIAutomation scripts against iOS devices

[![Build Status](https://travis-ci.org/appium/authorize-ios.svg)](https://travis-ci.org/appium/authorize-ios)
[![Coverage Status](https://coveralls.io/repos/appium/authorize-ios/badge.svg?branch=master&service=github)](https://coveralls.io/github/appium/authorize-ios?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/appium/authorize-ios.svg)](https://greenkeeper.io/)

##Installation##

(if you're using Appium, check the [Appium docs](https://github.com/appium/appium/blob/master/docs/en/drivers/ios-uiautomation.md#simulator-setup) for how to call this function. The document you are reading is for developers who are using this npm package, not Appium users)

`npm install authorize-ios`

##Usage##

`require('authorize-ios')()`

This will bring up an alert that prompts the user to input their sudo password. There's no away around this.
