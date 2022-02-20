// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Default constructor.
 * @constructor
 * @class
 * This is a static class that defines a number of constants and helper methods that
 * support the working with CSS.
 * 
 * @author Ross Dargahi
 * 
 * @private
 */
DwtCssStyle = function() {
}

// Common class name constants used in Dwt

/**
 * "mouseOver": transitory state while mouse is over the item.
 */
DwtCssStyle.HOVER = "hover";

/**
 * "mouseDown": transitory state while left mouse button is being pressed on the item.
 */
DwtCssStyle.ACTIVE = "active";

/**
 * item is "on", (for example: selected tab, select item(s) in list, or button that stays depressed).
 */
DwtCssStyle.SELECTED = "selected";

/**
 * Currently used for item that is currently viewed, but not selected (other checkboxes are checked, or a right click action is on a different item).
 */
DwtCssStyle.ALT_SELECTED = "altSelected";

/**
 * "disabled": item is not actionable (for example: because not appropriate or some other condition needs to be true).
 */
DwtCssStyle.DISABLED = "disabled";

/**
 * "focused": item has keyboard focus.
 */
DwtCssStyle.FOCUSED = "focused";

/**
 * UI component is target of some external action, for example:
 * <ul>
 * <li>item is the target of right-click (for example: show menu)</li>
 * <li>item is the thing being dragged</li>
 * </ul>
 */
DwtCssStyle.ACTIONED = "actioned";

/**
 * Matched item in a list (for example: in conv list view, items that match the search. NOT used if *all* items match the search).
 */
DwtCssStyle.MATCHED	 = "matched";

/**
 * UI component is the current, valid drop target.
 */
DwtCssStyle.DRAG_OVER = "dragOver";

/**
 * Item being dragged is over a valid drop target.
 */
DwtCssStyle.DROPPABLE = "droppable";

/**
 * Item being dragged is NOT over a valid drop target.
 */
DwtCssStyle.NOT_DROPPABLE = "notDroppable";

/**
 * Represents of an item *as it is being dragged* (for example: thing moving around the screen).
 */
DwtCssStyle.DRAG_PROXY = "dragProxy";

/**
 * Class applies only to linux browsers.
 */
DwtCssStyle.LINUX = "linux";


DwtCssStyle.getProperty = 
function(htmlElement, cssPropName) {
	var doc = htmlElement.ownerDocument;

	if (window.getComputedStyle) {
		var cssDecl = window.getComputedStyle(htmlElement, null);
		if (cssDecl && cssDecl.length > 0) { //on Chrome/Safari it returns cssDecl with length 0 for some elements for some reason. (a wild guess could be invisible items, as it happens with invite toolbar when it's invisible) So in that case fall back on the other ways.
			return cssDecl.getPropertyValue(cssPropName);
		}
	}
	
	// Convert CSS -> DOM name for IE etc
	var tokens = cssPropName.split("-");
	// Shift one word off the array and capitalize the rest
	var propName = tokens.shift() + AjxUtil.map(tokens, AjxStringUtil.capitalize).join("");

	if (htmlElement.currentStyle) {
		return htmlElement.currentStyle[propName];
	} else if (htmlElement.style) {
		return htmlElement.style[propName];
	}
};

DwtCssStyle.getComputedStyleObject = 
function(htmlElement) {
	var doc = htmlElement.ownerDocument;
	
	if (window.getComputedStyle) {
		var style = window.getComputedStyle(htmlElement, null);
		if (!style && htmlElement.style) {
// TODO: destructive ?
			htmlElement.style.display = "";
			style = window.getComputedStyle(htmlElement, null);
		}
		return style || {};
	} else if (htmlElement.currentStyle)
		return htmlElement.currentStyle;
	else if (htmlElement.style)
		return htmlElement.style;
};

DwtCssStyle.removeProperty = function(el, prop) {
	if (prop instanceof Array) {
		for (var i = prop.length; --i >= 0;)
			DwtCssStyle.removeProperty(el, prop[i]);
	} else {
		if (AjxEnv.isIE) {
			el.style.removeAttribute(prop, true);
		} else {
			prop = prop.replace(/([A-Z])/g, "-$1");
			el.style.removeProperty(prop);
		}
	}
};

