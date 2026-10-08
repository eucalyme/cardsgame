class LoginPage extends Page {

    constructor() {
        super(document.getElementById('login'));
    }

    protected onEnter() {
        // bind le listener sur e bouton de creation
        // bind le listener sur ke bouton de joindre
    }

    protected onLeave() {
        // retirer les listener
    }

    private onMessage(message: ServerMsg) {
        // Estce que la page dacceuil peut recevoir des message ?
        // oui : erreur de jojn room
        // rooting des retours serveur ici
        // TODO
    }
}

export default LoginPage;