import application from 'express';
import http from 'http';
import { AddressInfo, Socket } from 'net';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { Configuration } from './Configuration';
import { NmosNode } from './NmosNode';
import { NmosDevice } from './NmosDevice';
import { RegistrationClient } from './RegistrationClient';
import { NmosReceiverVideo } from './NmosReceiverVideo';
import { NmosReceiverActiveRtp } from './NmosReceiverActiveRtp';
import { SessionManager } from './SessionManager';
import { NcBlock, RootBlock } from './NCModel/Blocks';
import { NcClassManager, NcDeviceManager } from './NCModel/Managers';
import { NcIoDirection, NcMethodStatus, NcPort, NcPortReference, NcSignalPath, NcTouchpointNmos, NcTouchpointResourceNmos } from './NCModel/Core';
import { NcDemo, NcGain, NcIdentBeacon, NcReceiverMonitor } from './NCModel/Features';
import { ProtocolError, ProtocolSubscription } from './NCProtocol/Commands';
import { MessageType, ProtocolWrapper } from './NCProtocol/Core';
import { MultiviewerLayoutElement, NcMultiviewerDisplay, NcMultiviewerLayout, NcMultiviewerTile, NcUMD } from './NCModel/FeaturesMultiviewers';

export interface WebSocketConnection extends WebSocket {
    isAlive: boolean;
    connectionId: string;
}

function DelayTask(timeMs: number | undefined) 
{
    return new Promise(resolve => setTimeout(resolve, timeMs));
}

