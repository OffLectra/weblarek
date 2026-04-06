import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { TPayment } from "../../../types";
import { Form } from "./Form";

export interface IOrderData {
    payment: TPayment;
    address: string;
}

export enum ViewOrderEvents {
    SUBMIT = 'order:submit',
    FIELD_CHANGED = 'order:field-changed'
}

export class Order extends Form<IOrderData> {
    protected addressInput: HTMLInputElement;
    protected paymentButtons: HTMLElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement
    ) {
        super(events, container);
        
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.paymentButtons = ensureElement<HTMLElement>('.order__buttons', this.container);

        this.paymentButtons.addEventListener('click', (event) => {
            const target = event.target as HTMLButtonElement;
            if (target.name === 'card' || target.name === 'cash') {
                this.events.emit(ViewOrderEvents.FIELD_CHANGED, {
                    field: 'payment',
                    value: target.name as TPayment
                });
            }
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit(ViewOrderEvents.FIELD_CHANGED, {
                field: 'address',
                value: this.addressInput.value.trim()
            });
        });
    }

    protected submit(): void {
        this.events.emit(ViewOrderEvents.SUBMIT);
    }

    reset(): void {
        this.addressInput.value = '';
        this.selectedPayment = null;
        this.submitButton.disabled = true;
    }

    set selectedPayment(value: TPayment) {
        if (value === null) {
            const buttons = this.paymentButtons.querySelectorAll('.button_alt');
            buttons.forEach((btn) => {
                const button = btn as HTMLButtonElement;
                button.classList.remove('button_alt-active');
            });
            return;
        }
        const buttons = this.paymentButtons.querySelectorAll('.button_alt');
        buttons.forEach((btn) => {
            const button = btn as HTMLButtonElement;
            if (button.name === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    set errors(value: string) {
        this.showErrors(value ? [value] : []);
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
}