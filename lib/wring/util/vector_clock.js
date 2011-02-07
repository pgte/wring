var util    = require('util');

var VectorClock = function(vc) {
  this.vc = parse(vc) || {};
};

module.exports.new = function(vc) {
  return new VectorClock(vc);
};

module.exports.parse = module.exports.new;

VectorClock.prototype.serialize = function() {
  return JSON.stringify(this.vc);
};

var parse = function(vc) {
  if (vc === null) {
    return null;
  }
  if (typeof vc == 'string') {
    return JSON.parse(vc);
  }
  if (vc instanceof VectorClock) {
    return clone(vc.vc);
  }
  if (vc instanceof Object) {
    return clone(vc);
  }
  throw new Error('Unknown format for ' + util.inspect(vc));
};

var clone = function(obj) {
  if(obj == null || typeof(obj) != 'object') {
    return obj;
  }

  var temp = obj.constructor(); // changed

  for(var key in obj) {
    temp[key] = clone(obj[key]);
  }

  return temp;
};

VectorClock.prototype.descendsDirecltyFrom = function(vc) {
  if (vc instanceof VectorClock) {
    vc = vc.vc;
  }
  return descendsDirecltyFrom(this.vc, vc);
};

var descendsDirecltyFrom = function(a, b) {
  var aKeys = Object.keys(a),
      bKeys = Object.keys(b),
      descends = true,
      alreadyDiffersByOne = false,
      checkedBKeys = [],
      difference,
      key, value;
      
  for(var i = 0; i < aKeys.length; i ++) {
    key = aKeys[i];
    value = b[key] || 0;
    difference = a[key] - value;
    if (difference === 1) {
      if (alreadyDiffersByOne) {
        return false;
      }
      alreadyDiffersByOne = true;
    } else {
      if (difference > 1 || difference < 0) {
        return false
      }
    }
    checkedBKeys.push(key)
  }
  for(var j = 0; j < bKeys.length; j ++) {
    key = bKeys[j];
    if (checkedBKeys.indexOf(key) !== -1) {
      continue;
    }
    value = a[key] || 0;
    difference = value - b[key];
    if (difference === 1) {
      if (alreadyDiffersByOne) {
        return false;
      }
      alreadyDiffersByOne = true;
    } else {
      if (difference > 1 || difference < 0) {
        return false
      }
    }
  }
  
  return alreadyDiffersByOne;
};

VectorClock.prototype.descendsFrom = function(vc) {
  if (vc instanceof VectorClock) {
    vc = vc.vc;
  }
  return descendsFrom(this.vc, vc);
};

var descendsFrom = function(a, b) {
  var aKeys = Object.keys(a),
      bKeys = Object.keys(b),
      descends = true,
      checkedBKeys = [],
      difference,
      key, value;
      
  for(var i = 0; i < aKeys.length; i ++) {
    key = aKeys[i];
    value = b[key] || 0;
    difference = a[key] - value;
    if (difference < 0) {
      return false
    }
    checkedBKeys.push(key);
  }
  for(var j = 0; j < bKeys.length; j ++) {
    key = bKeys[j];
    if (checkedBKeys.indexOf(key) !== -1) {
      continue;
    }
    value = a[key] || 0;
    difference = value - b[key];
    if (difference < 0) {
      return false
    }
  }
  
  return descends;
};

VectorClock.prototype.increment = function(key) {
  if (key in this.vc) {
    this.vc[key] ++;
  } else {
    this.vc[key] = 1;
  }
};