

abstract class Page {
    isActive : boolean = true;    
    readonly el: HtmlElement;

    constructor(el: HtmlElement) {
        this.el = el;
    }

    protected abstract onEnter() {}
    protected abstract onLeave() {}
    
    activate() {
        this.isActive = true;
        this.el.hidden = false;
        this.onEnter();
    }

    desactivate() {
        this.isActive = false;
        this.el.hidden = true;
        this.onLeave();
    }

    guard<A extends unknown[]>(fn: (...a : A) => void) {
        return (...args : A) => { if(this.isActive) fn(...args) }
    }
}

export default Page;