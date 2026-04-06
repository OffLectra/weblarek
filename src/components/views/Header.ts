import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export enum HeaderEvents {
    BASKET_OPEN = 'basket:open'
}

interface IHeaderData {
    counter: number;
}

export class Header extends Component<IHeaderData> {
    protected counterElement: HTMLElement;
    protected basketButton: HTMLElement;
    
    public constructor(
        protected events: IEvents,
        container: HTMLElement,
    ) {
        super(container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButton = ensureElement<HTMLElement>('.header__basket', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit(HeaderEvents.BASKET_OPEN);
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}
