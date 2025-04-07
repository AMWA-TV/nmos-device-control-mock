import { jsonIgnoreReplacer } from "json-ignore";
import { NmosResource } from "./NmosResource";
import { RegistrationClient } from "./RegistrationClient";

export class NmosSource extends NmosResource
{
    public device_id: string;
    public parents: string[];
    public clock_name: string;
    public caps: object;

    public constructor(
        id: string,
        device_id: string,
        base_label: string,
        parents: string[],
        clock_name: string,
        registrationClient: RegistrationClient)
    {
        super(id, `${base_label} source`, registrationClient);

        this.device_id = device_id;
        this.parents = parents;
        this.clock_name = clock_name;
        
        this.tags = {};
        this.caps = {};
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }

    public ToJsonArray()
    {
        return JSON.stringify([this], jsonIgnoreReplacer);
    }
}