try
{
    console.log('App started');
    const config = new Configuration();

    const registrationClient = new RegistrationClient(config.registry_address, config.registry_port, config.work_without_registry);

    const myNode = new NmosNode(
        config.node_id,
        config.base_label,
        config.address,
        config.port,
        registrationClient);

    const myDevice = new NmosDevice(
        config.device_id,
        config.node_id,
        config.base_label,
        config.address,
        config.port,
        registrationClient);

    const myVideoReceiver_01 = new NmosReceiverVideo(
        config.mwvr_receiver_01_id,
        config.device_id,
        config.base_label,
        'urn:x-nmos:transport:rtp.mcast',
        '01',
        registrationClient)

    const myVideoReceiver_02 = new NmosReceiverVideo(
        config.mwvr_receiver_02_id,
        config.device_id,
        config.base_label,
        'urn:x-nmos:transport:rtp.mcast',
        '02',
        registrationClient)

    const myVideoReceiver_03 = new NmosReceiverVideo(
        config.mwvr_receiver_03_id,
        config.device_id,
        config.base_label,
        'urn:x-nmos:transport:rtp.mcast',
        '03',
        registrationClient)

    const myVideoReceiver_04 = new NmosReceiverVideo(
        config.mwvr_receiver_04_id,
        config.device_id,
        config.base_label,
        'urn:x-nmos:transport:rtp.mcast',
        '04',
        registrationClient)

    myDevice.AddReceiver(myVideoReceiver_01);

    const sessionManager = new SessionManager(config.notify_without_subscriptions);

    const deviceManager = new NcDeviceManager(
        2,
        true,
        1,
        'Device manager',
        null,
        null,
        "The device manager offers information about the product this device is representing",
        sessionManager);

    const classManager = new NcClassManager(
        3,
        true,
        1,
        'Class manager',
        null,
        null,
        "The class manager offers access to control class and data type descriptors",
        sessionManager);

    const receiverMonitorAgent_01 = new NcReceiverMonitor(
        11,
        true,
        1,
        'ReceiverMonitor_01',
        'Receiver monitor 01',
        [ new NcTouchpointNmos('x-nmos', new NcTouchpointResourceNmos('receiver', myVideoReceiver_01.id)) ],
        null,
        true,
        "Receiver monitor worker",
        sessionManager);

    myVideoReceiver_01.AttachMonitoringAgent(receiverMonitorAgent_01);

    const receiverMonitorAgent_02 = new NcReceiverMonitor(
        12,
        true,
        1,
        'ReceiverMonitor_02',
        'Receiver monitor 02',
        [ new NcTouchpointNmos('x-nmos', new NcTouchpointResourceNmos('receiver', myVideoReceiver_02.id)) ],
        null,
        true,
        "Receiver monitor worker",
        sessionManager);

    myVideoReceiver_02.AttachMonitoringAgent(receiverMonitorAgent_02);

    const receiverMonitorAgent_03 = new NcReceiverMonitor(
        13,
        true,
        1,
        'ReceiverMonitor_03',
        'Receiver monitor 03',
        [ new NcTouchpointNmos('x-nmos', new NcTouchpointResourceNmos('receiver', myVideoReceiver_03.id)) ],
        null,
        true,
        "Receiver monitor worker",
        sessionManager);

    myVideoReceiver_03.AttachMonitoringAgent(receiverMonitorAgent_03);

    const receiverMonitorAgent_04 = new NcReceiverMonitor(
        14,
        true,
        1,
        'ReceiverMonitor_04',
        'Receiver monitor 04',
        [ new NcTouchpointNmos('x-nmos', new NcTouchpointResourceNmos('receiver', myVideoReceiver_04.id)) ],
        null,
        true,
        "Receiver monitor worker",
        sessionManager);

    myVideoReceiver_04.AttachMonitoringAgent(receiverMonitorAgent_04);

    const receiver_monitors_block = new NcBlock(
        false,
        10,
        true,
        5,
        'receiver-monitors',
        'Receiver monitors block',
        null,
        null,
        true,
        "multiviewer-control",
        "1.0.0",
        null,
        null,
        "Multiviewer control blockspec",
        false,
        [
            receiverMonitorAgent_01,
            receiverMonitorAgent_02,
            receiverMonitorAgent_03,
            receiverMonitorAgent_04,
        ],
        [], [],
        "Receiver monitors block",
        sessionManager);

    const demoClass = new NcDemo(
        111,
        true,
        1,
        'DemoClass',
        'Demo class',
        [],
        null,
        true,
        "Demo control class",
        sessionManager);

    const channelGainBlock = new NcBlock(
        false,
        21,
        true,
        31,
        'channel-gain',
        'Channel gain',
        null,
        null,
        true,
        null,
        null,
        null,
        null,
        null,
        false,
        [
            new NcGain(22, true, 21, "left-gain", "Left gain", [], null, true, [
                new NcPort('input_1', NcIoDirection.Input, null),
                new NcPort('output_1', NcIoDirection.Output, null),
            ], null, 0, "Left channel gain", sessionManager),
            new NcGain(23, true, 21, "right-gain", "Right gain", [], null, true, [
                new NcPort('input_1', NcIoDirection.Input, null),
                new NcPort('output_1', NcIoDirection.Output, null),
            ], null, 0, "Right channel gain", sessionManager)
        ],
        [ 
            new NcPort('stereo_gain_input_1', NcIoDirection.Input, null),
            new NcPort('stereo_gain_input_2', NcIoDirection.Input, null),
            new NcPort('stereo_gain_output_1', NcIoDirection.Output, null),
            new NcPort('stereo_gain_output_2', NcIoDirection.Output, null)
        ],
        [
            new NcSignalPath('left_gain_input', 'Left gain input', new NcPortReference([], "stereo_gain_input_1"), new NcPortReference(['left-gain'], 'input_1')),
            new NcSignalPath('left_gain_output', 'Left gain output', new NcPortReference(['left-gain'], 'output_1'), new NcPortReference([], "stereo_gain_output_1")),
            new NcSignalPath('right_gain_input', 'Right gain input', new NcPortReference([], "stereo_gain_input_2"), new NcPortReference(['right-gain'], 'input_1')),
            new NcSignalPath('right_gain_output', 'Right gain output', new NcPortReference(['right-gain'], 'output_1'), new NcPortReference([], "stereo_gain_output_2")),
        ],
        "Channel gain block",
        sessionManager);

        const stereoGainBlock = new NcBlock(
            false,
            31,
            true,
            1,
            'stereo-gain',
            'Stereo gain',
            null,
            null,
            true,
            null,
            null,
            null,
            null,
            null,
            false,
            [
                channelGainBlock,
                new NcGain(24, true, 31, "master-gain", "Master gain", [], null, true, [
                    new NcPort('input_1', NcIoDirection.Input, null),
                    new NcPort('input_2', NcIoDirection.Input, null),
                    new NcPort('output_1', NcIoDirection.Output, null),
                    new NcPort('output_2', NcIoDirection.Output, null),
                ], null, 0, "Master gain", sessionManager)
            ],
            [ 
                new NcPort('block_input_1', NcIoDirection.Input, null),
                new NcPort('block_input_2', NcIoDirection.Input, null),
                new NcPort('block_output_1', NcIoDirection.Output, null),
                new NcPort('block_output_2', NcIoDirection.Output, null)
            ],
            [
                new NcSignalPath('block-in-1-to-left-gain-in', 'Block input 1 to left gain input', new NcPortReference([], "block_input_1"), new NcPortReference(['stereo-gain'], 'stereo_gain_input_1')),
                new NcSignalPath('left-gain-out-to-master-gain-in-1', 'Left gain output to master gain input 1', new NcPortReference(['stereo-gain'], 'stereo_gain_output_1'), new NcPortReference(['master-gain'], "input_1")),
                new NcSignalPath('master-gain-out-1-to-block-out-1', 'Master gain output 1 to block output 1', new NcPortReference(['master-gain'], "output_1"), new NcPortReference([], 'block_output_1')),
                new NcSignalPath('block-in-2-to-right-gain-in', 'Block input 2 to right gain input', new NcPortReference([], "block_input_2"), new NcPortReference(['stereo-gain'], 'stereo_gain_input_2')),
                new NcSignalPath('right-gain-out-to-master-gain-in-2', 'Right gain output to master gain input 2', new NcPortReference(['stereo-gain'], 'stereo_gain_output_2'), new NcPortReference(['master-gain'], "input_2")),
                new NcSignalPath('master-gain-out-2-to-block-out-2', 'Master gain output 2 to block output 2', new NcPortReference(['master-gain'], "output_2"), new NcPortReference([], 'block_output_2'))
            ],
            "Stereo gain block",
            sessionManager);

    const identBeacon = new NcIdentBeacon(51, true, 1, "IdentBeacon", "Identification beacon", [], null, true, false, "Identification beacon", sessionManager);

    const umds_block = new NcBlock(
        false,
        200,
        true,
        5,
        'umds',
        'UMDs block',
        null,
        null,
        true,
        "multiviewer-control-umds",
        "1.0.0",
        null,
        null,
        "Multiviewer control umds blockspec",
        false,
        [
            new NcUMD(211, true, 200, 'umd_01', 'UMD 01', [], null, true, "UMD control class", sessionManager),
            new NcUMD(212, true, 200, 'umd_02', 'UMD 02', [], null, true, "UMD control class", sessionManager),
            new NcUMD(213, true, 200, 'umd_03', 'UMD 03', [], null, true, "UMD control class", sessionManager),
            new NcUMD(214, true, 200, 'umd_04', 'UMD 04', [], null, true, "UMD control class", sessionManager),
        ],
        [], [],
        "UMDs block",
        sessionManager);

    const tiles_block = new NcBlock(
        false,
        300,
        true,
        5,
        'tiles',
        'Tiles block',
        null,
        null,
        true,
        "multiviewer-control-tiles",
        "1.0.0",
        null,
        null,
        "Multiviewer control tiles blockspec",
        false,
        [
            new NcMultiviewerTile(311, true, 300, 'tile_01', 'Tile 01', [], null, true, "Tile control class", receiver_monitors_block.memberObjects[0].oid, umds_block.memberObjects[0].oid, sessionManager),
            new NcMultiviewerTile(312, true, 300, 'tile_02', 'Tile 02', [], null, true, "Tile control class", receiver_monitors_block.memberObjects[1].oid, umds_block.memberObjects[1].oid, sessionManager),
            new NcMultiviewerTile(313, true, 300, 'tile_03', 'Tile 03', [], null, true, "Tile control class", receiver_monitors_block.memberObjects[2].oid, umds_block.memberObjects[2].oid, sessionManager),
            new NcMultiviewerTile(314, true, 300, 'tile_04', 'Tile 04', [], null, true, "Tile control class", receiver_monitors_block.memberObjects[3].oid, umds_block.memberObjects[3].oid, sessionManager),
        ],
        [], [],
        "Tiles block",
        sessionManager);

    const layouts_block = new NcBlock(
        false,
        400,
        true,
        5,
        'layouts',
        'Layouts block',
        null,
        null,
        true,
        "multiviewer-control-layouts",
        "1.0.0",
        null,
        null,
        "Multiviewer control layouts blockspec",
        false,
        [
            new NcMultiviewerLayout(411, true, 400, 'layout_01', 'Layout ABC', [], null, true, "Layout control class",
            1920, 1080,
            [
                new MultiviewerLayoutElement(180, 110, 710, 430, tiles_block.memberObjects[0].oid),
                new MultiviewerLayoutElement(1030, 110, 710, 430, tiles_block.memberObjects[1].oid),
                new MultiviewerLayoutElement(180, 640, 710, 430, tiles_block.memberObjects[2].oid),
                new MultiviewerLayoutElement(1030, 640, 710, 430, tiles_block.memberObjects[3].oid)
            ], sessionManager),
        ],
        [], [],
        "Layouts block",
        sessionManager);

    const displays_block = new NcBlock(
        false,
        500,
        true,
        5,
        'displays',
        'Displays block',
        null,
        null,
        true,
        "multiviewer-control-displays",
        "1.0.0",
        null,
        null,
        "Multiviewer control display blockspec",
        false,
        [
            new NcMultiviewerDisplay(511, true, 500, 'display_01', 'Display 01', [], null, true, "Display control class",
                layouts_block.memberObjects[0].oid, sessionManager),
        ],
        [], [],
        "Displays block",
        sessionManager);

    const multiviewer_control = new NcBlock(
        false,
        5,
        true,
        1,
        'multiviewer-control',
        'Displays block',
        null,
        null,
        true,
        "multiviewer-control",
        "1.0.0",
        null,
        null,
        "Multiviewer control blockspec",
        false,
        [ receiver_monitors_block, umds_block, tiles_block, layouts_block, displays_block ],
        [], [],
        "Multiviewer control block",
        sessionManager);
    
    const rootBlock = new RootBlock(
        1,
        true,
        null,
        'root',
        'Root',
        null,
        null,
        true,
        "base-root",
        "1.0.0",
        null,
        null,
        "Blockspec for root block of minimum compliant device",
        false,
        [ deviceManager, classManager, multiviewer_control, stereoGainBlock, demoClass, identBeacon ],
        null,
        null,
        "Root block",
        sessionManager);

    async function doAsync () {
        await registrationClient.RegisterOrUpdateResource('node', myNode);
        registrationClient.StartHeatbeats(myNode.id);
        await registrationClient.RegisterOrUpdateResource('device', myDevice);
        await registrationClient.RegisterOrUpdateResource('receiver', myVideoReceiver_01);
        await registrationClient.RegisterOrUpdateResource('receiver', myVideoReceiver_02);
        await registrationClient.RegisterOrUpdateResource('receiver', myVideoReceiver_03);
        await registrationClient.RegisterOrUpdateResource('receiver', myVideoReceiver_04);
    };

    doAsync();

    //initialize the Express HTTP listener
    const app = application();
    app.use(application.json());
    
    //initialize server
    const server = http.createServer(application);
    
    //initialize the WebSocket server instance
    const webSocketServer = new WebSocket.Server({ noServer: true });

    webSocketServer.on('connection', (ws: WebSocket) => {
        let extWs = ws as WebSocketConnection;
    
        extWs.isAlive = true;
        extWs.connectionId = uuidv4().toString();

        ws.on('close', () => {
            console.log(`Client disconnected - connection id: ${extWs.connectionId}`);
            sessionManager.ConnectionClosed(extWs.connectionId);
        });
    
        ws.on('pong', () => {
            extWs.isAlive = true;
        });
    
        //subscribe to messages
        ws.on('message', (msg: string) => {
            console.log(`WS msg received - connection id: ${extWs.connectionId}, msg: ${msg}`);
            
            let isMessageValid = false;
            let errorMessage = ``;
            let status: NcMethodStatus = NcMethodStatus.BadCommandFormat;

            try
            {
                let message = JSON.parse(msg) as ProtocolWrapper;

                if(message)
                {
                    if(message.protocolVersion == "1.0.0")
                    {
                        switch(message.messageType)
                        {
                            case MessageType.Command:
                            {
                                rootBlock.ProcessMessage(msg, extWs);
                                isMessageValid = true;
                            }
                            break;
                            case MessageType.Subscription:
                            {
                                let message = JSON.parse(msg) as ProtocolSubscription;
                                sessionManager.ModifySubscription(extWs, message);
                                isMessageValid = true;
                            }
                            break;
                            default:
                            {
                                isMessageValid = false;
                                errorMessage = `Invalid message type received: ${message.messageType}`;
                            }
                            break;
                        }
                    }
                    else
                    {
                        isMessageValid = false;
                        errorMessage = `Unsupported protocol version`;
                        status = NcMethodStatus.ProtocolVersionError;
                    }
                }
                else
                {
                    isMessageValid = false;
                    errorMessage = `Could not parse JSON message: ${msg}`;
                }
            }
            catch (err)
            {
                console.log(err);
                isMessageValid = false;
                errorMessage = `Could not parse JSON message: ${msg}`;
            }

            if(isMessageValid == false)
            {
                console.log(errorMessage);
                let error = new ProtocolError(status, errorMessage);
                extWs.send(error.ToJson());
            }
        });
    
        ws.on('error', (err) => {
            console.warn(`Client disconnected with error - reason: ${err}, connection id: ${extWs.connectionId}`);
            sessionManager.ConnectionClosed(extWs.connectionId);
        })

        sessionManager.CreateSession(extWs);
    });

    setInterval(() => {
        webSocketServer.clients.forEach((ws: WebSocket) => {
            const extWs = ws as WebSocketConnection;
    
            if (!extWs.isAlive) return ws.terminate();
    
            extWs.isAlive = false;
            ws.ping(null, undefined);
        });
    }, 10000);
    
    //forward normal HTTP requests to Express
    server.on('request', app);
    
    //forward WS upgrades to the webSocketServer
    server.on('upgrade', function upgrade(request, socket, head) {
        if(request.url)
        {
            console.log(`Request url ${request.url}`);
            if (request.url === '/x-nmos/ncp/v1.0/connect')
            {
                webSocketServer.handleUpgrade(request, socket as Socket, head, function done(ws) {
                    webSocketServer.emit('connection', ws, request);
                });
            }
            else 
            {
                socket.destroy();
            }
        }
        else 
        {
            socket.destroy();
        }
    });

    //General paths
    
    app.get('/', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 'x-nmos/' ]));
    })

    app.get('/x-nmos', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 
            'node/',
            'connection/'
        ]));
    })

    //IS-04 paths

    app.get('/x-nmos/node', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 'v1.3/' ]));
    })

    app.get('/x-nmos/node/v1.3', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 
            'self/',
            'devices/',
            'sources/',
            'flows/',
            'senders/',
            'receivers/',
        ]));
    })

    app.get('/x-nmos/node/v1.3/self', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(myNode.ToJson());
    })

    app.get('/x-nmos/node/v1.3/devices', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ `${myDevice.id}/` ]));
    })

    app.get('/x-nmos/node/v1.3/devices/:id', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(req.params.id === myDevice.id)
            res.send(myDevice.ToJson());
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/node/v1.3/sources', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
    })

    app.get('/x-nmos/node/v1.3/flows', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
    })

    app.get('/x-nmos/node/v1.3/senders', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
    })

    app.get('/x-nmos/node/v1.3/receivers', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(myDevice.FetchReceiversUris()))
    })

    app.get('/x-nmos/node/v1.3/receivers/:id', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send(myDevice.FetchReceiver(req.params.id)?.ToJson());
        else
            res.sendStatus(404);
    })

    //IS-05 paths
    app.get('/x-nmos/connection', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 'v1.1/' ]));
    })

    app.get('/x-nmos/connection/:version', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 
            'single/'
        ]));
    })

    app.get('/x-nmos/connection/:version/single', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([ 
            'senders/',
            'receivers/'
        ]));
    })

    app.get('/x-nmos/connection/:version/single/senders', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
    })

    app.get('/x-nmos/connection/:version/single/receivers', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(myDevice.FetchReceiversUris()));
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send(JSON.stringify([ 
                'constrains/',
                'staged/',
                'active/',
                'transporttype'
            ]));
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/constraints', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send(JSON.stringify(myDevice.FetchReceiver(req.params.id)?.FetchConstraints()));
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/active', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send((myDevice.FetchReceiver(req.params.id)?.FetchActive()?.ToJson()));
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/staged', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send((myDevice.FetchReceiver(req.params.id)?.FetchStaged()?.ToJson()));
        else
            res.sendStatus(404);
    })

    app.get('/x-nmos/connection/:version/single/receivers/:id/transporttype', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(myDevice.FindReceiver(req.params.id))
            res.send(JSON.stringify(myDevice.FetchReceiver(req.params.id)?.FetchTransportType()));
        else
            res.sendStatus(404);
    })

    app.patch('/x-nmos/connection/:version/single/receivers/:id/staged', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        let settings = req.body as NmosReceiverActiveRtp;

        if(myDevice.FindReceiver(req.params.id))
        {
            myDevice.ChangeReceiverSettings(req.params.id, settings);
            res.send((myDevice.FetchReceiver(req.params.id)?.FetchActive()?.ToJson()));
        }
        else
            res.sendStatus(404);
    })
    
    //start our server
    server.listen(config.port, () => {
        console.log(`Server started on port ${(server.address() as AddressInfo).port}`);
    });
}
catch (err) 
{
    console.log(err);
}