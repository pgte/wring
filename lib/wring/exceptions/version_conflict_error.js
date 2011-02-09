var util = require('util');

var VersionConflictError = function(message) {
  Error.apply(this, arguments);
  this.name = "VersionConflictError";
  this.message = message;
  Error.captureStackTrace(this);
};

util.inherits(VersionConflictError, Error);

module.exports = VersionConflictError;