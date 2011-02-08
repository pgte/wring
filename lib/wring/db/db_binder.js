module.exports.bind = function(db, getter, putter) {
  var oldAttachKeyMap = db.attach_key_map;
  
  var swap = function(keyMap) {
    var oldPut = keyMap.put;
    var oldGet = keyMap.get;
    keyMap.get = getter(keyMap, oldGet);
    keyMap.put = putter(keyMap, oldPut);
  };
  
  db.attach_key_map = function(keyMapName, options, callback) {
    oldAttachKeyMap.call(db, keyMapName, options, function(err, keyMap) {
      if (err) { callback(err); return; }
      swap(keyMap);
      callback(null, keyMap);
    });
  };
  
  db.key_map_names.forEach(function(keyMapName) {
    var keyMap = db[keyMapName];
    swap(keyMap);
  });

};