import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { TPayment } from "../../../types";
import { Form } from "./Form";

export interface IOrderData {
    payment: TPayment;
    address: string;
}

enum OrderEvents {
    SUBMIT = 'order:submit'
}

export class Order extends Form<IOrderData> {
    protected addressInput: HTMLInputElement;
    protected paymentButtons: HTMLElement;
    private _selectedPayment: TPayment = null;

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
                this._selectedPayment = target.name as TPayment;
                this.updatePaymentButton();
                this.updateSubmitButton();
            }
        });

        this.addressInput.addEventListener('input', () => {
            this.updateSubmitButton();
        });
    }

    protected validate(): void {
        const errors: string[] = [];
        
        if (!this._selectedPayment) {
            errors.push('Выберите способ оплаты');
        }
        if (!this.addressInput.value.trim()) {
            errors.push('Укажите адрес доставки');
        }
        
        this.showErrors(errors);
    }

    protected isValid(): boolean {
        return this._selectedPayment !== null && this.addressInput.value.trim().length > 0;
    }

    protected submit(): void {
        this.events.emit(OrderEvents.SUBMIT, {
            payment: this._selectedPayment,
            address: this.addressInput.value.trim()
        });
    }

    set payment(value: TPayment) {
        this._selectedPayment = value;
    }

    private updatePaymentButton() {
        const buttons = this.paymentButtons.querySelectorAll('.button_alt');
        buttons.forEach((btn) => {
            const button = btn as HTMLButtonElement;
            if (button.name === this._selectedPayment) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }
}