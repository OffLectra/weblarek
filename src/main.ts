import './scss/styles.scss';

import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';
import { WebLarekAPI } from './components/communication/WebLarekAPI';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { IProduct } from './types';


const catalog = new CatalogModel();
const basket = new BasketModel();
const order = new OrderModel();
const api = new WebLarekAPI(API_URL);


// ---CatalogModel---
console.log('---CatalogModel---');

catalog.setItems(apiProducts.items as IProduct[]);
console.log('setItems + getItems:', catalog.getItems().length === 4 ? 'OK' : 'FAIL');

const found = catalog.getProductById(apiProducts.items[0].id);
console.log('getProductById:', found ? found.title : 'NOT FOUND');

catalog.setSelectedProduct(apiProducts.items[0] as IProduct);
console.log('setSelectedProduct + getSelectedProduct:', catalog.getSelectedProduct()?.title === apiProducts.items[0].title ? 'OK' : 'FAIL');

// ---BasketModel---
console.log('\n---BasketModel---');

basket.addItem('id-1');
basket.addItem('id-2');
basket.addItem('id-1');
console.log('addItem (no duplicates):', basket.getItems().length === 2 ? 'OK' : 'FAIL');

console.log('getCount:', basket.getCount() === 2 ? 'OK' : 'FAIL');

console.log('contains (existing):', basket.contains('id-1') === true ? 'OK' : 'FAIL');
console.log('contains (non-existing):', basket.contains('id-3') === false ? 'OK' : 'FAIL');

basket.removeItem('id-1');
console.log('removeItem:', basket.getItems().length === 1 ? 'OK' : 'FAIL');

basket.clear();
console.log('clear:', basket.getItems().length === 0 ? 'OK' : 'FAIL');

// ---OrderModel---
console.log('\n--- OrderModel ---');

console.log('Initial state:', {
    payment: order.payment,
    address: order.address,
    email: order.email,
    phone: order.phone
});

const emptyValidation = order.validate();
console.log('validate (empty data):', 
    emptyValidation.payment && 
    emptyValidation.address && 
    emptyValidation.email && 
    emptyValidation.phone ? 'OK' : 'FAIL'
);
console.log('validateStepOne (empty):', order.validateStepOne() === false ? 'OK' : 'FAIL');
console.log('validateStepTwo (empty):', order.validateStepTwo() === false ? 'OK' : 'FAIL');

order.setAddress('Test Address');
order.setPayment('cash');
order.setEmail('test@example.com');
order.setPhone('+7 999 888-77-66');

const filled = {
    payment: order.payment,
    address: order.address,
    email: order.email,
    phone: order.phone
};
console.log('\nAfter filling:');
console.log('setAddress/setPayment/setEmail/setPhone:',
    filled.address === 'Test Address' &&
    filled.payment === 'cash' &&
    filled.email === 'test@example.com' &&
    filled.phone === '+7 999 888-77-66' ? 'OK' : 'FAIL'
);

const filledValidation = order.validate();
console.log('validate (filled data):', Object.keys(filledValidation).length === 0 ? 'OK' : 'FAIL');
console.log('validateStepOne (filled):', order.validateStepOne() === true ? 'OK' : 'FAIL');
console.log('validateStepTwo (filled):', order.validateStepTwo() === true ? 'OK' : 'FAIL');

order.clear();
console.log('\nAfter clear:');
console.log('clear:', order.address === '' ? 'OK' : 'FAIL');

const clearedValidation = order.validate();
console.log('validate (after clear):', 
    clearedValidation.payment && 
    clearedValidation.address && 
    clearedValidation.email && 
    clearedValidation.phone ? 'OK' : 'FAIL'
);
console.log('validateStepOne (after clear):', order.validateStepOne() === false ? 'OK' : 'FAIL');
console.log('validateStepTwo (after clear):', order.validateStepTwo() === false ? 'OK' : 'FAIL');

// ---SUMMARY---
console.log('\n---SUMMARY---');
console.log('All tests completed.');

// ---API Request---
console.log('\n---API Request---');

api.getProducts()
    .then(data => {
        catalog.setItems(data.items);
        console.log('getProducts:', catalog.getItems().length === data.total ? 'OK' : 'FAIL');
    })
    .catch(error => {
        console.error('getProducts:', error);
    });