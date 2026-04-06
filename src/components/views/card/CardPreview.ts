import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";
import { IProduct } from "../../../types";
import { Card } from "./Card";

export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'title' | 'price' | 'description' | 'id'> & { inBasket: boolean };

enum CardPreviewEvents {
    ADD = 'product:add',
    REMOVE = 'product:remove'
}

export class CardPreview extends Card<TCardPreview> {
    protected descriptionElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected imageElement: HTMLImageElement;
    protected _inBasket: boolean = false;

    constructor(
        protected events: IEvents,
        container: HTMLElement
    ) {
        super(container);
        
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        this.buttonElement.addEventListener('click', () => {
            if (this._inBasket) {
                this.events.emit(CardPreviewEvents.REMOVE);
            } else {
                this.events.emit(CardPreviewEvents.ADD);
            }
        });
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set image(value: string) {
        if (this.imageElement) {
            this.setImage(this.imageElement, value, this.titleElement.textContent || '');
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as keyof typeof categoryMap],
                key === value
            );
        }
    }

    set inBasket(value: boolean) {
        this._inBasket = value;
        if (!this.buttonElement.disabled){
            if (value) {
                this.buttonElement.textContent = 'Удалить из корзины';
            } else {
                this.buttonElement.textContent = 'Купить';
            }
        }
    }

    set price(value: number | null) {
        super.price = value;
        if (!value) {
            this.buttonElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
        } else {
            this.buttonElement.disabled = false;
        }
    }
}