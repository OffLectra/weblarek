import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card } from "./Card";

export type TCardBasket = Pick<IProduct, 'image' | 'category' | 'title' | 'price' | 'description' | 'id'>;

enum CardBasketEvents {
    REMOVE = 'product:remove'
}

export class CardBasket extends Card<TCardBasket> {
    protected counterElement: HTMLElement;
    protected basketButtonDelete: HTMLButtonElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement
    ) {
        super(container);
        
        this.counterElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.basketButtonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.basketButtonDelete.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                this.events.emit(CardBasketEvents.REMOVE, { id: id });
            }
        });
    }

    set index(value: number) {
        this.counterElement.textContent = String(value);
    }
}