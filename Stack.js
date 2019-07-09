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
        return this.STACK_EMPTY;
    }
    return this.data[--this.cur];
}

Stack.prototype.count = function() {
    return this.cur;
}

Stack.prototype.STACK_EMPTY = 'stack_is_empty';

// Immediately Invoked function
module.exports = function() {
    return new Stack();
}