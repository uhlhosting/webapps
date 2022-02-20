// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

// AjxVector class

/**
 * Creates a vector.
 * @class
 * This class represents a vector.
 * 
 */
AjxVector = function(array) {
	this._array = array || [];
};

AjxVector.prototype.isAjxVector = true;

/**
 * Returns a string representation of the object.
 * 
 * @param	{string}	sep		the seperator
 * @param	{boolean}	compress	if <code>true</code>, compress
 * 
 * @return	{string}	a string representation of the object
 */
AjxVector.prototype.toString =
function(sep, compress) {
	if (compress !== true)
		return this._array.join(sep);

	var a = new Array();
	for (var i = 0; i < this._array.length; i++) {
		var x = this._array[i];
		if  (x != undefined && x != null && x != "")
			a.push(x);
	}
	return a.join(sep);
};

/**
 * Creates a vector from a given array.
 * 
 * @param	{array}	list		an array
 * @return	{AjxVector}		the vector
 */
AjxVector.fromArray =
function(list) {
	var vec = new AjxVector();
	if (AjxUtil.isArray1(list)) {
		vec._array = list;
	}
	return vec;
};

/**
 * Gets the size of the vector.
 * 
 * @return	{number}	the size
 */
AjxVector.prototype.size =
function() {
	return this._array.length;
};

/**
 * Adds a object to the vector.
 * 
 * @param	{Object}	obj		the object
 * @param	{number}		index	the index where to add
 * @param	{boolean}	noDuplicates	if <code>true</code>, confirm the object is not in vector before adding
 */
AjxVector.prototype.add =
function(obj, index, noDuplicates) {
	// if no duplicates, search for the obj in list and return if found.
	if (noDuplicates && this.contains(obj)) {
		return;
	}

	AjxUtil.arrayAdd(this._array, obj, index);
};

/**
 * Adds the given array.
 * 
 * @param	{array}		list		an array
 */
AjxVector.prototype.addList =
function(list) {
	if (!list) return;

	if (list.length) {// array
		this._array = this._array.concat(list);
	} else if (list.size && list.size()) {// AjxVector
		// in new window, IE seems to lose its rtti :(
		if (AjxEnv.isIE && (!(list._array instanceof Array))) {
			var newList = [];
			for (var i = 0; i < list._array.length; i++) {
				newList.push(list._array[i]);
			}
			list._array = newList;
		}

		this._array = this._array.concat(list._array);
	}
};

/**
 * Removes the object.
 * 
 * @param	{Object}	obj		the object to remove
 * @return	{boolean}	<code>true</code> if the object is removed
 */
AjxVector.prototype.remove =
function(obj) {
	return AjxUtil.arrayRemove(this._array, obj);
};

/**
 * Removes the object at the given index.
 * 
 * @param	{number}	index		the index
 * @return	{Object}	the object at the index or <code>null</code> if no object at index
 */
AjxVector.prototype.removeAt =
function(index) {
	if (index >= this._array.length || index < 0)
		return null;

	var delArr = this._array.splice(index, 1);
	var ret = null;
	if (delArr) {
		ret = delArr[0];
	}
	return ret;
};

/**
 * Removes all objects from vector.
 * 
 */
AjxVector.prototype.removeAll =
function() {
	// Actually blow away the array items so that garbage
	// collection can take place (XXX: does this really force GC?)
	for (var i = 0; i < this._array.length; i++)
		this._array[i] = null;
	this._array.length = 0;
};

/**
 * Removes the last object in the vector.
 * 
 */
AjxVector.prototype.removeLast =
function() {
	return this._array.length > 0 ? this._array.pop() : null;
};

/**
 * Reverses the order of the objects in the vector.
 * 
 */
AjxVector.prototype.reverse =
function() {
	this._array.reverse();
};

/**
 * Replaces the object at a given index.
 * 
 * @param	{number}	index		the index
 * @param	{Object}	newObj	the new object
 * @return	{Object}	the old object
 */
AjxVector.prototype.replace =
function(index, newObj) {
	var oldObj = this._array[index];
	this._array[index] = newObj;
	return oldObj;
};

/**
 * Replaces an object.
 * 
 * @param	{Object}	obj		the object to replace
 * @param	{Object}	newObj	the new object
 * @return	{Object}	the replaced object or <code>null</code> if not replaced
 */
AjxVector.prototype.replaceObject =
function(obj, newObj) {
	for (var i = 0; i < this._array.length; i++) {
		if (this._array[i] == obj) {
			this._array[i] = newObj;
			return obj;
		}
	}
	return null;
};

/**
 * Returns the index of the obj given w/in vector
 *
 * @param {Object}	    obj			the object being looked for
 * @param {function}	func	    (optional) a function for transforming objects
 *
 * @return	{number}	the index or -1 if not found
 */
