var b64Coder = require("./base64Coder");
var CryptoJS = require('crypto-js');
var SECRET_KEY = 'your-256-bit-secret';

//crypto-js/hmac-sha256
function rtJWT() {
    this.b64Coder = b64Coder();
}

// PAYLOAD:DATA
const payload = `{"sub":"88665676680","name":"Ricky Tsao","iat":1516239022}`;

rtJWT.prototype.sign = function(payload, secret) {
  const header = `{"alg":"HS256","typ":"JWT"}`;
  let encodedHeader = this.b64Coder.encode(header);
  let encodedPayload = this.b64Coder.encode(payload);
  let encodedMessage = encodedHeader + '.' + encodedPayload;

  //var signature = crypto.createHmac('sha256', secret).update(encodedMessage).digest('base64');
  var hash = CryptoJS.HmacSHA256(encodedMessage, secret);
  let token = encodedHeader + '.' + encodedPayload + '.' + hash;
  return token;
}

function doesItMatch(client, server) {
  console.log('---- does it match -----');
  console.log(`client length - ${client.length}, server length - ${server.length}`);


  if (client.length === server.length) {
    for( let i = 0; i < client.length; i++) {
      if (client[i] !== server[i]) {
        console.log(`uh oh, error at index ${i}, values ${client[i]}, ${server[i]}`);
        return false;
      }
    }
    // 
    return true;
  }
  return false;
}
rtJWT.prototype.verify = function(token, callback) {
  let base64Array = token.split('.');

  let encodedHeader = base64Array[0];
  let encodedPayload = base64Array[1];
  let signature = base64Array[2];
  console.log(`client signature - |${signature}|`);
  

  let header = this.b64Coder.decode(encodedHeader);
  let obj = JSON.parse(header);

  let serverSignature;

  if (obj.alg === 'HS256' && obj.typ === 'JWT') {

    serverSignature = CryptoJS.HmacSHA256(encodedHeader + '.' + encodedPayload, SECRET_KEY);
    //serverSignature = crypto.createHmac('sha256', SECRET_KEY).update(encodedHeader + '.' + encodedPayload).digest('base64');
    console.log(`\nserverSignature - |${serverSignature}|`);

    console.log(`${typeof signature}, ${typeof serverSignature}`);
    
    console.log(`${signature.length}, ${serverSignature.length}`);

    if (signature === serverSignature) {
      console.log('oh yea');
    } else {
      console.log('oh no');
    }
    /*
    if (doesItMatch(clientSignature, serverSignature)) {
      console.log(`-- its a match --`);
      callback(this.b64Coder.decode(encodedPayload), null);
    } else {
      console.log(' --- uh no match ----');
    }
    */
  }
  callback(false, new Error('does not match'));
}

let m = new rtJWT();
let token = m.sign(payload, SECRET_KEY);
console.log('token is: ' + token);

m.verify(token, function(payload, error) {

});