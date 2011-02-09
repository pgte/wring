var VectorClock          = require('../util/vector_clock'),
    VersionConflictError = require('../exceptions/version_conflict_error'),
    util                 = require('util');

module.exports.wrap = function(actorId, keyMap, oldGet, oldPut) {
  return {
    get: function(key, callback) {
      oldGet.call(keyMap, key, function(err, value) {
        if (err) { callback(err); }
        callback(null, value.o, value.v);
      });
    },
    
    put: function(key, value /*[, version]*/, callback, secret) {
      var version;
      
      if (typeof arguments[3] == 'function') {
        version = arguments[2];
        callback = arguments[3];
        secret = arguments[4];
      }
      
      keyMap.index.atomic(key, secret, function(err, secret, record, next) {
        if (err) { callback(err); return; }
        
        function _save(oldValue) {
          
          var previousVersion = oldValue ? oldValue.v : {};
          
          if (!version) { version = previousVersion; }
          version = VectorClock.new(version);
          version.increment(actorId);
          if (!version.descendsDirecltyFrom(previousVersion)) {
            next();
            callback(new VersionConflictError("Version conflict: you provided " + util.inspect(version.vc) + ' and the latest version is ' + util.inspect(previousVersion)));
            return;
          }
          
          oldPut.call(keyMap, key, {o: value, v: version.vc}, function(err) {
            next();
            if (err) { callback(err); return; }
            callback(null, version.vc);
          });
        }
        
        if (record) {
          keyMap.getAtPos(record.o, record.l, function(err, retKey, value) {
            if (err) { callback(err); return; }
            _save(value);
          });
        } else {
          _save(null);
        }
      });
      
    }
  };
};