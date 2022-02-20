// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

ZaSplashScreen =function(parent) {
    var className = "LoginScreen";
    DwtComposite.call(this, {parent:parent, className:className, posStyle:DwtControl.ABSOLUTE_STYLE});
    this._origClassName = className;
    this._xparentClassName = className + "-Transparent";
    this.setBounds(0, 0, "100%", "100%");
    var htmlElement = this.getHtmlElement();
    htmlElement.style.zIndex = Dwt.Z_SPLASH;
    htmlElement.className = className;
    this.setVisible(false);
    
	var params = ZLoginFactory.copyDefaultParams(ZaMsg);
	params.showPanelBorder = true;
	params.showForm = true;
	params.showUserField =false ;
	params.showPasswordField = false;
	params.showRememberMeCheckbox = false;
	params.showLogOff = false;
	params.showButton = false;
    params.showLoading = true ;
    params.companyURL = ZaAppCtxt.getLogoURI () ;
    params.copyrightText = ZaItem.getSplashScreenCopyright();
    params.clientLevelNotice = ZabMsg.clientLevelNotice ? ZabMsg.clientLevelNotice :"";
    var html = ZLoginFactory.getLoginDialogHTML(params);
	this.setContent(html);
}

ZaSplashScreen.prototype = new DwtComposite;
ZaSplashScreen.prototype.constructor = ZaSplashScreen;
ZaSplashScreen.prototype.toString = 
function() {
	return "ZaSplashScreen";
}
