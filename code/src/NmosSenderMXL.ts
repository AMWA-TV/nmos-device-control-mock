import { NmosSender, NmosSenderActive, NmosSenderStaged } from './NmosSender';
import { RegistrationClient } from './RegistrationClient';
import { NmosActivation, TransportParamsSetActive, TransportParamsSetStaged } from './NmosReceiver';
import { TAI64 } from 'tai64';
import { jsonIgnoreReplacer } from 'json-ignore';

export class NmosSenderMXL extends NmosSender
{
    public constructor(
        id: string,
        flow_id: string,
        device_id: string,
        base_label: string,
        transport: string,
        registrationClient: RegistrationClient)
    {
        super(id, flow_id, device_id, base_label, transport, null, [], registrationClient);

        this.active = new NmosSenderActiveMXL(
            null,
            true,
            new NmosActivation(null, null, null),
            [ new MXLSenderTransportParamsSetActive(flow_id)]);

        this.staged = new NmosSenderStagedMXL(
            null,
            true,
            new NmosActivation(null, null, null),
            [ new MXLSenderTransportParamsSetStaged(flow_id)]);

        this.constraints = [
        {
            'flow_id': {}
        }];
    }

    public FetchConstraints() : object | null {
        return this.constraints;
    }

    public FetchActive() : NmosSenderActive | null {
        return this.active;
    }

    public FetchStaged() : NmosSenderStaged | null {
        return this.staged;
    }

    public FetchSdp() : string | null
    {
        return null;
    }

    public ChangeSenderSettings(settings: NmosSenderStaged) : NmosSenderStaged | null
    {
        let mxlSettings = settings as NmosSenderStagedMXL;
        if(mxlSettings && this.active != null && this.staged != null)
        {
            let currentParams = this.active as NmosSenderActiveMXL;
            if(currentParams)
            {
                let activeParams: MXLSenderTransportParamsSetActive[];
                if(mxlSettings.transport_params)
                {
                    activeParams = [];
                    activeParams.push(currentParams.transport_params[0].ProcessStagedTransportParams(mxlSettings.transport_params[0]));
                    if(currentParams.transport_params.length == 2)
                    {
                        if(mxlSettings.transport_params.length == 2)
                            activeParams.push(currentParams.transport_params[1].ProcessStagedTransportParams(mxlSettings.transport_params[1]));
                        else
                            activeParams.push(currentParams.transport_params[1]);
                    }
                }
                else
                    activeParams = currentParams.transport_params;

                let activation: NmosActivation | null;

                if(settings.activation !== undefined)
                {
                    let activation_time: string | null;
                    let requested_time: string | null;

                    if(settings.activation.mode == "activate_immediate")
                    {
                        let versionSeconds = `${TAI64.now().toUnix().toString()}`;
                        activation_time = `${versionSeconds}:0`;
                        requested_time = null;
                    }
                    else
                    {
                        activation_time = settings.activation.activation_time !== undefined ? settings.activation.activation_time : currentParams.activation.activation_time;
                        requested_time = settings.activation.requested_time !== undefined ? settings.activation.requested_time : currentParams.activation.requested_time;
                    }
                    
                    activation = new NmosActivation(
                        settings.activation.mode !== undefined ? settings.activation.mode : currentParams.activation.mode,
                        activation_time,
                        requested_time);
                }
                else
                    activation = currentParams.activation;

                this.active = new NmosSenderActiveMXL(
                    settings.receiver_id !== undefined ? settings.receiver_id : this.active.receiver_id,
                    settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                    activation,
                    activeParams);
    
                this.staged = new NmosSenderStagedMXL(
                    settings.receiver_id !== undefined ? settings.receiver_id : this.active.receiver_id,
                    settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                    new NmosActivation(null, null, null),
                    mxlSettings.transport_params !== undefined ? mxlSettings.transport_params : activeParams);

                let response = new NmosSenderStagedMXL(
                    settings.receiver_id !== undefined ? settings.receiver_id : this.active.receiver_id,
                    settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                    activation,
                    mxlSettings.transport_params !== undefined ? mxlSettings.transport_params : activeParams);

                if(this.active.master_enable)
                {
                    if(this.active.receiver_id != null)
                        super.UpdateSubscription(this.active.receiver_id, true);
                    else
                        super.UpdateSubscription(null, true);

                    this.agent?.Activated();
                }
                else
                {
                    super.UpdateSubscription(null, false);

                    this.agent?.Deactivated();
                }

                return response;
            }
        }

        return null;
    }
}

export class NmosSenderActiveMXL extends NmosSenderActive
{
    public constructor(
        receiver_id: string | null,
        master_enable: boolean,
        activation: NmosActivation,
        public transport_params: MXLSenderTransportParamsSetActive[])
    {
        super(receiver_id, master_enable, activation, transport_params);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class MXLSenderTransportParamsSetActive extends TransportParamsSetActive
{
    public flow_id: string | null;

    public constructor(
        flow_id: string | null)
    {
        super();

        this.flow_id = flow_id;
    }

    public ProcessStagedTransportParams(stagedSet: MXLSenderTransportParamsSetStaged) : MXLSenderTransportParamsSetActive
    {
        return new MXLSenderTransportParamsSetActive(
            stagedSet.flow_id != "auto" && stagedSet.flow_id !== undefined ? stagedSet.flow_id : this.flow_id
        );
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NmosSenderStagedMXL extends NmosSenderStaged
{
    public constructor(
        receiver_id: string | null,
        master_enable: boolean,
        activation: NmosActivation,
        public transport_params: MXLSenderTransportParamsSetStaged[])
    {
        super(receiver_id, master_enable, activation, transport_params);
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class MXLSenderTransportParamsSetStaged extends TransportParamsSetStaged
{
    public flow_id: string | null;

    public constructor(
        flow_id: string | null)
    {
        super();

        this.flow_id = flow_id;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}