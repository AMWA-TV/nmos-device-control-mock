import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';

import { NmosResource } from './NmosResource';
import { RegistrationClient } from './RegistrationClient';

import os from 'os';

export class NmosNode extends NmosResource
{
    public hostname: string;
    public caps: object;
    public href: string;
    public clocks: NmosClock[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public services: any[];
    public api: NmosApi;
    public interfaces: NmosInterface[]

    @jsonIgnore()
    private manufacturer: string;

    @jsonIgnore()
    private product: string;

    @jsonIgnore()
    private instance: string;

    public constructor(
        id: string,
        base_label: string,
        address: string,
        port: number,
        manufacturer: string,
        product: string,
        instance: string,
        registrationClient: RegistrationClient)
    {
        super(id, `${base_label} node`, registrationClient);

        this.href = `http://${address}:${port}`;
        
        this.manufacturer = manufacturer;
        this.product = product;
        this.instance = instance;

        this.tags = {
            "urn:x-nmos:tag:asset:manufacturer/v1.0": [ this.manufacturer ],
            "urn:x-nmos:tag:asset:product/v1.0": [ this.product ],
            "urn:x-nmos:tag:asset:instance-id/v1.0": [ this.instance ]
        };

        this.hostname = os.hostname();

        this.clocks = [ new NmosClock('clk0', 'internal') ];

        this.caps = {};

        this.services = [];

        this.api = new NmosApi(address, port);

        this.interfaces = [ new NmosInterface('00-15-5d-67-c3-4e', 'eth0', '00-15-5d-67-c3-4e'), new NmosInterface('96-1c-70-61-b1-54', 'eth1', '96-1c-70-61-b1-54') ];
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

class NmosClock
{
    public name : string;
    public ref_type : string;

    public constructor(
        name: string,
        ref_type: string) 
    {
        this.name = name;
        this.ref_type = ref_type;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

class NmosEndpoint
{
    public host : string;
    public port : number;
    public protocol : string;

    public constructor(
        host: string,
        port: number,
        protocol: string) 
    {
        this.host = host;
        this.port = port;
        this.protocol = protocol;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

class NmosApi
{
    public endpoints: NmosEndpoint[];
    public versions: string[];

    public constructor(
        address: string,
        port: number)
    {
        this.endpoints = [ new NmosEndpoint(address, port, 'http') ];
        this.versions = [ 'v1.3' ];
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

class NmosInterface
{
    public chassis_id: string;
    public name: string;
    public port_id: string;

    public constructor(
        chassis_id: string,
        name: string,
        port_id: string)
    {
        this.chassis_id = chassis_id;
        this.name = name;
        this.port_id = port_id;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}