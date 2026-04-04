import { IApi, IProduct, IOrder, IOrderResponse } from '../../types';

/**
 * Класс для работы с API web larek
 */
export class WebLarekAPI {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    /**
     * Получить список всех товаров с сервера
     */
    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<{ items: IProduct[] }>('/product');
        return response.items;
    }

    /**
     * Отправить заказ на сервер
     */
    async postOrder(order: IOrder): Promise<IOrderResponse> {
        const rawResult = await this.api.post<IOrderResponse>('/order', order);
        return rawResult;
    }
}
