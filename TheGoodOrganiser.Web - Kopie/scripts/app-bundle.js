define('app',['exports', 'aurelia-framework', './stock/stockMonitor'], function (exports, _aureliaFramework, _stockMonitor) {
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

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Factory.of(_stockMonitor.StockMonitor)), _dec(_class = function App(stockMonitorResolver) {
    _classCallCheck(this, App);

    this.stockMonitor = stockMonitorResolver();
  }) || _class);
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
define('main',['exports', './environment', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _environment, _aureliaFramework, _aureliaFetchClient) {
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
      config.useStandardConfiguration().withBaseUrl('http://localhost:64089/api/').withInterceptor({
        request: function request(_request) {
          console.log('Requesting ' + _request.method + ' ' + _request.url);
          return _request;
        },
        response: function response(_response) {
          console.log('Received ' + _response.status + ' ' + _response.url);
        }
      });
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
define('stock/stockMonitor',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient) {
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

    var StockMonitor = exports.StockMonitor = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
        function StockMonitor(http) {
            _classCallCheck(this, StockMonitor);

            this.http = http;
        }

        StockMonitor.prototype.activate = function activate() {
            return this.http.get('stock').then(function (data) {
                console.log(data.description);
            });
        };

        return StockMonitor;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <h1>Test</h1>\n  <compose view-model.bind=\"stockMonitor\"/>\n</template>\n"; });
define('text!stock/stockMonitor.html', ['module'], function(module) { module.exports = "<template>\r\n    <h3>Current Stocks of Goods</h3>\r\n    <p repeat.for=\"stock of stockInfos\">XXX</p>\r\n</template>\r\n\r\n"; });
//# sourceMappingURL=app-bundle.js.map