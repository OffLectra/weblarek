import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';


export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;


export enum OrderEvents {
    DATA_CHANGED = 'order:data-changed',
    CLEARED = 'order:cleared'
}


/**
 * Модель заказа
 */
export class OrderModel {
    private dataBayer: IBuyer = {
        payment: null,
        email: "",
        phone: "",
        address: "",
    };

    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }
    /**
     * Сохранение данных покупателя
     */
    setData(dataBayer: Partial<IBuyer>): void {
        this.dataBayer = { ...this.dataBayer, ...dataBayer };
        this.events.emit(OrderEvents.DATA_CHANGED);
    }

    /**
     * Получить все данные
     */
    getData(): IBuyer {
        return this.dataBayer;
    }

    /**
     * Очистить все данные заказа
     */
    clear(): void {
        this.dataBayer = {
            payment: null,
            email: "",
            phone: "",
            address: "",
        };
        this.events.emit(OrderEvents.CLEARED);
    }

    /**
     * Валидация данных заказа
     */
    validateFields(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this.dataBayer.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.dataBayer.address) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.dataBayer.email) {
            errors.email = 'Укажите email';
        }
        if (!this.dataBayer.phone) {
            errors.phone = 'Укажите номер телефона';
        }

        return errors;
    }
}