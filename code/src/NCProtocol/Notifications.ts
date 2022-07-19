import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NcElementId, NcPropertyChangeType } from '../NCModel/Core';

import { ProtocolWrapper } from './Core';

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

export class NcNotification
{
    public type: string = 'Event';

    public oid: number;

    public eventID: NcElementId;

    public eventData: NcEventData;

    constructor(
        oid: number,
        eventID: NcElementId,
        eventData: NcEventData)
    {
        this.oid = oid;
        this.eventID = eventID;
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
        super('1.0.0', 'Notification');

        this.sessionId = sessionId;
        this.messages = messages;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}
