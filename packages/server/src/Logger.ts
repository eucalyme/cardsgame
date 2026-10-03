/**
 * Tout les levels de logs
 */
enum Level
{
    /** Tout les logs */
    ALL,
    /** Toutes les informations */
    INFO,
    /** Tout les infos de devs */
    DEBUG,
    /** Uniquement les avertissements et erreurs */
    WARNING,
    /** Uniquement les erreurs */
    ERROR,
    /** Aucun log */
    NONE,
}

/**
 * Class logger
 */
export default class Logger
{
    /** Niveau courant pour afficher les logs */
    static level: Level = Level.INFO; 

    /** Change le niveau de logs */
    static setLevel(level: Level) : undefined
    {
        Logger.level = level;
    }

    /** Affichage des messages */
    static print(level: Level, caller: string | undefined, message: string) : undefined
    {
        console.log(`[${level}] ${caller}: ${message}`)
    }

    /** Lance un message à partir d'un niveau */
    static log(level: Level, caller: string | undefined, message: string) : undefined
    {
        if(level < Logger.level)
            return;
        this.print(level, caller, message);
    }

    /** Log un message de niveau Informatif */
    static info(message: string) : undefined
    {
        let caller = new Error().stack?.split('\n')[3]?.trim();
        Logger.log(Level.INFO, caller, message);
    }

    /** Log un message de niveau Debug */
    static debug(message: string) : undefined
    {
        let caller = new Error().stack?.split('\n')[3]?.trim();
        Logger.log(Level.DEBUG, caller, message);
    }

    /** Log un message de niveau Avertissement */
    static warn(message: string) : undefined
    {
        let caller = new Error().stack?.split('\n')[3]?.trim();
        Logger.log(Level.WARNING, caller, message);
    }

    /** Log un message de niveau Erreur */
    static error(message: string) : undefined
    {
        let caller = new Error().stack?.split('\n')[3]?.trim();
        Logger.log(Level.ERROR, caller, message);
    }
}