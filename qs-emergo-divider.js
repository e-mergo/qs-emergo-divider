/**
 * E-mergo Divider Extension
 *
 * @since 20191113
 * @author Laurens Offereins <https://github.com/lmoffereins>
 *
 * @param  {Object} qlik      Qlik's core API
 * @param  {Object} $         jQuery
 * @param  {Object} props     Property panel definition
 * @param  {Object} initProps Initial properties
 * @param  {Object} util      E-mergo utility functions
 * @param  {String} css       Extension stylesheet
 * @return {Object}           Extension structure
 */
define([
	"qlik",
	"jquery",
	"./properties",
	"./initial-properties",
	"./util/util",
	"text!./style.css"
], function( qlik, $, props, initProps, util, css ) {

	// Add global styles to the page
	util.registerStyle("qs-emergo-divider", css);

	/**
	 * Holds the reference to the current app's API
	 *
	 * @type {Object}
	 */
	var app = qlik.currApp(),

	/**
	 * Holds the app's current theme data
	 *
	 * @type {Object}
	 */
	currTheme,

	/**
	 * Return the color picker's corresponding palette color
	 *
	 * @param  {Object} picker Color picker value
	 * @return {String}        Color value
	 */
	getPaletteColor = function( picker ) {
		if (picker && picker.color) {
			if (-1 !== picker.index) {
				var paletteColor = _.get(currTheme || {}, "properties.palettes.ui.0.colors".split("."), []);
				return picker.index - 1 < paletteColor.length ? paletteColor[picker.index - 1] : picker.color;
			} else {
				return picker.color;
			}
		} else {
			return "#000000";
		}
	},

	/**
	 * Holds the extension template
	 *
	 * @type {String}
	 */
	tmpl = '<div class="qs-emergo-divider" ng-class="elClass()"><hr class="rule" ng-style="elStyle()" /></div>',

	/**
	 * Extension controller function
	 *
	 * @param  {Object} $scope Extension scope
	 * @return {Void}
	 */
	controller = ["$scope", function( $scope ) {
		/**
		 * Deregister method after registering scoped extension object css
		 *
		 * @type {Function}
		 */
		var deregisterStyle = util.registerObjStyle($scope.layout.qInfo.qId, {
			hideNav: true // Hide the object's nav items
		});

		/**
		 * Constructor for object class names
		 *
		 * @return {Array} Class names
		 */
		$scope.elClass = function() {
			var classes = [
				$scope.layout.props.orientation,
				"align-".concat($scope.layout.props.alignment)
			];

			return classes;
		};

		/**
		 * Constructor for element styles
		 *
		 * @return {Object} Style definition
		 */
		$scope.elStyle = function() {
			var styles = {}, props = $scope.layout.props, isVertical = "vertical" === props.orientation, color;

			// Define defaults
			props.styleType = props.styleType || "color";
			props.color = props.color || {};
			props.color.color = props.color.color || "#a6a6a6";
			props.width = props.width || 1;

			// Color
			if ("color" === props.styleType) {
				color = getPaletteColor(props.color);
			} else {
				color = props[props.styleType];
				color = util.argbToRgb(color) || util.hexToRgb(color);
				color = color ? "rgb(".concat(color.r, ",", color.g, ",", color.b, ")") : "";
			}
			styles["border-color"] = color;

			// Width
			styles["border-width"] = "0 0 ".concat(isVertical ? "0 ".concat(props.width, "px") : "".concat(props.width, "px 0"));
			if (props.width > 1 && "center" === props.alignment) {
				styles.transform = (isVertical ? "translateX" : "translateY").concat("(calc(-50%", (props.width % 2 ? " + 1px" : ""), "))");
			}

			// Border style
			styles["border-style"] = -1 !== ["dashed", "dotted", "double", "groove", "inset", "outset", "ridge"].indexOf(props.borderStyle) ? props.borderStyle : "solid";

			// Border radius
			if (props.borderRadius) {
				styles["border-radius"] = "".concat(props.borderRadius, "px");
			}

			return styles;
		};

		// When the object is destroyed
		$scope.$on("destroy", function() {
			deregisterStyle();
		});
	}];

	// Find the appprops object and subscribe to layout changes
	// This listener remains running in memory without end, but it is only
	// created once for all instances of this extension.
	app.getObject("AppPropsList").then( function( obj ) {
		obj.layoutSubscribe( function() {

			// Set the current theme
			app.theme.getApplied().then( function( theme ) {
				currTheme = theme;
			});
		});
	});

	return {
		definition: props,
		initialProperties: initProps,
		template: tmpl,
		controller: controller,
		support: {
			snapshot: false,
			export: false,
			exportData: false
		}
	};
});