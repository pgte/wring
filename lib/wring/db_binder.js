module.exports.bind = function(db, getter, putter) {
  var oldAttachKeyMap = db.attach_key_map;
  db.attach_key_map = function(keyMapName, options, callback) {
    oldAttachKeyMap.call(db, keyMapName, options, function(err, keyMap) {
      if (err) { callback(err); return; }
      var oldPut = keyMap.put;
      var oldGet = keyMap.get;
      
      keyMap.get = getter(keyMap, oldGet);

      keyMap.put = putter(keyMap, oldPut);

      callback(null, keyMap);
    });
  };
};