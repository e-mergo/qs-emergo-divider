/**
 * E-mergo Buttons Property Panel definition
 *
 * @param  {Object} util          E-mergo utility functions
 * @param  {String} qext          Extension QEXT data
 * @return {Object}               Extension Property Panel definition
 */
define([
	"./util/util",
	"text!./emergo-divider.qext"
], function( util, qext ) {

	/**
	 * Holds the settings definition of the appearance sub-panel
	 *
	 * @type {Object}
	 */
	var appearance = {
		uses: "settings",
		items: {
			general: {
				show: false
			},
			selections: {
				show: false
			},
			divider: {
				label: "Divider",
				component: "items",
				items: {
					orientation: {
						label: "Orientation",
						ref: "props.orientation",
						type: "string",
						component: "buttongroup",
						options: [{
							label: "Horizontal",
							value: "horizontal"
						}, {
							label: "Vertical",
							value: "vertical"
						}],
						defaultValue: "vertical"
					},
					alignment: {
						label: "Alignment",
						ref: "props.alignment",
						type: "string",
						component: "buttongroup",
						options: [{
							label: "Start",
							value: "start"
						}, {
							label: "Center",
							value: "center"
						}, {
							label: "End",
							value: "end"
						}],
						defaultValue: "center"
					},
					width: {
						label: "Width",
						ref: "props.width",
						type: "number",
						component: "slider",
						min: 1,
						max: 30,
						step: 1,
						defaultValue: 1
					},
					styleType: {
						label: "Color",
						type: "string",
						component: "buttongroup",
						ref: "props.styleType",
						options: [{
							label: "Picker",
							value: "color"
						}, {
							label: "Expression",
							value: "colorExpression"
						}],
						defaultValue: "style"
					},
					color: {
						translation: "Picker",
						type: "object",
						component: "color-picker",
						ref: "props.color",
						dualOutput: true,
						show: function( layout ) {
							return "color" === layout.props.styleType;
						}
					},
					colorExpression: {
						// label: "Expression",
						type: "string",
						expression: "optional",
						ref: "props.colorExpression",
						defaultValue: "",
						show: function( layout ) {
							return "colorExpression" === layout.props.styleType;
						}
					}
				}
			}
		}
	},

	/**
	 * Holds the settings definition of the about sub-panel
	 *
	 * @type {Object}
	 */
	about = {
		label: function() {
			return "About " + JSON.parse(qext).name;
		},
		type: "items",
		items: {
			author: {
				label: "This Qlik Sense extension is developed by E-mergo.",
				component: "text"
			},
			version: {
				label: function() {
					return "Version: " + JSON.parse(qext).version;
				},
				component: "text"
			},
			description: {
				label: "Please refer to the accompanying documentation page for a detailed description of this extension and its features.",
				component: "text"
			},
			help: {
				label: "Open documentation",
				component: "button",
				action: function() {
					util.requireMarkdownMimetype().finally( function() {
						window.open(window.requirejs.toUrl("extensions/emergo-divider/docs/docs.html"), "_blank");
					});
				}
			}
		}
	};

	return {
		type: "items",
		component: "accordion",
		items: {
			appearance: appearance,
			about: about
		}
	};
});
