import { ServToCli, type ServerMsg } from "@cardgame/shared/src/protocol";
import type Session from "./Session";

/** Paramètres des salons */
interface Params {
    /** Joueur créant le salon */
    player: Session;
}

/**
 * Class de gestion d'un salon
 */
class Room {
    /** Propriétaire du salon */
    owner: Session;
    /** Liste des joueurs dans le salon */
    players: Session[];

    constructor(param : Params)
    {
        this.players = [param.player];
        this.owner = param.player;
    }

    /** Méthode d'ajout d'un joueur dans le salon */
    add(player: Session)
    {
        if(this.players.includes(player))
            return false;
        this.players.push(player);
        return true;
    }

    /** Méthode de suppression d'un joueur dans le salon */
    remove(player: Session)
    {
        if(!this.players.includes(player))
            return false;
        player.connection?.send({type: ServToCli.Disconnected});
        this.players = this.players.filter(p => p.playerId !== player.playerId);
        return true;
    }

    /**
     * Broadcast à tout les joueurs un message
     * @param message du server
     */
    broadcast(message: ServerMsg)
    {
        for (const p of this.players)
        {
            p.connection?.send(message);
        }
    }
}

export default Room;