AjxVector.prototype.indexOf = function(obj, func) {

	if (obj == null) {
		return -1;
	}
    obj = func ? func.call(obj) : obj;

	for (var i = 0; i < this._array.length; i++) {
        var member = this._array[i],
            test = func ? func.call(member) : member;
		if (test === obj) {
			return i;
		}
	}
	return -1;
};

AjxVector.prototype.indexOfLike = AjxVector.prototype.indexOf;

/**
 * Returns the last index of the obj given w/in vector
 *
 * @param {Object}	    obj			the object being looked for
 * @param {function}	func	    (optional) a function for transforming objects
 *
 * @return	{number}	the index or -1 if not found
 */
AjxVector.prototype.lastIndexOf = function(obj, func) {

	if (obj == null) {
		return -1;
	}
    obj = func ? func.call(obj) : obj;

	for (var i = this._array.length - 1; i >= 0; i--) {
        var member = this._array[i],
            test = func ? func.call(member) : member;
		if (member === obj) {
			return i;
		}
	}
	return -1;
};

AjxVector.prototype.lastIndexOfLike = AjxVector.prototype.lastIndexOf;

/**
 * Returns the last index of the obj given w/in vector
 *
 * @param {Object}	obj			the object being looked for
 * @param {function}	keyFunc	a function for transforming objects
 * @return	{number}	the index or -1 if not found
 */
AjxVector.prototype.lastIndexOfLike =
function(obj, keyFunc) {
	var value = keyFunc.call(obj);

	for (var i = this._array.length - 1; i >= 0; i--) {
		var test = keyFunc.call(this._array[i]);
		if (test == value)
			return i;
	}
	return -1;
};

/**
 * Clones the vector.
 * 
 * @return	{AjxVector}	the new vector
 */
AjxVector.prototype.clone =
function() {
	var vec = new AjxVector();
	vec.addList(this);
	return vec;
};

/**
 * Checks if the vector contains an object.
 * 
 * @param	{Object}	obj		the object
 * @return	{boolean}	<code>true</code> if the object is found
 */
AjxVector.prototype.contains =
function(obj) {
	return AjxUtil.arrayContains(this._array, obj);
};


/**
 * Returns true if the vector contains the given object, using the given
 * function to compare objects. The comparison function should return a
 * type for which the equality test (==) is meaningful, such as a string
 * or a base type.
 *
 * @param {Object}	obj			the object being looked for
 * @param {function}	keyFunc	a function for transforming objects
 * @return	{boolean}	<code>true</code> if the object is found
 */
AjxVector.prototype.containsLike =
function(obj, keyFunc) {
	var value = keyFunc.call(obj);
	for (var i = 0; i < this._array.length; i++) {
		var test = keyFunc.call(this._array[i]);
		if (test == value)
			return true;
	}
	return false;
};

/**
 * Gets the object at a given index.
 * 
 * @param	{number}	index		the index
 * @return	{Object}	the object or <code>null</code> if not found
 */
AjxVector.prototype.get =
function(index) {
	return index >= this._array.length || index < 0
		? null : this._array[index];
};

/**
 * Gets an array of the vector.
 * 
 * @return	{array}	an array
 */
AjxVector.prototype.getArray =
function() {
	return this._array;
};

/**
 * Gets the last object in the vector.
 * 
 * @return	{Object}	the object or <code>null</code> if vector is empty
 */
AjxVector.prototype.getLast =
function() {
	return this._array.length == 0
		? null : this._array[this._array.length-1];
};

/**
 * Gets the next object in the vector after a given object.
 * 
 * @param	{Object}	obj		the object
 * @return	{Object}	the object or <code>null</code> if object not found
 */
AjxVector.prototype.getNext =
function(obj) {
	var idx = this.indexOf(obj);
	if (idx == -1)
		return null;
	return this.get(++idx);
};

/**
 * Gets the previous object in the vector before a given object.
 * 
 * @param	{Object}	obj		the object
 * @return	{Object}	the object or <code>null</code> if object not found
 */
AjxVector.prototype.getPrev =
function(obj) {
	var idx = this.indexOf(obj);
	if (idx == -1)
		return null;
	return this.get(--idx);
};

/**
 * Sorts the vector.
 * 
 * @param	{function}	sortFunc		the function
 */
AjxVector.prototype.sort =
function(sortFunc) {
	if (!sortFunc) {
		sortFunc = AjxVector._defaultArrayComparator;
	}
	this._array.sort(sortFunc);
};

/**
 * Performs a binary search.
 * 
 * @param	{Object}	valueToFind		the value
 * @param	{function}	sortFunc		the sort function
 * @return	{number}	the index
 */
