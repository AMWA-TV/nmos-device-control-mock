import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';
import { NcBlock } from './Blocks';
import { NcBlockMemberDescriptor, NcClassDescriptor, NcClassIdentity, NcDatatypeDescriptor, NcDatatypeDescriptorEnum, NcDatatypeDescriptorPrimitive, NcDatatypeDescriptorStruct, NcDatatypeDescriptorTypeDef, NcDatatypeType, NcElementID, NcEnumItemDescriptor, NcLockState, NcMethodDescriptor, NcMethodStatus, NcObject, NcParameterDescriptor, NcPort, NcPortReference, NcPropertyDescriptor, NcSignalPath, NcTouchpoint, NcTouchpointNmos, NcTouchpointResource, NcTouchpointResourceNmos } from './Core';
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
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);
    }
}

export class NcClassManager extends NcManager
{
    public classID: number[] = [ 1, 7, 3 ];
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
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);
    }

    public override InvokeMethod(oid: number, methodID: NcElementID, args: { [key: string]: any; } | null, handle: number): CommandResponseNoValue 
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
                new NcPropertyDescriptor(new NcElementID(3, 1), "controlClasses", "ncClassDescriptor", true, true, true),
                new NcPropertyDescriptor(new NcElementID(3, 2), "datatypes", "ncDatatypeDescriptor", true, true, true)
            ],
            [ 
                new NcMethodDescriptor(new NcElementID(3, 1), "GetControlClass", "ncMethodResultClassDescriptors", [
                    new NcParameterDescriptor("identity", "ncClassIdentity", true),
                    new NcParameterDescriptor("allElements", "ncBoolean", true)
                ]),
                new NcMethodDescriptor(new NcElementID(3, 2), "GetDatatype", "ncMethodResultDatatypeDescriptors", [
                    new NcParameterDescriptor("name", "ncName", true),
                    new NcParameterDescriptor("allDefs", "ncBoolean", true)
                ]),
                new NcMethodDescriptor(new NcElementID(3, 3), "GetControlClasses", "ncMethodResultClassDescriptors", [
                    new NcParameterDescriptor("blockPath", "ncRolePath", true),
                    new NcParameterDescriptor("recurseBlocks", "ncBoolean", true),
                    new NcParameterDescriptor("allElements", "ncBoolean", true)
                ]),
                new NcMethodDescriptor(new NcElementID(3, 4), "GetDataTypes", "ncMethodResultDatatypeDescriptors", [
                    new NcParameterDescriptor("blockPath", "ncRolePath", true),
                    new NcParameterDescriptor("recurseBlocks", "ncBoolean", true),
                    new NcParameterDescriptor("allDefs", "ncBoolean", true)
                ])
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
            case 'ncBoolean': 
                return [ new NcDatatypeDescriptorPrimitive("ncBoolean")];
            case 'ncInt8': 
                return [ new NcDatatypeDescriptorPrimitive("ncInt8")];
            case 'ncInt16': 
                return [ new NcDatatypeDescriptorPrimitive("ncInt16")];
            case 'ncInt32': 
                return [ new NcDatatypeDescriptorPrimitive("ncInt32")];
            case 'ncInt64': 
                return [ new NcDatatypeDescriptorPrimitive("ncInt64")];
            case 'ncUint8': 
                return [ new NcDatatypeDescriptorPrimitive("ncUint8")];
            case 'ncUint16': 
                return [ new NcDatatypeDescriptorPrimitive("ncUint16")];
            case 'ncUint32': 
                return [ new NcDatatypeDescriptorPrimitive("ncUint32")];
            case 'ncUint64': 
                return [ new NcDatatypeDescriptorPrimitive("ncUint64")];
            case 'ncFloat32': 
                return [ new NcDatatypeDescriptorPrimitive("ncFloat32")];
            case 'ncFloat64': 
                return [ new NcDatatypeDescriptorPrimitive("ncFloat64")];
            case 'ncString': 
                return [ new NcDatatypeDescriptorPrimitive("ncString")];
            case 'ncBlob': 
                return [ new NcDatatypeDescriptorPrimitive("ncBlob")];
            case 'ncBlobFixedLen': 
                return [ new NcDatatypeDescriptorPrimitive("ncBlobFixedLen")];
            case 'ncClassId': 
                return [ new NcDatatypeDescriptorTypeDef("ncClassId", "ncClassIdField")];
            case 'ncClassIdField': 
                return [ new NcDatatypeDescriptorTypeDef("ncClassIdField", "ncInt32")];
            case 'ncVersionCode': 
                return [ new NcDatatypeDescriptorTypeDef("ncVersionCode", "ncString")];
            case 'ncOid': 
                return [ new NcDatatypeDescriptorTypeDef("ncOid", "ncUint32")];
            case 'ncRole': 
                return [ new NcDatatypeDescriptorTypeDef("ncRole", "ncName")];
            case 'ncRolePath': 
                return [ new NcDatatypeDescriptorTypeDef("ncRolePath", "ncName")];
            case 'ncLabel': 
                return [ new NcDatatypeDescriptorTypeDef("ncLabel", "ncString")];
            case 'ncName': 
                return [ new NcDatatypeDescriptorTypeDef("ncName", "ncString")];
            case 'ncId32': 
                return [ new NcDatatypeDescriptorTypeDef("ncId32", "ncUint32")];
            case 'ncTimeInterval': 
                return [ new NcDatatypeDescriptorTypeDef("ncTimeInterval", "ncFloat64")];
            case 'ncDB': 
                return [ new NcDatatypeDescriptorTypeDef("ncDB", "ncFloat32")];
            case 'ncPropertyId': 
                return [ new NcDatatypeDescriptorTypeDef("ncPropertyId", "ncElementID")];
            case 'ncElementID': 
                return [ NcElementID.GetTypeDescriptor() ];
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
                    new NcPropertyDescriptor(new NcElementID(1, 1), "status", "ncMethodStatus", true, true, true),
                    new NcPropertyDescriptor(new NcElementID(1, 1), "errorMessage", "ncString", true, true, true)
                ])];
            case 'ncMethodResultPropertyValue':
                return [ new NcDatatypeDescriptorStruct("ncMethodResultPropertyValue", [
                    new NcPropertyDescriptor(new NcElementID(1, 1), "status", "ncMethodStatus", true, true, true),
                    new NcPropertyDescriptor(new NcElementID(1, 1), "errorMessage", "ncString", true, true, true),
                    new NcPropertyDescriptor(new NcElementID(2, 1), "value", "", true, true, true)
                ])];
            case 'ncMethodResultId32':
                return [ new NcDatatypeDescriptorStruct("ncMethodResultId32", [
                    new NcPropertyDescriptor(new NcElementID(1, 1), "status", "ncMethodStatus", true, true, true),
                    new NcPropertyDescriptor(new NcElementID(1, 1), "errorMessage", "ncString", true, true, true),
                    new NcPropertyDescriptor(new NcElementID(2, 1), "value", "ncId32", true, true, true)
                ])];
            case 'ncClassIdentity': 
                return [ NcClassIdentity.GetTypeDescriptor() ];
            case 'ncBlockMemberDescriptor': 
                return [ NcBlockMemberDescriptor.GetTypeDescriptor() ];
            case 'ncMethodResultBlockMemberDescriptors':
                return [ new NcDatatypeDescriptorStruct("ncMethodResultBlockMemberDescriptors", [
                    new NcPropertyDescriptor(new NcElementID(1, 1), "status", "ncMethodStatus", true, true, true),
                    new NcPropertyDescriptor(new NcElementID(1, 1), "errorMessage", "ncString", true, true, true),
                    new NcPropertyDescriptor(new NcElementID(2, 1), "value", "ncBlockMemberDescriptor", true, true, true)
                ])];
            case 'ncReceiverStatus': 
                return [ NcReceiverStatus.GetTypeDescriptor() ];
            case 'ncMethodResultReceiverStatus':
                return [ new NcDatatypeDescriptorStruct("ncMethodResultReceiverStatus", [
                    new NcPropertyDescriptor(new NcElementID(1, 1), "status", "ncMethodStatus", true, true, true),
                    new NcPropertyDescriptor(new NcElementID(1, 1), "errorMessage", "ncString", true, true, true),
                    new NcPropertyDescriptor(new NcElementID(2, 1), "value", "ncReceiverStatus", true, true, true)
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
    public classID: number[] = [ 1, 7, 5 ];
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
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);
    }

    public static override GetClassDescriptor(): NcClassDescriptor 
    {
        let baseDescriptor = super.GetClassDescriptor();

        let currentClassDescriptor = new NcClassDescriptor("NcSubscriptionManager class descriptor",
            [],
            [ 
                new NcMethodDescriptor(new NcElementID(3, 1), "AddSubscription", "ncMethodResult", [
                    new NcParameterDescriptor("event", "ncEvent", true)
                ]),
                new NcMethodDescriptor(new NcElementID(3, 2), "RemoveSubscription", "ncMethodResult", [
                    new NcParameterDescriptor("event", "ncEvent", true)
                ]),
                new NcMethodDescriptor(new NcElementID(3, 3), "addPropertyChangeSubscription", "ncMethodResult", [
                    new NcParameterDescriptor("emitter", "ncOid", true),
                    new NcParameterDescriptor("property", "ncPropertyID", true)
                ]),
                new NcMethodDescriptor(new NcElementID(3, 4), "removePropertyChangeSubscription", "ncMethodResult", [
                    new NcParameterDescriptor("emitter", "ncOid", true),
                    new NcParameterDescriptor("property", "ncPropertyID", true)
                ])
            ],
            []
        );

        currentClassDescriptor.properties = currentClassDescriptor.properties.concat(baseDescriptor.properties);
        currentClassDescriptor.methods = currentClassDescriptor.methods.concat(baseDescriptor.methods);
        currentClassDescriptor.events = currentClassDescriptor.events.concat(baseDescriptor.events);

        return currentClassDescriptor;
    }
}