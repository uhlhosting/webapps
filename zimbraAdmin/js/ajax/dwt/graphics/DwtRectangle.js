// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Creates a rectangle.
 * @constructor
 * @class
 * This class represents a rectangle. A point has an x-coordinate, y-coordinate, height and width.
 * 
 * @author Ross Dargahi
 * 
 * @param {number} x 	the x coordinate
 * @param {number} y 	the y coordinate
 * @param {number} width 	the width
 * @param {number} height 	the height
 */
DwtRectangle = function(x, y, width, height) {

	/**
	 * The x-coordinate.
	 * @type	number
	 */
	this.x = x;
	/**
	 * The y-coordinate.
	 * @type	number
	 */
	this.y = y;
	/**
	 * The width.
	 * @type	number
	 */
	this.width = width;
	/**
	 * The height.
	 * @type	number
	 */
	this.height = height;
}

/**
 * Returns a string representation of the object.
 * 
 * @return		{string}		a string representation of the object
 */
DwtRectangle.prototype.toString = 
function() {
	return "DwtRectangle";
}

/**
 * Sets the values of the rectangle.
 * 
 * @param {number} x 	the x coordinate
 * @param {number} y 	the y coordinate
 * @param {number} width 	the width
 * @param {number} height 	the height
 */
 DwtRectangle.prototype.set =
 function(x, y, width, height) {
 	this.x = x;
 	this.y = y;
 }
