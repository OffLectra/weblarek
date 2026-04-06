import { Component } from "../base/Component";

export interface IGalleryData {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set catalog(items: HTMLElement[]) {
        this.container.innerHTML = '';
        items.forEach((item) => this.container.appendChild(item));
    }
}