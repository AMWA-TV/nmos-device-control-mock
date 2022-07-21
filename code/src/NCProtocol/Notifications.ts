import exp from 'constants';
import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NcElementId, NcPropertyChangeType } from '../NCModel/Core';

import { MessageType, ProtocolWrapper } from './Core';

export class NcEventData
{
    public propertyId: NcElementId;

    public changeType: NcPropertyChangeType;

    public propertyValue: any | null;

    constructor(
        propertyId: NcElementId,
        changeType: NcPropertyChangeType,
        propertyValue: any | null)
    {
        this.propertyId = propertyId;
        this.changeType = changeType;
        this.propertyValue = propertyValue;
    }
}

export enum NcNotificationType
{
    Event = 0,
    SubscriptionEnd = 1
}

export class NcNotification
{
    public type: NcNotificationType = NcNotificationType.Event;

    public oid: number;

    public eventId: NcElementId;

    public eventData: NcEventData;

    constructor(
        oid: number,
        eventId: NcElementId,
        eventData: NcEventData)
    {
        this.oid = oid;
        this.eventId = eventId;
        this.eventData = eventData;
    }
}

export class ProtoNotification extends ProtocolWrapper
{
    public sessionId: number;

    public messages: NcNotification[];

    public constructor(
        sessionId: number,
        messages: NcNotification[])
    {
        super('1.0.0', MessageType.Notification);

        this.sessionId = sessionId;
        this.messages = messages;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}
