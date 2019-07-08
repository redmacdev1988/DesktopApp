var USER = require("./User");
var MAX = 8;

// must use stack

const STACK_EMPTY = 'empty';

function Stack() {
    // public this object
    this.data = [];
    this.cur = 0;
}

Stack.prototype.push = function(ch) {
    this.data[this.cur++] = ch;
}

Stack.prototype.isEmpty = function() {
    return this.cur === 0;
}

Stack.prototype.pop = function() {
    if (this.isEmpty()) {
        return STACK_EMPTY;
    }
    return this.data[--this.cur];
}

Stack.prototype.count = function() {
    return this.cur;
}



function convertASCIIto8BitBinary(asciiValue, resultArr) {
    let division = asciiValue;
    for ( let i = 7; i >= 0; i--) {
        resultArr[i] = division % 2;
        division = Math.floor(division / 2);
    }
    return resultArr;
}


function charToBinary(ch) {
    try {
        if ((typeof ch === 'string') && (ch.length === 1)) {
            console.log(`√ ${ch} is a character`);

            let asciiValue = ch.charCodeAt(0);

            // return an array of 8 bits all filled
            return convertASCIIto8BitBinary(asciiValue, [8]);
    
        } else throw new Error(" wrong input "); 

    } catch (error) {
        console.log(error);
    }
}


function eightBitBinaryToBase64(arrOfBits) {

    // 1) we get an array of bits  100010101110101
    let numOfSixBits = Math.ceil(arrOfBits.length/6);

    // 2) we split them into 6's  000100 010101 110101
    // so I need numOfSixBits arrays
    var arr = [];

    for (let j = 0; j < numOfSixBits; j++) {
        arr[j] = new Array();
    }

    let bitStack = new Stack();
    for (let i = 0; i < arrOfBits.length; i++) {
        bitStack.push(arrOfBits[i]);
    }

    let data;
    let arrIndex = numOfSixBits-1;
    let i = 5;
    do {
        data = bitStack.pop();
        if (data === STACK_EMPTY) {break;}
        arr[arrIndex][i--] = data;
        if (i < 0) { // reset
            arrIndex--;
            i = 5;
        }
    } while (arrIndex > -1 && data !== STACK_EMPTY);

    for (let z = 0; z <= i; z++) {
        arr[arrIndex][z] = 0;
    }


    //  3) convert these 6 bits into base 64 characters

}

//{"alg
let r1 = charToBinary('{');
let r2 = charToBinary('"');
let r3 = charToBinary('a');
let r4 = charToBinary('l');
let r5 = charToBinary('g');

console.log(`${r1}    ${r2}     ${r3}     ${r4}     ${r5}`);


let result = r1.concat(r2, r3, r4, r5);

eightBitBinaryToBase64(result);

// charToBinary('a');
// charToBinary('n');


function Node (newData, newNext) {
    //The 'this' keyword will refer to the new instance that is created
    // these properties are tied to each instance
    this.data = newData;
    this.next = newNext;
}

Node.prototype.display = function() {
    if (this.data instanceof USER.user) {
        console.log('|' + this.data.name + '|');
    } else {
        console.log('|' + this.data + '|');
    }
}

Node.prototype.freeMemory = function() {
    this.data = null;
    this.next = null;
}

function Queue() {
    this._head = null;
    this._tail = null;
}

Queue.prototype.push = function(newData) {
    if (!this._head && !this._tail) {
        this._head = new Node(newData, this._head);
        this._tail = this._head;
        return;
    }
    this._tail.next = new Node(newData, null);
    this._tail = this._tail.next;
}

Queue.prototype.pop = function() {
    if (this._head && this._tail) {
        var temp = this._head;
        this._head = this._head.next;
        temp.freeMemory();
        
        if (!this._head) { // if removing the last node
            this._tail = null;
        }
        return true;
    } else {
        console.log(`No more items to remove from Queue`);
        return false;
    }
}

Queue.prototype.search = function(username) {
    console.log('Queue - searching for ' + username);
    for (var temp = this._head; temp !=null; temp = temp.next) {
        if (temp.data.name == username) {
            console.log(temp);
            return temp;
        }
    }
    console.log('(queue) - cannot find ' + username);
    return null;
}

Queue.prototype.delete = function(userName) {
    console.log('---- delete ----- ' + userName);
    for(var tmp = this._head, trailer = tmp; 
          tmp != null && trailer != null;
          trailer = tmp, tmp = tmp.next) {
        if (tmp.data.name == userName) {
            if (tmp == this._head) {
                this._head = this._head.next;
            } else {
                trailer.next = tmp.next;
            }
            tmp.freeMemory();
            if (this._head == null) {
                this._tail = null;
            }
            return true;
        }
    }
    return false;
}

Queue.prototype.print = function() {
    console.log('--- print (queue) ---');
    if (!this._head) {console.log(`nothing to print`);return;}
    for (var temp = this._head; temp != null; temp = temp.next) { temp.display(); }
    console.log('---------------------------');
}

Queue.prototype.toArrayOfStrings = function() {
    var arr = [];
    for (var temp = this._head; temp != null; temp = temp.next) {
        if (temp && temp.data && temp.data.name && temp.data.name != null) {
            arr.push(temp.data.name);
        }
    }
    return arr;
}

Queue.prototype.isEmpty = function() {return (!this._head && !this._tail);}

module.exports = (function HashTable() {
    var table = new Array(MAX);
    function hash(data) {
        if (typeof data == 'string' || data instanceof String) {
            let value = 0;
            for (let i = 0; i < data.length; i++) {
                value += data[i].charCodeAt(0); 
            }
            return (value * data.length) % MAX;
        } else {
            console.log('data must be of type string or instanceof String');
            return null;
        }
    }

    function insertUser(userObj) {
        if (userObj instanceof USER.user) {
            console.log('its a user! lets add it into our hash table');
            var index = hash(userObj.name);
            if (!table[index]) {table[index] = new Queue();}
            table[index].push(userObj);
        } else {
            console.log('not a user, should not be added into data structure');
        }
    }

    function searchUserByUserName(userName) {
        var queue = table[hash(userName)];
        if (queue) {
            return queue.search(userName);
        }
        else {return null;}  
    }

    function removeUserByUserName(userName) {
        var index = hash(userName);
        var queue = table[index];
        if (!queue) { return null; } 
        else {
            var queue = table[index];
            var bRemoved =  queue.delete(userName);
            if (queue.isEmpty()) {
                table[index] = null;
                console.log('table slot ' + index + ' has just been set to null.');
            }
            return bRemoved;
        }
    }

    function printTable() {
        console.log('\n\n===== print table =======');
        for (var i = 0; i < table.length; i++) {
            console.log('---' + i + '---');
            var bucket = table[i];
            if (bucket) {
                bucket.print();
            } else {
                console.log('empty');
            }
        }
        console.log('\n-------------------------\n');
    }

    function flattenTableIntoArrayOfStrings() {
        var allElements = [];
        for (var i = 0; i < table.length; i++) {
            var bucket = table[i];
            if (bucket) {
                Array.prototype.push.apply(allElements, bucket.toArrayOfStrings());
            }
        }
        return allElements;
    }

    // return object with properties
    return {
        print: printTable,
        insertUser: insertUser,
        searchUserByUserName: searchUserByUserName,
        removeUserByUserName: removeUserByUserName,
        flatten: flattenTableIntoArrayOfStrings,
        insertUser: insertUser
    };

})();



