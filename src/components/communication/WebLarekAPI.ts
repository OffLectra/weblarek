import { Api } from '../base/Api';
import { IOrder, IOrderResult, IProductsResponse } from '../../types';

/**
 * Класс для работы с API web larek
 */
export class WebLarekAPI extends Api {
    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    /**
     * Получить список всех товаров с сервера
     * @returns Promise с объектом, содержащим массив товаров и общее количество
     */
    getProducts(): Promise<IProductsResponse> {
        return this.get('/product').then((data: unknown) => data as IProductsResponse);
    }

    /**
     * Отправить заказ на сервер
     * @param order - данные заказа (товары, оплата, адрес, контакты)
     * @returns Promise с результатом заказа (id и total)
     */
    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then((data: unknown) => data as IOrderResult);
    }
}