import { RegistrationClient } from './RegistrationClient';
import { NmosActivation, NmosReceiver, NmosReceiverActive, NmosReceiverStaged } from './NmosReceiver';
import { TAI64 } from 'tai64';
import { MXLReceiverTransportParamsSetActive, MXLReceiverTransportParamsSetStaged, NmosReceiverActiveMXL, NmosReceiverStagedMXL } from './NmosReceiverMXL';

export class NmosReceiverVideoMXL extends NmosReceiver
{
    public caps: object;
    public format: string;

    public constructor(
        id: string,
        device_id: string,
        base_label: string,
        transport: string,
        registrationClient: RegistrationClient)
    {
        super(id, device_id, base_label, transport, [], registrationClient);

        this.caps = { 'media_types': ['video/v210'] };
        this.format = 'urn:x-nmos:format:video';

        this.active = new NmosReceiverActiveMXL(
            null,
            true,
            new NmosActivation(null, null, null),
            [ new MXLReceiverTransportParamsSetActive(null) ]);

        this.staged = new NmosReceiverStagedMXL(
            null,
            true,
            new NmosActivation(null, null, null),
            [ new MXLReceiverTransportParamsSetStaged(null) ]);

        this.constraints = [
            {
                'flow_id': {}
            }
        ];
    }

    public FetchConstraints() : object | null {
        return this.constraints;
    }

    public FetchActive() : NmosReceiverActive | null {
        return this.active;
    }

    public FetchStaged() : NmosReceiverStaged | null {
        return this.staged;
    }

    public ChangeReceiverSettings(settings: NmosReceiverStaged) : NmosReceiverStaged | null
    {
        let mxlSettings = settings as NmosReceiverStagedMXL;
        if(mxlSettings && this.active != null && this.staged != null)
        {
            let currentParams = this.active as NmosReceiverActiveMXL;
            if(currentParams)
            {
                let activeParams: MXLReceiverTransportParamsSetActive[];
                if(mxlSettings.transport_params)
                {
                    activeParams = [];

                    activeParams.push(currentParams.transport_params[0].ProcessStagedTransportParams(mxlSettings.transport_params[0]));
                    if(currentParams.transport_params.length == 2)
                        activeParams.push(currentParams.transport_params[1].ProcessStagedTransportParams(mxlSettings.transport_params[1]));
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

                this.active = new NmosReceiverActiveMXL(
                    settings.sender_id !== undefined ? settings.sender_id : this.active.sender_id,
                    settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                    activation,
                    activeParams);

                this.staged = new NmosReceiverStagedMXL(
                    settings.sender_id !== undefined ? settings.sender_id : this.active.sender_id,
                    settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                    new NmosActivation(null, null, null),
                    mxlSettings.transport_params !== undefined ? mxlSettings.transport_params : activeParams);

                let response = new NmosReceiverStagedMXL(
                    settings.sender_id !== undefined ? settings.sender_id : this.active.sender_id,
                    settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                    activation,
                    mxlSettings.transport_params !== undefined ? mxlSettings.transport_params : activeParams);

                if(this.active.master_enable)
                {
                    if(this.active.sender_id != null)
                        super.UpdateSubscription(this.active.sender_id, true);
                    else
                        super.UpdateSubscription(null, true);

                    this.agent?.Connected();
                }
                else
                {
                    super.UpdateSubscription(null, false);

                    this.agent?.Disconnected();
                }

                return response;
            }
        }

        return null;
    }
}