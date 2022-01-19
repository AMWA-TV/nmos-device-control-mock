import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { INotificationContext } from '../SessionManager';
import { NcaObject, NcaTouchpoint } from './Core';

export abstract class NcaManager extends NcaObject
{
    public constructor(
        oid: number,
        resources: NcaTouchpoint[] | null,
        constantOid: boolean,
        notificationContext: INotificationContext)
    {
        super(oid, resources, constantOid, notificationContext);
    }
}

export class ClassManager extends NcaManager
{
    public classID: number[] = [ 1, 7, 3 ];
    public classVersion: number = 1;

    public constructor(
        oid: number,
        resources: NcaTouchpoint[] | null,
        constantOid: boolean,
        notificationContext: INotificationContext)
    {
        super(oid, resources, constantOid, notificationContext);
    }
}

export class SubscriptionManager extends NcaManager
{
    public classID: number[] = [ 1, 7, 5 ];
    public classVersion: number = 1;

    public constructor(
        oid: number,
        resources: NcaTouchpoint[] | null,
        constantOid: boolean,
        notificationContext: INotificationContext)
    {
        super(oid, resources, constantOid, notificationContext);
    }
}