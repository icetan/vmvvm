var test = require('tap').test,

    router = require('../lib/router');

test('should execute mapped function and return', function(t) {
  var route = router({
    'test': function() {
      return 123;
    },
    'lol': function() {
      return 789;
    }
  });
  t.equal(route('test'), 123);
  t.equal(route('lol'), 789);
  t.end();
});

test('should match regexp strings', function(t) {
  var route = router({
    'test.*': function() {
      return 321;
    }
  });
  t.equal(route('test'), 321);
  t.equal(route('tests'), 321);
  t.end();
});

test('should match in order', function(t) {
  var route = router({
    'test': function() {
      return 'this is the test function';
    },
    'test.*': function() {
      return 'this is the test etc. function';
    },
    '.*': function() {
      return 'this matches everything';
    }
  });
  t.equal(route('test'), 'this is the test function');
  t.equal(route('tests'), 'this is the test etc. function');
  t.equal(route('meh'), 'this matches everything');
  t.end();
});

test('should match regexp groups to function parameters', function(t) {
  var route = router({
    'test/(.*)': function(param) {
      return 'prefix.' + param;
    }
  });
  t.equal(route('test/4567'), 'prefix.4567');
  t.end();
});
