import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';

import { NmosReceiverCore } from './NmosReceiverCore';
import { NmosResource } from './NmosResource';
import { NmosReceiverActiveRtp } from './NmosReceiverActiveRtp';
import { NmosReceiverVideo } from './NmosReceiverVideo';
import { RegistrationClient } from './RegistrationClient';

export class NmosDevice extends NmosResource
{
    public controls: NmosControl[];
    public node_id: string;
    public receivers: string[];
    public senders: string[];
    public type: string;

    @jsonIgnore()
    public receiverObjects: NmosReceiverCore[];

    public constructor(
        id: string,
        node_id: string,
        base_label: string,
        address: string,
        port: number,
        registrationClient: RegistrationClient)
    {
        super(id, `${base_label} device`, registrationClient);

        this.node_id = node_id;

        this.receiverObjects = [];

        this.receivers = [];
        this.senders = [];
        this.controls = [
            new NmosControl(`http://${address}:${port}/x-nmos/connection/v1.1/`, 'urn:x-nmos:control:sr-ctrl/v1.1'),
            new NmosControl(`http://${address}:${port}/x-nmos/connection/v1.0/`, 'urn:x-nmos:control:sr-ctrl/v1.0'),
            new NmosControl(`ws://${address}:${port}/x-nmos/ncp/v1.0/connect`, 'urn:x-nmos:control:ncp/v1.0')
        ];

        this.type = 'urn:x-nmos:device:generic';
    }

    public AddReceiver(receiver: NmosReceiverCore)
    {
        this.receiverObjects.push(receiver);
        this.receivers.push(receiver.id);
    }

    public FindReceiver(id: string) : boolean
    {
        let receiver = this.receivers.find(e => e === id);
        if(receiver === undefined)
            return false;
        else
            return true;
    }

    public FetchReceiver(id: string)
    {
        return this.receiverObjects.find(e => e.id === id);
    }

    public ChangeReceiverSettings(id: string, settings: NmosReceiverActiveRtp)
    {
        let receiver = this.receiverObjects.find(e => e.id === id);
        if(receiver)
            (receiver as NmosReceiverVideo).ChangeReceiverSettings(settings);
    }

    public FetchReceiversUris()
    {
        let uris: string[] = [];

        this.receivers.forEach( (receiverId) => {
            uris.push(`${receiverId}/`);
        });

        return uris;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

class NmosControl
{
    public href : string;
    public type : string;

    public constructor(
        href: string,
        type: string) 
    {
        this.href = href;
        this.type = type;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}