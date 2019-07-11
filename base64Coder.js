
function base64Coder() {}

base64Coder.prototype.encode = function(input) {
    let allArraysOf8bits = new Array();
    for (let i = 0; i < input.length; i++) {
        let tmpArr = this.charToBinary(input[i]);
        allArraysOf8bits = allArraysOf8bits.concat(tmpArr);
    }
    return this.eightBitBinaryToBase64(allArraysOf8bits);
}

base64Coder.prototype.encode = function(base64String) {

    // 1) given a base 64 string, we first have to reverse it to a numeric

    // 2) given a

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

function create6BitsFrom8Bits_startingFromLeft(arrOfBits, arrayOf6BitWord) {
    //console.log(arrOfBits);
    let wordIndex = -1;
    //console.log(arrOfBits.length);
    for (let i = 0; i < arrOfBits.length; i++) {
        if (i % 6 === 0) wordIndex++;
        arrayOf6BitWord[wordIndex].push(arrOfBits[i]);
    }

    console.log('wordIndex: ' + wordIndex);
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