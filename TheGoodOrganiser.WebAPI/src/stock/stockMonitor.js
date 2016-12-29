import { inject, Factory } from 'aurelia-dependency-injection';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UpdateDataEvent } from '../resources/events/UpdateDataEvent';
import 'whatwg-fetch';

@inject(HttpClient, EventAggregator)
export class StockMonitor {
    constructor(http, eventAggregator) {
        this.eventAggregator = eventAggregator;
        this.http = http;
        this.stockFilter = "";
        this.test = "";
        this.eventAggregator.subscribe(UpdateDataEvent, () => {
            this.updateList();
        });
    }

    attached() {
        this.updateList();
    }

    updateList() {
        return this.http.fetch('stock')
            .then(response => response.json())
            .then(data => {
                this.stockInfos = data;
            });
    }

    filterFunc(searchExpression, stockItem) {

        let itemType = stockItem.Type.toUpperCase();
        let itemGender = stockItem.Gender.toUpperCase();
        let itemAltType;
        let itemManWoman;
        let itemBoyGirl;
        let itemSize;

        if (itemType === 'SHOES') {
            itemSize = stockItem.ShoeSize;
            itemAltType = 'SHOE';
        } else if (itemType !== 'HYGIENE') {
            itemSize = stockItem.ClothSize.toUpperCase();
        }
        if (itemType === 'PANTS') {
            itemAltType = 'PANT';
        }
        if (itemType === 'TOP') {
            itemAltType = 'TOPS';
        }
        if (itemType === 'JACKET') {
            itemAltType = 'JACKETS';
        }
        if (itemType === 'HYGIENE') {
            itemAltType = 'HYGIENES';
        }


        if (itemGender === 'MALE') {
            itemManWoman = 'MAN';
            itemBoyGirl = 'BOY';
        } else {
            itemManWoman = 'WOMAN';
            itemBoyGirl = 'GIRL';
        }

        searchExpression = searchExpression.toUpperCase();
        var searchParts = searchExpression.split(' ');

        var foundSearchParts = [];
        searchParts.forEach(function(searchPart) {
            if (itemType == searchPart) {
                foundSearchParts.push(searchPart);
            } else if (itemAltType == searchPart) {
                foundSearchParts.push(searchPart);
            } else if (itemGender == searchPart) {
                foundSearchParts.push(searchPart);
            } else if (itemManWoman == searchPart) {
                foundSearchParts.push(searchPart);
            } else if (itemBoyGirl == searchPart) {
                foundSearchParts.push(searchPart);
            } else if (itemType == 'SHOES' && itemSize == searchPart) {
                foundSearchParts.push(searchPart);
            } else if (itemType !== 'HYGIENE' && itemType !== 'SHOES' && (itemSize + '').indexOf(searchPart) > -1) {
                foundSearchParts.push(searchPart);
            }
        }, this);


        return searchParts.length == foundSearchParts.length;

    }

}