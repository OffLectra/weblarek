import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * ћодель каталога товаров
 * ”правл€ет списком товаров и отслеживает выбранный продукт
 */
export class CatalogModel {
    protected _items: IProduct[] = [];
    protected _selectedProduct: IProduct | null = null;

    constructor(protected events: EventEmitter) {}

    /**
     * ѕолна€ замена каталога
     * @param items - новый массив товаров
     */
    setItems(items: IProduct[]): void {
        if (!Array.isArray(items)) {
            console.warn('CatalogModel: попытка установить не массив в каталог');
            return;
        }
        
        // —оздаем копию, чтобы избежать мутаций извне
        this._items = [...items];
        this.events.emit('catalog:changed', { items: this._items });
    }

    /**
     * ѕолучить все товары (только дл€ чтени€)
     */
    getItems(): IProduct[] {
        // ¬озвращаем копию, чтобы предотвратить пр€мую мутацию
        return [...this._items];
    }

    /**
     * ѕоиск товара по id
     */
    getProductById(id: string): IProduct | undefined {
        if (!id) return undefined;
        return this._items.find(item => item.id === id);
    }

    /**
     * ”становить текущий выбранный товар
     * @param product - выбранный товар (если null - сброс выбора)
     */
    setSelectedProduct(product: IProduct | null): void {
        // Ќе эмитим событие, если выбор не изменилс€
        if (this._selectedProduct?.id === product?.id) return;
        
        this._selectedProduct = product;
        
        // Ёмитим только если есть что эмитить
        if (product) {
            this.events.emit('product:selected', { product });
        } else {
            this.events.emit('product:cleared');
        }
    }

    /**
     * ѕолучить текущий выбранный товар
     */
    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }

    /**
     * ѕроверить, выбран ли какой-либо товар
     */
    hasSelectedProduct(): boolean {
        return this._selectedProduct !== null;
    }

    /**
     * —бросить выбранный товар
     */
    clearSelectedProduct(): void {
        this.setSelectedProduct(null);
    }

    /**
     * ќчистить весь каталог
     */
    clear(): void {
        this._items = [];
        this._selectedProduct = null;
        this.events.emit('catalog:cleared');
    }
}