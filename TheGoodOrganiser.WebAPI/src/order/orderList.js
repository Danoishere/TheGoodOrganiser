import { inject, Factory } from 'aurelia-dependency-injection';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UpdateDataEvent } from '../resources/events/UpdateDataEvent';
import 'whatwg-fetch';

@inject(HttpClient, EventAggregator)
export class OrderList {
    constructor(http, eventAggregator) {
        this.http = http;
        this.eventAggregator = eventAggregator;
        this.eventAggregator.subscribe(UpdateDataEvent, () => {
            this.updateOrderList();
        });
    }

    updateOrderList() {
        return this.http.fetch('order')
            .then(response => response.json())
            .then(data => {
                this.orders = [];
                this.orders = data;
            });
    }

    attached() {
        this.updateOrderList();
    }

    filterFunc(searchExpression, orderItem) {

        let itemCamp = orderItem.Camp === null ? '' : orderItem.Camp.toUpperCase();
        let itemReference = orderItem.ReferenceCode === null ? '' : orderItem.ReferenceCode.toUpperCase();
        let itemReceiverName = orderItem.ReceiverName === null ? '' : orderItem.ReceiverName.toUpperCase();
        let itemState = orderItem.State === null ? '' : orderItem.State.toUpperCase();

        searchExpression = searchExpression.toUpperCase();
        var searchParts = searchExpression.split(' ');

        var foundSearchParts = [];
        searchParts.forEach(function(searchPart) {
            if (itemReference.indexOf(searchPart) > -1) {
                foundSearchParts.push(searchPart);
            } else if (itemCamp.indexOf(searchPart) > -1) {
                foundSearchParts.push(searchPart);
            } else if (itemReceiverName.indexOf(searchPart) > -1) {
                foundSearchParts.push(searchPart);
            } else if (itemState.indexOf(searchPart) > -1) {
                foundSearchParts.push(searchPart);
            }
        }, this);


        return searchParts.length == foundSearchParts.length;
    }

    containsString(source, searchString) {
        return (source + '').indexOf(searchString + '') !== -1;
    }
}