import * as sdpTransform from 'sdp-transform';

import { NmosReceiverActiveRtp, NmosReceiverStagedRtp, RtpReceiverTransportParamsSetActive, RtpReceiverTransportParamsSetStaged } from './NmosReceiverRtp';
import { RegistrationClient } from './RegistrationClient';
import { NmosActivation, NmosReceiver, NmosReceiverActive, NmosReceiverStaged } from './NmosReceiver';
import { TAI64 } from 'tai64';

export class NmosReceiverVideoRaw extends NmosReceiver
{
    public caps: object;
    public format: string;

    public constructor(
        id: string,
        device_id: string,
        base_label: string,
        transport: string,
        interface_bindings: string[],
        registrationClient: RegistrationClient)
    {
        super(id, device_id, base_label, transport, interface_bindings, registrationClient);

        this.caps = { 'media_types': ['video/raw'] };
        this.format = 'urn:x-nmos:format:video';

        this.active = new NmosReceiverActiveRtp(
            null,
            true,
            new NmosActivation(null, null, null),
            null,
            [ new RtpReceiverTransportParamsSetActive(null, null, 5000), new RtpReceiverTransportParamsSetActive(null, null, 5000) ]);

        this.staged = new NmosReceiverStagedRtp(
            null,
            true,
            new NmosActivation(null, null, null),
            null,
            [ new RtpReceiverTransportParamsSetStaged(null, null, 5000), new RtpReceiverTransportParamsSetStaged(null, null, 5000) ]);

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

    public FetchStaged() : NmosReceiverStaged | null {
        return this.staged;
    }

    public ChangeReceiverSettings(settings: NmosReceiverStaged) : NmosReceiverStaged | null
    {
        let rtpSettings = settings as NmosReceiverStagedRtp;
        if(rtpSettings && this.active != null && this.staged != null)
        {
            if(rtpSettings.transport_file != null && rtpSettings.transport_file.data != null)
            {
                const res = sdpTransform.parse(rtpSettings.transport_file.data);

                if(res.media[0].sourceFilter?.destAddress != null &&
                    res.media[0].sourceFilter?.srcList != null)
                {
                    let currentParams = this.active as NmosReceiverActiveRtp;
                    if(currentParams)
                    {
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
    
                        this.active = new NmosReceiverActiveRtp(
                            settings.sender_id !== undefined ? settings.sender_id : this.active.sender_id,
                            settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                            activation,
                            rtpSettings.transport_file,
                            res.media.length > 1 && res.media[1].sourceFilter?.destAddress != null && res.media[1].sourceFilter?.srcList != null ?
                            [
                                new RtpReceiverTransportParamsSetActive(res.media[0].sourceFilter?.destAddress, res.media[0].sourceFilter?.srcList, res.media[0].port),
                                new RtpReceiverTransportParamsSetActive(res.media[1].sourceFilter?.destAddress, res.media[1].sourceFilter?.srcList, res.media[1].port)
                            ]
                            : [ new RtpReceiverTransportParamsSetActive(res.media[0].sourceFilter?.destAddress, res.media[0].sourceFilter?.srcList, res.media[0].port) ]);
    
                         this.staged = new NmosReceiverStagedRtp(
                            settings.sender_id !== undefined ? settings.sender_id : this.active.sender_id,
                            settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                            new NmosActivation(null, null, null),
                            rtpSettings.transport_file,
                            res.media.length > 1 && res.media[1].sourceFilter?.destAddress != null && res.media[1].sourceFilter?.srcList != null ? 
                            [
                                new RtpReceiverTransportParamsSetStaged(res.media[0].sourceFilter?.destAddress, res.media[0].sourceFilter?.srcList, res.media[0].port),
                                new RtpReceiverTransportParamsSetStaged(res.media[1].sourceFilter?.destAddress, res.media[1].sourceFilter?.srcList, res.media[1].port)
                            ] : [ new RtpReceiverTransportParamsSetStaged(res.media[0].sourceFilter?.destAddress, res.media[0].sourceFilter?.srcList, res.media[0].port) ]);

                        let response = new NmosReceiverStagedRtp(
                            settings.sender_id !== undefined ? settings.sender_id : this.active.sender_id,
                            settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                            activation,
                            rtpSettings.transport_file,
                            res.media.length > 1 && res.media[1].sourceFilter?.destAddress != null && res.media[1].sourceFilter?.srcList != null ?
                            [
                                new RtpReceiverTransportParamsSetStaged(res.media[0].sourceFilter?.destAddress, res.media[0].sourceFilter?.srcList, res.media[0].port),
                                new RtpReceiverTransportParamsSetStaged(res.media[1].sourceFilter?.destAddress, res.media[1].sourceFilter?.srcList, res.media[1].port)
                            ] : [ new RtpReceiverTransportParamsSetStaged(res.media[0].sourceFilter?.destAddress, res.media[0].sourceFilter?.srcList, res.media[0].port) ]);

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
            }
            else
            {
                let currentParams = this.active as NmosReceiverActiveRtp;
                if(currentParams)
                {
                    let activeParams: RtpReceiverTransportParamsSetActive[];
                    if(rtpSettings.transport_params)
                    {
                        activeParams = [];

                        activeParams.push(currentParams.transport_params[0].ProcessStagedTransportParams(rtpSettings.transport_params[0]));
                        if(currentParams.transport_params.length == 2)
                            activeParams.push(currentParams.transport_params[1].ProcessStagedTransportParams(rtpSettings.transport_params[1]));
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

                    this.active = new NmosReceiverActiveRtp(
                        settings.sender_id !== undefined ? settings.sender_id : this.active.sender_id,
                        settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                        activation,
                        null,
                        activeParams);

                    this.staged = new NmosReceiverStagedRtp(
                        settings.sender_id !== undefined ? settings.sender_id : this.active.sender_id,
                        settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                        new NmosActivation(null, null, null),
                        null,
                        rtpSettings.transport_params !== undefined ? rtpSettings.transport_params : activeParams);

                    let response = new NmosReceiverStagedRtp(
                        settings.sender_id !== undefined ? settings.sender_id : this.active.sender_id,
                        settings.master_enable !== undefined ? settings.master_enable : this.active.master_enable,
                        activation,
                        null,
                        rtpSettings.transport_params !== undefined ? rtpSettings.transport_params : activeParams);
    
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
        }

        return null;
    }
}