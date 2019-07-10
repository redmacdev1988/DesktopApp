var b64Coder = require("./base64Coder");
var crypto = require('crypto');

//crypto-js/hmac-sha256
function rtJWT() {
    this.b64Coder = b64Coder();
}

// HEADER:ALGORITHM & TOKEN TYPE
const header = `{"alg":"HS256","typ":"JWT"}`;

// PAYLOAD:DATA
const payload = `{"sub":"1234567890","name":"John Doe","iat":1516239022}`;

rtJWT.prototype.sign = function(header, payload, secret) {

  header = header.replace(/\r?\n|\r/g,'');
  payload = payload.replace(/\r?\n|\r/g,'');

  let encodedHeader = this.b64Coder.encode(header);
  let encodedPayload = this.b64Coder.encode(payload);
  let message = encodedHeader + '.' + encodedPayload;

  var signature = crypto.createHmac('sha256', secret).update(message).digest('base64');
  let token = encodedHeader + '.' + encodedPayload + '.' + signature;
  console.log(`token: ${token}`);

  return token;

}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
// eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
// SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

let m = new rtJWT();
m.sign(header, payload, 'your-256-bit-secret');