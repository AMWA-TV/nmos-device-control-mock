import { NmosSender, NmosSenderActive, NmosSenderStaged } from './NmosSender';
import { NmosSenderActiveRtp, NmosSenderStagedRtp, RtpSenderTransportParamsSetActive, RtpSenderTransportParamsSetStaged } from './NmosSenderRtp';
import { RegistrationClient } from './RegistrationClient';
import { NmosActivation } from './NmosReceiver';
import { TAI64 } from 'tai64';

export class NmosSenderMpegTS extends NmosSender
{
    public bit_rate: number;

    public constructor(
        id: string,
        flow_id: string,
        device_id: string,
        base_label: string,
        transport: string,
        bit_rate: number,
        manifest_href: string,
        interface_bindings: string[],
        registrationClient: RegistrationClient)
    {
        super(id, flow_id, device_id, base_label, transport, manifest_href, interface_bindings, registrationClient);

        this.bit_rate = bit_rate;

        this.active = new NmosSenderActiveRtp(
            null,
            true,
            new NmosActivation(null, null, null),
            [ new RtpSenderTransportParamsSetActive("239.100.20.0", "192.168.10.101", 10000, 10000)]);

        this.staged = new NmosSenderStagedRtp(
            null,
            true,
            new NmosActivation(null, null, null),
            [ new RtpSenderTransportParamsSetStaged("239.100.20.0", "192.168.10.101", 10000, 10000)]);

        this.constraints = [ 
        {
            'destination_ip': {},
            'source_ip': {},
            'source_port': {},
            'destination_port': {},
            'rtcp_enabled': {},
            'fec_enabled': {},
            'fec_destination_ip': {},
            'fec_type': {},
            'fec_mode': {},
            'fec_block_width': {},
            'fec_block_height': {},
            'fec1D_destination_port': {},
            'fec2D_destination_port': {},
            'fec1D_source_port': {},
            'fec2D_source_port': {},
            'rtcp_destination_ip': {},
            'rtcp_destination_port': {},
            'rtcp_source_port': {},
            'rtp_enabled': {},
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

    public FetchSdp() : string | null {
        if(this.active?.transport_params != null)
        {
            let myTransportParamsLeg_0 = this.active?.transport_params[0] as RtpSenderTransportParamsSetActive;
            return `v=0
o=- 3948176205 3948176205 IN IP4 ${myTransportParamsLeg_0.source_ip}
s=${this.label}
t=0 0
m=video ${myTransportParamsLeg_0.destination_port} RTP/AVP 33
c=IN IP4 ${myTransportParamsLeg_0.destination_ip}/32
a=source-filter: incl IN IP4 ${myTransportParamsLeg_0.destination_ip} ${myTransportParamsLeg_0.source_ip}
a=rtpmap:33 MP2T/90000\r\n`;
        }

        return null;
    }

    public ChangeSenderSettings(settings: NmosSenderStaged) : NmosSenderStaged | null
    {
        let rtpSettings = settings as NmosSenderStagedRtp;
        if(rtpSettings && this.active != null && this.staged != null)
        {
            let currentParams = this.active as NmosSenderActiveRtp;
            if(currentParams)
            {
                let activeParams: RtpSenderTransportParamsSetActive[];
                if(rtpSettings.transport_params)
                {
                    activeParams = [];
                    activeParams.push(currentParams.transport_params[0].ProcessStagedTransportParams(rtpSettings.transport_params[0]));
                    if(currentParams.transport_params.length == 2)
                    {
                        if(rtpSettings.transport_params.length == 2)
                            activeParams.push(currentParams.transport_params[1].ProcessStagedTransportParams(rtpSettings.transport_params[1]));
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

                this.active = new NmosSenderActiveRtp(
                    settings.receiver_id !== undefined ? settings.receiver_id : this.active.receiver_id,
                    settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                    activation,
                    activeParams);
    
                this.staged = new NmosSenderStagedRtp(
                    settings.receiver_id !== undefined ? settings.receiver_id : this.active.receiver_id,
                    settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                    new NmosActivation(null, null, null),
                    rtpSettings.transport_params !== undefined ? rtpSettings.transport_params : activeParams);

                let response = new NmosSenderStagedRtp(
                    settings.receiver_id !== undefined ? settings.receiver_id : this.active.receiver_id,
                    settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                    activation,
                    rtpSettings.transport_params !== undefined ? rtpSettings.transport_params : activeParams);

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