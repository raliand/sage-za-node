var request = require('request');

Sage.BASE_URL = "https://accounting.sageone.co.za/api/1.1.3";

/* Constructor */
function Sage(subscriptionKey, auth) {
  this.subscriptionKey = subscriptionKey;
  this.auth = auth;
}

function IsJsonString(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

/* Public Functions */
Sage.prototype.query = function (httpMethod, url, parameters, body) {

  url = Sage.BASE_URL + url;

  parameters.apikey = this.subscriptionKey

  var options = {
    method: httpMethod,
    url: url,
    encoding: null,
    headers: {
        'Authorization': 'Basic ' + this.auth,
        'Content-Type': 'application/json',
        'User-Agent': 'sage_za_node',
      },
    qs: parameters,
    gzip: true,
    body: JSON.stringify(body)
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (response.statusCode == 200 || response.statusCode == 201) {
        if (IsJsonString(body)) {
          resolve(JSON.parse(body));
        } else {
          resolve(body)
        }
      } else {
        if (!error) error = { message: `Error Occured: ${body.toString()}`, statusCode: response.statusCode }      
        reject(error)
      }
    });
  })
};

Sage.prototype.setBaseUrl = function (url) {
  Sage.BASE_URL = url;
}

module.exports = Sage;