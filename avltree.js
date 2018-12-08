"use strict";

//https://www.cise.ufl.edu/~nemo/cop3530/AVL-Tree-Rotations.pdf


var CONSTANTS = require("./constants");

/***************************************
  NODE OBJECT WE USE TO CREATE OUR TREE
****************************************/


// Using ES6:
class treeNode {
    constructor (left, newData, newHeight, newBalance, right) {
        this.left = left || null;
        this.data = newData;
        this.height = newHeight;
        this.balance = newBalance;
        this.right = right || null;
    }
    
    display() {console.log("> " + this.data + " height: " + this.height + ", balance: " + this.balance);}

    delete() {
        this.left = null;
        this.data = null;
        this.height = null;
        this.balance = null;
        this.right = null;
    }
}

/******* SEARCHING IN TREE ***********/

// PRIVATE
// O(n)
function traverseSearch(toFind, node) {
    if (node == null) return null;

    if (toFind > node.data) {
       return traverseSearch(toFind, node.right);
    } else if (toFind < node.data ){
       return traverseSearch(toFind, node.left);
    } else if (toFind == node.data) {
       return node;
    }
}


/********** BALANCE AND HEIGHT FOR WHOLE TREE ***********/

// PRIVATE
// O(n)
function balanceIt(node) {
    if (node === null) { return -1; }
    var rightHeight = balanceIt(node.right) + 1;
    var leftHeight = balanceIt(node.left) + 1;
    node.height = (leftHeight > rightHeight) ? leftHeight : rightHeight;
    node.balance = Math.abs(leftHeight - rightHeight);
    return node.height;
}

// PRIVATE
// O(n)
function updateBalanceAndHeightValuesForTree(node) {
    //console.log(" ∞ Reassign balance/height for (sub)tree at root: " + node.data);
    if (node) {
        var rightHeight = balanceIt(node.right) + 1;
        var leftHeight = balanceIt(node.left) + 1;
        node.height = (leftHeight > rightHeight) ? leftHeight : rightHeight;
        node.balance = Math.abs(leftHeight - rightHeight);
    }
    return node;
}


/********** INSERTING INTO THE TREE *************/

function getBalance(node) {
    if (node.left == null && node.right == null) { return 0; }
    var leftHeight = 0;
    var rightHeight = 0;
    if (node.left) { leftHeight = getHeight(node.left); }
    if (node.right) { rightHeight = getHeight(node.right); }
    return Math.abs(leftHeight - rightHeight);
}

//The height of a binary tree is the number of edges between the tree's root
// and its furthest leaf node. This means that a tree containing a single node has a height of 0.
function getHeight(node) {
    if (node == null) return 0;
    if (node.left == null && node.right == null) { return 0; }
    var leftHeight = 0;
    var rightHeight = 0;
    if (node.left) { leftHeight = getHeight(node.left) + 1; }
    if (node.right) { rightHeight = getHeight(node.right) + 1; }
    return maxHeight(leftHeight, rightHeight);
}


// PRIVATE
// O(n)
function setHeightAndBalance(node) {
    node.height = getHeight(node);
    node.balance = getBalance(node);
    return node;
}

// PRIVATE
// O(1)
function maxHeight(leftHeight, rightHeight) {
    return (leftHeight > rightHeight) ? leftHeight : rightHeight;
}

// PRIVATE
// O(1)
function updateHeightAndBalanceForSingleNode(node) {
    var leftHeight = 0;
    if (node.left) { leftHeight = node.left.height + 1; }

    var rightHeight = 0;
    if (node.right) { rightHeight = node.right.height + 1; }

    node.height = maxHeight(leftHeight, rightHeight);
    node.balance = Math.abs(leftHeight - rightHeight);
    return node;
}

// PRIVATE
// O(1)
function rotate(node, directionType) {
    var anchor = null;
    var toMove = node;

    if (directionType == CONSTANTS.LEFT) {
        anchor = node.right;
        toMove.right = (anchor.left) ? anchor.left : null;
        anchor.left = toMove;

    } else if (directionType == CONSTANTS.RIGHT) {
        anchor = node.left;
        toMove.left = (anchor.right) ? anchor.right : null;
        anchor.right = toMove;
    }

    setHeightAndBalance(anchor);
    setHeightAndBalance(toMove);
    //console.log("å anchor: " + anchor.data);
    return anchor;
}

// PRIVATE
// O(n)
function nodeCountForTree(node) {
    if (node == null) return 0;
    return nodeCountForTree(node.left) + nodeCountForTree(node.right) + 1;
}

// PRIVATE
// O(n)
// this function tells me whether the node is left or right heavy by height.
// if height is same, then it counts number of nodes.

function heaviness(node) {
    var leftHeight = 0; if (node.left) {leftHeight = getHeight(node.left)+1;}
    var rightHeight = 0; if (node.right) {rightHeight = getHeight(node.right)+1;}

    if (leftHeight == rightHeight) {
      return (nodeCountForTree(node.left) > nodeCountForTree(node.right)) ? CONSTANTS.LEFT_HEAVY : CONSTANTS.RIGHT_HEAVY;
    }
    return (leftHeight > rightHeight) ? CONSTANTS.LEFT_HEAVY : CONSTANTS.RIGHT_HEAVY;
}

