var should        = require('should'),
    assert        = require('assert'),
    util          = require('util'),
    KeyMapWrapper = require('../../lib/wring/db/key_map_wrapper'),
    VersionConflictError = require('../../lib/wring/exceptions/version_conflict_error');

/* Setup */

var db = {
  'key1': {o: {'a': 1}, v: {'ACTOR1': 1}},
  'key2': {o: {'b': 1}, v: {'ACTOR1': 1}},
  'key3': {o: {'c': 1}, v: {'ACTOR1': 2}},
  'key4': {o: {'d': 1}, v: {'ACTOR1': 2}}
};

var keyPos = {
  0: 'key1',
  1: 'key2',
  2: 'key3'
};

var posKey = {
  'key1': 0,
  'key2': 1,
  'key3': 2
};

var maxPos = 2;

mockKeyMap = {
  get: function(key, callback) {
    callback(null, db[key]);
  },
  
  put: function(key, value, callback, secret) {
    db[key] = value;
    maxPos ++;
    keyPos[maxPos] = key;
    posKey[key] = maxPos;
    callback(null);
  },
  
  index: {
    atomic: function(key, secret, callback) {
      var record = {
        o: posKey[key],
        l:10
      };
      callback(null, secret, record, function() {});
    }
  },
  
  getAtPos: function(o, l, callback) {
    var key = keyPos[o];
    if (!key) {
      callback(null, null);
      return;
    }
    callback(null, key, db[key]);
  }
};

var wrapper = KeyMapWrapper.wrap('ACTOR1', mockKeyMap, mockKeyMap.get, mockKeyMap.put);


/* Tests */

module.exports = {
  
  "get should also return version": function() {
    wrapper.get('key1', function(err, value, version) {
      assert.isNull(err);
      value.should.eql({a: 1});
      version.should.eql({'ACTOR1': 1});
    });
  },
  
  "put should work with non-existing records": function() {
    wrapper.put('key4', {d: 1}, function(err, newVersion) {
      assert.isNull(err);
      newVersion.should.eql({'ACTOR1': 1});
      wrapper.get('key4', function(err, value) {
        value.should.eql({d:1});
      });
    });
  },
  
  "should work with existing records without version passed in": function() {
    wrapper.put('key2', {b:2}, function(err, version) {
      assert.isNull(err);
      version.should.eql({'ACTOR1': 2});
      wrapper.get('key2', function(err, value) {
        assert.isNull(err);
        value.should.eql({b:2});
      });
    });
  },

  "should work with existing records with valid version passed in": function() {
    wrapper.put('key3', {c:2}, {'ACTOR1': 2}, function(err, version) {
      assert.isNull(err);
      version.should.eql({'ACTOR1': 3});
      wrapper.get('key3', function(err, value) {
        assert.isNull(err);
        value.should.eql({c:2});
      });
    });
  },
  
  "should notify of error when there is a version conflict": function() {
    wrapper.put('key4', {c:2}, {'ACTOR1': 3}, function(err, version) {
      assert.isNotNull(err);
      (err instanceof VersionConflictError).should.eql(true);
    });
  }
  
};