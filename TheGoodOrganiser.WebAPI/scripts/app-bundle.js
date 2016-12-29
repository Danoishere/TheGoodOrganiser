define('app',['exports', 'aurelia-framework', './stock/stockMonitor', './order/orderList', './order/editOrder', './stock/editStock', './resources/events/UpdateDataEvent', 'aurelia-event-aggregator', 'whatwg-fetch'], function (exports, _aureliaFramework, _stockMonitor, _orderList, _editOrder, _editStock, _UpdateDataEvent, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.App = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Factory.of(_stockMonitor.StockMonitor), _aureliaFramework.Factory.of(_orderList.OrderList), _aureliaFramework.Factory.of(_editOrder.EditOrder), _aureliaFramework.Factory.of(_editStock.EditStock), _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function App(stockMonitorResolver, orderListResolver, editOrderResolver, editStockResolver, eventAggregator) {
            _classCallCheck(this, App);

            this.eventAggregator = eventAggregator;
            this.stockMonitor = stockMonitorResolver();
            this.orderList = orderListResolver();
            this.editOrderResolver = editOrderResolver;
            this.editStockResolver = editStockResolver;
            this.isEditingOrder = false;
            this.isEditingStock = false;
        }

        App.prototype.updateOrderList = function updateOrderList() {
            this.orderList.updateOrderList();
        };

        App.prototype.openOrder = function openOrder(id) {
            this.isEditingOrder = true;
            this.editOrder = this.editOrderResolver(this, id, this.orderList);
        };

        App.prototype.createOrder = function createOrder() {
            this.isEditingOrder = true;
            this.editOrder = this.editOrderResolver(this, 0, this.orderList);
        };

        App.prototype.closeOrder = function closeOrder() {
            this.isEditingOrder = false;
            this.editOrder = null;
        };

        App.prototype.modifyStock = function modifyStock() {
            this.isEditingStock = true;
            this.editStock = this.editStockResolver(this.stockMonitor);
        };

        App.prototype.closeOverlay = function closeOverlay() {
            this.isEditingStock = false;
            this.editStock = null;
        };

        return App;
    }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment', 'aurelia-framework', 'aurelia-fetch-client', 'whatwg-fetch'], function (exports, _environment, _aureliaFramework, _aureliaFetchClient) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.configure = configure;

    var _environment2 = _interopRequireDefault(_environment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    Promise.config({
        longStackTraces: _environment2.default.debug,
        warnings: {
            wForgottenReturn: false
        }
    });

    function configure(aurelia) {
        aurelia.use.standardConfiguration().feature('resources');

        if (_environment2.default.debug) {
            aurelia.use.developmentLogging();
        }

        if (_environment2.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }

        var http = new _aureliaFetchClient.HttpClient();
        http.configure(function (config) {
            config.useStandardConfiguration().withBaseUrl('http://thegoodorganiserwebapi.azurewebsites.net/api/');
        });

        aurelia.container.registerInstance(_aureliaFetchClient.HttpClient, http);

        aurelia.start().then(function () {
            return aurelia.setRoot();
        });
    }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('order/editOrder',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', './personNeedList', 'aurelia-event-aggregator', '../resources/events/UpdateDataEvent', 'whatwg-fetch'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _personNeedList, _aureliaEventAggregator, _UpdateDataEvent) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EditOrder = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var EditOrder = exports.EditOrder = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator, _aureliaDependencyInjection.Factory.of(_personNeedList.PersonNeedList)), _dec(_class = function () {
        function EditOrder(http, eventAggregator, personNeedsResolver, app, orderId, orderList) {
            var _this = this;

            _classCallCheck(this, EditOrder);

            this.http = http;
            this.eventAggregator = eventAggregator;
            this.app = app;
            this.orderId = orderId;
            this.orderList = orderList;
            this.personNeeds = personNeedsResolver(orderId, this);
            this.availability = 'Loading...';
            this.eventAggregator.subscribe(_UpdateDataEvent.UpdateDataEvent, function () {
                _this.updateOrder();
                _this.checkOrderAvailability();
            });
        }

        EditOrder.prototype.attached = function attached() {
            this.updateOrder();
            this.checkOrderAvailability();
        };

        EditOrder.prototype.updateOrder = function updateOrder() {
            var _this2 = this;

            if (this.orderId !== 0) {
                this.http.fetch('order/' + this.orderId).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    _this2.order = data;
                });
            }
        };

        EditOrder.prototype.checkOrderAvailability = function checkOrderAvailability() {
            var _this3 = this;

            if (this.orderId !== 0) {
                this.http.fetch('order/checkavailability/' + this.orderId).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    if (data === true) {
                        _this3.availability = 'Available';
                    } else {
                        _this3.availability = 'Not Available';
                    }
                });
            }
        };

        EditOrder.prototype.saveOrder = function saveOrder() {
            var _this4 = this;

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
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this4.order = data;
                _this4.orderId = data.Id;
                _this4.personNeeds.orderId = data.Id;
                _this4.eventAggregator.publish(new _UpdateDataEvent.UpdateDataEvent());
            });
        };

        EditOrder.prototype.deleteOrder = function deleteOrder() {
            var _this5 = this;

            this.http.fetch('order/delete/' + this.orderId, {
                method: "DELETE"
            }).then(function () {
                _this5.app.closeOrder();
                _this5.eventAggregator.publish(new _UpdateDataEvent.UpdateDataEvent());
            });
        };

        EditOrder.prototype.closeThisOrder = function closeThisOrder() {
            var _this6 = this;

            this.http.fetch('order/close/' + this.orderId).then(function () {
                _this6.app.closeOrder();
                _this6.eventAggregator.publish(new _UpdateDataEvent.UpdateDataEvent());
            });
        };

        EditOrder.prototype.markAsReady = function markAsReady() {
            var _this7 = this;

            this.http.fetch('order/use/' + this.orderId).then(function (response) {
                return response.json();
            }).then(function (data) {
                if (data !== 'Ok') {
                    _this7.processionError = data;
                } else {
                    _this7.eventAggregator.publish(new _UpdateDataEvent.UpdateDataEvent());
                }
            });
        };

        return EditOrder;
    }()) || _class);
});
define('order/orderList',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', 'aurelia-event-aggregator', '../resources/events/UpdateDataEvent', 'whatwg-fetch'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _aureliaEventAggregator, _UpdateDataEvent) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.OrderList = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var OrderList = exports.OrderList = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function OrderList(http, eventAggregator) {
            var _this = this;

            _classCallCheck(this, OrderList);

            this.http = http;
            this.eventAggregator = eventAggregator;
            this.eventAggregator.subscribe(_UpdateDataEvent.UpdateDataEvent, function () {
                _this.updateOrderList();
            });
        }

        OrderList.prototype.updateOrderList = function updateOrderList() {
            var _this2 = this;

            return this.http.fetch('order').then(function (response) {
                return response.json();
            }).then(function (data) {
                _this2.orders = [];
                _this2.orders = data;
            });
        };

        OrderList.prototype.attached = function attached() {
            this.updateOrderList();
        };

        OrderList.prototype.filterFunc = function filterFunc(searchExpression, orderItem) {

            var itemCamp = orderItem.Camp === null ? '' : orderItem.Camp.toUpperCase();
            var itemReference = orderItem.ReferenceCode === null ? '' : orderItem.ReferenceCode.toUpperCase();
            var itemReceiverName = orderItem.ReceiverName === null ? '' : orderItem.ReceiverName.toUpperCase();
            var itemState = orderItem.State === null ? '' : orderItem.State.toUpperCase();

            searchExpression = searchExpression.toUpperCase();
            var searchParts = searchExpression.split(' ');

            var foundSearchParts = [];
            searchParts.forEach(function (searchPart) {
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
        };

        OrderList.prototype.containsString = function containsString(source, searchString) {
            return (source + '').indexOf(searchString + '') !== -1;
        };

        return OrderList;
    }()) || _class);
});
define('order/personNeedList',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', 'aurelia-event-aggregator', '../resources/events/UpdateDataEvent', 'whatwg-fetch'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _aureliaEventAggregator, _UpdateDataEvent) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PersonNeedList = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var PersonNeedList = exports.PersonNeedList = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function PersonNeedList(http, eventAggregator, orderId, editOrder) {
            var _this = this;

            _classCallCheck(this, PersonNeedList);

            this.editOrder = editOrder;
            this.http = http;
            this.eventAggregator = eventAggregator;
            this.orderId = orderId;
            this.shoeSizes = this.getShoeSizes(25, 55);
            this.clothSizes = ['XS', 'S', 'M', 'L', 'XL'];
            this.eventAggregator.subscribe(_UpdateDataEvent.UpdateDataEvent, function () {
                _this.updateNeedsList();
            });
        }

        PersonNeedList.prototype.attached = function attached() {
            this.updateNeedsList();
        };

        PersonNeedList.prototype.updateNeedsList = function updateNeedsList() {
            var _this2 = this;

            return this.http.fetch('need/order/' + this.orderId).then(function (response) {
                return response.json();
            }).then(function (data) {
                _this2.needs = [];
                _this2.needs = data;
            });
        };

        PersonNeedList.prototype.addNeed = function addNeed() {
            if (this.needs.length < 6) {
                this.needs.push(new Object({
                    Id: 0,
                    Gender: 'None'
                }));
            }
        };

        PersonNeedList.prototype.saveNeed = function saveNeed(need) {
            var _this3 = this;

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
            }).then(function (response) {
                return response.json();
            }).then(function () {
                _this3.eventAggregator.publish(new _UpdateDataEvent.UpdateDataEvent());
            });
        };

        PersonNeedList.prototype.deleteNeed = function deleteNeed(need) {
            var _this4 = this;

            this.http.fetch('need/delete/' + need.Id, {
                method: "DELETE"
            }).then(function () {
                _this4.updateNeedsList();
            });
        };

        PersonNeedList.prototype.getShoeSizes = function getShoeSizes(start, end) {
            var sizes = [];
            for (var i = start; i < end; i++) {
                sizes.push(i);
            }
            return sizes;
        };

        return PersonNeedList;
    }()) || _class);
});
define('stock/editStock',['exports', 'aurelia-framework', './stockMonitor', 'aurelia-fetch-client', 'aurelia-event-aggregator', '../resources/events/UpdateDataEvent', 'whatwg-fetch'], function (exports, _aureliaFramework, _stockMonitor, _aureliaFetchClient, _aureliaEventAggregator, _UpdateDataEvent) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EditStock = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var EditStock = exports.EditStock = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator, _aureliaFramework.Factory.of(_stockMonitor.StockMonitor)), _dec(_class = function () {
        function EditStock(http, eventAggregator, stockMonitorResolver, originalStockMonitor) {
            _classCallCheck(this, EditStock);

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

        EditStock.prototype.closeOrder = function closeOrder() {
            this.isEditingOrder = false;
            this.editOrder = null;
        };

        EditStock.prototype.getShoeSizes = function getShoeSizes(start, end) {
            var sizes = [];
            for (var i = start; i < end; i++) {
                sizes.push(i);
            }
            return sizes;
        };

        EditStock.prototype.addToStock = function addToStock() {
            this.modifyStock(this.amount);
        };

        EditStock.prototype.removeFromStock = function removeFromStock() {
            this.modifyStock(-1 * this.amount);
        };

        EditStock.prototype.modifyStock = function modifyStock(amount) {
            var _this = this;

            var url = 'stock/modify?' + 'type=' + this.typeOfGood + '&' + 'amount=' + amount + '&' + 'clothSize=' + this.clothSize + '&' + 'shoeSize=' + this.shoeSize + '&' + 'gender=' + this.gender;

            this.http.fetch(url).then(function () {
                _this.eventAggregator.publish(new _UpdateDataEvent.UpdateDataEvent());
            });
        };

        return EditStock;
    }()) || _class);
});
define('stock/stockMonitor',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', 'aurelia-event-aggregator', '../resources/events/UpdateDataEvent', 'whatwg-fetch'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _aureliaEventAggregator, _UpdateDataEvent) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StockMonitor = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var StockMonitor = exports.StockMonitor = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function StockMonitor(http, eventAggregator) {
            var _this = this;

            _classCallCheck(this, StockMonitor);

            this.eventAggregator = eventAggregator;
            this.http = http;
            this.stockFilter = "";
            this.test = "";
            this.eventAggregator.subscribe(_UpdateDataEvent.UpdateDataEvent, function () {
                _this.updateList();
            });
        }

        StockMonitor.prototype.attached = function attached() {
            this.updateList();
        };

        StockMonitor.prototype.updateList = function updateList() {
            var _this2 = this;

            return this.http.fetch('stock').then(function (response) {
                return response.json();
            }).then(function (data) {
                _this2.stockInfos = data;
            });
        };

        StockMonitor.prototype.filterFunc = function filterFunc(searchExpression, stockItem) {

            var itemType = stockItem.Type.toUpperCase();
            var itemGender = stockItem.Gender.toUpperCase();
            var itemAltType = void 0;
            var itemManWoman = void 0;
            var itemBoyGirl = void 0;
            var itemSize = void 0;

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
            searchParts.forEach(function (searchPart) {
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
        };

        return StockMonitor;
    }()) || _class);
});
define('resources/value-converters/date-format',['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DateFormatValueConverter = undefined;

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
        function DateFormatValueConverter() {
            _classCallCheck(this, DateFormatValueConverter);
        }

        DateFormatValueConverter.prototype.toView = function toView(value) {
            return (0, _moment2.default)(value).format('DD.MM.YYYY');
        };

        return DateFormatValueConverter;
    }();
});
define('resources/value-converters/filter',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var FilterValueConverter = exports.FilterValueConverter = function () {
        function FilterValueConverter() {
            _classCallCheck(this, FilterValueConverter);
        }

        FilterValueConverter.prototype.toView = function toView(array, searchTerm, filterFunc) {
            if (array === undefined) {
                return [];
            }
            if (searchTerm === undefined) {
                return array;
            }

            searchTerm = searchTerm.trim();

            return array.filter(function (item) {
                var matches = searchTerm && searchTerm.length > 0 ? filterFunc(searchTerm, item) : true;
                return matches;
            });
        };

        return FilterValueConverter;
    }();
});
define('resources/events/UpdateDataEvent',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var UpdateDataEvent = exports.UpdateDataEvent = function UpdateDataEvent() {
        _classCallCheck(this, UpdateDataEvent);
    };
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"position:relative\">\n    <compose view-model.bind=\"orderList\"/>\n    <compose view-model.bind=\"stockMonitor\"/>\n    <div if.bind=\"isEditingOrder\" class=\"overlay\">\n      <compose view-model.bind=\"editOrder\"></compose>\n    </div>\n    <div if.bind=\"isEditingStock\" class=\"overlay\">\n      <compose view-model.bind=\"editStock\"></compose>\n    </div>\n  </div>\n</template>"; });
define('text!order/editOrder.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../resources/value-converters/date-format\"></require>\r\n    <br/>\r\n    <div class=\"row\">\r\n        <div class=\"col-sm-12\">\r\n            <h2 class=\"pull-left\">Edit Order</h2>\r\n            <h2 class=\"pull-right bold-hover\" click.delegate=\"closeOrder()\">&#10006;</h2>\r\n        </div>\r\n    </div>\r\n    <br/>\r\n\r\n    <form submit.delegate=\"saveOrder()\">\r\n        <div class=\"row\" if.bind=\"order.State === 'Created'\">\r\n            <div class=\"col-sm-3\">\r\n                <label>Availability</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <span if.bind=\"availability === 'Loading...'\" class=\"label label-default label-lg\">${availability}</span>\r\n                <span if.bind=\"availability === 'Available'\" class=\"label label-success label-lg\">${availability}</span>\r\n                <span if.bind=\"availability === 'Not Available'\"  class=\"label label-danger label-lg\">${availability}</span>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n                <label>State</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <span if.bind=\"order.State === 'Created'\" class=\"label label-default label-lg\">${order.State}</span>\r\n                <span if.bind=\"order.State === 'Ready'\"  class=\"label label-success label-lg\">${order.State}</span>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n                <label>Reference</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <input type=\"text\" class=\"form-control\" placeholder=\"Order Reference\" value.bind=\"order.ReferenceCode\"/>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n                <label>Camp</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <input class=\"form-control\" type=\"text\" value.bind=\"order.Camp\" placeholder=\"Camp name\"/>\r\n            </div>\r\n        </div>\r\n         <br/>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n                <label>Whatsapp Number</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <input class=\"form-control\" type=\"tel\" value.bind=\"order.WhatsappNumber\" placeholder=\"+41 73 91 04 12\"/>\r\n            </div>\r\n        </div>\r\n         <br/>\r\n         <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n                <label>Working Phone Number</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <input class=\"form-control\" type=\"tel\" value.bind=\"order.WorkingPhoneNumber\" placeholder=\"+41 73 91 04 12\"/>\r\n            </div>\r\n        </div>\r\n         <br/>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n                <label>Responsible Receiver</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <input class=\"form-control\" type=\"text\" value.bind=\"order.ReceiverName\" placeholder=\"Name of the responsible receiver\"/>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n                <label>Language</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <input class=\"form-control\" type=\"text\" value.bind=\"order.Language\" placeholder=\"Arabic / Farsi / Other\"/>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\"> </div>\r\n            <div class=\"col-sm-9\">\r\n                <input type=\"submit\" class=\"btn btn-primary btn-margin pull-right\" value=\"Save Order\"/>\r\n                <button click.delegate=\"deleteOrder()\" class=\"btn btn-danger btn-margin pull-right\">Delete</button>\r\n                <button click.delegate=\"markAsReady()\" disabled.bind=\"availability !== 'Available'\" if.bind=\"order.State === 'Created'\" class=\"btn btn-success btn-margin pull-right\">Mark as Ready</button>\r\n                <button click.delegate=\"closeThisOrder()\" if.bind=\"order.State === 'Ready'\" class=\"btn btn-success btn-margin pull-right\">Close</button>\r\n            </div>\r\n        </div>\r\n    </form>\r\n\r\n    <div class=\"row\" if.bind=\"processionError !== ''\">\r\n        <div class=\"col-sm-12\">\r\n            <h3 class=\"label label-danger\">${processionError}</h3>\r\n        </div>\r\n    </div>\r\n\r\n    <compose view-model.bind=\"personNeeds\"></compose>\r\n    \r\n</template>"; });
define('text!order/orderList.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../resources/value-converters/date-format\"></require>\r\n    <require from=\"../resources/value-converters/filter\"></require>\r\n    <div class=\"row\">\r\n        <div class=\"col-sm-6\">\r\n            <h3>Orders</h3>\r\n        </div>\r\n        <div class=\"col-sm-6\">\r\n            <div class=\"form-inline top-margin\">\r\n                <button style=\"margin-bottom:10px;\" click.delegate=\"createOrder()\" class=\"btn btn-success pull-right btn-margin inline-block\">Add Order</button>\r\n                <input value.bind=\"orderFilter\" type=\"text\" class=\"form-control pull-right inline-block\" placeholder=\"Search | Camp Receiver\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <br/>\r\n    <div class=\"row table-responsive\">\r\n        <div class=\"col-sm-12\">\r\n            <table class=\"table\">\r\n                <tr>\r\n                    <th style=\"width:80px\">State</th>\r\n                    <th>Camp</th>\r\n                    <th>Reference</th>\r\n                    <th>Contact</th>\r\n                </tr>\r\n                <tr style=\"cursor:pointer\" click.delegate=\"openOrder(order.Id)\" repeat.for=\"order of orders |filter:orderFilter:filterFunc\">\r\n                    <td if.bind=\"order.State === 'Closed'\"><span class=\"label label-info label-lg\">${order.State}</span></td>\r\n                    <td if.bind=\"order.State === 'Created'\"><span class=\"label label-default label-lg\">${order.State}</span></td>\r\n                    <td if.bind=\"order.State === 'Ready'\"><span class=\"label label-success label-lg\">${order.State}</span></td>\r\n\r\n                    <td>${order.Camp}</td>\r\n                    <td>${order.ReferenceCode}</td>\r\n                    <td>${order.ReceiverName}</td>\r\n                </tr>\r\n            </table>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!order/personNeedList.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../resources/value-converters/date-format\"></require>\r\n    <br/>\r\n    <br/>\r\n    <h3 class=\"pull-left\">Person Needs</h3>\r\n    <button click.delegate=\"addNeed()\" class=\"btn btn-success pull-right\">Add Person</button>\r\n    <br/>\r\n    <div repeat.for=\"need of needs\">\r\n        <br/>\r\n        <br/>\r\n        <form submit.delegate=\"saveNeed(need)\">\r\n            <div class=\"panel panel-default panel-body\">\r\n                <h3>${$index+1}/${needs.length} Person</h3>\r\n                <div class=\"row\">\r\n                    <div class=\"col-sm-6 min-38\">\r\n                        <input class=\"form-control\" type=\"text\" placeholder=\"Name of the receiver\" value.bind=\"need.Name\"/>\r\n                    </div>\r\n                    <div class=\"col-sm-6 min-38\">\r\n                        <select class=\"form-control\" value.bind=\"need.Gender\">\r\n                            <option value=\"Male\">Male</option>\r\n                            <option value=\"Female\">Female</option>\r\n                        </select>\r\n                    </div>\r\n                </div>\r\n                <br/>\r\n                <div class=\"row \">\r\n                    <div class=\"col-sm-3 min-38\">\r\n                        <input class=\"checkbox-top\" type=\"checkbox\" checked.bind=\"need.NeedsShoes\"/>\r\n                        <label class=\"label-top\">Shoes</label>\r\n                    </div>\r\n                    <div class=\"col-sm-3 min-38\">\r\n                        <select class=\"form-control\" if.bind=\"need.NeedsShoes\" value.bind=\"need.ShoeSize\">\r\n                            <option repeat.for=\"size of shoeSizes\" model.bind=\"size\">${size}</option>\r\n                        </select>\r\n                    </div>\r\n\r\n                    <div class=\"col-sm-3 min-38\">\r\n                        <input class=\"checkbox-top\" type=\"checkbox\" checked.bind=\"need.NeedsPants\"/>\r\n                        <label class=\"label-top\">Pants</label>\r\n                    </div>\r\n                    <div class=\"col-sm-3 min-38\">\r\n                        <select class=\"form-control\" if.bind=\"need.NeedsPants\" value.bind=\"need.PantsSize\">\r\n                            <option repeat.for=\"size of clothSizes\" model.bind=\"size\">${size}</option>\r\n                        </select>\r\n                    </div>\r\n                    \r\n                    <div class=\"col-sm-3 min-38\">\r\n                        <input class=\"checkbox-top\" type=\"checkbox\" checked.bind=\"need.NeedsTop\"/>\r\n                        <label class=\"label-top\">Top</label>\r\n                    </div>\r\n                    <div class=\"col-sm-3 min-38\">\r\n                        <select class=\"form-control\" if.bind=\"need.NeedsTop\" value.bind=\"need.TopSize\">\r\n                            <option repeat.for=\"size of clothSizes\" model.bind=\"size\">${size}</option>\r\n                        </select>\r\n                    </div>\r\n\r\n                    <div class=\"col-sm-3 min-38\">\r\n                        <input class=\"checkbox-top\" type=\"checkbox\" checked.bind=\"need.NeedsJacket\"/>\r\n                        <label class=\"label-top\">Jacket</label>\r\n                    </div>\r\n                    <div class=\"col-sm-3 min-38\" >\r\n                        <select class=\"form-control\" if.bind=\"need.NeedsJacket\" value.bind=\"need.JacketSize\">\r\n                            <option repeat.for=\"size of clothSizes\" model.bind=\"size\">${size}</option>\r\n                        </select>\r\n                    </div>\r\n                    \r\n                    <div class=\"col-sm-6 min-38\">\r\n                        <input class=\"checkbox-top\" type=\"checkbox\" checked.bind=\"need.NeedsHygiene\"/>\r\n                        <label class=\"label-top\">Hygiene</label>\r\n                    </div>\r\n                    <div class=\"col-sm-6 min-38\">\r\n                        <input class=\"btn btn-primary btn-margin pull-right\" type=\"submit\" value=\"Save Person Needs\"/>\r\n                        <button class=\"btn btn-danger btn-margin pull-right\" click.delegate=\"deleteNeed(need)\">Delete</button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </form>\r\n    </div>\r\n</template>"; });
define('text!stock/editStock.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../resources/value-converters/date-format\"></require>\r\n    <br/>\r\n    <div class=\"row\">\r\n        <div class=\"col-sm-12\">\r\n            <h2 class=\"pull-left\">Edit Stock</h2>\r\n            <h2 class=\"pull-right bold-hover\" click.delegate=\"closeOverlay()\">&#10006;</h2>\r\n        </div>\r\n    </div>\r\n    <br/>\r\n    <compose view-model.bind=\"stockMonitor\"></compose>\r\n    <br/>\r\n    <br/>\r\n     <div class=\"row\">\r\n        <div class=\"col-sm-12\">\r\n            <h3 class=\"pull-left\">Modify Stock</h3>\r\n        </div>\r\n    </div>\r\n    <form submit.delegate=\"executeStockChange()\">\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n                <label>Good</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <select class=\"form-control\" value.bind=\"typeOfGood\">\r\n                    <option value=\"Shoes\">Shoes</option>\r\n                    <option value=\"Top\">Top</option>\r\n                    <option value=\"Pants\">Pants</option>\r\n                    <option value=\"Jacket\">Jacket</option>\r\n                    <option value=\"Hygiene\">Hygiene</option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n                <label>Gender</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <select class=\"form-control\" value.bind=\"gender\">\r\n                    <option value=\"Male\">Male</option>\r\n                    <option value=\"Female\">Female</option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n                <label>Amount</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <input class=\"form-control\" type=\"number\" value.bind=\"amount\" placeholder=\"12\"/>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n                <label if.bind=\"typeOfGood !== 'Hygiene'\">Size</label>\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <select class=\"form-control\" if.bind=\"typeOfGood === 'Top' || typeOfGood === 'Jacket' || typeOfGood === 'Pants'\" value.bind=\"clothSize\">\r\n                    <option repeat.for=\"size of clothSizes\" model.bind=\"size\">${size}</option>\r\n                </select>\r\n                <select class=\"form-control\" if.bind=\"typeOfGood === 'Shoes'\" value.bind=\"shoeSize\">\r\n                    <option repeat.for=\"size of shoeSizes\" model.bind=\"size\">${size}</option>\r\n                </select>   \r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"row\">\r\n            <div class=\"col-sm-3\">\r\n            </div>\r\n            <div class=\"col-sm-9\">\r\n                <button click.delegate=\"addToStock()\" class=\"btn btn-success btn-margin pull-right\">Add to stock</button>\r\n                <button click.delegate=\"removeFromStock()\" class=\"btn btn-danger btn-margin pull-right\">Remove from Stock</button>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n    </form>\r\n</template>"; });
define('text!stock/stockMonitor.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../resources/value-converters/filter\"></require>\r\n    <br/>\r\n    <div class=\"row\">\r\n        <div class=\"col-sm-6\">\r\n            <h3>Current Stocks of Goods</h3>\r\n        </div>\r\n        <div class=\"col-sm-6\">\r\n            <div class=\"form-inline top-margin\">\r\n                <button style=\"margin-bottom:10px;\" click.delegate=\"modifyStock()\" class=\"btn btn-success pull-right btn-margin inline-block\">Edit Stock</button>\r\n                <input value.bind=\"stockFilter\" type=\"text\" class=\"form-control pull-right inline-block\" placeholder=\"Search | Man Shoes 42\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <br/>\r\n    <div class=\"row table-responsive\">\r\n        <div class=\"col-sm-12\">\r\n        <table class=\"table\">\r\n            <tr>\r\n                <th style=\"width:50px\">Amount</th>\r\n                <th>Type</th>\r\n                <th>Size</th>\r\n                <th>Gender</th>\r\n            </tr>\r\n            <tr repeat.for=\"stock of stockInfos| filter:stockFilter:filterFunc\">\r\n                \r\n                <td><strong>${stock.Amount}x</strong></td>\r\n                <td>${stock.Type}</td>\r\n\r\n                <td if.bind=\"stock.Type === 'Shoes'\">${stock.ShoeSize}</td>\r\n                <td if.bind=\"stock.Type === 'Pants' || stock.Type === 'Top' || stock.Type === 'Jacket'\">\r\n                    ${stock.ClothSize}\r\n                </td>\r\n                <td if.bind=\"stock.Type === 'Hygiene'\" ></td>\r\n                <td>\r\n                    ${stock.Gender}\r\n                </td>\r\n            </tr>\r\n        </table>\r\n    </div>\r\n    </div>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map