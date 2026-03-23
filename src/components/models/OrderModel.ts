import { IBuyer, TPayment, IBuyerValidation } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Модель заказа
 * Управляет данными покупателя и их валидацией
 */
export class OrderModel implements IBuyer {
    protected _payment: TPayment = 'card';
    protected _address: string = '';
    protected _email: string = '';
    protected _phone: string = '';

    constructor(protected events: EventEmitter) {}

    get payment(): TPayment {
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

    /**
     * Выбрать способ оплаты
     */
    setPayment(payment: TPayment): void {
        if (!payment) {
            console.warn('OrderModel: способ оплаты не указан');
            return;
        }
        
        if (this._payment === payment) return;
        
        this._payment = payment;
        this.events.emit('order:changed', { 
            order: this.getOrderData(),
            field: 'payment'
        });
    }

    /**
     * Указать адрес доставки
     */
    setAddress(address: string): void {
        const trimmedAddress = address?.trim() ?? '';
        
        if (this._address === trimmedAddress) return;
        
        this._address = trimmedAddress;
        this.events.emit('order:changed', { 
            order: this.getOrderData(),
            field: 'address'
        });
    }

    /**
     * Указать email
     */
    setEmail(email: string): void {
        const trimmedEmail = email?.trim() ?? '';
        
        if (this._email === trimmedEmail) return;
        
        this._email = trimmedEmail;
        this.events.emit('order:changed', { 
            order: this.getOrderData(),
            field: 'email'
        });
    }

    /**
     * Указать телефон
     */
    setPhone(phone: string): void {
        const trimmedPhone = phone?.trim() ?? '';
        
        if (this._phone === trimmedPhone) return;
        
        this._phone = trimmedPhone;
        this.events.emit('order:changed', { 
            order: this.getOrderData(),
            field: 'phone'
        });
    }

    /**
     * Сохранить все данные заказа (частичное обновление)
     */
    setOrderData(data: Partial<IBuyer>): void {
        if (!data) return;
        
        let changed = false;
        
        if (data.payment !== undefined && data.payment !== this._payment) {
            this._payment = data.payment;
            changed = true;
        }
        
        if (data.address !== undefined) {
            const address = data.address.trim();
            if (this._address !== address) {
                this._address = address;
                changed = true;
            }
        }
        
        if (data.email !== undefined) {
            const email = data.email.trim();
            if (this._email !== email) {
                this._email = email;
                changed = true;
            }
        }
        
        if (data.phone !== undefined) {
            const phone = data.phone.trim();
            if (this._phone !== phone) {
                this._phone = phone;
                changed = true;
            }
        }
        
        if (changed) {
            this.events.emit('order:changed', { 
                order: this.getOrderData(),
                field: 'batch'
            });
        }
    }

    /**
     * Получить все данные заказа
     */
    getOrderData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone
        };
    }

    /**
     * Все поля заполнены?
     */
    isComplete(): boolean {
        return !!(
            this._payment &&
            this._address &&
            this._email &&
            this._phone
        );
    }

    /**
     * Очистить все данные заказа
     */
    clear(): void {
        const wasEmpty = this.isEmpty();
        
        this._payment = 'card';
        this._address = '';
        this._email = '';
        this._phone = '';
        
        if (!wasEmpty) {
            this.events.emit('order:changed', { 
                order: this.getOrderData(),
                field: 'clear'
            });
        }
    }

    /**
     * Проверить, пуст ли заказ (способ оплаты по умолчанию не считается)
     */
    isEmpty(): boolean {
        return !(this._address || this._email || this._phone);
    }

    /**
     * Валидация данных заказа
     * Возвращает объект с ошибками для каждого поля
     * Поля без ошибок отсутствуют в объекте
     */
    validate(): IBuyerValidation {
        const errors: IBuyerValidation = {};

        // Способ оплаты
        if (!this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        // Адрес
        if (!this._address?.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        // Email, проверка на наличие @
        if (!this._email?.trim()) {
            errors.email = 'Укажите email';
        } else if (!this._email.includes('@')) {
            errors.email = 'Введите корректный email';
        }

        // Телефон, минимум 10 цифр
        if (!this._phone?.trim()) {
            errors.phone = 'Укажите номер телефона';
        } else {
            const digits = this._phone.replace(/\D/g, '');
            if (digits.length < 10) {
                errors.phone = 'Введите номер телефона (минимум 10 цифр)';
            }
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