// PRIVATE
// O(n)
function correctBalanceness(node) {
    //console.log("\nUnbalanceness detected at node: " + node.data);

    if (heaviness(node) == CONSTANTS.LEFT_HEAVY) {
      if (heaviness(node.left) == CONSTANTS.RIGHT_HEAVY) {
         //console.log("HEAVY left right (<) ");

         node.left = rotate(node.left, CONSTANTS.LEFT);
         node = rotate(node, CONSTANTS.RIGHT);
      } else {
        //console.log("HEAVY left left (/) ");
        node = rotate(node, CONSTANTS.RIGHT);
      }
    } else if (heaviness(node) == CONSTANTS.RIGHT_HEAVY){ // right heavy
      if (heaviness(node.right) == CONSTANTS.LEFT_HEAVY) {
          //console.log("HEAVY right left (>)");
          node.right = rotate(node.right, CONSTANTS.RIGHT);
          node = rotate(node, CONSTANTS.LEFT);
      } else {
          //console.log("HEAVY right right (\\) ");
          node = rotate(node, CONSTANTS.LEFT);
      }
    }
    return node;
}

// PRIVATE
// O(n)
function balanceNode(node) {
    node = updateHeightAndBalanceForSingleNode(node);
    return (node.balance >= 2) ? correctBalanceness(node) : node;
}


// PRIVATE
// O(log n)  for insertion
// O(n)    for update height and balance after insertion
function traverseInsertion(numberToInsert, node) {
    if (node == null) {
      //console.log("(+) Inserted leaf node: " + numberToInsert);
      return new treeNode(null, numberToInsert, 0, 0, null);
    }
    if (numberToInsert > node.data) {
        node.right = traverseInsertion(numberToInsert, node.right);
    } else if (numberToInsert < node.data) {
        node.left = traverseInsertion(numberToInsert, node.left);
    } else if (numberToInsert === node.data) {
        console.log(numberToInsert + ', already exists');
    }

    return balanceNode(node);
}

/*********** BALANCENESS OF A TREE *************/

// PRIVATE
// will send 'false' to callback for any unbalanceness
// O(n) - we visit every node in the tree
function countBalance(node, balancedCallBack) {
    if (node == null) { return -1; }
    var leftCount = 1 + countBalance(node.left, balancedCallBack);
    var rightCount = 1 + countBalance(node.right, balancedCallBack);
    if (Math.abs(leftCount-rightCount) > 1) {
        balancedCallBack(false, node);
    }
    return (leftCount >= rightCount) ? leftCount : rightCount;
}


// PRIVATE
// Checks to see if an unbalanceness exist in the tree
// O(n)
function checkForBalanceness (balancedTree) {
    //console.log("√ Check for Balanceness at node: " + balancedTree.data);
    var balancenessExist = true;
    countBalance(balancedTree, function(balanced = true, node) {
        if (balanced == false) {
            balancenessExist = balanced
        }
    });
    //console.log("∆ Does Balance Exist? : " + balancenessExist);
    return balancenessExist;
}

/*********** REMOVING FROM THE TREE ***********/

//PRIVATE UTILITY FOR CHECKING NODE'S CHILDREN EXISTENCE
// O(1)
function noChildren(node) { return (node.left == null && node.right == null); }
function leftChildOnly(node) { return (node.left != null && node.right == null); }
function rightChildOnly(node) { return (node.left == null && node.right != null); }
function bothChildExist(node) { return (node.left != null && node.right != null); }
function singleNodeLeft(node) { return ((node) && node.left == null && node.right == null); }
// PRIVATE
// Finds the minimum of sub-tree and delete it

// when both nodes exist
// You can get rightmost of left subtree, or leftmost of right subtree
// in our case, we got leftmost of the right subtree
// O (log n)
function deleteMinimum(node, removeCallBack) {
    if (noChildren(node)) {
        removeCallBack(node);
        return null;
    }
    if (rightChildOnly(node)) {
        removeCallBack(node);
        return node.right;
    }
    if (node.left) {
        node.left = deleteMinimum(node.left, removeCallBack);
        return node;
    }
}

// PRIVATE
// O(log n) - for finding the removal and removing it
// O(log n) - for case where both subtree exist. We delete minimum of right subtree.
// total - O(log n)
function traverseRemove(number, node) {
    if (node == null) {
        //console.log("Ø You're at leaf end, null. Number " + number + " not found. :P )");
        return null;
    }
    if (number > node.data) {
        node.right = traverseRemove(number, node.right);
        return node;
    } else if (number < node.data) {
        node.left = traverseRemove(number, node.left);
        return node;
    } else if (number == node.data) {
        if (noChildren(node)) {
            //console.log("Deleting node " + node.data + ", which HAS NO CHILDREN!");
            node.delete(); return null;
        }
        if (leftChildOnly(node)) {
            var leftNodeRef = node.left; node.delete(); return leftNodeRef;
        }
        if (rightChildOnly(node)) {
            var rightNodeRef = node.right; node.delete(); return rightNodeRef;
        }
        if (bothChildExist(node)) {
          // we get leftmost of the right subtree.
          // note: you can also implement right most of the left subtree.
            var nodeToDelete;
            node.right = deleteMinimum(node.right, function(toRemove){
                node.data = toRemove.data;
                nodeToDelete = toRemove;
            });
            nodeToDelete.delete();
            return node;
        }
    } // FOUND
} // traverseRemove function


