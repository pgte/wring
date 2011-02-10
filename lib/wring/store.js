var Alfred        = require('alfred'),
    DbBinder      = require('./db/db_binder'),
    KeyMapWrapper = require('./db/key_map_wrapper');

var Store = function(path, callback) {
  var self = this;
  this.path = path;
  Alfred.open(path, function(err, db) {
    if (err) { callback(err); return; }

    var _bind = function(actorId) {
      DbBinder.bind(actorId, db, KeyMapWrapper);
      self.db = db;
      callback(null, db);
    };
    
    db.meta.get('wring_actor_id', function(err, actorId) {
      if (err) { callback(err); return; }
      if (actorId) {
        _bind(actorId);
      } else {
        actorId = createActorId();
        db.meta.put('wring_actor_id', actorId, function(err) {
          if (err) { callback(err); return; }
          _bind(actorId);
        });
      }
    });
    
  });
};

module.exports.open = function(path, callback) {
  return new Store(path, callback);
};

function createActorId() {
  return (Math.floor(Math.random() * 100000000000000000) + Date.now()).toString(32);
};