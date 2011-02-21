function clone(a) {
  var n = {};
  for(var prop in a) {
    if (a.hasOwnProperty(prop)) {
      n[prop] = a[prop];
    }
  }
  return n;
};

var merge = module.exports.merge = function(a, b) {
  if (a === null) { return b };
  if (b === null) { return a };
  if (typeof b != 'object') {
    return b;
  }
  var n = clone(a);
  for(var prop in b) {
    if (b.hasOwnProperty(prop)) {
      n[prop] = merge(a[prop], b[prop]);
    }
  }
  return n;
};