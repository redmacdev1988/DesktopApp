var b64Coder = require("./base64Coder");
var crypto = require('crypto');

var SECRET_KEY = 'your-256-bit-secret';

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
  let encodedMessage = encodedHeader + '.' + encodedPayload;

  var signature = crypto.createHmac('sha256', secret).update(encodedMessage).digest('base64');
  let encodedSignature = this.b64Coder.encode(signature);
  let token = encodedHeader + '.' + encodedPayload + '.' + encodedSignature;

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
  //console.log(`going in, token is: ${token}`);
  //let encodedPay = this.b64Coder.encode(`{"alg":"HS256","typ":"JWT"}`);
  //let answer = this.b64Coder.decode(encodedPay);
  //console.log(`answer - ${answer}`);

  let base64Array = token.split('.');
  console.log(base64Array);

  let header = base64Array[0];
  let payload = base64Array[1];
  let signature = base64Array[2];

  let decodedHeader = this.b64Coder.decode(header);
  let decodedPayload = this.b64Coder.decode(payload);

  
  console.log(decodedHeader);
  console.log(decodedPayload);

  // todo
 
  // The application server receives the secret key from the authentication server when 
  // the application sets up its authentication process. Since the application knows the secret key, 
  // when the user makes a JWT-attached API call to the application, the application can perform the 
  // same signature algorithm as in Step 3 on the JWT. 
  
  // NOTE:
//   Step 3. Create the SIGNATURE
// The signature is computed using the following pseudo code:
// signature algorithm
// data = base64urlEncode( header ) + “.” + base64urlEncode( payload )
// hashedData = hash( data, secret )
// signature = base64urlEncode( hashedData )

  
  // The application can then verify that the signature 
  // obtained from it’s own hashing operation matches the signature on the JWT itself 
  
  //   (i.e. it matches 
  //   the JWT signature created by the authentication server). If the signatures match, then that means
  //    the JWT is valid which indicates that the API call is coming from an authentic source. Otherwise, 
  //    if the signatures don’t match, then it means that the received JWT is invalid, which may be an indicator 
  //    of a potential attack on the application. So by verifying the JWT, the application adds a layer of trust 
  //    between itself and the user.


  // 4) download and receive secret from authentication server
  // 5) use decoded header, decoded payloaded, and this downloaded secret to create a hash
  // 6) this hash signature should be the same as the token' s signature. 

}

// check it:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
// eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
// SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

let m = new rtJWT();
let token = m.sign(payload, SECRET_KEY);
console.log('token is: ' + token);

m.verify(token);