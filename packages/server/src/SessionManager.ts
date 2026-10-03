import { ServToCli } from '@cardgame/shared/src/protocol'
import { randomUUID } from 'node:crypto'
import type Connection from "./Connection"
import Logger from './Logger'
import Session from "./Session"

/** Temps en ms à attendre avant de déconnecter qqn, ici 60s */
const GRACE_MS = 60_000

/**
 * Manager des sessions utilisateurs
 */
class SessionManager
{
    /** Map permetant selon un token de récupérer la session */
    private byToken = new Map<string, Session>()
    /** Map permetant selon un id de récupérer la session */
    private byId = new Map<string, Session>()

    /** Méthode de connection : nouvelle connection ou reconnection */
    hello(connection: Connection, pseudo: string, token?: string) : undefined
    {
        let session = token ? this.byToken.get(token) : undefined

        if (session) {
            // Si une session existe on ferme la connection
            // On reconnecte juste après la nouvelle session à la palce
            clearTimeout(session.graceTimer);
            session.connection?.close();
        } else {
            session = new Session({
                playerId: randomUUID(),
                token: randomUUID(),
                pseudo: pseudo
            });
            this.byToken.set(session.token, session);
            this.byId.set(session.playerId, session);
        }

        Logger.debug(`Hello from ${session.pseudo}`);

        session.connection = connection;
        connection.session = session;
        // On informe le client de sa bienvenue
        connection.send(
            { type: ServToCli.Welcome, playerId: session.playerId, token: session.token }
        );
    }

    /** Méthode de déconnection */
    disconnect(conn: Connection) : undefined
    {
        const session = conn.session;
        if (!session || session.connection !== conn)
            return;

        Logger.debug(`Session closed for ${session.pseudo}`);

        session.connection = undefined;
        session.graceTimer = setTimeout(
            () => {
                this.byToken.delete(session.token);
                this.byId.delete(session.playerId);
            }, GRACE_MS);
        }
    }

/**
 * Exports
 */
export default SessionManager;