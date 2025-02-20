import { jsonIgnoreReplacer } from "json-ignore";
import { NmosResource } from "./NmosResource";
import { RegistrationClient } from "./RegistrationClient";

export class NmosFlow extends NmosResource
{
    public source_id: string;
    public device_id: string;
    public parents: string[];
    public grain_rate: object;

    public constructor(
        id: string,
        source_id: string,
        device_id: string,
        base_label: string,
        parents: string[],
        grain_rate_numerator: number,
        grain_rate_denominator: number,
        registrationClient: RegistrationClient)
    {
        super(id, `${base_label} flow`, registrationClient);

        this.source_id = source_id;
        this.device_id = device_id;
        this.parents = parents;
        this.grain_rate = {
            "numerator": grain_rate_numerator,
            "denominator": grain_rate_denominator
        };
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