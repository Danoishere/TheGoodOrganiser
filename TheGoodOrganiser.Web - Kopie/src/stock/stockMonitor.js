import {inject, Factory} from 'aurelia-dependency-injection';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class StockMonitor {
    constructor (http) {
        this.http = http;
    }

    activate() {
    return this.http.get('stock').then(data => {
        console.log(data.description)
    });
  }
}