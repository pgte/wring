module.exports.bind = function(actorId, db, Wrapper) {
  var oldAttachKeyMap = db.attach_key_map;
  
  var wrap = function(keyMap) {
    var wrapper = Wrapper.wrap(actorId, keyMap);
    keyMap.put = wrapper.put;
    keyMap.get = wrapper.get;
  };
  
  db.attach_key_map = function(keyMapName, options, callback) {
    oldAttachKeyMap.call(db, keyMapName, options, function(err, keyMap) {
      if (err) { callback(err); return; }
      wrap(keyMap);
      callback(null, keyMap);
    });
  };
  
  db.key_map_names.forEach(function(keyMapName) {
    wrap(db[keyMapName]);
  });

};