# AMWA NMOS Device Control Mock Application

[![Lint Status](https://github.com/AMWA-TV/nmos-device-control-mock/workflows/Lint/badge.svg)](https://github.com/AMWA-TV/nmos-device-control-mock/actions?query=workflow%3ALint)
[![Render Status](https://github.com/AMWA-TV/nmos-device-control-mock/workflows/Render/badge.svg)](https://github.com/AMWA-TV/nmos-device-control-mock/actions?query=workflow%3ARender)

<!-- INTRO-START -->

This is a mock NMOS device written in Typescript and running on the NodeJS stack.

It has support for the NMOS Control & Monitoring suite:

* MS-05-02
* IS-12
* BCP-008-01
* BCP-008-02

It also has support for IS-04 and IS-05 with some limitations:

* It does not support DND-SD discovery and the NMOS registry endpoint has to be configured in the config.json file
* It does not support the IS-05 bulk API as it currently only runs 1 receiver and 1 sender

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
* streaming_profile - enum option `[RTP_RAW, RTP_MPEG_TS]` specifying the streaming profile of senders and receivers (default is `RTP_RAW`)

## Specifications supported

* [AMWA IS-04 NMOS Discovery and Registration](https://specs.amwa.tv/is-04)
* [AMWA IS-05 NMOS Device Connection Management](https://specs.amwa.tv/is-05)
* [AMWA IS-12 NMOS Control Protocol](https://specs.amwa.tv/is-12)
* [AMWA MS-05-01 NMOS Control Architecture](https://specs.amwa.tv/ms-05-01)
* [AMWA MS-05-02 NMOS Control Framework](https://specs.amwa.tv/ms-05-02)
* [AMWA BCP-002-02 NMOS Asset Distinguishing Information](https://specs.amwa.tv/bcp-002-02)
* [AMWA BCP-008-01 NMOS Receiver Status](https://specs.amwa.tv/bcp-008-01/)
* [AMWA BCP-008-02 NMOS Sender Status](https://specs.amwa.tv/bcp-008-02/)
* [AMWA BCP-006-04 NMOS Support for MPEG Transport Streams](https://specs.amwa.tv/bcp-006-04/)

<!-- INTRO-END -->
