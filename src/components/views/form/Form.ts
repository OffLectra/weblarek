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
        this.submit();
    }

    protected abstract submit(): void;
    abstract reset(): void;

    protected showErrors(errors: string[]) {
        this.errorsElement.textContent = errors.join(', ');
    }
}