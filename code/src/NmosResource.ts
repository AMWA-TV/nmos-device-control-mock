import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { TAI64 } from "tai64";

import { RegistrationClient } from './RegistrationClient';

export abstract class NmosResource
{
    public id: string;
    public version: string;
    public label: string;
    public description: string;
    public tags: object;

    @jsonIgnore()
    public registrationClient: RegistrationClient;

    public constructor(
        id: string,
        label: string,
        registrationClient: RegistrationClient)
    {
        this.id = id;
        this.label = label;
        this.version = `${TAI64.now().toUnix().toString()}:00000000`;
        this.description = label;
        this.tags = {};
        this.registrationClient = registrationClient;
    }

    public BumpVersion()
    {
        this.version = `${TAI64.now().toUnix().toString()}:00000000`;
    }

    public abstract ToJson();
}