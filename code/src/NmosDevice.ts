import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';

import { NmosReceiverCore } from './NmosReceiverCore';
import { NmosResource } from './NmosResource';
import { NmosReceiverActiveRtp } from './NmosReceiverActiveRtp';
import { NmosReceiverVideo } from './NmosReceiverVideo';
import { RegistrationClient } from './RegistrationClient';
import { NmosSender } from './NmosSender';
import { NmosSenderActiveRtp } from './NmosSenderActiveRtp';
import { NmosSenderVideo } from './NmosSenderVideo';

export class NmosDevice extends NmosResource
{
    public controls: NmosControl[];
    public node_id: string;
    public receivers: string[];
    public senders: string[];
    public type: string;

    @jsonIgnore()
    private manufacturer: string;

    @jsonIgnore()
    private product: string;

    @jsonIgnore()
    private instance: string;

    @jsonIgnore()
    private application: string;

    @jsonIgnore()
    public receiverObjects: NmosReceiverCore[];

    @jsonIgnore()
    public senderObjects: NmosSender[];

    public constructor(
        id: string,
        node_id: string,
        base_label: string,
        address: string,
        port: number,
        manufacturer: string,
        product: string,
        instance: string,
        application: string,
        registrationClient: RegistrationClient)
    {
        super(id, `${base_label} device`, registrationClient);

        this.node_id = node_id;

        this.manufacturer = manufacturer;
        this.product = product;
        this.instance = instance;
        this.application = application;

        this.tags = {
            "urn:x-nmos:tag:asset:manufacturer/v1.0": [ this.manufacturer ],
            "urn:x-nmos:tag:asset:product/v1.0": [ this.product ],
            "urn:x-nmos:tag:asset:instance-id/v1.0": [ this.instance ],
            "urn:x-nmos:tag:asset:function/v1.0": [ this.application ]
        };

        this.receiverObjects = [];
        this.senderObjects = [];

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

    public FetchReceivers() {
        return this.receiverObjects;
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

    public AddSender(sender: NmosSender)
    {
        this.senderObjects.push(sender);
        this.senders.push(sender.id);
    }

    public FindSender(id: string) : boolean
    {
        let sender = this.senders.find(e => e === id);
        if(sender === undefined)
            return false;
        else
            return true;
    }

    public FetchSender(id: string)
    {
        return this.senderObjects.find(e => e.id === id);
    }

    public FetchSenders() {
        return this.senderObjects;
    }

    public ChangeSenderSettings(id: string, settings: NmosSenderActiveRtp)
    {
        let sender = this.senderObjects.find(e => e.id === id);
        if(sender)
            (sender as NmosSenderVideo).ChangeSenderSettings(settings);
    }

    public FetchSendersUris()
    {
        let uris: string[] = [];

        this.senders.forEach( (senderId) => {
            uris.push(`${senderId}/`);
        });

        return uris;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }

    public ToJsonArray()
    {
        return JSON.stringify([this], jsonIgnoreReplacer);
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