import { inject, Factory } from 'aurelia-framework';
import { StockMonitor } from './stockMonitor';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UpdateDataEvent } from '../resources/events/UpdateDataEvent';
import 'whatwg-fetch';

@inject(HttpClient, EventAggregator, Factory.of(StockMonitor))
export class EditStock {
    constructor(http, eventAggregator, stockMonitorResolver, originalStockMonitor) {
        this.http = http;
        this.eventAggregator = eventAggregator;
        this.originalStockMonitor = originalStockMonitor;
        this.stockMonitor = stockMonitorResolver();
        this.shoeSizes = this.getShoeSizes(25, 55);
        this.clothSizes = ['XS', 'S', 'M', 'L', 'XL'];
        this.typeOfGood = 'Shoes';
        this.shoeSize = 0;
        this.clothSize = 'XS';
        this.gender = 'Male';
        this.amount = 0;

    }

    closeOrder() {
        this.isEditingOrder = false;
        this.editOrder = null;
    }

    getShoeSizes(start, end) {
        var sizes = [];
        for (var i = start; i < end; i++) {
            sizes.push(i);
        }
        return sizes;
    }

    addToStock() {
        this.modifyStock(this.amount);
    }

    removeFromStock() {
        this.modifyStock(-1 * this.amount);
    }

    modifyStock(amount) {
        var url = 'stock/modify?' +
            'type=' + this.typeOfGood + '&' +
            'amount=' + amount + '&' +
            'clothSize=' + this.clothSize + '&' +
            'shoeSize=' + this.shoeSize + '&' +
            'gender=' + this.gender;

        this.http.fetch(url).then(() => {
            this.eventAggregator.publish(new UpdateDataEvent());
        });
    }


}