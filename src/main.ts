import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';
import { apiProducts } from './utils/data';
import { IProduct } from './types';


const events = new EventEmitter();
const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const order = new OrderModel(events);

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

// Test total price with catalog data
catalog.setItems(apiProducts.items as IProduct[]);
basket.clear();
basket.addItem(apiProducts.items[0].id); // price 750
basket.addItem(apiProducts.items[1].id); // price 1450
basket.addItem(apiProducts.items[2].id); // price null -> 0
const total = basket.getTotalPrice(catalog.getItems());
console.log('getTotalPrice (750+1450+0):', total === 2200 ? 'OK' : `FAIL (got ${total})`);

basket.removeItem(apiProducts.items[0].id);
console.log('removeItem:', basket.getItems().length === 2 ? 'OK' : 'FAIL');

basket.clear();
console.log('clear:', basket.getItems().length === 0 ? 'OK' : 'FAIL');

// ---OrderModel---
console.log('\n--- OrderModel ---');

console.log('Initial state:', order.getOrderData());

order.setAddress('Test Address');
order.setPayment('cash');
order.setEmail('test@example.com');
order.setPhone('+7 999 888-77-66');

const filled = order.getOrderData();
console.log('setAddress/setPayment/setEmail/setPhone:',
  filled.address === 'Test Address' &&
  filled.payment === 'cash' &&
  filled.email === 'test@example.com' &&
  filled.phone === '+7 999 888-77-66' ? 'OK' : 'FAIL'
);

const validation = order.validate();
console.log('validate (all fields filled):', Object.keys(validation).length === 0 ? 'OK' : 'FAIL');

console.log('validateStepOne:', order.validateStepOne() === true ? 'OK' : 'FAIL');
console.log('validateStepTwo:', order.validateStepTwo() === true ? 'OK' : 'FAIL');

order.clear();
console.log('clear:', order.getOrderData().address === '' ? 'OK' : 'FAIL');

order.setOrderData({ address: 'New Address', email: 'new@test.com' });
const partial = order.getOrderData();
console.log('setOrderData (partial update):',
  partial.address === 'New Address' &&
  partial.email === 'new@test.com' &&
  partial.payment === 'card' &&
  partial.phone === '' ? 'OK' : 'FAIL'
);

// ---SUMMARY---
console.log('\n---SUMMARY---');
console.log('All tests completed.');