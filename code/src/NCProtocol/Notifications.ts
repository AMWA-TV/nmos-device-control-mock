import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NcElementID, NcPropertyChangeType } from '../NCModel/Core';

import { ProtocolWrapper } from './Core';

export class NcEventData
{
    public propertyID: NcElementID;

    public changeType: NcPropertyChangeType;

    public propertyValue: any | null;

    constructor(
        propertyID: NcElementID,
        changeType: NcPropertyChangeType,
        propertyValue: any | null)
    {
        this.propertyID = propertyID;
        this.changeType = changeType;
        this.propertyValue = propertyValue;
    }
}

export class NcNotification
{
    public type: string = 'Event';

    public oid: number;

    public eventID: NcElementID;

    public eventData: NcEventData;

    constructor(
        oid: number,
        eventID: NcElementID,
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
        super('1.0', 'Notification');

        this.sessionId = sessionId;
        this.messages = messages;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}
