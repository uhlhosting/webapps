// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * 
 * @private
 */
AjxCookie = function() {
}

AjxCookie.prototype.toString = 
function() {
	return "AjxCookie";
}

AjxCookie.getCookie = 
function(doc, name) {
	var arg = name + "=";
	var alen = arg.length;
	var clen = doc.cookie.length;
	var cookie = doc.cookie;
	var i = 0;
	while (i < clen) {
		var j = i + alen;
		if (cookie.substring(i, j) == arg) {
			var endstr = cookie.indexOf (";", j);
			if (endstr == -1)
				endstr = cookie.length;
			return unescape(cookie.substring(j, endstr));
		}
		i = cookie.indexOf(" ", i) + 1;
		if (i == 0) 
			break; 
	}
  return null;
}

AjxCookie.setCookie = 
function(doc, name, value, expires, path, domain, secure) {
	doc.cookie = name + "=" + escape (value) +
		((expires) ? "; expires=" + expires.toGMTString() : "") +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") +
		((secure) ? "; secure" : "");
}

AjxCookie.deleteCookie = 
function (doc, name, path, domain) {
	doc.cookie = name + "=" +
	((path) ? "; path=" + path : "") +
	((domain) ? "; domain=" + domain : "") + "; expires=Fri, 31 Dec 1999 23:59:59 GMT";
}

AjxCookie.areCookiesEnabled = 
function (doc) {
	var name = "ZM_COOKIE_TEST";
	var value = "Zimbra";
	AjxCookie.setCookie(doc, name, value);
	var cookie = AjxCookie.getCookie(doc, name);
	AjxCookie.deleteCookie(doc, name);
	return cookie == value;
}

