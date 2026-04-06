import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';
import { WebLarekAPI } from './components/communication/WebLarekAPI';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { Order } from './components/views/form/Order';
import { Contacts } from './components/views/form/Contacts';
import { Success } from './components/views/Success';
import { CardCatalog } from './components/views/card/CardCatalog';
import { CardPreview } from './components/views/card/CardPreview';
import { CardBasket } from './components/views/card/CardBasket';
import { TPayment, IOrder } from './types';

const events = new EventEmitter();

const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const order = new OrderModel(events);

const baseApi = new Api(API_URL);
const api = new WebLarekAPI(baseApi);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));

const basketTemplate = cloneTemplate<HTMLElement>('#basket');
const basketView = new Basket(events, basketTemplate);

events.on('catalog:items-changed', () => {
    const items = catalog.getItems();
    const cardElements = items.map(item => {
        const cardTemplate = cloneTemplate<HTMLButtonElement>('#card-catalog');
        const card = new CardCatalog(events, cardTemplate, {
            onClick: () => {
                catalog.setSelectedProduct(item);
            }
        });
        card.id = item.id;
        card.title = item.title;
        card.price = item.price;
        card.category = item.category;
        card.image = `${CDN_URL}/${item.image}`;
        return card.render();
    });
    gallery.catalog = cardElements;
});

events.on('basket:changed', () => {
    header.counter = basket.getCount();
    const items = basket.getItems();
    const cardElements = items.map((item, index) => {
        const cardTemplate = cloneTemplate<HTMLElement>('#card-basket');
        const card = new CardBasket(events, cardTemplate);
        card.id = item.id;
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1;
        return card.render();
    });
    basketView.itemsList = cardElements;
    basketView.total = basket.getTotal();
});

events.on('basket:open', () => {
    modal.content = basketView.render();
    modal.open();
});

events.on('catalog:selected-product-changed', () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;
    
    const previewTemplate = cloneTemplate<HTMLElement>('#card-preview');
    const previewView = new CardPreview(events, previewTemplate);
    
    previewView.id = product.id;
    previewView.title = product.title;
    previewView.description = product.description;
    previewView.price = product.price;
    previewView.category = product.category;
    previewView.image = `${CDN_URL}/${product.image}`;
    previewView.inBasket = basket.containsItem(product.id);
    
    modal.content = previewView.render();
    modal.open();
});

events.on('product:add', () => {
    const product = catalog.getSelectedProduct();
    if (product) {
        basket.addItem(product);
    }
    modal.close();
});

events.on('product:remove', (data: { id: string }) => {
    if (data?.id) {
        basket.removeItem(data.id);
    }
});

events.on('basket:submit', () => {
    order.clear();
    const orderTemplate = cloneTemplate<HTMLElement>('#order');
    const orderView = new Order(events, orderTemplate);
    modal.content = orderView.render();
});

events.on('order:submit', (data: { payment: TPayment; address: string }) => {
    order.setData({ ...order.getData(), ...data });
    const contactsTemplate = cloneTemplate<HTMLElement>('#contacts');
    const contactsView = new Contacts(events, contactsTemplate);
    modal.content = contactsView.render();
});

events.on('contacts:submit', (data: { email: string; phone: string }) => {
    order.setData({ ...order.getData(), ...data });
    const orderData: IOrder = {
        ...order.getData(),
        items: basket.getItems().map(item => item.id),
        total: basket.getTotal()
    };
    
    api.postOrder(orderData)
        .then(response => {
            const successTemplate = cloneTemplate<HTMLElement>('#success');
            const successView = new Success(events, successTemplate);
            successView.total = response.total;
            modal.content = successView.render();
            basket.clear();
            order.clear();
        })
        .catch(err => console.error(err));
});

events.on('success:close', () => {
    modal.close();
});

api.getProducts()
    .then(data => catalog.setItems(data))
    .catch(err => console.error(err));