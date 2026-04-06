import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface ISuccessData {
    total: number;
}

enum SuccessEvents {
    CLOSE = 'success:close'
}

export class Success extends Component<ISuccessData> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement
    ) {
        super(container);
        
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit(SuccessEvents.CLOSE);
        });
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}