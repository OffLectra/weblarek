import './scss/styles.scss';

import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';
import { WebLarekAPI } from './components/communication/WebLarekAPI';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { IProduct } from './types';
import { Api } from './components/base/Api';


const catalog = new CatalogModel();
const basket = new BasketModel();
const order = new OrderModel();

const baseApi = new Api(API_URL);
const api = new WebLarekAPI(baseApi);



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
const testProducts = apiProducts.items as IProduct[];
const item1 = testProducts[0];
const item2 = testProducts[1];
const item3 = testProducts[2];

basket.clear();
basket.addItem(item1);
basket.addItem(item2);
basket.addItem(item3);
console.log('addItem:', basket.getItems().length === 3 ? 'OK' : 'FAIL');

console.log('getCount:', basket.getCount() === 3 ? 'OK' : 'FAIL');

console.log('containsItem (existing):', basket.containsItem(item1.id) === true ? 'OK' : 'FAIL');
console.log('containsItem (non-existing):', basket.containsItem('non-existent-id') === false ? 'OK' : 'FAIL');

const total = basket.getTotal();
console.log('getTotal (750+1450+0):', total === 2200 ? 'OK' : `FAIL (got ${total})`);

basket.removeItem(item1.id);
console.log('removeItem:', basket.getItems().length === 2 ? 'OK' : 'FAIL');

const remainingIds = basket.getItems().map(item => item.id);
const isItem1Removed = !remainingIds.includes(item1.id);
const isItem2StillThere = remainingIds.includes(item2.id);
const isItem3StillThere = remainingIds.includes(item3.id);

console.log('removeItem (product1 removed):', 
    isItem1Removed && isItem2StillThere && isItem3StillThere ? 'OK' : 'FAIL'
);
console.log('removeItem (count):', basket.getItems().length === 2 ? 'OK' : 'FAIL');

basket.clear();
console.log('clear:', basket.getItems().length === 0 ? 'OK' : 'FAIL');



// ---OrderModel---
console.log('\n--- OrderModel ---');

console.log('Initial state:', order.getData());


const emptyValidation = order.validate();
console.log('validate (empty data):',
    emptyValidation.payment && emptyValidation.address && emptyValidation.email && emptyValidation.phone ? 'OK' : 'FAIL'
);
console.log('isDataValid (empty):', order.isDataValid() === false ? 'OK' : 'FAIL');

order.setData({ address: 'Test Address', payment: 'cash' });
console.log('\nAfter partial fill (address + payment):', order.getData());

const partialValidation = order.validate();
console.log('validate (partial):',
    !partialValidation.payment && !partialValidation.address && partialValidation.email && partialValidation.phone ? 'OK' : 'FAIL'
);
console.log('isDataValid (partial):', order.isDataValid() === false ? 'OK' : 'FAIL');

order.setData({ email: 'test@example.com', phone: '+7 999 888-77-66' });
console.log('\nAfter full fill:', order.getData());

const fullValidation = order.validate();
console.log('validate (full):', Object.keys(fullValidation).length === 0 ? 'OK' : 'FAIL');
console.log('isDataValid (full):', order.isDataValid() === true ? 'OK' : 'FAIL');

order.clear();
console.log('\nAfter clear:', order.getData());

const clearedValidation = order.validate();
console.log('validate (after clear):',
    clearedValidation.payment && clearedValidation.address && clearedValidation.email && clearedValidation.phone ? 'OK' : 'FAIL'
);
console.log('isDataValid (after clear):', order.isDataValid() === false ? 'OK' : 'FAIL');



// ---SUMMARY---
console.log('\n---SUMMARY---');
console.log('All tests completed.');

// ---API Request---
console.log('\n---API Request---');

api.getProducts()
    .then(data => {
        catalog.setItems(data);
        console.log('getProducts:', catalog.getItems().length === data.length ? 'OK' : 'FAIL');
    })
    .catch(error => {
        console.error('getProducts:', error);
    });