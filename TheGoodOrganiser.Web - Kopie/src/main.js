import environment from './environment';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

//Configure Bluebird Promises.
Promise.config({
  longStackTraces: environment.debug,
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  let http = new HttpClient();
  http.configure(config => {
    config
    .useStandardConfiguration()
    .withBaseUrl('http://localhost:64089/api/')
    .withInterceptor({
      request(request) {
        console.log(`Requesting ${request.method} ${request.url}`);
        return request;
      },
      response(response) {
        console.log(`Received ${response.status} ${response.url}`);
      }
    });
  });

  aurelia.container.registerInstance(HttpClient, http);

  aurelia.start().then(() => aurelia.setRoot());
}
