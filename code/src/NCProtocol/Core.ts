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
    public messageType: MessageType;

    public constructor(
        messageType: MessageType)
    {
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