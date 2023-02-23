import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import * as sdpTransform from 'sdp-transform';

import { NmosReceiverActiveRtp, RtpReceiverTransportParamsSet } from './NmosReceiverActiveRtp';
import { NmosActivation, NmosReceiverCore, NmosReceiverActive } from './NmosReceiverCore';
import { RegistrationClient } from './RegistrationClient';

export class NmosReceiverVideo extends NmosReceiverCore
{
    public caps: object;
    public format: string;

    public constructor(
        id: string,
        device_id: string,
        base_label: string,
        transport: string,
        suffix: string,
        registrationClient: RegistrationClient)
    {
        super(id, device_id, base_label, transport, suffix, registrationClient);

        this.caps = { 'media_types': ['video/raw'] };
        this.format = 'urn:x-nmos:format:video';

        this.active = new NmosReceiverActiveRtp(
            null,
            true,
            new NmosActivation(null, null, null),
            null,
            [ new RtpReceiverTransportParamsSet(null, null, 5000), new RtpReceiverTransportParamsSet(null, null, 5000) ]);

        this.staged = new NmosReceiverActiveRtp(
            null,
            true,
            new NmosActivation(null, null, null),
            null,
            [ new RtpReceiverTransportParamsSet(null, null, 5000), new RtpReceiverTransportParamsSet(null, null, 5000) ]);

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
            },
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

    public ChangeReceiverSettings(settings: NmosReceiverActiveRtp)
    {
        if(settings.activation != null)
        {
            if(settings.sender_id != null)
            {
                if(settings.master_enable && settings.transport_file != null && settings.transport_file.data != null)
                {
                    const res = sdpTransform.parse(settings.transport_file.data);

                    if(res.media[0].sourceFilter?.destAddress != null &&
                        res.media[0].sourceFilter?.srcList != null &&
                        res.media[1].sourceFilter?.destAddress != null &&
                        res.media[1].sourceFilter?.srcList != null)
                    {
                        //Connect
                        this.active = new NmosReceiverActiveRtp(
                            settings.sender_id,
                            settings.master_enable,
                            settings.activation,
                            settings.transport_file,
                            [
                                new RtpReceiverTransportParamsSet(res.media[0].sourceFilter?.destAddress, res.media[0].sourceFilter?.srcList, res.media[0].port),
                                new RtpReceiverTransportParamsSet(res.media[1].sourceFilter?.destAddress, res.media[1].sourceFilter?.srcList, res.media[1].port),
                            ]);

                         this.staged = new NmosReceiverActiveRtp(settings.sender_id,
                            settings.master_enable,
                            new NmosActivation(null, null, null),
                            settings.transport_file,
                            [
                                new RtpReceiverTransportParamsSet(res.media[0].sourceFilter?.destAddress, res.media[0].sourceFilter?.srcList, res.media[0].port),
                                new RtpReceiverTransportParamsSet(res.media[1].sourceFilter?.destAddress, res.media[1].sourceFilter?.srcList, res.media[1].port),
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