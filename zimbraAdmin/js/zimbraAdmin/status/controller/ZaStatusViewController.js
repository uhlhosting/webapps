// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @class ZaStatusViewController 
* @contructor ZaStatusViewController
* @param appCtxt
* @param container
* @param app
* @author Roland Schemers
* @author Greg Solovyev
**/
ZaStatusViewController = function(appCtxt, container) {
	ZaController.call(this, appCtxt, container,"ZaStatusViewController");
	this._helpURL = ZaUtil.HELP_URL;
	this._helpButtonText = ZaMsg.helpEditDomains;
   	this._popupOperations = new Array();
	this._UICreated = false;	
}

ZaStatusViewController.prototype = new ZaController();
ZaStatusViewController.prototype.constructor = ZaStatusViewController;
ZaController.initToolbarMethods["ZaStatusViewController"] = new Array();
ZaController.initPopupMenuMethods["ZaStatusViewController"] = new Array();

ZaStatusViewController.prototype.show = function(openInNewTab) {
	try {
		this._createUI(openInNewTab);
		var statusObj = new ZaStatus();
		statusObj.load();
		var statusVector = statusObj.getStatusVector();
		this._contentView.set(statusVector);
		ZaApp.getInstance().pushView(this.getContentViewId());
		var now = new Date();
	} catch (ex) {
		this._handleException(ex, "ZaStatusViewController.prototype.show", null, false);
		return;
	}	
};

ZaStatusViewController.prototype.getAppBarAction =function () {
    if (AjxUtil.isEmpty(this._appbarOperation)) {
    	this._appbarOperation[ZaOperation.HELP]=new ZaOperation(ZaOperation.HELP,ZaMsg.TBB_Help, ZaMsg.TBB_Help_tt, "Help", "Help", new AjxListener(this, this._helpButtonListener));
    }

    return this._appbarOperation;
}

ZaStatusViewController.prototype.getAppBarOrder = function () {
    if (AjxUtil.isEmpty(this._appbarOrder)) {
    	this._appbarOrder.push(ZaOperation.HELP);
    }

    return this._appbarOrder;
}

ZaStatusViewController.prototype._createUI = function (openInNewTab) {
	try {
		var elements = new Object();
		this._contentView = new ZaServicesListView(this._container);
		this._initPopupMenu();
		if(this._popupOperations && this._popupOperations.length) {
			this._acctionMenu =  new ZaPopupMenu(this._contentView, "ActionMenu", null, this._popupOperations, ZaId.VIEW_STATUSLIST, ZaId.MENU_POP);
		}
		elements[ZaAppViewMgr.C_APP_CONTENT] = this._contentView;
		//ZaApp.getInstance().createView(ZaZimbraAdmin._STATUS, elements);
		ZaApp.getInstance().getAppViewMgr().createView(this.getContentViewId(), elements);
		this._UICreated = true;
		ZaApp.getInstance()._controllers[this.getContentViewId ()] = this ;
	} catch (ex) {
		this._handleException(ex, "ZaStatusViewController.prototype._createUI", null, false);
		return;
	}	
}

ZaStatusViewController.prototype.refreshListener = function () {
	this.show();
}

ZaStatusViewController.prototype._handleException =
function(ex, method, params, restartOnError, obj) {
	if (ex.code && ex.code == ZmCsfeException.SVC_AUTH_REQUIRED) {
		this.popupErrorDialog(ZaMsg.SERVER_ERROR, ex);
	} else {
		ZaController.prototype._handleException.call(this, ex, method, params, restartOnError, obj);
	}
}	
