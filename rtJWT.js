var b64Coder = require("./base64Coder");
var crypto = require('crypto');

//crypto-js/hmac-sha256
function rtJWT() {
    this.b64Coder = b64Coder();
}

// PAYLOAD:DATA
const payload = `{"sub":"1234567890","name":"John Doe","iat":1516239022}`;

rtJWT.prototype.sign = function(payload, secret) {

  // HEADER:ALGORITHM & TOKEN TYPE
  // should be in the function. Don't pass it in
  const header = `{"alg":"HS256","typ":"JWT"}`;

  payload = payload.replace(/\r?\n|\r/g,'');

  let encodedHeader = this.b64Coder.encode(header);
  let encodedPayload = this.b64Coder.encode(payload);
  let message = encodedHeader + '.' + encodedPayload;

  var signature = crypto.createHmac('sha256', secret).update(message).digest('base64');
  let token = encodedHeader + '.' + encodedPayload + '.' + signature;
  console.log(`token: ${token}`);

  return token;

}


/*
  var crypto = require('crypto')

  var secret = 'alpha'
  var string = 'bacon'

  var hash = crypto.createHmac('SHA256', secret).update(string).digest('base64');
  // => 'IbNSH3Lc5ffMHo/wnQuiOD4C0mx5FqDmVMQaAMKFgaQ='

  if (hash === crypto.createHmac('SHA256', secret).update(string).digest('base64')) {
    console.log('match') // logs => 'match'
  } else {
    console.log('no match')
  }
*/


rtJWT.prototype.verify = function(token) {

  // 1) divide into header, payload, signature
  // 2) decode header so we know what algo to decrypt
  // 3) decode payload so we get the body data

  // 4) download and receive secret from authentication server
  // 5) use decoded header, decoded payloaded, and this downloaded secret to create a hash
  // 6) this hash signature should be the same as the token's signature. 

}

// check it:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
// eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
// SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

let m = new rtJWT();
m.sign(payload, 'your-256-bit-secret');