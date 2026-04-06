export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}


/**
 * Интерфейс товара
 */
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

/**
 * Тип оплаты
 */
export type TPayment = 'card' | 'cash' | null ;

/**
 * Интерфейс покупателя
 */
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

/**
 * Интерфейс заказа
 * Для отправки на сервер
 */
export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

/**
 * Интерфейс ответа от сервера при успешном создании заказа
 */
export interface IOrderResponse {
    id: string;
    total: number;
}
