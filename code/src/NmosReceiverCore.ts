import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NcReceiverMonitor } from './NCModel/Agents';

import { NmosResource } from './NmosResource';
import { RegistrationClient } from './RegistrationClient';

export abstract class NmosReceiverCore extends NmosResource
{
    public device_id: string;
    public transport: string;
    public interface_bindings: string[];
    public subscription: NmosReceiverSubscription;

    @jsonIgnore()
    public constraints: object[];

    @jsonIgnore()
    public active: NmosReceiverActive | null;

    @jsonIgnore()
    public staged: NmosReceiverActive | null;

    @jsonIgnore()
    public agent: NcReceiverMonitor | null;

    public constructor(
        id: string,
        device_id: string,
        base_label: string,
        transport: string,
        registrationClient: RegistrationClient)
    {
        super(id, `${base_label} receiver`, registrationClient);

        this.device_id = device_id;
        this.transport = transport;

        this.interface_bindings = [ 'eth0' ];
        this.subscription = new NmosReceiverSubscription(null, false);
        this.active = null;
        this.staged = null;
        this.constraints = [];
        this.agent = null;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }

    public FetchTransportType()
    {
        let split = this.transport.split('.');
        split.pop();
        return split.join('.');
    }

    public abstract FetchActive() : NmosReceiverActive | null;

    public abstract FetchStaged() : NmosReceiverActive | null;

    public abstract FetchConstraints() : object | null;

    public UpdateSubscription(
        sender_id : string | null,
        active: boolean)
    {
        this.subscription = new NmosReceiverSubscription(sender_id, active);
        this.BumpVersion();
        this.registrationClient.RegisterOrUpdateResource<NmosReceiverCore>('receiver', this);
    }

    public AttachMonitoringAgent(agent: NcReceiverMonitor)
    {
        this.agent = agent;
    }
}

class NmosReceiverSubscription
{
    public sender_id : string | null;
    public active : boolean;

    public constructor(
        sender_id : string | null,
        active: boolean)
    {
        this.sender_id = sender_id;
        this.active = active;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export abstract class NmosReceiverActive
{
    public sender_id: string | null;
    public master_enable: boolean;
    public activation: NmosActivation;
    
    public transport_params: TransportParamsSet[] | null

    public constructor(
        sender_id: string | null,
        master_enable: boolean,
        activation: NmosActivation,
        transport_params: TransportParamsSet[])
    {
        this.sender_id = sender_id;
        this.master_enable = master_enable;
        this.activation = activation;
        this.transport_params = transport_params;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NmosActivation
{
    public mode: string | null;
    public activation_time: string | null;
    public requested_time: string | null;

    public constructor(
        mode: string | null,
        activation_time: string | null,
        requested_time: string | null)
    {
        this.mode = null;
        this.activation_time = null;
        this.requested_time = null;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export abstract class TransportParamsSet {
    constructor() 
    {
    }
}

