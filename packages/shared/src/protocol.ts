/** 
 * Liste des types de message que le client peut envoyer au serveur
 */
const CliToServ = {
    /** Création de la session du client coté serveur */
    Hello: 'hello',
    /** Requete de création d'une room */
    CreateRoom: 'createRoom',
    /** Requete pour rejoindre une room */
    JoinRoom: 'joinRoom',
} as const;

/** 
 * Liste des types de message que le serveur peut envoyer au client
 */
const ServToCli = {
    /** Retour à un client de son acceptation dans le serveur */
    Welcome: 'welcome',
    /** Retour serveur à un client en cas d'erreur */
    Error: 'error',
} as const;

/** Contenu & format du message d'un client */
type ClientMsg =
    | { type: typeof CliToServ.Hello; pseudo: string; token?: string }

/** Contenu & format du message du server */
type ServerMsg =
    | { type: typeof ServToCli.Welcome; playerId: string; token: string }
    | { type: typeof ServToCli.Error; message: string }

/**
 * Exports
 */
export { CliToServ, ServToCli };
export type { ClientMsg, ServerMsg };

