var assert = require('assert'),
    ShallowMerge = require('../../../lib/wring/merge/strategies/shallow_merge');
require('should');

var n = null;
var a = {a: 1, b: 2, c: "ggg"};
var b = {a: 2, b: 1, d: 66};
var c = {a:2, b: 1, c: "ggg", d: 66}

module.exports = {
  
  "null and A should yield A": function() {
    ShallowMerge.merge(n, a).should.eql(a);
  },

  "A and null should yield A": function() {
    ShallowMerge.merge(a, n).should.eql(a);
  },
  
  "A and B sould yield C": function() {
    ShallowMerge.merge(a, b).should.eql(c);
  },
  
  "1 and 2 should yield 2": function() {
    ShallowMerge.merge(1, 2).should.eql(2);
  }

};