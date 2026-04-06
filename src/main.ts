import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { CatalogModel, CatalogEvents } from './components/models/CatalogModel';
import { BasketModel, BasketEvents } from './components/models/BasketModel';
import { OrderModel, OrderEvents, TBuyerErrors } from './components/models/OrderModel';
import { WebLarekAPI } from './components/communication/WebLarekAPI';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Header, HeaderEvents } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { Basket, BasketEvents as ViewBasketEvents } from './components/views/Basket';
import { Order, ViewOrderEvents } from './components/views/form/Order';
import { Contacts, ContactsEvents } from './components/views/form/Contacts';
import { Success, SuccessEvents } from './components/views/Success';
import { CardCatalog } from './components/views/card/CardCatalog';
import { CardPreview, CardPreviewEvents } from './components/views/card/CardPreview';
import { CardBasket } from './components/views/card/CardBasket';
import { IOrder, IBuyer } from './types';

const events = new EventEmitter();

const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const order = new OrderModel(events);

events.on(ViewOrderEvents.FIELD_CHANGED, (data: { field: string; value: unknown }) => {
    order.setData({ [data.field]: data.value } as Partial<IBuyer>);
});

events.on(ContactsEvents.FIELD_CHANGED, (data: { field: string; value: unknown }) => {
    order.setData({ [data.field]: data.value } as Partial<IBuyer>);
});

function filterErrors(errors: TBuyerErrors, fields: (keyof IBuyer)[]): TBuyerErrors {
    return fields.reduce((acc, field) => {
        if (errors[field]) {
            acc[field] = errors[field];
        }
        return acc;
    }, {} as TBuyerErrors);
}

events.on(OrderEvents.DATA_CHANGED, () => {
    const errors = order.validateFields();
    
    const orderErrors = filterErrors(errors, ['payment', 'address']);
    orderView.errors = Object.values(orderErrors).join(', ');
    orderView.valid = Object.keys(orderErrors).length === 0;
    orderView.selectedPayment = order.getData().payment;
    orderView.address = order.getData().address;
    
    const contactsErrors = filterErrors(errors, ['email', 'phone']);
    contactsView.errors = Object.values(contactsErrors).join(', ');
    contactsView.valid = Object.keys(contactsErrors).length === 0;
    contactsView.email = order.getData().email;
    contactsView.phone = order.getData().phone;
});

events.on(OrderEvents.CLEARED, () => {
    orderView.reset();
    contactsView.reset();
});

const baseApi = new Api(API_URL);
const api = new WebLarekAPI(baseApi);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));

const basketTemplate = cloneTemplate<HTMLElement>('#basket');
const basketView = new Basket(events, basketTemplate);

const orderTemplate = cloneTemplate<HTMLElement>('#order');
const orderView = new Order(events, orderTemplate);

const contactsTemplate = cloneTemplate<HTMLElement>('#contacts');
const contactsView = new Contacts(events, contactsTemplate);

const previewTemplate = cloneTemplate<HTMLElement>('#card-preview');
const previewView = new CardPreview(events, previewTemplate);

events.on(CatalogEvents.ITEMS_CHANGED, () => {
    const items = catalog.getItems();
    const cardElements = items.map(item => {
        const cardTemplate = cloneTemplate<HTMLButtonElement>('#card-catalog');
        const card = new CardCatalog(cardTemplate, {
            onClick: () => {
                catalog.setSelectedProduct(item);
            }
        });
        card.title = item.title;
        card.price = item.price;
        card.category = item.category;
        card.image = `${CDN_URL}/${item.image}`;
        return card.render();
    });
    gallery.catalog = cardElements;
});

events.on(BasketEvents.CHANGED, () => {
    header.counter = basket.getCount();
    const items = basket.getItems();
    const cardElements = items.map((item, index) => {
        const cardTemplate = cloneTemplate<HTMLElement>('#card-basket');
        const card = new CardBasket(cardTemplate, {
            onDelete: () => basket.removeItem(item.id)
        });
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1;
        return card.render();
    });
    basketView.itemsList = cardElements;
    basketView.total = basket.getTotal();
});

events.on(HeaderEvents.BASKET_OPEN, () => {
    modal.content = basketView.render();
    modal.open();
});

events.on(CatalogEvents.SELECTED_PRODUCT_CHANGED, () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;
    
    previewView.title = product.title;
    previewView.description = product.description;
    previewView.price = product.price;
    previewView.category = product.category;
    previewView.image = `${CDN_URL}/${product.image}`;
    previewView.inBasket = basket.containsItem(product.id);
    
    modal.content = previewView.render();
    modal.open();
});

events.on(CardPreviewEvents.TOGGLE, () => {
    const product = catalog.getSelectedProduct();
    if (product) {
        if (basket.containsItem(product.id)) {
            basket.removeItem(product.id);
        } else {
            basket.addItem(product);
        }
    }
    modal.close();
});

events.on(ViewBasketEvents.SUBMIT, () => {
    modal.content = orderView.render();
});

events.on(ViewOrderEvents.SUBMIT, () => {
    modal.content = contactsView.render();
});

events.on(ContactsEvents.SUBMIT, () => {
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

events.on(SuccessEvents.CLOSE, () => {
    modal.close();
});

api.getProducts()
    .then(data => catalog.setItems(data))
    .catch(err => console.error(err));