// PRIVATE
// O(log n)
function findBadNode(node, nodeParent, callBack) {
    if (node == null) return;
    if (node.balance >= 2) { callBack(node, nodeParent); }
    findBadNode(node.left, node, callBack);
    findBadNode(node.right, node, callBack);
}

// PRIVATE
// O(n)
function remove(number, head) {
  //console.log("---------- Let's remove: " + number + " -----------------");
  if (head) {
      if (head.data == number && rightChildOnly(head)) {
          var temp = head; head = head.right; temp.delete();
          return head;
      }
      else if (head.data == number && leftChildOnly(head)) {
          var temp = head; head = head.left; temp.delete();
          return head;
      }
      else if (head.data == number && noChildren(head)) {
          head.delete(); head = null;
          return null;
      }
      return traverseRemove(number, head);
  } else {
    //console.log("Ø Empty tree. Nothing to remove");
  }
}


// BALANCED AVL TREE
// insert
// delete
// search

module.exports = class AVLTree {

    constructor () {
        this._head = null; // root reference for this instance
        var _numOfStepsForSearch = 0;
        this.getNumOfStepsForSearch = function() { return _numOfStepsForSearch; }
    }

    getHead() {return this._head;}
    static CreateObject () {return new AVLTree();}

    // PUBLIC
    // returns you the node if found
    // null otherwise
    search (numberToFind) {
        if (this._head) { return traverseSearch(numberToFind, this._head); }
    }

    // PUBLIC
    // O(log n) for insertion
    // O(n) for updating heights and balance values
    insertAndBalance (number) {
        if (this._head == null) {
            this._head = new treeNode(null, number, 0, 0, null);
        } else {
            if (number > this._head.data) {
              this._head.right = traverseInsertion(number, this._head.right);
            } else if (number == this._head.data) {
                console.log(number + ' already exists!');
                return updateBalanceAndHeightValuesForTree(this._head);
            }
            else {
              this._head.left = traverseInsertion(number, this._head.left);
            }
            this._head = balanceNode(this._head);
            //console.log("!! Anytime you do rotation in the tree AFTER AN INSERTION, you must update balance and height of WHOLE tree !!");
            return updateBalanceAndHeightValuesForTree(this._head);
        }
    }

    // PUBLIC
    // when we remove ANY nodes, the height and balance of WHOLE TREE MUST BE RE-EVALUATED
    // O(n) for update balance and height of tree
    // O(n) for balancing tree
    // O(n) + O(n) = 2 * O(n), which is O(n)
    removeAndBalance(value) {

        var node = remove(value, this._head);
        if (node == null) {
            //console.log("Ø TREE EMPTY NOW. NOTHING to rebalance or fix");
            this._head = null; return;
        }
        if (singleNodeLeft(node)) { this._head = node; }

        node = updateBalanceAndHeightValuesForTree(node); // THIS IS NEEDED
        var self = this; // for accessing context inside a callback

        while (checkForBalanceness(node) == false) { // while its un balanced, we find bad node.
            findBadNode(node, null, function(badNode, parentNode) {
                if (parentNode) {
                    if (parentNode.left === badNode) {
                        parentNode.left = balanceNode(badNode);
                    } else {
                        parentNode.right = balanceNode(badNode);
                    }
                } else { 
                    self._head = balanceNode(badNode);
                }
                self._head = updateBalanceAndHeightValuesForTree(self._head);
                checkForBalanceness(self._head);
            }); // findBadNode
        } // while
    } //removeAndBalance


    // PUBLIC
    inOrderPrint(node) {
      
        if (node === null) {return;}

        this.inOrderPrint(node.left);
        if (this._head == node) {
          console.log("===============  HEAD  ==================");
        }
        node.display();
        if (this._head == node) {
          console.log("=============================================")
        }
        this.inOrderPrint(node.right);
    }

    // PUBLIC
    print(traversalType) {
        console.log("--------------------------------  TREE DISPLAY  --------------------------------");

        if (this._head) {
          switch (traversalType) {
              case CONSTANTS.INORDER:
              console.log(`CONSTANTS.INORDER`)
              this.inOrderPrint(this._head);
              break;
            default:
          }
        } else {
          console.log("Nothing to display. Empty Tree")
        }
    }

    flatten() {
        var array = [];
        this.flattenToArray(this._head, array);
        return array;
    }

    flattenToArray(node, array) {
        if (node === null) {return;}
        this.flattenToArray(node.left, array);
        array.push(node.data);
        this.flattenToArray(node.right, array);
    }

} // end of AVLTree