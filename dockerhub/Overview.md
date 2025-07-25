# AMWA NMOS Device Control Mock Application

This is a mock [NMOS](https://specs.amwa.tv/nmos/) device with support for the [NMOS Control & Monitoring](https://specs.amwa.tv/nmos/#device-control--monitoring) suite:

* MS-05-02
* IS-12
* BCP-008-01
* BCP-008-02

It also has support for the [IS-14 NMOS Device Configuration](https://specs.amwa.tv/is-14/) specification.

It also has support for other NMOS specifications (for a full list check the GitHub [repo](https://github.com/AMWA-TV/nmos-device-control-mock)).

## Usage

The application requires a `config.json` file present in a config volume mapped from the host. This file has required startup information and is also used to persist generated UUIDs (the container will write back to the file).

Consider the following structure:

```ini
my-deployment/
├── mock-01/
│   └── config.json
│
├── mock-02/
│   └── config.json
...
└── docker-compose.yml
```

Where the `config.json` may look like this:

```json
{
    "address": "192.168.1.23",
    "port": 8080,
    "outside_port": 49999,
    "base_label": "NC-01",
    "registry_address": "192.168.1.50",
    "registry_port": 80,
    "notify_without_subscriptions": false,
    "work_without_registry": false,
    "streaming_profile": "RTP_RAW"
}
```

where:

* address - the address advertised in NMOS API URLs (most commonly will be your Docker host's address)
* port - the internal port binding (the Docker image uses 8080 so no need to change it)
* outside_port - the port you are going to map to the container from your Docker host (this will be used in NMOS API URLs)
* base_label - the base label fragment used in NMOS Resource labels
* registry_address - the address of the NMOS Registration service
* registry_port - the port number of the NMOS Registration service
* work_without_registry - controls if the device can operate without an NMOS Registration service

For details on the other configuration options check the GitHub [repo](https://github.com/AMWA-TV/nmos-device-control-mock).

Running a container can be achieved using docker run:

```bash
docker run --name=nmos-device-control-mock -v ./mock-01:/app/dist/server/config -p 49999:8080 amwa/nmos-device-control-mock
```

or by using docker compose:

```bash
docker compose -p nmos-control up
```

with a `docker-compose.yml` like so:

```bash
version: "3.8"

services:
  mock-01:
    image: amwa/nmos-device-control-mock:latest
    restart: always
    container_name: nmos-device-control-mock-01
    hostname: nmos-device-control-mock-01
    ports:
      - 49999:8080
    volumes:
      - ./mock-01:/app/dist/server/config
```

## Source

The latest source code can be found at [https://github.com/AMWA-TV/nmos-device-control-mock](https://github.com/AMWA-TV/nmos-device-control-mock).
