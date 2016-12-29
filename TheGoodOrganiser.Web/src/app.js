import {inject, Factory} from 'aurelia-framework';
import {StockMonitor} from './stock/stockMonitor';

@inject(Factory.of(StockMonitor))
export class App {
  constructor(stockMonitorResolver) {
    this.stockMonitor =  stockMonitorResolver();
  }
}
