import { jsonIgnoreReplacer } from "json-ignore";
import { NmosResource } from "./NmosResource";
import { RegistrationClient } from "./RegistrationClient";

export class NmosFlow extends NmosResource
{
    public source_id: string;
    public device_id: string;
    public parents: string[];

    public constructor(
        id: string,
        source_id: string,
        device_id: string,
        base_label: string,
        parents: string[],
        
        registrationClient: RegistrationClient)
    {
        super(id, `${base_label} flow`, registrationClient);

        this.source_id = source_id;
        this.device_id = device_id;
        this.parents = parents;
        
        this.tags = {};
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