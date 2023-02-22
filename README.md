# \[Work In Progress\] AMWA NMOS Device Control Mock Application

[![Lint Status](https://github.com/AMWA-TV/nmos-device-control-mock/workflows/Lint/badge.svg)](https://github.com/AMWA-TV/nmos-device-control-mock/actions?query=workflow%3ALint)
[![Render Status](https://github.com/AMWA-TV/nmos-device-control-mock/workflows/Render/badge.svg)](https://github.com/AMWA-TV/nmos-device-control-mock/actions?query=workflow%3ARender)

<!-- INTRO-START -->

This is a mock NMOS device written in Typescript and running on the NodeJS stack. It has support for the NMOS Modeling suite (MS-05-02 and IS-12 in particular).

It also has support for IS-04 and IS-05 with some limitations:

* It does not support DND-SD discovery and the NMOS registry endpoint has to be configured in the config.json file
* It does not support the IS-05 bulk API as it only has 1 receiver currently.

## Installation

`Note`: npm commands need to be executed from the `/code` subfolder.

First install dependencies with

```bash
npm install
```

Modify the config.json properties for your configuration.
At the very least point `registry_address` and `registry_port` to the NMOS registry on your network.

## Usage

Build and run with:

```bash
npm run build-and-start
```

If you plan to make changes and want the app to recompile and run whenever you save run with:

```bash
npm run serve
```

## Configuration

These are the configuration keys which can be specified in the configuration file (config.json):

* notify_without_subscriptions - boolean flag which is set to false by default, but it can be set to true if you would like to get all notifications on all sessions without subscribing (for debugging purposes only).
* work_without_registry - boolean flag which is set to false by default, but it can be set to true if you would like the mock device not to attempt to register with an NMOS registry.

## Specifications

* [AMWA IS-04 NMOS Discovery and Registration](https://specs.amwa.tv/is-04)
* [AMWA IS-05 NMOS Device Connection Management](https://specs.amwa.tv/is-05)
* [AMWA IS-12 NMOS Control Protocol](https://specs.amwa.tv/is-12)
* [MS-05-01 NMOS Control Architecture](https://specs.amwa.tv/ms-05-01)
* [MS-05-02 NMOS Control Framework](https://specs.amwa.tv/ms-05-02)
* [MS-05-03 NMOS Control Block Specifications](https://specs.amwa.tv/ms-05-03)

<!-- INTRO-END -->
