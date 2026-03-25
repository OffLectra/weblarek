import { IProduct } from "../../types";

/**
 * Модель корзины
 */
export class BasketModel {
    private _items: IProduct[] = [];

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
    }

    /**
     * Удалить товар из корзины (по Id)
     */
    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
    }

    /**
     * Очистить корзину полностью
     */
    clear(): void {
        this._items = [];
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