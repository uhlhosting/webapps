// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only
 
/**
* @class ZaItemList a list of ZaItem {@link ZaItem} objects.
* @constructor
* @param constructor {Function) a reference to a constructor function which is called to create a single instance of an object contained in the list.
* @param app {ZaApp} {@link ZaApp} a reference to an instance of ZaApp. This reference is passed to constructor when a ZaItem object is constructed.
**/
ZaItemList = function(constructor) {

	//if (arguments.length == 0) return;
	ZaModel.call(this, true);
	if(constructor)
		this._constructor = constructor;

	this.loadedRights = false;
	this._vector = new ZaItemVector();
	this._idHash = new Object();
	this._targetIdHash = new Object();
}

ZaItemList.prototype = new ZaModel;
ZaItemList.prototype.constructor = ZaItemList;

ZaItemList.prototype.toString = 
function() {
	return "ZaItemList";
}

ZaItemList.prototype.replace =
function (item, index) {
	this._vector.replace(item, index);
	if (item.id) {
		this._idHash[item.id] = item;
	}
	if(item.attrs && item.attrs[ZaAlias.A_AliasTargetId]) {
		this._targetIdHash[item.attrs[ZaAlias.A_AliasTargetId]] = item;
	}
		
}

ZaItemList.prototype.replaceItem =
function (item) {
	if (item.id) {
		this._idHash[item.id] = item;
	}
	if(item.attrs && item.attrs[ZaAlias.A_AliasTargetId]) {
		this._targetIdHash[item.attrs[ZaAlias.A_AliasTargetId]] = item;
	}
	
}


/**
* Adds an item to the list.
*
* @param item	the item to add
* @param index	the index at which to add the item (defaults to end of list)
*/
ZaItemList.prototype.add = 
function(item, index) {
	this._vector.add(item, index);
	if (item.id) {
		this._idHash[item.id] = item;
	}
	if(item.attrs && item.attrs[ZaAlias.A_AliasTargetId]) {
		this._targetIdHash[item.attrs[ZaAlias.A_AliasTargetId]] = item;
	}
}

/**
* Removes an item from the list.
*
* @param item	the item to remove
*/
ZaItemList.prototype.remove = 
function(item) {
	this._vector.remove(item);
	if (item.id)
		delete this._idHash[item.id];
		
	if(item.attrs && item.attrs[ZaAlias.A_AliasTargetId] && this._targetIdHash[item.attrs[ZaAlias.A_AliasTargetId]]) {
		 delete this._targetIdHash[item.attrs[ZaAlias.A_AliasTargetId]];
	}
		
}

/**
* Returns the number of items in the list.
*/
ZaItemList.prototype.size = 
function() {
	return this._vector.size();
}

/**
* Returns the list as an array.
*/
ZaItemList.prototype.getArray =
function() {
	return this._vector.getArray();
}

/**
* Returns the list as a ZaItemVector.
*/
ZaItemList.prototype.getVector =
function() {
	return this._vector;
}

/**
* Returns the hash matching IDs to items.
*/
ZaItemList.prototype.getIdHash =
function() {
	return this._idHash;
}

/**
* Returns the item with the given ID.
*
* @param id		an item ID
*/
ZaItemList.prototype.getItemById =
function(id) {
	return this._idHash[id] ? this._idHash[id] : 
		this._targetIdHash[id] ? this._targetIdHash[id] : null;
}

/**
* Clears the list, including its ID hash.
*/
ZaItemList.prototype.clear =
function() {
	this._vector.removeAll();
	for (var id in this._idHash)
		this._idHash[id] = null;
	this._idHash = new Object();

	for (var id in this._targetIdHash)
		this._targetIdHash[id] = null;
	
	this._targetIdHash = null;
}

/**
* Populates the list with elements created from the response to a SOAP command. Each
* node in the response should represent an item of the list's type.
*
* @param respNode	an XML node whose children are item nodes
*/
ZaItemList.prototype.loadFromDom = 
function(respNode) {
	this.clear();
	var nodes = respNode.childNodes;
	for (var i = 0; i < nodes.length; i++) {
		var item;
		if(this._constructor) {
			item = new this._constructor();
		} else {
			item = ZaItem.getFromType(nodes[i].nodeName);
		}
		item.type = nodes[i].nodeName;
		item.initFromDom(nodes[i]);
		//add the list as change listener to the item
		this.add(item);
	}
}

/**
* Populates the list with elements created from the response to a SOAP command. 
* Each property of the resp parameter should contain properties of an item of the list' type.
* @param resp {Object} 
*/
ZaItemList.prototype.loadFromJS =
function(resp) {
	if(!resp)
		return;
	for(var ix in resp) {
		if(resp[ix] instanceof Array) {
			var arr = resp[ix];
			var len = arr.length;
			for(var i = 0; i < len; i++) {
				var item;
				if(this._constructor) {
					item = new this._constructor();
				} else {
					item = ZaItem.getFromType(ix);
				}
				item.type = ix;	
				item.initFromJS(arr[i]);
				
				//special cases
                /*
				if (item instanceof ZaDomain && item.attrs[ZaDomain.A_domainType] == "alias"){
					continue ;
				} */
				if (item instanceof ZaAlias) {
					item.attrs[ZaAlias.A_targetType] = arr[i][ZaAlias.A_targetType] ;
					item.attrs[ZaAlias.A_targetAccount] = arr[i][ZaAlias.A_targetAccount] ;
				}
				
				if(this._idHash[item.id]) {
					this._idHash[item.id].initFromJS(arr[i]);
				} else {
					this.add(item);								
				}
			}
		}  
	}
}

/**
* Grab the IDs out of a list of items, and return them as both a string and a hash.
**/
ZaItemList.prototype._getIds =
function(list) {
	var idHash = new Object();
	if (!(list && list.length))
		return idHash;
	var ids = new Array();
	for (var i = 0; i < list.length; i++) {
		var id = list[i].id;
		if (id) {
			ids.push(id);
			idHash[id] = list[i];
		}
	}
	idHash.string = ids.join(",");
	return idHash;
}
