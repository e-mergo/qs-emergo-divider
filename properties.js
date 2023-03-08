/**
 * E-mergo Divider Property Panel definition
 *
 * @param  {Object} qlik          Qlik's core API
 * @param  {Object} util          E-mergo utility functions
 * @param  {String} qext          Extension QEXT data
 * @return {Object}               Extension Property Panel definition
 */
define([
	"qlik",
	"./util/util",
	"text!./qs-emergo-divider.qext"
], function( qlik, util, qext ) {
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
	 * Holds the settings definition of the appearance sub-panel
	 *
	 * @type {Object}
	 */
	appearance = {
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
					borderStyle: {
						label: "Border style",
						ref: "props.borderStyle",
						type: "string",
						component: "dropdown",
						options: [{
							label: "Dashed",
							value: "dashed"
						}, {
							label: "Dotted",
							value: "dotted"
						}, {
							label: "Double",
							value: "double"
						}, {
							label: "Groove",
							value: "groove"
						}, {
							label: "Inset",
							value: "inset"
						}, {
							label: "Outset",
							value: "outset"
						}, {
							label: "Ridge",
							value: "ridge"
						}, {
							label: "Solid",
							value: "solid"
						}],
						defaultValue: "solid"
					},
					borderRadius: {
						label: "Border radius",
						ref: "props.borderRadius",
						type: "number",
						component: "slider",
						min: 0,
						max: 100,
						step: 1,
						defaultValue: 0
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
						defaultValue: function() {
							return {
								index: -1,
								color: currTheme && currTheme.properties.dataColors ? currTheme.properties.dataColors.primaryColor : "#000000"
							};
						},
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
			return "About ".concat(JSON.parse(qext).title);
		},
		type: "items",
		items: {
			author: {
				label: "This Qlik Sense extension is developed by E-mergo.",
				component: "text"
			},
			version: {
				label: function() {
					return "Version: ".concat(JSON.parse(qext).version);
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
						window.open(window.requirejs.toUrl("extensions/qs-emergo-divider/docs/docs.html"), "_blank");
					});
				}
			}
		}
	};

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
		type: "items",
		component: "accordion",
		items: {
			appearance: appearance,
			about: about
		}
	};
});
