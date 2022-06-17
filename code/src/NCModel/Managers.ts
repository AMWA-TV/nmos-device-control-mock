import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';
import { NcBlock } from './Blocks';
import { NcBlockMemberDescriptor, NcClassDescriptor, NcClassIdentity, NcDatatypeDescriptor, NcDatatypeDescriptorEnum, NcDatatypeDescriptorPrimitive, NcDatatypeDescriptorStruct, NcDatatypeDescriptorTypeDef, NcDatatypeType, NcElementId, NcEnumItemDescriptor, NcLockState, NcMethodDescriptor, NcMethodStatus, NcObject, NcParameterDescriptor, NcPort, NcPortReference, NcPropertyDescriptor, NcSignalPath, NcTouchpoint, NcTouchpointNmos, NcTouchpointResource, NcTouchpointResourceNmos } from './Core';
import { NcDemo, NcGain, NcReceiverMonitor, NcReceiverStatus } from './Features';

export abstract class NcManager extends NcObject
{
    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[] | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, description, notificationContext);
    }
}

export class NcClassManager extends NcManager
{
    public classID: number[] = [ 1, 3, 3 ];
    public classVersion: string = "1.0.0";

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[] | null,
        description, string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, description, notificationContext);
    }

    public override InvokeMethod(oid: number, methodID: NcElementId, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodID.level}m${methodID.index}`;

            switch(key)
            {
                case '3m1':
                    {
                        if(args != null && 'identity' in args)
                        {
                            let identity = args['identity'] as NcClassIdentity;
                            let descriptors = this.GetClassDescriptors(identity);
                            if(descriptors.length > 0)
                                return new CommandResponseWithValue(handle, NcMethodStatus.OK, descriptors, null);
                            else
                                return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Class identity could not be found');
                        }
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'No class identity has been provided');
                    }
                case '3m2':
                {
                    if(args != null && 'name' in args)
                    {
                        let name = args['name'] as string;
                        let descriptors = this.GetTypeDescriptors(name);
                        if(descriptors.length > 0)
                            return new CommandResponseWithValue(handle, NcMethodStatus.OK, descriptors, null);
                        else
                            return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'Type name could not be found');
                    }
                    else
                        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'No type name has been provided');
                }
                default:
                    return super.InvokeMethod(oid, methodID, args, handle);
            }
        }

        return new CommandResponseNoValue(handle, NcMethodStatus.InvalidRequest, 'OID could not be found');
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcClassManager class descriptor",
            [ 
                new NcPropertyDescriptor(new NcElementId(3, 1), "controlClasses", "NcClassDescriptor", true, true, false, true, null, "Descriptions of all control classes in the device"),
                new NcPropertyDescriptor(new NcElementId(3, 2), "datatypes", "NcDatatypeDescriptor", true, true, false, true, null, "Descriptions of all data types in the device")
            ],
            [ 
                new NcMethodDescriptor(new NcElementId(3, 1), "GetControlClass", "NcMethodResultClassDescriptors", [
                    new NcParameterDescriptor("identity", "NcClassIdentity", false, null, "class ID & version"),
                    new NcParameterDescriptor("allElements", "NcBoolean", false, null, "TRUE to include inherited class elements")
                ], "Get a single class descriptor"),
                new NcMethodDescriptor(new NcElementId(3, 2), "GetDatatype", "NcMethodResultDatatypeDescriptors", [
                    new NcParameterDescriptor("name", "NcName", false, null, "name of datatype"),
                    new NcParameterDescriptor("allDefs", "NcBoolean", false, null, "TRUE to include descriptors of component datatypes")
                ], "Get descriptor of datatype and maybe its component datatypes"),
                new NcMethodDescriptor(new NcElementId(3, 3), "GetControlClasses", "NcMethodResultClassDescriptors", [
                    new NcParameterDescriptor("blockPath", "NcNamePath", false, null, "path to block"),
                    new NcParameterDescriptor("recurseBlocks", "NcBoolean", false, null, "TRUE to recurse contained blocks"),
                    new NcParameterDescriptor("allElements", "NcBoolean", false, null, "TRUE to include inherited class elements")
                ], "Get descriptors of classes used by block(s)"),
                new NcMethodDescriptor(new NcElementId(3, 4), "GetDataTypes", "NcMethodResultDatatypeDescriptors", [
                    new NcParameterDescriptor("blockPath", "NcNamePath", false, null, "path to block"),
                    new NcParameterDescriptor("recurseBlocks", "NcBoolean", false, null, "TRUE to recurse contained blocks"),
                    new NcParameterDescriptor("allDefs", "NcBoolean", false, null, "TRUE to include descriptors of referenced datatypes")
                ], " Get descriptors of datatypes used by blocks(s)")
            ],
            []
        );

        currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
        currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
        currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);

        return currentClassDescriptor;
    }

    private GetClassDescriptors(identity: NcClassIdentity) : NcClassDescriptor[]
    {
        let key: string = identity.classID.join('.');

        switch(key)
        {
            case '1.1': 
                return [ NcBlock.GetClassDescriptor() ];
            case '1.7.3': 
                return [ NcClassManager.GetClassDescriptor() ];
            case '1.7.5': 
                return [ NcSubscriptionManager.GetClassDescriptor() ];
            case '1.2.2':
                return [ NcDemo.GetClassDescriptor() ];
            case '1.4.1': 
                return [ NcReceiverMonitor.GetClassDescriptor() ];
            case '1.2.1.1': 
                return [ NcGain.GetClassDescriptor() ];
            default:
                return new Array<NcClassDescriptor>();
        }
    }

    private GetTypeDescriptors(name: string) : NcDatatypeDescriptor[]
    {
        switch(name)
        {
            case 'NcBoolean': 
                return [ new NcDatatypeDescriptorPrimitive("NcBoolean", "Boolean primitive type")];
            case 'NcInt8': 
                return [ new NcDatatypeDescriptorPrimitive("NcInt8", "byte")];
            case 'NcInt16': 
                return [ new NcDatatypeDescriptorPrimitive("NcInt16", "short")];
            case 'NcInt32': 
                return [ new NcDatatypeDescriptorPrimitive("NcInt32", "long")];
            case 'McInt64': 
                return [ new NcDatatypeDescriptorPrimitive("NcInt64", "longlong")];
            case 'NcUint8': 
                return [ new NcDatatypeDescriptorPrimitive("NcUint8", "octet")];
            case 'NcUint16': 
                return [ new NcDatatypeDescriptorPrimitive("NcUint16", "unsignedshort")];
            case 'NcUint32': 
                return [ new NcDatatypeDescriptorPrimitive("NcUint32", "unsignedlong")];
            case 'NcUint64': 
                return [ new NcDatatypeDescriptorPrimitive("NcUint64", "unsignedlonglong")];
            case 'NcFloat32': 
                return [ new NcDatatypeDescriptorPrimitive("NcFloat32", "unrestrictedfloat")];
            case 'NcFloat64': 
                return [ new NcDatatypeDescriptorPrimitive("NcFloat64", "unrestricteddouble")];
            case 'NcString': 
                return [ new NcDatatypeDescriptorPrimitive("NcString", "UTF-8 string")];
            case 'NcBlob': 
                return [ new NcDatatypeDescriptorPrimitive("NcBlob", "blob")];
            case 'NcBlobFixedLen': 
                return [ new NcDatatypeDescriptorPrimitive("NcBlobFixedLen", "fixed length blob")];
            case 'NcClassId': 
                return [ new NcDatatypeDescriptorTypeDef("NcClassId", "NcClassIdField", true, "Sequence of class ID fields.")];
            case 'NcClassIdField': 
                return [ new NcDatatypeDescriptorTypeDef("NcClassIdField", "NcInt32", false, "Class ID field. Either a definition index or an authority key.")];
            case 'NcVersionCode': 
                return [ new NcDatatypeDescriptorTypeDef("NcVersionCode", "NcString", false, "Version code in semantic versioning format")];
            case 'NcOid': 
                return [ new NcDatatypeDescriptorTypeDef("NcOid", "NcUint32", false, "Object id")];
            case 'NcName': 
                return [ new NcDatatypeDescriptorTypeDef("NcName", "NcString", false, "Programmatically significant name, alphanumerics + underscore, no spaces")];
            case 'NcNamePath': 
                return [ new NcDatatypeDescriptorTypeDef("NcNamePath", "NcName", false, "Name path")];
            case 'NcString': 
                return [ new NcDatatypeDescriptorPrimitive("NcString", "UTF-8 string")];
            case 'NcId32': 
                return [ new NcDatatypeDescriptorTypeDef("NcId32", "NcUint32", false, "Identity handler")];
            case 'NcTimeInterval': 
                return [ new NcDatatypeDescriptorTypeDef("NcTimeInterval", "NcFloat64", false, "Floating point seconds")];
            case 'NcDB': 
                return [ new NcDatatypeDescriptorTypeDef("NcDB", "NcFloat32", false, "A ratio expressed in dB.")];
            case 'NcPropertyId': 
                return [ new NcDatatypeDescriptorTypeDef("NcPropertyId", "NcElementId", false, "Class property id which contains the level and index")];
            case 'NcElementId': 
                return [ NcElementId.GetTypeDescriptor() ];
            case 'ncLockState': 
                return [ new NcDatatypeDescriptorEnum("ncLockState", [
                    new NcEnumItemDescriptor("noLock", 0),
                    new NcEnumItemDescriptor("lockNoWrite", 1),
                    new NcEnumItemDescriptor("lockNoReadWrite", 2),
                ])];
            case 'ncMethodStatus': 
                return [ new NcDatatypeDescriptorEnum("ncMethodStatus", [
                    new NcEnumItemDescriptor("ok", 0),
                    new NcEnumItemDescriptor("protocolVersionError", 1),
                    new NcEnumItemDescriptor("deviceError", 2),
                    new NcEnumItemDescriptor("readonly", 3),
                    new NcEnumItemDescriptor("locked", 4),
                    new NcEnumItemDescriptor("badCommandFormat", 5),
                    new NcEnumItemDescriptor("badOid", 6),
                    new NcEnumItemDescriptor("parameterError", 7),
                    new NcEnumItemDescriptor("parameterOutOfRange", 8),
                    new NcEnumItemDescriptor("notImplemented", 9),
                    new NcEnumItemDescriptor("invalidRequest", 10),
                    new NcEnumItemDescriptor("processingFailed", 11),
                    new NcEnumItemDescriptor("badMethodID", 12),
                    new NcEnumItemDescriptor("partiallySucceeded", 13),
                    new NcEnumItemDescriptor("timeout", 14),
                    new NcEnumItemDescriptor("bufferOverflow", 15),
                    new NcEnumItemDescriptor("omittedProperty", 16),
                ])];
            case 'ncMethodResult':
                return [ new NcDatatypeDescriptorStruct("ncMethodResult", [
                    new NcPropertyDescriptor(new NcElementId(1, 1), "status", "ncMethodStatus", true, true, true),
                    new NcPropertyDescriptor(new NcElementId(1, 1), "errorMessage", "ncString", true, true, true)
                ])];
            case 'ncMethodResultPropertyValue':
                return [ new NcDatatypeDescriptorStruct("ncMethodResultPropertyValue", [
                    new NcPropertyDescriptor(new NcElementId(1, 1), "status", "ncMethodStatus", true, true, true),
                    new NcPropertyDescriptor(new NcElementId(1, 1), "errorMessage", "ncString", true, true, true),
                    new NcPropertyDescriptor(new NcElementId(2, 1), "value", "", true, true, true)
                ])];
            case 'ncMethodResultId32':
                return [ new NcDatatypeDescriptorStruct("ncMethodResultId32", [
                    new NcPropertyDescriptor(new NcElementId(1, 1), "status", "ncMethodStatus", true, true, true),
                    new NcPropertyDescriptor(new NcElementId(1, 1), "errorMessage", "ncString", true, true, true),
                    new NcPropertyDescriptor(new NcElementId(2, 1), "value", "ncId32", true, true, true)
                ])];
            case 'ncClassIdentity': 
                return [ NcClassIdentity.GetTypeDescriptor() ];
            case 'ncBlockMemberDescriptor': 
                return [ NcBlockMemberDescriptor.GetTypeDescriptor() ];
            case 'ncMethodResultBlockMemberDescriptors':
                return [ new NcDatatypeDescriptorStruct("ncMethodResultBlockMemberDescriptors", [
                    new NcPropertyDescriptor(new NcElementId(1, 1), "status", "ncMethodStatus", true, true, true),
                    new NcPropertyDescriptor(new NcElementId(1, 1), "errorMessage", "ncString", true, true, true),
                    new NcPropertyDescriptor(new NcElementId(2, 1), "value", "ncBlockMemberDescriptor", true, true, true)
                ])];
            case 'ncReceiverStatus': 
                return [ NcReceiverStatus.GetTypeDescriptor() ];
            case 'ncMethodResultReceiverStatus':
                return [ new NcDatatypeDescriptorStruct("ncMethodResultReceiverStatus", [
                    new NcPropertyDescriptor(new NcElementId(1, 1), "status", "ncMethodStatus", true, true, true),
                    new NcPropertyDescriptor(new NcElementId(1, 1), "errorMessage", "ncString", true, true, true),
                    new NcPropertyDescriptor(new NcElementId(2, 1), "value", "ncReceiverStatus", true, true, true)
                ])];
            case 'ncIoDirection': 
                return [ new NcDatatypeDescriptorEnum("ncIoDirection", [
                    new NcEnumItemDescriptor("undefined", 0),
                    new NcEnumItemDescriptor("input", 1),
                    new NcEnumItemDescriptor("output", 2),
                    new NcEnumItemDescriptor("bidirectional", 3),
                ])];
            case 'ncConnectionStatus': 
                return [ new NcDatatypeDescriptorEnum("ncConnectionStatus", [
                    new NcEnumItemDescriptor("Undefined", 0),
                    new NcEnumItemDescriptor("Connected", 1),
                    new NcEnumItemDescriptor("Disconnected", 2),
                    new NcEnumItemDescriptor("ConnectionError", 3),
                ])];
            case 'ncPayloadStatus': 
                return [ new NcDatatypeDescriptorEnum("ncPayloadStatus", [
                    new NcEnumItemDescriptor("Undefined", 0),
                    new NcEnumItemDescriptor("PayloadOK", 1),
                    new NcEnumItemDescriptor("PayloadFormatUnsupported", 2),
                    new NcEnumItemDescriptor("PayloadError", 3),
                ])];
            case 'ncPort': 
                return [ NcPort.GetTypeDescriptor() ];
            case 'ncPortReference': 
                return [ NcPortReference.GetTypeDescriptor() ];
            case 'ncSignalPath': 
                return [ NcSignalPath.GetTypeDescriptor() ];
            case 'ncTouchpoint': 
                return [ NcTouchpoint.GetTypeDescriptor() ];
            case 'ncTouchpointResource': 
                return [ NcTouchpointResource.GetTypeDescriptor() ];
            case 'ncTouchpointNmos': 
                return [ NcTouchpointNmos.GetTypeDescriptor() ];
            case 'ncTouchpointResourceNmos': 
                return [ NcTouchpointResourceNmos.GetTypeDescriptor() ];
            case 'ncDemoEnum': 
                return [ new NcDatatypeDescriptorEnum("ncDemoEnum", [
                    new NcEnumItemDescriptor("Undefined", 0),
                    new NcEnumItemDescriptor("Alpha", 1),
                    new NcEnumItemDescriptor("Beta", 2),
                    new NcEnumItemDescriptor("Gamma", 3),
                ])];
            default:
                return new Array<NcDatatypeDescriptor>();
        }
    }
}

export class NcSubscriptionManager extends NcManager
{
    public classID: number[] = [ 1, 3, 5 ];
    public classVersion: string = "1.0.0";

    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcLockState,
        touchpoints: NcTouchpoint[] | null,
        description: string,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, description, notificationContext);
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcSubscriptionManager class descriptor",
            [],
            [ 
                new NcMethodDescriptor(new NcElementId(3, 1), "AddSubscription", "NcMethodResult", [
                    new NcParameterDescriptor("event", "NcEvent", false, null, "Event identifying information")
                ], "When used to subscribe to the property changed event it will subscribe to changes from all of the properties"),
                new NcMethodDescriptor(new NcElementId(3, 2), "RemoveSubscription", "NcMethodResult", [
                    new NcParameterDescriptor("event", "NcEvent", false, null, "Event identifying information")
                ], "When used to unsubscribe to the property changed event it will unsubscribe to changes from all of the properties"),
                new NcMethodDescriptor(new NcElementId(3, 3), "AddPropertyChangeSubscription", "NcMethodResult", [
                    new NcParameterDescriptor("emitter", "NcOid", false, null, "ID of object where property is"),
                    new NcParameterDescriptor("property", "NcPropertyID", false, null, "ID of the property")
                ], "Subscribe to individual property on an object"),
                new NcMethodDescriptor(new NcElementId(3, 4), "RemovePropertyChangeSubscription", "NcMethodResult", [
                    new NcParameterDescriptor("emitter", "NcOid", false, null, "ID of object where property is"),
                    new NcParameterDescriptor("property", "NcPropertyID", false, null, "ID of the property")
                ], "Unsubscribe from individual property on an object")
            ],
            []
        );

        currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
        currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
        currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);

        return currentClassDescriptor;
    }
}