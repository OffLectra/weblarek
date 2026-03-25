import { IApi, IProduct, IOrder } from '../../types';

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
        try {
            const response = await this.api.get<{ items: IProduct[] }>('/product');
            return response.items;
        } catch (error) {
            console.error('Ошибка при попытке получения списка товаров:', error);
            throw error;
        }
    }

    /**
     * Отправить заказ на сервер
     */
    async postOrder(order: IOrder): Promise<IOrder> {
        try {
            return await this.api.post<IOrder>('/order', order);
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            throw error;
        }
    }
}
