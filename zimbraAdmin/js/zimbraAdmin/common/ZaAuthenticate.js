// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

ZaAuthenticate = function(appCtxt) {
    if (arguments.length == 0) return;
    this._appCtxt = appCtxt;
    this.uname = "";
}


ZaAuthenticate.processResponseMethods = new Array();

ZaAuthenticate.prototype.toString = 
function() {
    return "ZaAuthenticate";
}

ZaAuthenticate.prototype.changePassword = 
function (uname,oldPass,newPass,callback) {
    var soapDoc = AjxSoapDoc.create("ChangePasswordRequest", "urn:zimbraAccount");
    var el = soapDoc.set("account", uname);
    el.setAttribute("by", "name");
    soapDoc.set("oldPassword", oldPass);
    soapDoc.set("password", newPass);

    var command = new ZmCsfeCommand();
    var params = new Object();
    params.soapDoc = soapDoc;    
    params.asyncMode = true;
    params.noAuthToken=true;
    params.callback = callback;
    command.invoke(params);    
}

ZaAuthenticate.prototype.execute =
function (uname, pword, callback, twoFactorCode, trustedDevice) {
    var soapDoc = AjxSoapDoc.create("AuthRequest", ZaZimbraAdmin.URN, null);
    this.uname = uname;
    var params = new Object();
    params.noAuthToken=true;
    params.ignoreAuthToken = true;
    if(uname && pword) {
        soapDoc.set("name", uname);
        soapDoc.set("password", pword);
    } else {
        soapDoc.getMethod().setAttribute("refresh", "1");
    }
    if(twoFactorCode) {
        soapDoc.set("twoFactorCode", twoFactorCode);
    }
    if(trustedDevice) {
        soapDoc.set("trustedDevice", trustedDevice);
    }
    soapDoc.set("virtualHost", location.hostname);
    soapDoc.set("csrfTokenSecured", 1);
    var command = new ZmCsfeCommand();
    params.soapDoc = soapDoc;
    params.asyncMode = true;
    params.skipExpiredToken = true;
    params.callback = callback;
    command.invoke(params);
}