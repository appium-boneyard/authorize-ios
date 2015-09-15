
# authorize-ios

A little utility that pre-authorizes Instruments to run UIAutomation scripts against iOS devices

[![Build Status](https://travis-ci.org/appium/authorize-ios.svg)](https://travis-ci.org/appium/authorize-ios)
[![Coverage Status](https://coveralls.io/repos/appium/authorize-ios/badge.svg?branch=master&service=github)](https://coveralls.io/github/appium/authorize-ios?branch=master)

##Installation##

(if you're using appium, check the appium readme for how to call this function. This readme is for developers who are using this npm package, not appium users)

`npm install authorize-ios`

##Usage##

`require('authorize-ios')()`

This will bring up an alert that prompts the user to input their sudo password. There's no away around this.
