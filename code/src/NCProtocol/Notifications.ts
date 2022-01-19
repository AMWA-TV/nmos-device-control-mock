import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { NcaElementID, NcaPropertyChangeType } from '../NCModel/Core';

import { ProtocolWrapper, ProtoMsg } from './Core';

export class NcaEventData
{
    public propertyID: NcaElementID;

    public changeType: NcaPropertyChangeType;

    public propertyValue: any | null;

    constructor(
        propertyID: NcaElementID,
        changeType: NcaPropertyChangeType,
        propertyValue: any | null)
    {
        this.propertyID = propertyID;
        this.changeType = changeType;
        this.propertyValue = propertyValue;
    }
}

export class NcaNotification
{
    public type: string = 'Event';

    public oid: number;

    public eventID: NcaElementID;

    public eventData: NcaEventData;

    constructor(
        oid: number,
        eventID: NcaElementID,
        eventData: NcaEventData)
    {
        this.oid = oid;
        this.eventID = eventID;
        this.eventData = eventData;
    }
}

export class ProtoNotification extends ProtocolWrapper
{
    public sessionId: number;

    public messages: NcaNotification[];

    public constructor(
        sessionId: number,
        messages: NcaNotification[])
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
