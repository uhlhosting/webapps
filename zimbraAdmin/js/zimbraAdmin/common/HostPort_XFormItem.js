// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* XFormItem class: HOST PORT
* this item is used in the Admin UI to display Host name fields like Relay MTA host
* @class HostPort_XFormItem
* @constructor HostPort_XFormItem
* @author Greg Solovyev
**/
HostPort_XFormItem = function() {}
XFormItemFactory.createItemType("_HOSTPORT_", "hostport", HostPort_XFormItem, Composite_XFormItem);
HostPort_XFormItem.prototype.numCols = 3;
HostPort_XFormItem.prototype.nowrap = true;
HostPort_XFormItem.prototype._serverPart = "";
HostPort_XFormItem.prototype._portPart = "";

HostPort_XFormItem.prototype.items = [
	{type:_TEXTFIELD_, width:"200px", forceUpdate:true, ref:".", labelLocation:_NONE_, label:null,
		visibilityChecks:[],enableDisableChecks:[],
		required:true,
		getDisplayValue:function (itemVal) {
			var val = "";
			if(itemVal) {
				var URLChunks = itemVal.split(":");
				if(URLChunks.length >= 2) {
					val = URLChunks[0];
				} else {
					val = itemVal;
				}
				this.getParentItem()._serverPart = val;
			} 
			return val;	
		},
		elementChanged:function(serverPart, instanceValue, event) {
			this.getParentItem()._serverPart = serverPart;
			var val = "";
			if(serverPart) {
				val = serverPart;
			}
			if(this.getParentItem()._portPart) {
				val += ":";
				val += this.getParentItem()._portPart;				
			}
			this.getForm().itemChanged(this.getParentItem(), val, event);
		},
		onClick: "Super_HostPort_XFormItem.handleClick",
		onMouseout: "Super_HostPort_XFormItem.handleMouseout"
	},
	{type:_OUTPUT_, width:"5px", labelLocation:_NONE_, label:null,value:":"},
	{type:_TEXTFIELD_,width:"40px",forceUpdate:true, ref:".", labelLocation:_NONE_, label:null,
		visibilityChecks:[],enableDisableChecks:[],
		getDisplayValue:function (itemVal) {
			var val = "";
			if(itemVal) {
				var URLChunks = itemVal.split(":");
				if(URLChunks.length == 2) {
					val = URLChunks[1];
				} else {
					val = "";
				}
				this.getParentItem()._portPart = val;
			} 
			return val;	
		},
		elementChanged:function(portPart, instanceValue, event) {
			this.getParentItem()._portPart = portPart;
			var val = "";
			if(this.getParentItem()._serverPart) {
				val = this.getParentItem()._serverPart;
			}
			if(portPart) {
				val +=":";
				val+=portPart;
			}
			this.getForm().itemChanged(this.getParentItem(), val, event);
		}
	}
];
