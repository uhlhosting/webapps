// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Creates an exception.
 * @constructor
 * @class
 * This is the base class for all exceptions in the Zimbra Ajax Toolkit.
 * 
 * @author Ross Dargahi
 * 
 * @param {string} 		[msg]		the human readable message
 * @param {constant} 	[code]	any error or fault code
 * @param {string} 		[method] 	the name of the method throwing the exception
 * @param {string} 		[detail]		any additional detail
 */
AjxException = function(msg, code, method, detail) {

	if (arguments.length == 0) { return; }
	
	/** 
	 * Human readable message, if applicable.
	 */
	this.msg = msg;
	
	/** 
	 * Error or fault code, if applicable.
	 */
	this.code = code;
	
	/**
	 * Name of the method throwing the exception, if applicable.
	 */
	this.method = method;
	
	/**
	 * Any additional detail.
	 */
	this.detail = detail;
};

/**
 * Returns a string representation of the object.
 * 
 * @return		{string}		a string representation of the object
 */
AjxException.prototype.toString = 
function() {
	return "AjxException";
};

/**
 * Dumps the exception.
 * 
 * @return {string}	the state of the exception
 */
AjxException.prototype.dump = 
function() {
	return "AjxException: msg=" + this.msg + " code=" + this.code + " method=" + this.method + " detail=" + this.detail;
};

/**
 * Invalid parent exception code.
 */
AjxException.INVALIDPARENT 			= "AjxException.INVALIDPARENT";

/**
 * Invalid operation exception code.
 */
AjxException.INVALID_OP 			= "AjxException.INVALID_OP";

/**
 * Internal error exception code.
 */
AjxException.INTERNAL_ERROR 		= "AjxException.INTERNAL_ERROR";

/**
 * Invalid parameter to method/operation exception code.
 */
AjxException.INVALID_PARAM 			= "AjxException.INVALID_PARAM";

/**
 * Unimplemented method called exception code.
 */
AjxException.UNIMPLEMENTED_METHOD 	= "AjxException.UNIMPLEMENTED_METHOD";

/**
 * Network error exception code.
 */
AjxException.NETWORK_ERROR 			= "AjxException.NETWORK_ERROR";

/**
 * Out or RPC cache exception code.
 */
AjxException.OUT_OF_RPC_CACHE		= "AjxException.OUT_OF_RPC_CACHE";

/**
 * Unsupported operation code.
 */
AjxException.UNSUPPORTED 			= "AjxException.UNSUPPORTED";

/**
 * Unknown error exception code.
 */
AjxException.UNKNOWN_ERROR 			= "AjxException.UNKNOWN_ERROR";

/**
 * Operation canceled exception code.
 */
AjxException.CANCELED				= "AjxException.CANCELED";

AjxException.defaultScriptErrorHandler =
function(ex) {
	alert(ex);
};

AjxException.setScriptErrorHandler =
function(func) {
	AjxException.scriptErrorHandler = func;
};

AjxException.reportScriptError =
function(ex) {
	if (AjxException.reportScriptErrors && AjxException.scriptErrorHandler && !(ex instanceof AjxException)) {
		AjxException.scriptErrorHandler(ex);
	}
	throw ex;
};

AjxException.reportScriptErrors = false;
AjxException.scriptErrorHandler = AjxException.defaultScriptErrorHandler;
