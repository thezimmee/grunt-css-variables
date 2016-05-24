'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.css_variables = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default: function(test) {
    test.expect(2);

    var expectedCss = grunt.file.read('test/expected/default.css');
    var actualCss = grunt.file.read('tmp/default.css');

    var expectedCssVariables = grunt.file.read('test/expected/default--variables.css');
    var actualCssVariables = grunt.file.read('tmp/default--variables.css');

    // test content of source file
    test.equal(actualCss, expectedCss, '`tmp/default.css` should equal `test/expected/expected-default.css`.');
    // test content of variables file
    test.equal(actualCssVariables, expectedCssVariables, '`tmp/default--variables.css` should equal `test/expected/expected-default--variables.css`.');

    test.done();
  },
  custom: function(test) {
    test.expect(1);

    var expectedCssVariables = grunt.file.read('test/expected/variables--custom.css');
    var actualCssVariables = grunt.file.read('tmp/variables--custom.css');

    // test content of variables file
    test.equal(actualCssVariables, expectedCssVariables, '`tmp/variables--custom.css` should equal `test/expected/variables--expected-custom.css`.');

    test.done();
  },
};
