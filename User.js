
function createPrototypeObjAndConnect(FuncConstructor, prototype, callbackForPrototypeFuncCreation) {
    var prototypeObj = Object.create(prototype);
    FuncConstructor.prototype = prototypeObj;
    prototypeObj.constructor = FuncConstructor;
    callbackForPrototypeFuncCreation(FuncConstructor);
 }

 function User(newName, newPassword, newUserType) {
    this.name = newName;
    this.password = newPassword;
    this.userType = newUserType || 'User';
 }

 User.prototype.print = function() {
   console.log('print');
 }

function Admin(newName, newPassword) {
  User.call(this, newName, newPassword, 'Admin');
  this.roomsCanAdmin = ["Public", "Private"];

}

createPrototypeObjAndConnect(Admin, User.prototype, function(Func) {
  Func.prototype.addRoom = function(roomName) {
    console.log('Admin ' + this.name + ' added room ' + roomName);
  }
  Func.prototype.removeRoom = function(roomName) {
    console.log('Admin ' + this.name + ' removed room ' + roomName);
  }
  Func.prototype.kickOutUser = function(userName) {
    console.log('Admin ' + this.name + ' has kicked out ' + userName);
  }
});
    
function SuperAdmin(newName, newPassword) {
  Admin.call(this, newName, newPassword, 'SuperAdmin');
}
    
createPrototypeObjAndConnect(SuperAdmin, Admin.prototype, function(Func) {
  Func.prototype.addUser = function(userName) {
    console.log('SuperAdmin ' + this.name + ' has kicked out ' + userName);
  }
  Func.prototype.removeUser = function(userName) {
    console.log('SuperAdmin ' + this.name + ' has kicked out ' + userName);
  }
});


module.exports = (function HashTable() {

    function createUser(name, pwd) {
        return new User(name, pwd);
    }

    function createAdmin(name, pwd) {
        return new Admin(name, pwd);
    }

    function createSuperAdmin(name, pwd) {
        return new SuperAdmin(name, pwd);
    }

    User.createUser = createUser;
    Admin.createAdmin = createAdmin;
    SuperAdmin.createSuperAdmin = createSuperAdmin;
    
    return {
        user : User,
        admin : Admin,
        superadmin : SuperAdmin
    }

})();