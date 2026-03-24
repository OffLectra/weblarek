import { TPayment, IBuyerValidation } from '../../types';

/**
 * Модель заказа
 * Управляет данными покупателя и их валидацией
 */
export class OrderModel {
    protected _payment: TPayment | null = null;
    protected _address: string = '';
    protected _email: string = '';
    protected _phone: string = '';

    get payment(): TPayment | null {
        return this._payment;
    }

    get address(): string {
        return this._address;
    }

    get email(): string {
        return this._email;
    }

    get phone(): string {
        return this._phone;
    }

    setPayment(payment: TPayment): void {
        this._payment = payment;
    }

    setAddress(address: string): void {
        this._address = address;
    }

    setEmail(email: string): void {
        this._email = email;
    }

    setPhone(phone: string): void {
        this._phone = phone;
    }

    /**
     * Очистить все данные заказа
     */
    clear(): void {
        this._payment = null;
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    /**
     * Валидация данных заказа
     */
    validate(): IBuyerValidation {
        const errors: IBuyerValidation = {};

        if (!this._payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this._address || this._address.trim() === '') {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this._email || this._email.trim() === '') {
            errors.email = 'Укажите email';
        }
        if (!this._phone || this._phone.trim() === '') {
            errors.phone = 'Укажите номер телефона';
        }

        return errors;
    }

    /**
     * Проверить валидность данных для первого шага (оплата, адрес)
     */
    validateStepOne(): boolean {
        const errors = this.validate();
        return !errors.payment && !errors.address;
    }

    /**
     * Проверить валидность данных для второго шага (email, телефон)
     */
    validateStepTwo(): boolean {
        const errors = this.validate();
        return !errors.email && !errors.phone;
    }
}