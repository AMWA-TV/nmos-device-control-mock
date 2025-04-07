import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import * as sdpTransform from 'sdp-transform';

import { NmosReceiverActiveRtp, RtpReceiverTransportParamsSet } from './NmosReceiverActiveRtp';
import { RegistrationClient } from './RegistrationClient';
import { NmosActivation, NmosReceiver, NmosReceiverActive } from './NmosReceiver';

export class NmosReceiverMpegTS extends NmosReceiver
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
        super(id, device_id, base_label, transport, registrationClient);

        this.caps = { 'media_types': ['video/MP2T'] };
        this.format = 'urn:x-nmos:format:mux';

        this.active = new NmosReceiverActiveRtp(
            null,
            true,
            new NmosActivation(null, null, null),
            null,
            [ new RtpReceiverTransportParamsSet(null, null, 5000) ]);

        this.staged = new NmosReceiverActiveRtp(
            null,
            true,
            new NmosActivation(null, null, null),
            null,
            [ new RtpReceiverTransportParamsSet(null, null, 5000) ]);

        this.constraints = [ 
            {
                'multicast_ip': {},
                'source_ip': {},
                'destination_port': {},
                'interface_ip': {},
                'rtcp_enabled': {},
                'fec_enabled': {},
                'fec_destination_ip': {},
                'fec_mode': {},
                'fec1D_destination_port': {},
                'fec2D_destination_port': {},
                'rtcp_destination_ip': {},
                'rtcp_destination_port': {},
                'rtp_enabled': {},
            }];
    }

    public FetchConstraints() : object | null {
        return this.constraints;
    }

    public FetchActive() : NmosReceiverActive | null {
        return this.active;
    }

    public FetchStaged() : NmosReceiverActive | null {
        return this.staged;
    }

    public ChangeReceiverSettings(settings: NmosReceiverActive)
    {
        let rtpSettings = settings as NmosReceiverActiveRtp;
        if(rtpSettings && settings.activation != null)
        {
            if(settings.sender_id != null)
            {
                if(settings.master_enable && rtpSettings.transport_file != null && rtpSettings.transport_file.data != null)
                {
                    const res = sdpTransform.parse(rtpSettings.transport_file.data);

                    if(res.media[0].sourceFilter?.destAddress != null &&
                        res.media[0].sourceFilter?.srcList != null)
                    {
                        //Connect
                        this.active = new NmosReceiverActiveRtp(
                            settings.sender_id,
                            settings.master_enable,
                            settings.activation,
                            rtpSettings.transport_file,
                            [
                                new RtpReceiverTransportParamsSet(res.media[0].sourceFilter?.destAddress, res.media[0].sourceFilter?.srcList, res.media[0].port)
                            ]);

                         this.staged = new NmosReceiverActiveRtp(settings.sender_id,
                            settings.master_enable,
                            new NmosActivation(null, null, null),
                            rtpSettings.transport_file,
                            [
                                new RtpReceiverTransportParamsSet(res.media[0].sourceFilter?.destAddress, res.media[0].sourceFilter?.srcList, res.media[0].port)
                            ]);

                        this.agent?.Connected();
                    }

                    super.UpdateSubscription(settings.sender_id, true);
                }
            }
            else
            {
                //Disconnect
                this.active = new NmosReceiverActiveRtp(
                    null,
                    false,
                    settings.activation,
                    (this.active as NmosReceiverActiveRtp).transport_file,
                    (this.active as NmosReceiverActiveRtp).transport_params);

                this.staged = new NmosReceiverActiveRtp(
                    null,
                    false,
                    new NmosActivation(null, null, null),
                    (this.staged as NmosReceiverActiveRtp).transport_file,
                    (this.staged as NmosReceiverActiveRtp).transport_params);

                super.UpdateSubscription(null, false);

                this.agent?.Disconnected();
            }
        }
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}