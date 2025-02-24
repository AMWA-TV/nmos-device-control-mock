import { jsonIgnoreReplacer } from "json-ignore";
import { RegistrationClient } from "./RegistrationClient";
import { NmosSource } from "./NmosSource";

export class NmosSourceVideo extends NmosSource
{
    public format: string;

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
        super(id, device_id, label, parents, clock_name, grain_rate_numerator, grain_rate_denominator, registrationClient);

        this.format = format;
    }

    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }
}