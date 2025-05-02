import { jsonIgnore, jsonIgnoreReplacer } from "json-ignore";
import { NmosResource } from "./NmosResource";
import { RegistrationClient } from "./RegistrationClient";
import { NmosActivation, TransportParamsSetActive, TransportParamsSetStaged } from "./NmosReceiver";
import { NcSenderMonitor } from "./NCModel/Features";

export abstract class NmosSender extends NmosResource
{
    public flow_id: string;
    public device_id: string;
    public transport: string;
    public interface_bindings: string[];
    public subscription: object;
    public manifest_href: string;
    
    @jsonIgnore()
    public constraints: object[];

    @jsonIgnore()
    public active: NmosSenderActive | null;

    @jsonIgnore()
    public staged: NmosSenderStaged | null;

    public caps: object;

    @jsonIgnore()
    public agent: NcSenderMonitor | null;

    public constructor(
        id: string,
        flow_id: string,
        device_id: string,
        base_label: string,
        transport: string,
        manifest_href: string,
        interface_bindings: string[],
        registrationClient: RegistrationClient)
    {
        super(id, `${base_label} sender`, registrationClient);

        this.flow_id = flow_id;
        this.device_id = device_id;
        this.transport = transport;
        this.interface_bindings = interface_bindings;
        this.manifest_href = manifest_href;
        this.subscription = new NmosSenderSubscription(null, true);
        this.tags = {};
        this.caps = {};

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

    public abstract FetchActive() : NmosSenderActive | null;

    public abstract FetchStaged() : NmosSenderStaged | null;

    public abstract FetchConstraints() : object | null;

    public abstract FetchSdp() : string | null;

    public abstract ChangeSenderSettings(settings: NmosSenderStaged) : NmosSenderStaged | null;

    public UpdateSubscription(
        receiver_id : string | null,
        active: boolean)
    {
        this.subscription = new NmosSenderSubscription(receiver_id, active);
        this.BumpVersion();
        this.registrationClient.RegisterOrUpdateResource<NmosSender>('sender', this);
    }

    public AttachMonitoringAgent(agent: NcSenderMonitor)
    {
        this.agent = agent;
    }
}

class NmosSenderSubscription
{
    public receiver_id : string | null;
    public active : boolean;

    public constructor(
        receiver_id : string | null,
        active: boolean)
    {
        this.receiver_id = receiver_id;
        this.active = active;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export abstract class NmosSenderActive
{
    public receiver_id: string | null;
    public master_enable: boolean;
    public activation: NmosActivation;
    
    public transport_params: TransportParamsSetActive[] | null

    public constructor(
        receiver_id: string | null,
        master_enable: boolean,
        activation: NmosActivation,
        transport_params: TransportParamsSetActive[])
    {
        this.receiver_id = receiver_id;
        this.master_enable = master_enable;
        this.activation = activation;
        this.transport_params = transport_params;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export abstract class NmosSenderStaged
{
    public receiver_id: string | null;
    public master_enable: boolean;
    public activation: NmosActivation;
    
    public transport_params: TransportParamsSetStaged[] | null

    public constructor(
        receiver_id: string | null,
        master_enable: boolean,
        activation: NmosActivation,
        transport_params: TransportParamsSetStaged[])
    {
        this.receiver_id = receiver_id;
        this.master_enable = master_enable;
        this.activation = activation;
        this.transport_params = transport_params;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}