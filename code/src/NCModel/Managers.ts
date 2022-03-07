import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { INotificationContext } from '../SessionManager';
import { NcLockState, NcObject, NcTouchpoint } from './Core';

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
    public classVersion: number = 1;

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

export class NcSubscriptionManager extends NcManager
{
    public classID: number[] = [ 1, 7, 5 ];
    public classVersion: number = 1;

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