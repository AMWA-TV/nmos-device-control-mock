# \[Work In Progress\] AMWA NMOS Device Control Mock Application

[![Lint Status](https://github.com/AMWA-TV/nmos-device-control-mock/workflows/Lint/badge.svg)](https://github.com/AMWA-TV/nmos-device-control-mock/actions?query=workflow%3ALint)
[![Render Status](https://github.com/AMWA-TV/nmos-device-control-mock/workflows/Render/badge.svg)](https://github.com/AMWA-TV/nmos-device-control-mock/actions?query=workflow%3ARender)

<!-- INTRO-START -->

This is a mock NMOS device written in Typescript and running on the NodeJS stack. It has support for the NMOS Modeling architecture, control models and protocol.

It also has support for IS-04 and IS-05 with some limitations:

* It does not support DND-SD discovery and the NMOS registry endpoint has to be configured in the config.json file
* It does not support the IS-05 bulk API as it only has 1 receiver currently.

## Installation

`Note`: npm commands need to be executed from the `/code` subfolder.

First install dependencies with

`npm install`

Modify the config.json properties for your configuration.
At the very least point `registry_address` and `registry_port` to the NMOS registry on your network.

### Usage

Run with

`npm run serve`

<!-- INTRO-END -->
