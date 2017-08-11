# node-accountkit
Account Kit helps you quickly register for apps using just your phone number or email address — no password needed. It's reliable, easy to use and gives you a choice about how you sign up for apps.

node-accountkit is a nodeJS module to handle accountkit server side implementation.

Full documentation for account kit can be found here [https://developers.facebook.com/docs/accountkit/web](https://developers.facebook.com/docs/accountkit/web)

### Version
1.1.6

### Installation

```sh
npm install node-accountkit
```
### Usages

**Step 1** Include module to your server.js
```javascript
var Accountkit = require ('node-accountkit');
```
**Step 2** Configure account kit.
```javascript
Accountkit.set ("APP_ID", "ACCOUNT_KIT_APP_SECRET"[, "API_VERSION"]); //API_VERSION is optional, default = v1.1
Accountkit.requireAppSecret (true); // if you have enabled this option, default = true
```
More information [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/)


**Step 4** Use it.
```javascript
//authorization_code are the authorizaition code that we get from account kit login operation. look for sample app for more usage information.
Accountkit.getAccountInfo (authorization_code, function(err, resp) {
    /**
    {
        "email": {
            "address": "mail.goyalshubham@gmail.com"
        },
        "id": "941488975973375"
    }
    */
});
// Account Removal
//accountId is accountkit user id
Accountkit.removeUser(accountId, function(err, resp){
    /**
    {
        "success": true
    }
    */
});
```

### Methods

* accountkit.getAccountInfo (authorization_code, callback);
* removeUser (id, callback);

### Contribute

Feel free to fork it on Github :)
