# grunt-css-variables

> Fallback solution to using native CSS variables and applying & updating them dynamically.

## Overview
We had a use case where we needed to allow admin users to choose and update their site's theme colors on demand. We couldn't find an acceptable solution except for native CSS variables / custom properties, which in its current state is only supported by some of the newest browsers. So we created this plugin to offer a fallback solution to be able to use native CSS variables in any browser on the :root element. Once browser support for native CSS variables is up to par you can simply remove this plugin from your build process.

Once you have have your task properly configured, the grunt build will create a separate stylesheet for you which contains only CSS rules which contain custom properties (with variables). You can then apply a fallback solution to browsers that don't support native CSS variables by doing the following:

1. Detect browser support of native CSS variables, for example:
	```js
	var supportsCssVars = function() {
		var TEST_KEY = '--test-variable';
		var TEST_VALUE = 'test value';

		document.body.style.setProperty(TEST_KEY, TEST_VALUE);
		var _nativeSupport = document.body.style.getPropertyValue(TEST_KEY) === TEST_VALUE;
		if (_nativeSupport) {
				document.body.style.removeProperty(TEST_KEY);
		}
		return _nativeSupport;
	};
	```
2. For browsers that DO support native variables, inject your new CSS variables at any time just like you would inject any styles.
3. For browsers that do NOT support native variables:
	1. Use an `ajax` call to grab the stylesheet created by this plugin
	2. Replace the variables (i.e., `var(--your-variable)`) with your new values. For example:
		```js
		for (var prop in styles) {
			var re = new RegExp('var\\(\\-\\-' + prop + '\\)', 'g'); // replaces `var(--variable-name)`
			styles = styles.replace(re, styles[prop]);
		}
		```
	3. Inject the updated styles into the DOM.

## Getting Started
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out:

- [Getting Started](http://gruntjs.com/getting-started) with Grunt
- [Sample Gruntfile](http://gruntjs.com/sample-gruntfile)

Once `grunt` is installed, install this plugin with this command:

```shell
npm install grunt-css-variables --save-dev
```

Then enable it in your Gruntfile with this line:

```js
grunt.loadNpmTasks('grunt-css-variables');
```

## Task configuration
In your project's Gruntfile, add a section named `css_variables` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	css_variables: {
		options: {
			// Task-specific options go here.
		},
		your_target: {
			// Target-specific file lists and/or options go here.
		},
	},
});
```

### Options

#### options.filename
Type: `String`
Default value: `'{{filename}}--variables.css'`

Filename of the stylesheet which is to contain the custom CSS properties from your original source. _Note: `{{filename}}` will be replaced by the source filename._

#### options.addFallbackToSrc
Type: `Boolean`
Default value: `true`

Whether to modify the original source styles and include the `:root` variable value as a fallback to the native CSS custom property value (which can then later by modified dynamically).

#### options.minify
Type: `Boolean`
Default value: `true`

Whether to minify the final css file(s).

### Usage Example

In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
	css_variables: {
		options: {},
		files: {
			'dest/default': ['src/test.css', 'src/test2.css'],
		},
	},
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- 0.0.1
	First release
