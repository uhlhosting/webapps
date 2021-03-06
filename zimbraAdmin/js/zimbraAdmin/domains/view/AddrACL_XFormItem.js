// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* XFormItem class: _ADDR_ACL_
* this item is used in the Admin UI to display ACls for addresses (groups, accounts, etc)
* @class AddrACL_XFormItem
* @constructor AddrACL_XFormItem
* @author Greg Solovyev
**/
AddrACL_XFormItem = function() {}
XFormItemFactory.createItemType("_ADDR_ACL_", "addracl", AddrACL_XFormItem, Composite_XFormItem);
AddrACL_XFormItem.prototype.numCols = 5;
AddrACL_XFormItem.prototype.nowrap = true;
AddrACL_XFormItem.prototype.initializeItems = function() {
	var changeMethod = this.getInheritedProperty("onChange");
	
	if(changeMethod) {
		this.items[0].onChange = changeMethod;
		this.items[1].onChange = changeMethod;		
	} else {
		this.items[0].onChange = null;
		this.items[1].onChange = null;		
	}	
	
	var visibleBoxes = this.getInheritedProperty("visibleBoxes");
	if(visibleBoxes)
		this.items[1].visibleBoxes = visibleBoxes;
		
	var dataFetcherMethod = this.getInheritedProperty("dataFetcherMethod");
	if(dataFetcherMethod)
		this.items[0].dataFetcherMethod = dataFetcherMethod;
		
	var toolTipContent = this.getInheritedProperty("toolTipContent");
	if(toolTipContent)
		this.items[0].toolTipContent = toolTipContent;
		
	Composite_XFormItem.prototype.initializeItems.call(this);
}
AddrACL_XFormItem.prototype.items = [
	{type:_DYNSELECT_, width:"200px", inputSize:30, ref:"name", editable:true, forceUpdate:true,
		dataFetcherClass:ZaSearch,
		visibilityChecks:[],enableDisableChecks:[],
		emptyText:ZaMsg.enterSearchTerm, 
		elementChanged:function(val,instanceValue, event) {
			this.getForm().itemChanged(this, val, event);			
		}
	},
	{type:_ACL_, forceUpdate:true, ref:"acl", labelLocation:_NONE_, label:null}
];

/**
* XFormItem class: _STATIC_ADDR_ACL_
* this item is used in the Admin UI to display ACls for addresses (groups, accounts, etc) with address being read-only
* @class StaticAddrACL_XFormItem
* @constructor StaticAddrACL_XFormItem
* @author Greg Solovyev
**/
StaticAddrACL_XFormItem = function() {}
XFormItemFactory.createItemType("_STATIC_ADDR_ACL_", "staticaddracl", StaticAddrACL_XFormItem, Composite_XFormItem);
StaticAddrACL_XFormItem.prototype.numCols = 5;
StaticAddrACL_XFormItem.prototype.nowrap = true;
StaticAddrACL_XFormItem.prototype.initializeItems = function() {
	var changeMethod = this.getInheritedProperty("onChange");
	
	if(changeMethod) {
		this.items[0].onChange = changeMethod;
		this.items[1].onChange = changeMethod;		
	} else {
		this.items[0].onChange = null;
		this.items[1].onChange = null;		
	}	
	
	var visibleBoxes = this.getInheritedProperty("visibleBoxes");
	if(visibleBoxes)
		this.items[1].visibleBoxes = visibleBoxes;
		
	Composite_XFormItem.prototype.initializeItems.call(this);
}
StaticAddrACL_XFormItem.prototype.items = [
	{type:_OUTPUT_, width:"200px", ref:"name", 
		visibilityChecks:[],enableDisableChecks:[]
	},
	{type:_ACL_, forceUpdate:true, ref:"acl", labelLocation:_NONE_, label:null}
];
