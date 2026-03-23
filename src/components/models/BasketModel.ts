import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Модель корзины
 * Управляет идентификаторами товаров, выбранных пользователем
 * 
 * @remarks
 * Хранит только id товаров, чтобы избежать дублирования данных
 * Полная информация о товарах получается из каталога по запросу
 */
export class BasketModel {
    protected _items: string[] = [];

    constructor(protected events: EventEmitter) {}

    /**
     * Получить все id товаров в корзине
     * @returns Копия массива для предотвращения мутаций извне
     */
    getItems(): string[] {
        // Возвращаем копию, чтобы внешний код не мог напрямую изменить корзину
        return [...this._items];
    }

    /**
     * Добавить товар в корзину
     * @param id - идентификатор товара
     * @returns true - если товар добавлен, false - если уже был в корзине
     */
    addItem(id: string): boolean {
        if (!id) {
            console.warn('BasketModel: попытка добавить пустой id');
            return false;
        }

        if (this._items.includes(id)) {
            // Товар уже в корзине, ничего не делаем
            return false;
        }

        this._items.push(id);
        this.events.emit('basket:changed', { 
            items: this._items,
            action: 'add',
            id 
        });
        return true;
    }

    /**
     * Удалить товар из корзины
     * @param id - идентификатор товара
     * @returns true - если товар удален, false - если его не было
     */
    removeItem(id: string): boolean {
        if (!id) return false;

        const initialLength = this._items.length;
        this._items = this._items.filter(itemId => itemId !== id);
        
        const removed = initialLength !== this._items.length;
        
        if (removed) {
            this.events.emit('basket:changed', { 
                items: this._items,
                action: 'remove',
                id 
            });
        }
        
        return removed;
    }

    /**
     * Очистить корзину полностью
     */
    clear(): void {
        if (this._items.length === 0) return; // Ничего не меняем, если уже пусто
        
        this._items = [];
        this.events.emit('basket:changed', { 
            items: this._items,
            action: 'clear'
        });
    }

    /**
     * Получить количество товаров в корзине
     */
    getCount(): number {
        return this._items.length;
    }

    /**
     * Проверить наличие товара в корзине
     * @param id - идентификатор товара
     */
    contains(id: string): boolean {
        if (!id) return false;
        return this._items.includes(id);
    }

    /**
     * Проверить, пуста ли корзина
     */
    isEmpty(): boolean {
        return this._items.length === 0;
    }

    /**
     * Получить общую стоимость товаров в корзине
     * @param products - массив всех товаров из каталога
     * @returns общая сумма (товары с ценой null игнорируются)
     */
    getTotalPrice(products: IProduct[]): number {
        if (!Array.isArray(products) || products.length === 0) {
            return 0;
        }

        // Создаем Map для быстрого поиска товаров по id
        const productsMap = new Map(products.map(p => [p.id, p]));
        
        let total = 0;
        
        for (const id of this._items) {
            const product = productsMap.get(id);
            
            if (!product) {
                console.warn(`BasketModel: товар с id "${id}" не найден в каталоге`);
                continue;
            }
            
            if (product.price === null || product.price === undefined) {
                console.warn(`BasketModel: товар "${product.title}" имеет цену null, пропускаем`);
                continue;
            }
            
            total += product.price;
        }
        
        return total;
    }

    /**
     * Получить массив товаров в корзине с полной информацией
     * @param products - массив всех товаров из каталога
     * @returns массив товаров, которые сейчас в корзине
     */
    getItemsWithDetails(products: IProduct[]): IProduct[] {
        if (!Array.isArray(products)) return [];
        
        const productsMap = new Map(products.map(p => [p.id, p]));
        
        return this._items
            .map(id => productsMap.get(id))
            .filter((product): product is IProduct => 
                product !== undefined && product.price !== null
            );
    }
}