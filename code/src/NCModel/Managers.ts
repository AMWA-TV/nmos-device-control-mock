import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';
import { NcReceiverMonitor } from './Agents';
import { NcBlock } from './Blocks';
import { NcClassDescriptor, NcClassIdentity, NcElementID, NcLockState, NcMethodDescriptor, NcMethodStatus, NcObject, NcParameterDescriptor, NcPropertyDescriptor, NcTouchpoint } from './Core';

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

    public override InvokeMethod(oid: number, methodID: NcElementID, args: { [key: string]: any; } | null, handle: number): CommandResponseWithValue 
    {
        if(oid == this.oid)
        {
            let key: string = `${methodID.level}m${methodID.index}`;

            switch(key)
            {
                case '3m1':
                    {
                        if(args != null)
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
            case '1.4.1': 
                return [ NcReceiverMonitor.GetClassDescriptor() ];
            default:
                return new Array<NcClassDescriptor>();
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