var request = require('request');
var utf8 = require('utf8');

Sage.BASE_URL = "http://accounting.sageone.co.za/api/1.1.3";

/* Constructor */
function Sage(subscriptionKey, auth) {
  this.subscriptionKey = subscriptionKey;
  this.auth = auth;
}

/* Public Functions */
Sage.prototype.query = function (httpMethod, url, parameters) {
  url = Sage.BASE_URL + url;
  let body = ''
  if(httpMethod == 'POST' || httpMethod == 'PUT') {
    body = utf8.encode(parameters.body)
    delete parameters.body
  }

  parameters.apikey = this.subscriptionKey

  var options = {
    method: httpMethod,
    url: url,
    headers: {
        'Authorization': 'Basic ' + this.auth,
        'Content-Type': 'application/json',
        'User-Agent': 'sage_za_node',
      },
    form: parameters,
    body: body
  };

  return new Promise((resolve, reject) => {
    // Making HTTP Request
    request(options, function (error, response, body) {
      if (response.statusCode == 200 || response.statusCode == 201) {
        resolve(JSON.parse(body));
      } else {
        // console.log('response code:', response.statusCode);
        // console.log(body);
        if (!error) error = { message: 'Error Occured', statusCode: response.statusCode }      
        reject(error)
      }
      // console.log(response.request.uri)
      // console.log(response.request.headers);
      // console.log(response.request.body);
    });
  })
};

Sage.prototype.setBaseUrl = function (url) {
  Sage.BASE_URL = url;
}

module.exports = Sage;