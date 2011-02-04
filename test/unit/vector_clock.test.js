var should = require('should')
  , VectorClock = require('../../lib/wring/util/vector_clock.js');

module.exports = {
  
  'null should yield empty vector clock': function() {
    var vc = VectorClock.new(null);
    vc.serialize().should.eql('{}');
  },
  
  'empty object should yield empty vector clock': function() {
    var vc = VectorClock.new({});
    vc.serialize().should.eql('{}');
  },
  
  'serializing': function() {
    var vc = VectorClock.new({a: 1, b: 1});
    vc.serialize().should.eql('{"a":1,"b":1}');
  },
  
  'parsing': function() {
    var vc = VectorClock.new('{"a":1,"b":1}');
    vc.serialize().should.eql('{"a":1,"b":1}');
  },
  
  'parse method should be the same as new method': function() {
    VectorClock.new.should.eql(VectorClock.parse);
  },
  
  'true direct descendant': function() {
    var vca = VectorClock.new({"a":1,"b":2});
    var vcb = VectorClock.new({"a":1,"b":1});
    vca.descendsDirecltyFrom(vcb).should.eql(true);
  },

  'false direct descendant': function() {
    var vca = VectorClock.new({"c":1,"d":1});
    var vcb = VectorClock.new({"c":1,"d":1});
    vca.descendsDirecltyFrom(vcb).should.eql(false);
  },

  'false direct descendant 2': function() {
    var vca = VectorClock.new({"e":1,"f":1});
    var vcb = VectorClock.new({"e":1,"f":2});
    vca.descendsDirecltyFrom(vcb).should.eql(false);
  },

  'not present defaults to zero': function() {
    var vca = VectorClock.new({"g":1,"h":1});
    var vcb = VectorClock.new({"g":1});
    vca.descendsDirecltyFrom(vcb).should.eql(true);
  },

  'shoule check unpresent keys with 0 value': function() {
    var vca = VectorClock.new({"i":1,"j":1});
    var vcb = VectorClock.new({"i":1,"j":0, "k":0});
    vca.descendsDirecltyFrom(vcb).should.eql(true);
  },

  'shoule check unpresent keys': function() {
    var vca = VectorClock.new({"l":1,"m":1});
    var vcb = VectorClock.new({"l":1,"n":1});
    vca.descendsDirecltyFrom(vcb).should.eql(false);
  },

  'shoule check unpresent keys with 0 value reverse': function() {
    var vca = VectorClock.new({"o":1,"q":1, "r": 1});
    var vcb = VectorClock.new({"o":1,"q":1});
    vca.descendsDirecltyFrom(vcb).should.eql(true);
  },

  'shoule check unpresent keys with 0 value reverse 2': function() {
    var vca = VectorClock.new({"o":1,"q":1, "r": 2});
    var vcb = VectorClock.new({"o":1,"q":1});
    vca.descendsDirecltyFrom(vcb).should.eql(false);
  },

  'shoule check unpresent keys with 0 value reverse 3': function() {
    var vca = VectorClock.new({"o":1,"q":1, "r": 1});
    var vcb = VectorClock.new({"o":1,"q":1, "s": 1});
    vca.descendsDirecltyFrom(vcb).should.eql(false);
  },
  
  'increment should create a direct descendant': function() {
    var vcRaw = {a: 1, b: 1};
    var vca = VectorClock.new(vcRaw);
    var vcb = VectorClock.new(vcRaw);
    vca.increment("a");
    vca.descendsDirecltyFrom(vcb).should.eql(true);
    vca.increment("a");
    vca.descendsDirecltyFrom(vcb).should.eql(false);
  }

};