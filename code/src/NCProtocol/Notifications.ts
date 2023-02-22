import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { BaseType, NcDatatypeDescriptor, NcDatatypeDescriptorStruct, NcElementId, NcFieldDescriptor, NcPropertyChangeType } from '../NCModel/Core';
import { MessageType, ProtocolWrapper } from './Core';

export class NcPropertyChangedEventData extends BaseType
{
    public propertyId: NcElementId;

    public changeType: NcPropertyChangeType;

    public value: any | null;

    public sequenceItemIndex: number | null;

    constructor(
        propertyId: NcElementId,
        changeType: NcPropertyChangeType,
        value: any | null,
        sequenceItemIndex: number | null)
    {
        super();

        this.propertyId = propertyId;
        this.changeType = changeType;
        this.value = value;
        this.sequenceItemIndex = sequenceItemIndex;
    }

    public static override GetTypeDescriptor(includeInherited: boolean): NcDatatypeDescriptor
    {
        return new NcDatatypeDescriptorStruct("NcPropertyChangedEventData", [
            new NcFieldDescriptor("propertyId", "NcElementId", false, false, null, "ID of changed property"),
            new NcFieldDescriptor("changeType", "NcPropertyChangeType", false, false, null, "Information regarding the change type"),
            new NcFieldDescriptor("value", null, true, false, null, "Property-type specific value"),
            new NcFieldDescriptor("sequenceItemIndex", "NcId", true, false, null, "Index of sequence item if the property is a sequence")
        ], null, null, "Payload of property-changed event");
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}

export class NcNotification
{
    public oid: number;

    public eventId: NcElementId;

    public eventData: NcPropertyChangedEventData;

    constructor(
        oid: number,
        eventId: NcElementId,
        eventData: NcPropertyChangedEventData)
    {
        this.oid = oid;
        this.eventId = eventId;
        this.eventData = eventData;
    }
}

export class ProtocolNotification extends ProtocolWrapper
{
    public notifications: NcNotification[];

    public constructor(
        notifications: NcNotification[])
    {
        super('1.0.0', MessageType.Notification);

        this.notifications = notifications;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}
