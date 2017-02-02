var Guid = require('guid');
var Request = require('request');
var Querystring = require('querystring');
var crypto = require('crypto');

function AccountKit() {
  var csrf_guid = Guid.raw();
  var api_version = "v1.1";
  var app_id = "";
  var app_secret = "";
  var require_app_secret = true;
  var base_url = "https://graph.accountkit.com/";
  return {
    set: function(v, id, secret) {
      api_version = v;
      app_id = id;
      app_secret = secret;
    },
    requireAppSecret: function(_require_app_secret) {
      require_app_secret = _require_app_secret;
    },
    getRandomState: function() {
      return csrf_guid;
    },
    getApiVersion: function() {
      return api_version;
    },
    getAppId: function() {
      return app_id;
    },
    getAppSecret: function() {
      return app_secret;
    },
    getAppAccessToken: function() {
      return ['AA', app_id, app_secret].join('|');
    },
    getEndpoint: function() {
      return base_url + api_version + "/me";
    },
    getDelUrl: function(id) {
      return base_url + api_version + '/' + id;
    },
    getTokenUrl: function() {
      return base_url + api_version + "/access_token";
    },
    getAccountInfo: function(authorization_code, callback) {
      var self = this;

      var params = {
        grant_type: 'authorization_code',
        code: authorization_code,
        access_token: this.getAppSecret(),
      };

      var token_exchange_url = this.getTokenUrl() + '?' + Querystring.stringify(params);
      Request.get({
        url: token_exchange_url,
        json: true
      }, function(error, resp, respBody) {
        if (error) {
          return callback(error);
        } else if (respBody.error) {
          return callback(respBody.error);
        } else if (resp.statusCode !== 200) {
          var errorMsg = "Invalid AccountKit Graph API status code (" + resp.statusCode + ")";
          return callback(errorMsg);
        }

        var me_endpoint_url = self.getEndpoint() + '?access_token=' + respBody.access_token;
        if (require_app_secret) {
          me_endpoint_url += '&appsecret_proof=' + crypto.createHmac('sha256', app_secret).update(respBody.access_token).digest('hex');
        }

        Request.get({
          url: me_endpoint_url,
          json: true
        }, function(err, resp, respBody) {
          if (error) {
            return callback(error);
          } else if (respBody.error) {
            return callback(respBody.error);
          } else if (resp.statusCode !== 200) {
            var errorMsg = "Invalid AccountKit Graph API status code (" + resp.statusCode + ")";
            return callback(errorMsg);
          }

          return callback(null, respBody);
        });
      });
    },
    removeUser: function(id, callback) {
      var self = this;
      var delUrl = this.getDelUrl(id) + "?" + "access_token=" + this.getAppSecret();

      Request.del({
        url: delUrl,
        json: true
      }, function(err, resp, respBody) {
        if (error) {
          return callback(error);
        } else if (respBody.error) {
          return callback(respBody.error);
        } else if (resp.statusCode !== 200) {
          var errorMsg = "Invalid AccountKit Graph API status code (" + resp.statusCode + ")";
          return callback(errorMsg);
        }

        return callback(null, respBody);
      });
    }
  };
}

module.exports = new AccountKit();