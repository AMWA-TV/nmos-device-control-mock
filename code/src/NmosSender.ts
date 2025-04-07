import { jsonIgnore, jsonIgnoreReplacer } from "json-ignore";
import { NmosResource } from "./NmosResource";
import { RegistrationClient } from "./RegistrationClient";
import { NmosActivation, TransportParamsSet } from "./NmosReceiver";
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
    public staged: NmosSenderActive | null;

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
        registrationClient: RegistrationClient)
    {
        super(id, `${base_label} sender`, registrationClient);

        this.flow_id = flow_id;
        this.device_id = device_id;
        this.transport = transport;
        this.interface_bindings = [ 'eth0' ];
        this.manifest_href = manifest_href;
        this.subscription = {
            "receiver_id": null,
            "active": true
        };
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

    public abstract FetchStaged() : NmosSenderActive | null;

    public abstract FetchConstraints() : object | null;

    public abstract FetchSdp(): string | null;

    public abstract ChangeSenderSettings(settings: NmosSenderActive);

    public AttachMonitoringAgent(agent: NcSenderMonitor)
    {
        this.agent = agent;
    }
}

export abstract class NmosSenderActive
{
    public receiver_id: string | null;
    public master_enable: boolean;
    public activation: NmosActivation;
    
    public transport_params: TransportParamsSet[] | null

    public constructor(
        receiver_id: string | null,
        master_enable: boolean,
        activation: NmosActivation,
        transport_params: TransportParamsSet[])
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