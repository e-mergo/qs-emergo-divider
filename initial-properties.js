/**
 * E-mergo Divider Initial Properties
 *
 * @package E-mergo Tools Bundle
 *
 * @param  {String} qext          Extension QEXT data
 * @return {Object}               Initial properties
 */
define([
	"text!./qs-emergo-divider.qext"
], function( qext ) {
	return {
		props: {
			orientation: "vertical",
			alignment: "center",
			width: 1,
			styleType: "color",
			color: {
				color: "#a6a6a6"
			},
			colorExpression: ""
		},
		showTitles: false,
		title: JSON.parse(qext).title
	};
});
