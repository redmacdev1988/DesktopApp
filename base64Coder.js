
function base64Coder() {}

base64Coder.prototype.encode = function(input) {
    let allArraysOf8bits = new Array();
    for (let i = 0; i < input.length; i++) {
        let tmpArr = this.charToBinary(input[i]);
        allArraysOf8bits = allArraysOf8bits.concat(tmpArr);
    }
    return this.eightBitBinaryToBase64(allArraysOf8bits);
}

base64Coder.prototype.decode = function(base64String) {
    let allBits = this.base64StringToBitsArray(base64String);
    let storage = this.allBitsInto8BitArrays(allBits);

    let result = '';
    for (let i = 0; i < storage.length; i++) {
        let value = this.convert8BitsIntoChar(storage[i]);
        let temp = this.convertNumberToASCII(value);
        //console.log(`${value} --> ${temp}`);
        result += temp;
    }
    return result;
}

base64Coder.prototype.base64StringToBitsArray = function(base64String) {
    let allBits = [];
    for (let i = 0; i < base64String.length; i++) {
        let sixBits = this.convertNumericInto6Bits(this.convert64CharToNumber(base64String[i]));
        allBits = allBits.concat(sixBits);
    }
    return allBits;
}

base64Coder.prototype.allBitsInto8BitArrays = function(allBits) {
    let storageCounter = 0;
    let storage = [];
    let temp = [];

    for (let i = 0; i < allBits.length; i++) {
        if ((i !== 0) && (i % 8 === 0)) {
  
            storage[storageCounter++] = temp;
            temp = [];
        }
        temp.push(allBits[i]);
    }

    let z = 8 - temp.length;
    for (let i = 0; i < z; i++) { temp.push(0); }
    storage[storageCounter++] = temp;
    return storage;
}

base64Coder.prototype.convertNumberToASCII = function(number) {
    return String.fromCharCode(number);
}

base64Coder.prototype.convert8BitsIntoChar = function(bitArr) {
    let total = 0;
    for(let i = 0; i < bitArr.length; i++) {
        total += Math.pow(2, (bitArr.length-1) - i) * bitArr[i];
    }
    return total;
}

base64Coder.prototype.convertNumericInto6Bits = function(numeric) {
    let arrOf6Bits = [6];
    let division = numeric;
    for (let i = 5; i >= 0; i--) {
        arrOf6Bits[i] = division % 2;
        division = Math.floor(division / 2);
    }
    return arrOf6Bits;
}

base64Coder.prototype.convertASCIIto8BitBinary = function(asciiValue) {
    let resultArr = [8];
    let division = asciiValue;
    for (let i = 7; i >= 0; i--) {
        resultArr[i] = division % 2;
        division = Math.floor(division / 2);
    }
    return resultArr;
}

base64Coder.prototype.charToBinary = function(ch) {
    try {
        if ((typeof ch === 'string') && (ch.length === 1)) {
            return this.convertASCIIto8BitBinary(ch.charCodeAt(0));
        } else throw new Error("wrong input"); 
    } catch (error) { console.log(error); }
}

base64Coder.prototype.sixBitBinaryToNumber = function(arr) {
    let exp = 5;
    let total = 0;
    for(let i = 0; i < 6; i++) { 
        total += arr[i] * Math.pow(2, exp--); 
    }
    return total;
}

base64Coder.prototype.convert64CharToNumber = function(ch) {

    if (ch >= 'A' && ch <= 'Z') {
        return ch.charCodeAt(0) - 65;
    }

    // ascii a is 97
    // 97 - 71 = 26
    if (ch >= 'a' && ch <= 'z') {
        return ch.charCodeAt(0) - 71;
    }

    // ascii:  48 - 57
    // base 64: 52 - 61
    if (ch >= '0' && ch <= '9') {
        return parseInt(ch, 10) + 52;
    }

    if (ch === '-') { return 62; }
    if (ch === '_') { return 63; }
}

base64Coder.prototype.convertNumberToBase64Char = function(num) {
    if (num >= 0 && num <= 25 ) { // A to Z
        // ascii 65 - 90
        return String.fromCharCode(num+65);
    } else if (num >= 26 && num <= 51 ) { // a to z
        // ascii 97 - 122
        return String.fromCharCode(num+71);
    } else if (num >= 52 && num <= 61 ) { // 0 to 9
        // ascii 48 - 57
        return String.fromCharCode(num-4);
    } else if (num == 62) { // + (43), for url safe use '-' (45)
        return String.fromCharCode(45);
    } else if (num == 63) { // / (47), for url safe use '_' (95)
        return String.fromCharCode(95);
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

function create6BitsFrom8Bits_startingFromLeft(arrOfBits, arrayOf6BitWord) {
    let wordIndex = -1;
    for (let i = 0; i < arrOfBits.length; i++) {
        if (i % 6 === 0) wordIndex++;
        arrayOf6BitWord[wordIndex].push(arrOfBits[i]);
    }

    for (let z = arrayOf6BitWord[wordIndex].length; z < 6; z++ ) {
        arrayOf6BitWord[wordIndex].push(0);
    }
    return arrayOf6BitWord;
}

base64Coder.prototype.convert6BitArrayToChars = function(arrayOf6BitWord) {
    let base64Results = '';
    for (let a = 0; a < arrayOf6BitWord.length; a++) {
        let result = this.convertNumberToBase64Char(this.sixBitBinaryToNumber(arrayOf6BitWord[a]));
        base64Results += result;
    }
    return base64Results;
}

base64Coder.prototype.eightBitBinaryToBase64 = function(arrOfBits) {
    let numOf6BitWord = numOf6BitsFromAllBits(arrOfBits);
    let arr = createEmpty6BitArrays(numOf6BitWord);
    arr = create6BitsFrom8Bits_startingFromLeft(arrOfBits, arr);
    return this.convert6BitArrayToChars(arr);
}

// let m =  new base64Coder();
// let result = m.encode('{"alg');
// console.log(result);

module.exports = function factoryBase64Coder() {
    return new base64Coder();
}