var path     = require('path'),
    fs       = require('fs'),
    should   = require('should'),
    assert   = require('assert'),
    dbBinder = require('../../lib/wring/db_binder.js'),
    Alfred   = require('Alfred');

/* Setup */

var DB_PATH = __dirname + '/../../tmp/db';

(function removeFilesUnder(dir) {
  if (path.existsSync(dir)) {
    fs.readdirSync(dir).forEach(function(path) {
      var path = dir + '/' + path;
      var stat = fs.statSync(path);
      if (stat.isFile()) {
        fs.unlinkSync(path);
      } else {
        removeFilesUnder(path);
        fs.rmdirSync(path);
      }
    });
  }
})(DB_PATH);

/* Tests */

module.exports = {
  'db_binder should work': function() {
    Alfred.open(DB_PATH, function(err, db) {
      assert.isNull(err);
      
      var getterCalled = false;
      var getter = function(keyMap, oldGet) {
        return function(key, callback) {
          getterCalled.should.eql(false);
          getterCalled = true;
          oldGet.call(keyMap, key, callback);
        }
      };

      var putterCalled = false;
      var putter = function(keyMap, oldPut) {
        return function(key, value, callback) {
          putterCalled.should.eql(false);
          putterCalled = true;
          oldPut.call(keyMap, key, value, callback);
        }
      };
      
      dbBinder.bind(db, getter, putter);
      
      db.ensure('users', function(err, keyMap) {
        assert.isNull(err);
        
        keyMap.put('a', 'b', function(err) {
          assert.isNull(err);
          putterCalled.should.eql(true);
          
          keyMap.get('a', function(err, value) {
            assert.isNull(err);
            value.should.eql('b');
            getterCalled.should.eql(true);
            
            db.close(function(err) {
              assert.isNull(err);
            });
            
          });
        })
      });
      
    });
  },
};