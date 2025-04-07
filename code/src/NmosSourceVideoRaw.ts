import { jsonIgnoreReplacer } from "json-ignore";
import { RegistrationClient } from "./RegistrationClient";
import { NmosSource } from "./NmosSource";

export class NmosSourceVideoRaw extends NmosSource
{
    public format: string;
    public grain_rate: object;

    public constructor(
        id: string,
        device_id: string,
        label: string,
        parents: string[],
        clock_name: string,
        grain_rate_numerator: number,
        grain_rate_denominator: number,
        format: string,
        registrationClient: RegistrationClient)
    {
        super(id, device_id, label, parents, clock_name, registrationClient);

        this.grain_rate = {
            "numerator": grain_rate_numerator,
            "denominator": grain_rate_denominator
        };

        this.format = format;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}