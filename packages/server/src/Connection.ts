import { CliToServ, ServToCli, type ClientMsg, type ServerMsg } from '@cardgame/shared/src/protocol';
import type { WebSocket } from 'ws';
import Logger from './Logger';
import type RoomManager from './RoomManager';
import Session from './Session';
import type SessionManager from './SessionManager';

/**
 * Paramètre pour la création d'une connection
 */
interface Params
{
    /** La websocket */
    ws: WebSocket,
    /** Le manager de session */
    sessionManager: SessionManager,
    /** Le manager de salons */
    roomManager: RoomManager,
}

/**
 * Class de gestion de la connection,
 * La connection concerne uniquement le flux WS uniquement, pas la session coté serveur
 * Elle peut être intérompue et recréer pour un même joueur
 */
class Connection
{
    /** La websocker */
    ws: WebSocket;
    /** Le manager de session */
    sessionManager: SessionManager;
    /** Le manager de salons */
    roomManager: RoomManager;
    /** La session rattaché à la connection */
    session: Session | undefined;

    constructor(param: Params)
    {
        this.session = undefined;
        this.sessionManager = param.sessionManager;
        this.roomManager = param.roomManager;

        this.ws = param.ws;
        this.ws.on('close', () => this.close())
        this.ws.on('message', (data) => this.onMessage(data.toString()))

        Logger.debug(`New connection start.`);
    }

    /** Méthode d'envoie d'un message via la WS */
    send(message: ServerMsg) : undefined
    {
        if (this.ws.readyState !== this.ws.OPEN)
        {
            Logger.warn("WebSocket not ready.");
            return;
        }
        this.ws.send(JSON.stringify(message));
    }

    /** Méthode de fermeture coté session manager en cas de coupure de la WS */
    close() : undefined
    {
        this.sessionManager.disconnect(this);
    }

    /** Gestion du rooting en cas de réception client d'une WS */
    private onMessage(rawMessage: string) : undefined
    {
        let message: ClientMsg;
        try {
            message = JSON.parse(rawMessage) 
        }
        catch {
            this.send({ type: ServToCli.Error, message: 'JSON invalide' })
            return;
        }
        if(message.type === CliToServ.Hello)
        {
            this.sessionManager.hello(this, message.pseudo, message.token);
            return;
        }
        if(!this.session)
        {
            this.send({ type: ServToCli.Error, message: 'use Hello before any action' });
            return;
        }

        switch (message.type) {
            // Le client nous informe d'une nouvelle connection
            case CliToServ.CreateRoom:
                this.roomManager.create(this.session);
                break;
            case CliToServ.JoinRoom:
                if(!this.roomManager.addPlayer(message.code, this.session))
                {
                    this.send({ type: ServToCli.Error, message: 'Impossible de rejoindre le salon' });
                }
                break;
            case CliToServ.KickRoom:
                this.roomManager.kick(this.session, message.playerId);
                break;
            // Si aucun type de message Client -> Serveur
            default:
                this.send({ type: ServToCli.Error, message: 'Type non accepté' });
        }
    }
}

/**
 * Exports
 */
export default Connection;