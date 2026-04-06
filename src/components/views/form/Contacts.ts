import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";

export interface IContactsData {
    email: string;
    phone: string;
}

export enum ContactsEvents {
    SUBMIT = 'contacts:submit',
    FIELD_CHANGED = 'contacts:field-changed'
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
            this.events.emit(ContactsEvents.FIELD_CHANGED, {
                field: 'email',
                value: this.emailInput.value.trim()
            });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit(ContactsEvents.FIELD_CHANGED, {
                field: 'phone',
                value: this.phoneInput.value.trim()
            });
        });
    }

    protected submit(): void {
        this.events.emit(ContactsEvents.SUBMIT);
    }

    reset(): void {
        this.emailInput.value = '';
        this.phoneInput.value = '';
        this.submitButton.disabled = true;
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    set errors(value: string) {
        this.showErrors(value ? [value] : []);
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
}