import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('submit', this.handleSubmit.bind(this));
    }

    protected handleSubmit(event: Event) {
        event?.preventDefault();
        this.validate();
        if (this.isValid()) {
            this.submit();
        }
    }

    protected abstract validate(): void;
    protected abstract isValid(): boolean;
    protected abstract submit(): void;

    protected updateSubmitButton() {
        this.validate();
        this.submitButton.disabled = !this.isValid();
    }

    protected showErrors(errors: string[]) {
        this.errorsElement.textContent = errors.join(', ');
    }
}