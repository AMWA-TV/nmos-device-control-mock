import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';

export abstract class ProtocolWrapper
{
    public protocolVersion: string;
    public messageType: string;

    public constructor(
        protocolVersion: string,
        messageType: string)
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