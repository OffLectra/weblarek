import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export enum CatalogEvents {
    ITEMS_CHANGED = 'catalog:items-changed',
    SELECTED_PRODUCT_CHANGED = 'catalog:selected-product-changed'
}

/**
 * Модель каталога товаров
 */
export class CatalogModel {
    protected _items: IProduct[] = [];
    protected _selectedProduct: IProduct | null = null;

    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    /**
     * Сохранить массив товаров
     */
    setItems(items: IProduct[]): void {
        this._items = items;
        this.events.emit(CatalogEvents.ITEMS_CHANGED);
    }

    /**
     * Получить все товары
     */
    getItems(): IProduct[] {
        return this._items;
    }

    /**
     * Получить товар по id
     */
    getProductById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    /**
     * Сохранить выбранный товар
     */
    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
        this.events.emit(CatalogEvents.SELECTED_PRODUCT_CHANGED);
    }

    /**
     * Получить выбранный товар
     */
    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}