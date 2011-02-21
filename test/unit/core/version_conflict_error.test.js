var VersionConflictError = require('../../../lib/wring/exceptions/version_conflict_error');

module.exports = {
  
  "should inherit from Error": function() {
    var err = new VersionConflictError('test');
    (err instanceof Error).should.eql(true);
  },
  
  "should have the message property": function() {
    var err = new VersionConflictError('test');
    err.message.should.eql('test');
  },
  
  "should have the stack property": function() {
    var err = new VersionConflictError('test');
    err.should.have.property('stack');
  }
  
};