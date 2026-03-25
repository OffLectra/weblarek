import { IProduct } from '../../types';

/**
 * Модель каталога товаров
 */
export class CatalogModel {
    protected _items: IProduct[] = [];
    protected _selectedProduct: IProduct | null = null;

    /**
     * Сохранить массив товаров
     */
    setItems(items: IProduct[]): void {
        this._items = items;
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
    }

    /**
     * Получить выбранный товар
     */
    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}