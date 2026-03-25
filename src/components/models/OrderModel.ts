import { IBuyer } from '../../types';


type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;


/**
 * Модель заказа
 */
export class OrderModel {
    private dataBayer: Partial<IBuyer> = {};

    /**
     * Сохранение данных покупателя
     */
    setData(dataBayer: Partial<IBuyer>): void {
        this.dataBayer = { ...this.dataBayer, ...dataBayer };
    }

    /**
     * Получить все данные
     */
    getData(): Partial<IBuyer> {
        return this.dataBayer;
    }

    /**
     * Очистить все данные заказа
     */
    clear(): void {
        this.dataBayer = {};
    }

    /**
     * Валидация данных заказа
     */
    validate(): TBuyerErrors {
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

    /**
     * Проверка валидности данных
     */
    isDataValid(): boolean {
        return Object.keys(this.validate()).length === 0;
    }

}