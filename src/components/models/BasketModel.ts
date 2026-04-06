import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export enum BasketEvents {
    CHANGED = 'basket:changed'
}

/**
 * Модель корзины
 */
export class BasketModel {
    private _items: IProduct[] = [];

    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }
    /**
     * Получить массив товаров в корзине
     */
    getItems(): IProduct[] {
        return this._items;
    }

    /**
     * Добавить товар в корзину
     */
    addItem(item: IProduct): void {
        this._items.push(item);
        this.events.emit(BasketEvents.CHANGED);
    }

    /**
     * Удалить товар из корзины (по Id)
     */
    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit(BasketEvents.CHANGED);
    }

    /**
     * Очистить корзину полностью
     */
    clear(): void {
        this._items = [];
        this.events.emit(BasketEvents.CHANGED);
    }

    /**
     * Получить общую стоимость товаров в корзине
     */
    getTotal(): number {
        return this._items.reduce((total, item) => total + (item.price || 0), 0);
    }

    /**
     * Получить количество товаров в корзине
     */
    getCount(): number {
        return this._items.length;
    }

    /**
     * Проверить наличие товара в корзине (по Id)
     */
    containsItem(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}