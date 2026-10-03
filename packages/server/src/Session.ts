import type Connection from "./Connection";
import Logger from "./Logger";

/**
 * Paramètre pour la création d'une session
 */
interface Params
{
    /** ID de session joueur */
    playerId: string,
    /** Token d'indentifiant du joueur */
    token: string,
    /** Pseudo du joueur */
    pseudo: string,
}

/**
 * Class d'une session, c'est le contact du serveur avec le client
 */
class Session
{
    /**
     * Code de la room si la session est connecté
     * -> Permet la reconnection
     */
    roomCode?: string;
    /** Timer avant le TO */
    graceTimer?: NodeJS.Timeout;
    /** Connection de la session */
    connection?: Connection;

    /** Id du joueur */
    readonly playerId: string;
    /** Token id du joueur */
    readonly token: string;
    /** Pseudo du joueur */
    pseudo: string;

    constructor( param: Params )
    {
        this.playerId = param.playerId;
        this.token = param.token;
        this.pseudo = param.pseudo;

        Logger.debug(`token created for player ${param.pseudo}`);
    }
}

/**
 * Exports
 */
export default Session;