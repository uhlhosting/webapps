// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @class ZaMigrationWizController 
* @contructor ZaMigrationWizController
* @param appCtxt
* @param container
* @param app
* @author Greg Solovyev
**/
ZaMigrationWizController = function(appCtxt, container) {

	ZaController.call(this, appCtxt, container, "ZaMigrationWizController");
	this.tabConstructor = ZaMigrationWizView;	
}

ZaMigrationWizController.prototype = new ZaController();
ZaMigrationWizController.prototype.constructor = ZaMigrationWizController;


ZaMigrationWizController.prototype.show = 
function(openInNewTab) {
    if (!this._contentView) {
		var elements = new Object();
		this._contentView = new this.tabConstructor(this._container);
		elements[ZaAppViewMgr.C_APP_CONTENT] = this._contentView;

        ZaApp.getInstance().getAppViewMgr().createView(this.getContentViewId(), elements) ;
		this._UICreated = true;
		ZaApp.getInstance()._controllers[this.getContentViewId ()] = this ;
	}
	//ZaApp.getInstance().pushView(ZaZimbraAdmin._MIGRATION_WIZ_VIEW);
	ZaApp.getInstance().pushView(this.getContentViewId());
	/*
	if (openInNewTab) {//when a ctrl shortcut is pressed
		
	}else{ //open in the main tab
		this.updateMainTab ("MigrationWiz", ZaMsg.Migration_wiz_title) ;	
	}*/
};
