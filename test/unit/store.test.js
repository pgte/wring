var Store  = require('../../lib/wring/store'),
    assert = require('assert'),
    path   = require('path'),
    fs     = require('fs');

require('should');

var DB_PATH = __dirname + '/../../tmp/db2';

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

module.exports = {
  "store open should return a working alfred database": function() {
    Store.open(DB_PATH, function(err, store) {
      assert.isNull(err);
      assert.isNotNull(store);
      store.should.have.property('ensure');
      store.ensure('users', function(err, keyMap) {
        keyMap.put('a', 'b', function(err, version) {
          assert.isNull(err);
          assert.isNotNull(version);
          version.should.be.a('object');
          keyMap.get('a', function(err, value) {
            assert.isNull(err);
            assert.isNotNull(value);
            value.should.be.eql('b');
            store.close(function(err) {
              assert.isNull(err);
            });
          });
        });
      });
    })
  }
}
