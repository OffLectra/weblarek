import './scss/styles.scss';

import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';
import { WebLarekAPI } from './components/communication/WebLarekAPI';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { IOrder, IProduct } from './types';
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


const emptyValidation = order.validateFields();
console.log('validate (empty data):',
    emptyValidation.payment && emptyValidation.address && emptyValidation.email && emptyValidation.phone ? 'OK' : 'FAIL'
);

order.setData({ address: 'Test Address', payment: 'cash', email: '', phone: ''});
console.log('\nAfter partial fill (address + payment):', order.getData());

const partialValidation = order.validateFields();
console.log('validate (partial):',
    !partialValidation.payment && !partialValidation.address && partialValidation.email && partialValidation.phone ? 'OK' : 'FAIL'
);

order.setData({ email: 'test@example.com', phone: '+7 999 888-77-66',  address: '', payment: null });
console.log('\nAfter partial second variant fill:', order.getData());

const partialValidationSecond = order.validateFields();
console.log('validate (partial):',
    partialValidationSecond.payment && partialValidationSecond.address && !partialValidationSecond.email && !partialValidationSecond.phone ? 'OK' : 'FAIL'
);

order.setData({ address: 'Test Address full', payment: 'card', email: 'test@example.com', phone: '+7 999 888-77-66' });
console.log('\Full:', order.getData());
const fullValidation = order.validateFields();
console.log('validate (full):',
    !fullValidation.payment && !fullValidation.address && !fullValidation.email && !fullValidation.phone ? 'OK' : 'FAIL');

order.clear();
console.log('\nAfter clear:', order.getData());

const clearedValidation = order.validateFields();
console.log('validate (after clear):',
    clearedValidation.payment && clearedValidation.address && clearedValidation.email && clearedValidation.phone ? 'OK' : 'FAIL'
);



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
        console.error('getProducts:Ошибка при попытке получения списка товаров:', error);
    })


const successOrder: IOrder = {
    payment: "card",
    email: "test@test.ru",
    phone: "+71234567890",
    address: "Spb Vosstania 1",
    total: 2200,
    items: [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
    ]
};
console.log('successOrder:', successOrder);
api.postOrder(successOrder)
    .then(data => { 
        console.log('postOrder:', data && typeof data.id === 'string' && typeof data.total === 'number' ? 'OK' : 'FAIL'); 
    })
    .catch(error => {
        console.error('postOrder error:', error);
    })

const productNotFoundOrder: IOrder = {
    ...successOrder,
    items: [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d" // неверный id
    ]
};
console.log('productNotFoundOrder:', productNotFoundOrder);

api.postOrder(productNotFoundOrder)
    .then(() => {
        console.log('postOrder error: FAIL'); 
    })
    .catch(error => {
        console.log('postOrder error message:', error);
        console.log('postOrder error: OK');
    })