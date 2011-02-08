var Alfred = require('alfred'),
    dbBinder = require('./db/db_binder');

var Store = function(path, callback) {
  var self = this;
  this.path = path;
  Alfred.open(path, function(err, db) {
    if (err) { callback(err); return; }
    bindDB(db);
    self.db = db;
    callback(null, self);
  });
};

module.exports.open = function(path, callback) {
  return new Store(path, callback);
};

function bindDB(db) {
  dbBinder.bind(
    db,
    function(keyMap, oldGet) {
      return function(key, callback) {
        
      }
    },
    function(keyMap, oldSet) {
      return function(key, value, callback) {
        
      }
    }
  )
};