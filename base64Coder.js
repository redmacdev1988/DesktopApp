var stackFactory = require("./Stack");

function base64Coder() {

}


base64Coder.prototype.constant = "HAHAHAHHA";
base64Coder.prototype.encode = function() {
}
base64Coder.prototype.decode = function() {
}

base64Coder.prototype.convertASCIIto8BitBinary = function(asciiValue) {
    let resultArr = [8];
    let division = asciiValue;
    for (let i = 7; i >= 0; i--) {
        resultArr[i] = division % 2;
        division = Math.floor(division / 2);
    }
    console.log(`ascii value ${asciiValue} in binary is:`);
    console.log(resultArr);
    return resultArr;
}

base64Coder.prototype.charToBinary = function(ch) {
    try {
        if ((typeof ch === 'string') && (ch.length === 1)) {
            let asciiValue = ch.charCodeAt(0);
            console.log(`√ ${ch} is a character, with an ascii value of ${asciiValue}`);
            return this.convertASCIIto8BitBinary(asciiValue);
        } else throw new Error(" wrong input "); 
    } catch (error) {
        console.log(error);
    }
}

base64Coder.prototype.sixBitBinaryToNumber = function(arr) {
    let exp = 5;
    let total = 0;
    for(let i = 0; i < 6; i++) {
        total += arr[i] * Math.pow(2, exp--);
    }
    console.log(`converted 6-bit binary ${arr} to value ${total}`);
    return total;
}

base64Coder.prototype.convertNumberToBase64Char = function(num) {
    //console.log(`converting a ${typeof num}  ${num} to base64`);
    if (num >= 0 && num <= 25 ) { // A to Z
        // ascii 65 - 90
        return String.fromCharCode(num+65);
    } else if (num >= 26 && num <= 51 ) { // a to z
        // ascii 97 - 122
        return String.fromCharCode(num+71);
    } else if (num >= 52 && num <= 61 ) { // 0 to 9
        // ascii 48 - 57
        return String.fromCharCode(num-4);
    } else if (num == 62) { // + 
        return String.fromCharCode(43);
    } else if (num == 63) { // /
        return String.fromCharCode(47);
    }
    return 'ERROR';
}

function numOf6BitsFromAllBits(arrOfBits) {
    return Math.ceil(arrOfBits.length/6);
}

function createEmpty6BitArrays(number) {
    var arr = [];
    for (let j = 0; j < number; j++) { arr[j] = new Array(); }
    return arr;
}

function createStackInitWithData(arr) {
    let bitStack = stackFactory();
    for (let i = 0; i < arr.length; i++) {
        bitStack.push(arr[i]);
    }
    return bitStack;
}

function create6BitsFrom8Bits() {

}

base64Coder.prototype.eightBitBinaryToBase64 = function(arrOfBits) {

    let numOf6Bits = numOf6BitsFromAllBits(arrOfBits);
    let arr = createEmpty6BitArrays(numOf6Bits);
    let bitStack = createStackInitWithData(arrOfBits);


    // 4) pop them into the empty arrays
    let data;
    let arrIndex = numOf6Bits-1;
    let i = 5;
    do {
        data = bitStack.pop();
        if (data === bitStack.STACK_EMPTY) {break;}
        arr[arrIndex][i--] = data;
        if (i < 0) { // reset
            arrIndex--;
            i = 5;
        }
    } while (arrIndex > -1 && data !== bitStack.STACK_EMPTY);

    if (arrIndex > -1) {
        // 5) fill out remaining with 0's
        for (let z = 0; z <= i; z++) { arr[arrIndex][z] = 0; }
    }

    console.log(`converted ${arrOfBits} to: `);

    for (let a = 0; a < numOfBase64; a++) {
        console.log(arr[a]);
    }

    let base64Results = '';
    //  6) convert these 6 bits into base 64 characters
    for (let a = 0; a < numOfBase64; a++) {
        let result = this.convertNumberToBase64Char(this.sixBitBinaryToNumber(arr[a]));
        console.log(`${arr[a]} becomes ${result}`);
        // convert each arr[a] into a character
        base64Results += result;
    }
    console.log(base64Results);
}


//https://www.base64encoder.io/


let m = new base64Coder();

let r1 = m.charToBinary('M');
let r2 = m.charToBinary('a');
let r3 = m.charToBinary('n');

let result = r1.concat(r2, r3);
console.log(`all binaries together: ${result}`);
m.eightBitBinaryToBase64(result);