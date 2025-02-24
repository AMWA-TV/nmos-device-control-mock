import { v4 as uuidv4 } from 'uuid';
import { jsonIgnoreReplacer } from 'json-ignore';
const fs = require("fs");
const writeFileAtomic = require('write-file-atomic')

export class Configuration implements IConfiguration
{
    public node_id: string;
    public device_id: string;
    public receiver_id: string;
    public source_id: string;
    public flow_id: string;
    public sender_id: string;
    public address: string;
    public port: number;
    public base_label: string;
    public registry_address: string;
    public registry_port: string;
    public notify_without_subscriptions: boolean;
    public work_without_registry: boolean;
    public manufacturer: string;
    public product: string;
    public instance: string;
    public function: string;

    public constructor()
    {
        //read configuration
        console.log('Configuration: Reading config.json');
        const jsonString = fs.readFileSync('./dist/server/config.json');
        let config: IConfiguration = JSON.parse(jsonString);

        this.node_id = config.node_id;
        this.device_id = config.device_id;
        this.receiver_id = config.receiver_id;
        this.source_id = config.source_id;
        this.flow_id = config.flow_id;
        this.sender_id = config.sender_id;
        this.base_label = config.base_label;
        this.address = config.address;
        this.port = config.port;
        this.registry_address = config.registry_address;
        this.registry_port = config.registry_port;
        this.notify_without_subscriptions = config.notify_without_subscriptions;
        this.work_without_registry = config.work_without_registry;

        this.manufacturer = config.manufacturer;
        this.product = config.product;
        this.instance = config.instance;
        this.function = config.function;

        this.CheckIdentifiers();
        this.CheckDistinguishingInformation();
    }

    public CheckIdentifiers()
    {
        console.log('Configuration - CheckIdentifiers()');

        let shouldWriteConfig: boolean = false;

        if(this.node_id == null)
        {
            this.node_id = uuidv4().toString();
            shouldWriteConfig = true;
        }

        if(this.device_id == null)
        {
            this.device_id = uuidv4().toString();
            shouldWriteConfig = true;
        }

        if(this.receiver_id == null)
        {
            this.receiver_id = uuidv4().toString();
            shouldWriteConfig = true;
        }

        if(this.source_id == null)
        {
            this.source_id = uuidv4().toString();
            shouldWriteConfig = true;
        }

        if(this.flow_id == null)
        {
            this.flow_id = uuidv4().toString();
            shouldWriteConfig = true;
        }

        if(this.sender_id == null)
        {
            this.sender_id = uuidv4().toString();
            shouldWriteConfig = true;
        }

        if(shouldWriteConfig)
            this.WriteConfig();
    }

    public CheckDistinguishingInformation()
    {
        console.log('Configuration - CheckDistinguishingInformation()');

        let shouldWriteConfig: boolean = false;

        if(this.manufacturer == null)
        {
            this.manufacturer = "ACME-D";
            shouldWriteConfig = true;
        }

        if(this.product == null)
        {
            this.product = "Widget Pro-D";
            shouldWriteConfig = true;
        }

        if(this.instance == null)
        {
            this.instance = "XYZ123-456789-D";
            shouldWriteConfig = true;
        }

        if(this.function == null)
        {
            this.function = "UHD Encoder/Decoder";
            shouldWriteConfig = true;
        }

        if(shouldWriteConfig)
            this.WriteConfig();
    }


    public ToJson()
    {
        return JSON.stringify(this, jsonIgnoreReplacer);
    }

    public WriteConfig()
    {
        console.log('Configuration- Writing back config.json');
        
        writeFileAtomic('./dist/server/config.json', this.ToJson(), function (err) {
            if (err)
            {
                console.log('Error writing file', err);
            }
            else
            {
                console.log('Successfully wrote file');
            }
        });
    }
}

export interface IConfiguration
{
    node_id: string;
    device_id: string;
    receiver_id: string;
    source_id: string;
    flow_id: string;
    sender_id: string;
    address: string;
    port: number;
    base_label: string;
    registry_address: string;
    registry_port: string;
    notify_without_subscriptions: boolean;
    work_without_registry: boolean;
    manufacturer: string;
    product: string;
    instance: string;
    function: string;
}