export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

/**
 * Тип категории товара
 */
export type TCategory = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';

/**
 * Товар в каталоге
 * Соответствует структуре данных, возвращаемой сервером
 */
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: TCategory;
  price: number | null;
}

/**
 * Тип оплаты
 */
export type TPayment = 'card' | 'cash';

/**
 * Данные покупателя для оформления заказа
 */
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

/**
 * Данные для отправки заказа на сервер
 */
export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

/**
 * Ответ сервера после успешного заказа
 */
export interface IOrderResult {
  id: string;
  total: number;
}

/**
 * Ответ сервера с каталогом товаров
 */
export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

/**
 * Данные для проверки валидации покупателя (ошибка может отсутствовать для поля)
 */
export interface IBuyerValidation {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}