/**
 * Adds a rule to a stylesheet.
 * 
 * @param {StyleSheet}	stylesheet		a CSS stylesheet
 * @param {string}		selector		rule selector
 * @param {string}		declaration		styles
 * @param {string}		index			insertion index (optional)
 * 
 * @return	index at which rule was inserted (for later removal)
 */
DwtCssStyle.addRule =
function(stylesheet, selector, declaration, index) {
	if (stylesheet.addRule) {	// IE
		//if index is not specified insert at the end so that new rule takes precedence
		index = index || (stylesheet.rules.length);
		stylesheet.addRule(selector, declaration, index);
	}
	else {
		//if index is not specified insert at the end so that new rule takes precedence
		index = index || (stylesheet.cssRules.length);
		stylesheet.insertRule(selector + "{" + declaration + "}", index);
	}
	return index;
};

/**
 * Removes the rule at the given index.
 * 
 * @param {StyleSheet}	stylesheet		a CSS stylesheet
 * @param {string}		index			insertion index (optional)
 */
DwtCssStyle.removeRule =
function(stylesheet, index) {
	if (stylesheet.removeRule) {	// IE
		stylesheet.removeRule(index);
	}
	else {
		stylesheet.deleteRule(index);
	}
};

DwtCssStyle.__PIXEL_RE = /^(-?[0-9]+(?:\.[0-9]*)?)px$/;
DwtCssStyle.__DIMENSION_RE = /^(-?[0-9]+(?:\.[0-9]*)?)([a-z]*|%)$/;
DwtCssStyle.__NUMBER_RE = /^(-?[0-9]+(?:\.[0-9]*)?)+$/

/**
 * Obtain the font size of the root element in pixels.
 */
DwtCssStyle.__getRootFontSize = function() {

	var fontsize = DwtCssStyle.getProperty(document.documentElement, 'font-size');

	if (!DwtCssStyle.__PIXEL_RE.test(fontsize)) {
		DBG.println(AjxDebug.DBG1, 'font size of root element is not in pixels!');
		return -1;
	}

	return parseInt(fontsize);
};

/**
 * Convert a CSS value to a pixel count; unhandled units raise an error.
 *
 * @param   {String}    val     a font size value in some form
 *
 * @return  {Number}    the size in pixels, or -1 if there is an error
 */
DwtCssStyle.asPixelCount = function(val) {

	if (!val) {
		DBG.println(AjxDebug.DBG1, 'DwtCssStyle.asPixelCount: missing argument');
		return -1;
	}

	var dimension, unit, match;

	// assume pixels if no unit is specified
	if (typeof val === 'number' || DwtCssStyle.__NUMBER_RE.test(val)) {
		dimension = Number(val);
		unit = 'px';
	} else if ((match = DwtCssStyle.__DIMENSION_RE.exec(val))) {
		dimension = Number(match[1]);
		unit = match[2];
	} else {
		DBG.println(AjxDebug.DBG1, 'DwtCssStyle.asPixelCount: unsupported argument: ' + val);
		return -1;
	}

	switch (unit) {
		case 'rem': {
			var rootFontSize = DwtCssStyle.__getRootFontSize();
			return rootFontSize !== -1 ? dimension * rootFontSize : -1;
		}

		// see http://www.w3.org/TR/css3-values/#absolute-lengths
		case 'mm': {
			dimension /= 10;
		}

		case 'cm': {
			dimension /= 2.54;
		}

		case 'in': {
			dimension *= 6;
		}

		case 'pc': {
			dimension *= 12;
		}

		case 'pt': {
			dimension /= 0.75;
		}

		case 'px': {
			return dimension;
		}

		case 'ch':
		case 'em':
		case 'ex': {
			DBG.println(AjxDebug.DBG1, 'DwtCssStyle.asPixelCount: cannot convert context-dependent CSS unit ' + unit);
			return -1;
		}

		default: {
			DBG.println(AjxDebug.DBG1, 'DwtCssStyle.asPixelCount: unrecognized CSS unit ' + unit);
			return -1;
		}
	}
};
