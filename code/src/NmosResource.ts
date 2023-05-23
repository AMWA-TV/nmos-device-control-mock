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

    @jsonIgnore()
    public versionSeconds: string;
    @jsonIgnore()
    public versionNanoSeconds: number;

    public constructor(
        id: string,
        label: string,
        registrationClient: RegistrationClient)
    {
        this.id = id;
        this.label = label;
        this.versionNanoSeconds = 0;
        this.versionSeconds = `${TAI64.now().toUnix().toString()}`;
        this.version = `${this.versionSeconds}:${this.versionNanoSeconds}`;
        this.description = label;
        this.tags = {};
        this.registrationClient = registrationClient;
    }

    public BumpVersion()
    {
        let newVersionSeconds = `${TAI64.now().toUnix().toString()}`;
        if(newVersionSeconds != this.versionSeconds)
        {
            this.versionSeconds = newVersionSeconds;
            this.versionNanoSeconds = 0;
        }
        else
            this.versionNanoSeconds++;

        this.version = `${this.versionSeconds}:${this.versionNanoSeconds}`;
    }

    public abstract ToJson();
}