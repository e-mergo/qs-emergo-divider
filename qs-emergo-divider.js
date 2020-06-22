/**
 * E-mergo Divider Extension
 *
 * @since 20191113
 * @author Laurens Offereins <https://github.com/lmoffereins>
 *
 * @param  {Object} $         jQuery
 * @param  {Object} props     Property panel definition
 * @param  {Object} initProps Initial properties
 * @param  {Object} util      E-mergo utility functions
 * @param  {String} css       Extension stylesheet
 * @return {Object}           Extension structure
 */
define([
	"jquery",
	"./properties",
	"./initial-properties",
	"./util/util",
	"text!./style.css"
], function( $, props, initProps, util, css ) {

	// Add global styles to the page
	util.registerStyle("qs-emergo-divider", css);

	// Extension template
	var tmpl = '<div class="qs-emergo-divider" ng-class="elClass()" ng-style="elStyle()"></div>',

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
				"align-" + $scope.layout.props.alignment
			];

			return classes;
		};

		/**
		 * Constructor for element styles
		 *
		 * @return {Object} Style definition
		 */
		$scope.elStyle = function() {
			var styles = {}, props = $scope.layout.props, color;

			// Define defaults
			props.styleType = props.styleType || "color";
			props.color = props.color || {};
			props.color.color = props.color.color || "#a6a6a6";
			props.width = props.width || 1;

			// Color
			if ("color" === props.styleType) {
				color = props.color && props.color.color;
			} else {
				color = props[props.styleType];
				color = util.argbToRgb(color) || util.hexToRgb(color);
				color = color ? "rgb(" + color.r + "," + color.g + "," + color.b + ")" : "";
			}
			styles["border-color"] = color;

			// Width
			styles["border-width"] = props.width + "px";
			if (props.width > 1 && "center" === props.alignment) {
				styles.transform = ("vertical" === props.orientation ? "translateX" : "translateY") + "(calc(-50%" + (props.width % 2 ? " + 1px" : "") + "))";
			}

			return styles;
		};

		// When the object is destroyed
		$scope.$on("destroy", function() {
			deregisterStyle();
		});
	}];

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