AjxVector.prototype.binarySearch =
function(valueToFind, sortFunc) {
	if (!sortFunc) {
		sortFunc = AjxVector._defaultArrayComparator;
	}

	var l = 0;
	var arr = this._array;
	var u = arr.length - 1;

	while(true) {
		if (u < l) {
			return -1;
		}

		var i = Math.floor((l + u)/ 2);
		var comparisonResult = sortFunc(valueToFind, arr[i]);

		if (comparisonResult < 0) {
			u = i - 1;
		} else if (comparisonResult > 0) {
			l = i + 1;
		} else {
			return i;
		}
	}
};

AjxVector.prototype.merge =
function(offset, list) {

	if (offset < 0)
		return;

	var rawList = list instanceof AjxVector ? list.getArray() : list;

	var limit = this._array.length < (offset+rawList.length)
		? this._array.length
		: offset+rawList.length;

	if (offset < this._array.length) {
		// replace any overlapping items in vector
		var count = 0;
		for (var i=offset; i<limit; i++)
			this._array[i] = rawList[count++];

		// and append the rest
		if (count < rawList.length)
			this._array = this._array.concat(rawList.slice(count));
	} else {
		// otherwise, just append the raw list to the end
		this._array = this._array.concat(rawList);
	}
};


// Static methods

AjxVector._defaultArrayComparator =
function(a, b) {
	return a < b ? -1 : (a > b ? 1 : 0);
};

// Apply function f for each element of the array.  Optionally call it
// in the context of obj object.  If "f" is a string, then for each
// non-null array element call its "f" member function.
AjxVector.prototype.foreach = function(f, obj) {
	var l = this.size(), i = 0, el;
	if (typeof f == "function") {
		while (--l >= 0)
			f.call(obj, this.get(i), i++);
	} else {
		while (--l >= 0) {
			el = this.get(i++);
			if (el != null)
				el[f].call(el); // assuming function
		}
	}
};

/**
 * Return a new AjxVector which contains the results of calling f
 * (optionally in the context obj) for each element of this array.
 * <ul>
 * <li>If "f" is a string, then for each element el:
 * <ul>
 * <li>if el[f] is a function, call el[f] and push the result in the returned array.</li>
 * <li>otherwise push el[f]</li>
 * </ul>
 * </li>
 * </ul>
 * 
 * @param	{function}	f 	the function
 * @param	{Object}	obj		the obj context
 * @return	{AjxVector}		the resulting vector
 */
AjxVector.prototype.map = function(f, obj) {
	var a = [], i = this.size(), el;
	if (typeof f == "function") {
		while (--i >= 0)
			a[i] = f.call(obj, this.get(i), i);
	} else if (f instanceof AjxCallback) {
		while (--i >= 0)
			a[i] = f.run(this.get(i), i);
	} else {
		while (--i >= 0) {
			el = this.get(i);
			if (el != null) {
				if (typeof el[f] == "function")
					a.unshift(el[f].call(el));
				else
					a.unshift(el[f]);
			}
		}
	}
	return AjxVector.fromArray(a);
};

/**
 * Returns an AjxVector with all the members of the given array for which the
 * filtering function returns true.
 *
 * @param {Function}    func        filtering function
 * @param {Object}      context     scope for filtering function
 *
 * @returns {Array} array of members for which the filtering function returns true
 */
AjxVector.prototype.filter = function(func, context) {
	return AjxVector.fromArray(AjxUtil.filter(this._array, func, context));
};

/**
 * Joins the vector.
 * 
 * @param	{string}	sep		the string separator
 * @return	{string}	a string representation of the vector
 */
AjxVector.prototype.join = function(sep) {
	return this._array.join(sep);
};

/**
 * Return true if the given function returns true for a member of this vector,
 * otherwise false.
 *
 * @param	{function}	f 	the function
 * @param	{Object}	obj		the obj context
*/
AjxVector.prototype.some =
function(f, obj) {
	return this._array.some(f, obj);
};


/**
 * Return a new AjxVector containing the elements from this vector
 * except those for which f(el) returns true.  Otherwise said,
 * "SUBtracts" from this vector those elements for which f(el) returns true.
 *
 * @param	{function}	f 	the function
 * @param	{Object}	obj		the obj context
 * @return	{AjxVector}		the resulting vector
 */
AjxVector.prototype.sub = function(f, obj) {
	var a = [], l = this.size(), i = 0, el;
	while (--l >= 0) {
		el = this.get(i++);
		if (!f.call(obj, el, i))
			a.push(el);
	}
	return AjxVector.fromArray(a);
};

AjxVector.prototype.slice =
function(start, end) {
	return AjxVector.fromArray(this._array.slice(start, end));
};
