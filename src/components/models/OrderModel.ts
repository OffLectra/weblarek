import { IBuyer } from '../../types';


type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;


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

    /**
     * Сохранение данных покупателя
     */
    setData(dataBayer: IBuyer): void {
        this.dataBayer = dataBayer;
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
    }

    /**
     * Валидация данных заказа
     */
    validateFields(): TBuyerErrors {
        const errors: TBuyerErrors = {
            payment: "",
            email: "",
            phone: "",
            address: "",
        };

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