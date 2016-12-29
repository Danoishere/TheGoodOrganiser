import { inject, Factory } from 'aurelia-dependency-injection';
import { HttpClient } from 'aurelia-fetch-client';
import { PersonNeedList } from './personNeedList';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UpdateDataEvent } from '../resources/events/UpdateDataEvent';

import 'whatwg-fetch';

@inject(HttpClient, EventAggregator, Factory.of(PersonNeedList))
export class EditOrder {
    constructor(http, eventAggregator, personNeedsResolver, app, orderId, orderList) {
        this.http = http;
        this.eventAggregator = eventAggregator;
        this.app = app;
        this.orderId = orderId;
        this.orderList = orderList;
        this.personNeeds = personNeedsResolver(orderId, this);
        this.availability = 'Loading...';
        this.eventAggregator.subscribe(UpdateDataEvent, () => {
            this.updateOrder();
            this.checkOrderAvailability();
        });
    }

    attached() {
        this.updateOrder();
        this.checkOrderAvailability();
    }



    updateOrder() {
        if (this.orderId !== 0) {
            this.http.fetch('order/' + this.orderId)
                .then(response => response.json())
                .then(data => {
                    this.order = data;
                });
        }
    }

    checkOrderAvailability() {
        if (this.orderId !== 0) {
            this.http.fetch('order/checkavailability/' + this.orderId)
                .then(response => response.json())
                .then(data => {
                    if (data === true) {
                        this.availability = 'Available';
                    } else {
                        this.availability = 'Not Available';
                    }
                });
        }
    }

    saveOrder() {
        var actionUrl;
        if (this.orderId !== 0) {
            actionUrl = 'order/update';
        } else {
            actionUrl = 'order/insert';
        }

        this.http.fetch(actionUrl, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                dataType: "json",
                method: "POST",
                body: JSON.stringify(this.order)
            })
            .then(response => response.json())
            .then(data => {
                this.order = data;
                this.orderId = data.Id;
                this.personNeeds.orderId = data.Id;
                this.eventAggregator.publish(new UpdateDataEvent());
            });

    }

    deleteOrder() {
        this.http.fetch('order/delete/' + this.orderId, {
                method: "DELETE"
            })
            .then(() => {
                this.app.closeOrder();
                this.eventAggregator.publish(new UpdateDataEvent());
            });
    }

    closeThisOrder() {
        this.http.fetch('order/close/' + this.orderId)
            .then(() => {
                this.app.closeOrder();
                this.eventAggregator.publish(new UpdateDataEvent());
            });
    }

    markAsReady() {
        this.http.fetch('order/use/' + this.orderId)
            .then(response => response.json())
            .then(data => {
                if (data !== 'Ok') {
                    this.processionError = data;
                } else {
                    this.eventAggregator.publish(new UpdateDataEvent());
                }
            });
    }
}