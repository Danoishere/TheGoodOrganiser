import { inject, Factory } from 'aurelia-framework';
import { StockMonitor } from './stock/stockMonitor';
import { OrderList } from './order/orderList';
import { EditOrder } from './order/editOrder';
import { EditStock } from './stock/editStock';
import { UpdateDataEvent } from './resources/events/UpdateDataEvent';
import { EventAggregator } from 'aurelia-event-aggregator';
import 'whatwg-fetch';

@inject(Factory.of(StockMonitor), Factory.of(OrderList), Factory.of(EditOrder), Factory.of(EditStock), EventAggregator)
export class App {
    constructor(stockMonitorResolver, orderListResolver, editOrderResolver, editStockResolver, eventAggregator) {
        this.eventAggregator = eventAggregator;
        this.stockMonitor = stockMonitorResolver();
        this.orderList = orderListResolver();
        this.editOrderResolver = editOrderResolver;
        this.editStockResolver = editStockResolver;
        this.isEditingOrder = false;
        this.isEditingStock = false;
    }




    updateOrderList() {
        this.orderList.updateOrderList();
    }

    openOrder(id) {
        this.isEditingOrder = true;
        this.editOrder = this.editOrderResolver(this, id, this.orderList);
    }

    createOrder() {
        this.isEditingOrder = true;
        this.editOrder = this.editOrderResolver(this, 0, this.orderList);
    }

    closeOrder() {
        this.isEditingOrder = false;
        this.editOrder = null;
    }

    modifyStock() {
        this.isEditingStock = true;
        this.editStock = this.editStockResolver(this.stockMonitor);
    }


    closeOverlay() {
        this.isEditingStock = false;
        this.editStock = null;
    }
}