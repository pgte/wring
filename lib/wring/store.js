var Alfred = require('alfred');

var Store = function(path, callback) {
  var self = this;
  this.path = path;
  Alfred.open(path, function(err, db) {
    if (err) { callback(err); return; }
    self._bindDb(db);
    self.db = db;
    callback(null, self);
  });
};

module.exports.open = function(path, callback) {
  return new Store(path, callback);
};

Store.prototype._bindDb = function(db) {

};