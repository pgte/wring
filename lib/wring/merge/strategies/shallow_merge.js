function clone(a) {
  var n = {};
  for(var prop in a) {
    if (a.hasOwnProperty(prop)) {
      n[prop] = a[prop];
    }
  }
  return n;
};

module.exports.merge = function(a, b) {
  if (a === null) { return b };
  if (b === null) { return a };
  if (typeof b != 'object') {
    return b;
  }
  var n = clone(a), value;
  for(var prop in b) {
    value = b[prop];
    if (b.hasOwnProperty(prop)) {
      n[prop] = b[prop];
    }
  }
  return n;
};