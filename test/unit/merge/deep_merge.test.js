var assert = require('assert'),
    DeepMerge = require('../../../lib/wring/merge/strategies/deep_merge');
require('should');

var n = null;
var a = {a: 1, b: "ggg",       d: {a: 10, b: 12        , d: {a: 20, b: 22}}};
var b = {a: 2,           c: 4, d: {a: 11,        c: 13,  d: {a: 21,       c: 23}}};
var c = {a: 2, b: "ggg", c: 4, d: {a: 11, b: 12, c: 13,  d: {a: 21, b: 22, c: 23}}};

module.exports = {
  
  "null and A should yield A": function() {
    DeepMerge.merge(n, a).should.eql(a);
  },

  "A and null should yield A": function() {
    DeepMerge.merge(a, n).should.eql(a);
  },
  
  "A and B sould yield C": function() {
    DeepMerge.merge(a, b).should.eql(c);
  },

  "1 and 2 should yield 2": function() {
    DeepMerge.merge(1, 2).should.eql(2);
  }

};