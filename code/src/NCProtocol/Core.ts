import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';

export enum MessageType {
    Command = 0,
    CommandResponse = 1,
    Notification = 2,
    Subscription = 3,
    SubscriptionResponse = 4,
    Error = 5
}

export abstract class ProtocolWrapper
{
    public protocolVersion: string;
    public messageType: MessageType;

    public constructor(
        protocolVersion: string,
        messageType: MessageType)
    {
        this.protocolVersion = protocolVersion;
        this.messageType = messageType;
    }
}

export abstract class ProtoMsg {
    public handle: number;

    constructor(
        handle: number)
    {
        this.handle = handle;
    }
}