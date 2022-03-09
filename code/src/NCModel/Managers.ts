import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { CommandResponseNoValue, CommandResponseWithValue } from '../NCProtocol/Commands';
import { INotificationContext } from '../SessionManager';
import { NcBlock } from './Blocks';
import { NcClassDescriptor, NcClassIdentity, NcElementID, NcLockState, NcMethodStatus, NcObject, NcTouchpoint } from './Core';

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

    private GetClassDescriptors(identity: NcClassIdentity) : NcClassDescriptor[]
    {
        let key: string = identity.classID.join('.');

        switch(key)
        {
            case '1.1': 
                return [ NcBlock.GetClassDescriptor() ];
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
}