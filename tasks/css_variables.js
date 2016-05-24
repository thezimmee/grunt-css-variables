/*
 * grunt-css-variables
 * https://github.com/thezimmee/grunt-css-variables
 *
 * Copyright (c) 2016 The Zimmee
 * Licensed under the MIT license.
 */

'use strict';

// dependencies
var customProps = require('custom-props');
var rework = require('rework');
var reworkVars = require('rework-vars');
var css = require('css');
var csso = require('csso');
var _ = require('lodash');

module.exports = function(grunt) {

  // see Grunt documentation for more information regarding task creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('css_variables', 'Fallback for native CSS variables.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      minify: true,
      addFallbackToSrc: true,
      filename: '{{filename}}--variables.css'
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join('');

      // set filepath for variables stylesheet
      options.varsFilepath = f.dest.split('/');
      options.srcFilename = options.varsFilepath.pop().split('.')[0];
      options.filename = options.filename.replace('{{filename}}', options.srcFilename);
      options.varsFilepath = options.varsFilepath.join('/') + '/' + options.filename;

      // filters css properties that contain --variables
      function filterStyleProperties(rule) {
        rule.declarations = _.filter(rule.declarations, function (dec) {
          return dec.value && dec.value.indexOf('var(--') > -1;
        });
        if (rule.declarations && rule.declarations.length) {
          return rule;
        }
      }

      // ast css object from css module
      var ast = css.parse(src);
      // process all styles
      ast.stylesheet.rules = _.filter(ast.stylesheet.rules, function (rule) {
        if (rule.rules) {
          var rules = _.filter(rule.rules, filterStyleProperties);
          if (rules.length) {
            return rules;
          }
        } else if (rule.declarations) {
          return filterStyleProperties(rule);
        }
      });

      // append variables styles to separate stylesheet
      var variablesStyles = '/**\n * ##!!! CUSTOM VARIABLES FOR OLDER BROWSERS !!!##\n */\n' + '/** ' + options.varsFilepath + '*/\n' + css.stringify(ast, {sourcemap: true}).code + '\n\n';
      // minify variables styles
      if (options.minify) {
        variablesStyles = csso.minify(variablesStyles, {restructure: false}).css;
      }

      // create fallback for custom properties when possible for original styles (i.e., for colors)
      if (options.addFallbackToSrc) {
        // provide variable fallback values in src
        var srcStyles = rework(src).use(reworkVars({preserve: true})).toString();
        if (options.minify) {
          srcStyles = csso.minify(srcStyles, {restructure: false}).css;
        }
        // Write the source file & log its success
        grunt.file.write(f.dest, srcStyles);
        grunt.log.writeln('File "' + f.dest + '" created.');
      }

      // write stylesheet with only variables which provides cross-browser fallback
      grunt.file.write(options.varsFilepath, variablesStyles);
      grunt.log.writeln('File "' + options.varsFilepath + '" created.');
    });
  });

};
