import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card } from "./Card";

export type TCardBasket = Pick<IProduct, 'image' | 'category' | 'title' | 'price' | 'description' | 'id'>;

export interface ICardBasketActions {
    onDelete?: () => void;
}

export class CardBasket extends Card<TCardBasket> {
    protected counterElement: HTMLElement;
    protected basketButtonDelete: HTMLButtonElement;
    protected _onDelete: (() => void) | undefined;

    constructor(
        container: HTMLElement,
        actions?: ICardBasketActions
    ) {
        super(container);
        
        this.counterElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.basketButtonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this._onDelete = actions?.onDelete;

        this.basketButtonDelete.addEventListener('click', () => {
            this._onDelete?.();
        });
    }

    set index(value: number) {
        this.counterElement.textContent = String(value);
    }
}