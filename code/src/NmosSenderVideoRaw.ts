import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NmosSender, NmosSenderActive } from './NmosSender';
import { NmosSenderActiveRtp, RtpSenderTransportParamsSet } from './NmosSenderActiveRtp';
import { RegistrationClient } from './RegistrationClient';
import { NmosActivation } from './NmosReceiver';

export class NmosSenderVideoRaw extends NmosSender
{
    public constructor(
        id: string,
        flow_id: string,
        device_id: string,
        base_label: string,
        transport: string,
        manifest_href: string,
        registrationClient: RegistrationClient)
    {
        super(id, flow_id, device_id, base_label, transport, manifest_href, registrationClient);

        this.active = new NmosSenderActiveRtp(
            null,
            true,
            new NmosActivation(null, null, null),
            [ new RtpSenderTransportParamsSet("239.100.20.0", "192.168.10.101", 10000, 10000), new RtpSenderTransportParamsSet("239.200.20.1", "192.168.20.101", 10000, 10000) ]);

        this.staged = new NmosSenderActiveRtp(
            null,
            true,
            new NmosActivation(null, null, null),
            [ new RtpSenderTransportParamsSet("239.100.20.0", "192.168.10.101", 10000, 10000), new RtpSenderTransportParamsSet("239.200.20.1", "192.168.20.101", 10000, 10000) ]);

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
        },
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

    public FetchStaged() : NmosSenderActive | null {
        return this.staged;
    }

    public FetchSdp() : string | null {
        if(this.active?.transport_params != null)
        {
            let myTransportParamsLeg_0 = this.active?.transport_params[0] as RtpSenderTransportParamsSet;
            let myTransportParamsLeg_1 = this.active?.transport_params[1] as RtpSenderTransportParamsSet;
            return `v=0
o=- 3948176205 3948176205 IN IP4 ${myTransportParamsLeg_0.source_ip}
s=${this.label}
t=0 0
a=group:DUP primary secondary
m=video 10000 RTP/AVP 96
c=IN IP4 ${myTransportParamsLeg_0.destination_ip}/64
a=source-filter: incl IN IP4 ${myTransportParamsLeg_0.destination_ip} ${myTransportParamsLeg_0.source_ip}
a=rtpmap:96 raw/90000
a=fmtp:96 sampling=YCbCr-4:2:2; width=1920; height=1080; depth=10; interlace; exactframerate=25; TCS=SDR; colorimetry=BT709; PM=2110GPM; SSN=ST2110-20:2017; TP=2110TPN; 
a=ts-refclk:ptp=IEEE1588-2008:08-00-11-FF-FE-21-E1-B0:32
a=mediaclk:direct=0
a=mid:primary
m=video 10000 RTP/AVP 96
c=IN IP4 ${myTransportParamsLeg_1.destination_ip}/64
a=source-filter: incl IN IP4 ${myTransportParamsLeg_1.destination_ip} ${myTransportParamsLeg_1.source_ip}
a=rtpmap:96 raw/90000
a=fmtp:96 sampling=YCbCr-4:2:2; width=1920; height=1080; depth=10; interlace; exactframerate=25; TCS=SDR; colorimetry=BT709; PM=2110GPM; SSN=ST2110-20:2017; TP=2110TPN; 
a=ts-refclk:ptp=IEEE1588-2008:08-00-11-FF-FE-21-E1-B0:32
a=mediaclk:direct=0
a=mid:secondary`;
        }

        return null;
    }

    public ChangeSenderSettings(settings: NmosSenderActive)
    {
        let rtpSettings = settings as NmosSenderActiveRtp;
        if(rtpSettings && settings.activation != null)
        {
            if(settings.master_enable)
                this.agent?.Activated();
            else
                this.agent?.Deactivated();

            this.active = new NmosSenderActiveRtp(
                settings.receiver_id,
                settings.master_enable,
                settings.activation,
                rtpSettings.transport_params);

            this.staged = new NmosSenderActiveRtp(
                settings.receiver_id,
                settings.master_enable,
                new NmosActivation(null, null, null),
                rtpSettings.transport_params);

            this.BumpVersion();
            this.registrationClient.RegisterOrUpdateResource<NmosSender>('sender', this);
        }
    }
}