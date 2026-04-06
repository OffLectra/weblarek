import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IBasketData {
    itemsList: HTMLElement[];
    total: number;
}

export enum BasketEvents {
    SUBMIT = 'basket:submit'
}

export class Basket extends Component<IBasketData> {
    protected list: HTMLElement;
    protected button: HTMLButtonElement;
    protected price: HTMLElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement
    ) {
        super(container);
        
        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.price = ensureElement<HTMLElement>('.basket__price', this.container);

        this.button.disabled = true;

        this.button.addEventListener('click', () => {
            this.events.emit(BasketEvents.SUBMIT);
        });
    }

    set itemsList(items: HTMLElement[]) {
        this.list.textContent = '';
        if (items.length === 0) {
        } else {
            items.forEach((item) => this.list.appendChild(item));
        }
        
        this.button.disabled = items.length === 0;
    }

    set total(value: number) {
        this.price.textContent = `${value} синапсов`;
    }

    set disabled(value: boolean) {
        this.button.disabled = value;
    }
}