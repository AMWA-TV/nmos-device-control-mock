import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { INotificationContext } from '../SessionManager';
import { NcaLockState, NcaObject, NcaTouchpoint } from './Core';

export abstract class NcaManager extends NcaObject
{
    public constructor(
        oid: number,
        constantOid: boolean,
        owner: number | null,
        role: string,
        userLabel: string,
        lockable: boolean,
        lockState: NcaLockState,
        touchpoints: NcaTouchpoint[] | null,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);
    }
}

export class NcaClassManager extends NcaManager
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
        lockState: NcaLockState,
        touchpoints: NcaTouchpoint[] | null,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);
    }
}

export class NcaSubscriptionManager extends NcaManager
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
        lockState: NcaLockState,
        touchpoints: NcaTouchpoint[] | null,
        notificationContext: INotificationContext)
    {
        super(oid, constantOid, owner, role, userLabel, lockable, lockState, touchpoints, notificationContext);
    }
}