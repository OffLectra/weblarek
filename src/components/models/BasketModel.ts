
/**
 * Модель корзины
 * Управляет идентификаторами товаров, выбранных пользователем
 */
export class BasketModel {
    protected _items: string[] = [];

    /**
     * Получить массив id товаров в корзине
     */
    getItems(): string[] {
        return this._items;
    }

    /**
     * Добавить товар в корзину
     */
    addItem(id: string): void {
        if (!this._items.includes(id)) {
            this._items.push(id);
        }
    }

    /**
     * Удалить товар из корзины
     */
    removeItem(id: string): void {
        this._items = this._items.filter(itemId => itemId !== id);
    }

    /**
     * Очистить корзину полностью
     */
    clear(): void {
        this._items = [];
    }

    /**
     * Получить количество товаров в корзине
     */
    getCount(): number {
        return this._items.length;
    }

    /**
     * Проверить наличие товара в корзине по id
     */
    contains(id: string): boolean {
        return this._items.includes(id);
    }
}