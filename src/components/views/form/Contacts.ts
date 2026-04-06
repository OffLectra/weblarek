import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";

export interface IContactsData {
    email: string;
    phone: string;
}

enum ContactsEvents {
    SUBMIT = 'contacts:submit'
}

export class Contacts extends Form<IContactsData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement
    ) {
        super(events, container);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            this.validate();
            this.updateSubmitButton();
        });

        this.phoneInput.addEventListener('input', () => {
            this.validate();
            this.updateSubmitButton();
        });
    }

    protected validate(): void {
        const errors: string[] = [];
        
        if (!this.emailInput.value.trim()) {
            errors.push('Укажите email');
        }
        if (!this.phoneInput.value.trim()) {
            errors.push('Укажите номер телефона');
        }
        
        this.showErrors(errors);
    }

    protected isValid(): boolean {
        return this.emailInput.value.trim().length > 0 && this.phoneInput.value.trim().length > 0;
    }

    protected submit(): void {
        this.events.emit(ContactsEvents.SUBMIT, {
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim()
        });
    }
}