import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";
import { IProduct } from "../../../types";
import { Card } from "./Card";

export type TCardCatalog = Pick<IProduct, 'image' | 'category' | 'title' | 'price' | 'description' | 'id'>;

export interface ICardActions {
    onClick?: () => void;
}

export class CardCatalog extends Card<TCardCatalog> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(
        container: HTMLElement,
        actions?: ICardActions
    ) {
        super(container);
        
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
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
}