import { inject, Factory } from 'aurelia-dependency-injection';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UpdateDataEvent } from '../resources/events/UpdateDataEvent';
import 'whatwg-fetch';

@inject(HttpClient, EventAggregator)
export class PersonNeedList {
    constructor(http, eventAggregator, orderId, editOrder) {
        this.editOrder = editOrder;
        this.http = http;
        this.eventAggregator = eventAggregator;
        this.orderId = orderId;
        this.shoeSizes = this.getShoeSizes(25, 55);
        this.clothSizes = ['XS', 'S', 'M', 'L', 'XL'];
        this.eventAggregator.subscribe(UpdateDataEvent, () => {
            this.updateNeedsList();
        });
    }

    attached() {
        this.updateNeedsList();
    }


    updateNeedsList() {
        return this.http.fetch('need/order/' + this.orderId)
            .then(response => response.json())
            .then(data => {
                this.needs = [];
                this.needs = data;
            });
    }

    addNeed() {
        if (this.needs.length < 6) {
            this.needs.push(new Object({
                Id: 0,
                Gender: 'None',
            }));
        }
    }



    saveNeed(need) {
        var address = '';
        if (need.Id === 0) {
            address = 'need/insert/' + this.orderId;
        } else {
            address = 'need/update';
        }

        this.http.fetch(address, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                dataType: "json",
                method: "POST",
                body: JSON.stringify(need)
            })
            .then(response => response.json())
            .then(() => {
                this.eventAggregator.publish(new UpdateDataEvent());
            });
    }

    deleteNeed(need) {
        this.http.fetch('need/delete/' + need.Id, {
            method: "DELETE"
        }).then(() => {
            this.updateNeedsList();
        });
    }

    getShoeSizes(start, end) {
        var sizes = [];
        for (var i = start; i < end; i++) {
            sizes.push(i);
        }
        return sizes;
    }
}