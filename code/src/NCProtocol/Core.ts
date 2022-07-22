import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';

export enum MessageType {
    CreateSession = 0,
    CreateSessionResponse = 1,
    Command = 2,
    CommandResponse = 3,
    Heartbeat = 4,
    HeartbeatResponse = 5,
    Notification = 6,
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