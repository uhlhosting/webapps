// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * 
 * @private
 */
DwtKeyEvent = function() {
	DwtUiEvent.call(this, true);
	this.reset(true);
};

DwtKeyEvent.prototype.toString = function() { return "DwtKeyEvent"; }
DwtKeyEvent.prototype.isDwtKeyEvent = true;

// Constants for key codes
DwtKeyEvent.KEY_END_OF_TEXT     = 3;      // Enter key on Mac
DwtKeyEvent.KEY_BACKSPACE       = 8;
DwtKeyEvent.KEY_TAB             = 9;
DwtKeyEvent.KEY_RETURN          = 13;
DwtKeyEvent.KEY_ENTER           = DwtKeyEvent.KEY_RETURN;
DwtKeyEvent.KEY_ESCAPE          = 27;
DwtKeyEvent.KEY_SPACE           = 32;
DwtKeyEvent.KEY_ARROW_LEFT      = 37;
DwtKeyEvent.KEY_ARROW_UP        = 38;
DwtKeyEvent.KEY_ARROW_RIGHT     = 39;
DwtKeyEvent.KEY_ARROW_DOWN      = 40;
DwtKeyEvent.KEY_DELETE          = 46;
DwtKeyEvent.KEY_SEMICOLON       = 59;
DwtKeyEvent.KEY_SEMICOLON_1     = 186;
DwtKeyEvent.KEY_COMMA           = 188;
DwtKeyEvent.KEY_COMMAND         = 224;  // Mac FF

// Easy way to check for 3 or 13
DwtKeyEvent.IS_RETURN = {};
DwtKeyEvent.IS_RETURN[ DwtKeyEvent.KEY_END_OF_TEXT ]    = true;
DwtKeyEvent.IS_RETURN[ DwtKeyEvent.KEY_RETURN ]         = true;

// FF on Mac reports keyCode of 0 for many shifted keys
DwtKeyEvent.MAC_FF_CODE = {};
DwtKeyEvent.MAC_FF_CODE["~"] = 192;
DwtKeyEvent.MAC_FF_CODE["!"] = 49;
DwtKeyEvent.MAC_FF_CODE["@"] = 50;
DwtKeyEvent.MAC_FF_CODE["#"] = 51;
DwtKeyEvent.MAC_FF_CODE["$"] = 52;
DwtKeyEvent.MAC_FF_CODE["%"] = 53;
DwtKeyEvent.MAC_FF_CODE["^"] = 54;
DwtKeyEvent.MAC_FF_CODE["&"] = 55;
DwtKeyEvent.MAC_FF_CODE["*"] = 56;
DwtKeyEvent.MAC_FF_CODE["("] = 57;
DwtKeyEvent.MAC_FF_CODE[")"] = 48;
DwtKeyEvent.MAC_FF_CODE["-"] = 189;
DwtKeyEvent.MAC_FF_CODE["_"] = 189;
DwtKeyEvent.MAC_FF_CODE["+"] = 187;
DwtKeyEvent.MAC_FF_CODE["|"] = 220;
DwtKeyEvent.MAC_FF_CODE[":"] = 186;
DwtKeyEvent.MAC_FF_CODE["<"] = 188;
DwtKeyEvent.MAC_FF_CODE[">"] = 190;
DwtKeyEvent.MAC_FF_CODE["?"] = 191;

DwtKeyEvent.prototype = new DwtUiEvent;
DwtKeyEvent.prototype.constructor = DwtKeyEvent;


DwtKeyEvent.isKeyEvent =
function(ev) {
	return ev.type && ev.type.search(/^key/i) != -1;
}

DwtKeyEvent.isKeyPressEvent =
function(ev) {
	return (AjxEnv.isIE && ev.type == "keydown") || (ev.type == "keypress");
}

DwtKeyEvent.prototype.reset =
function(dontCallParent) {
	if (!dontCallParent)
		DwtUiEvent.prototype.reset.call(this);
	this.keyCode = 0;
	this.charCode = 0;
}

DwtKeyEvent.prototype.isCommand =
function(ev) {
	return AjxEnv.isMac && this.metaKey || this.ctrlKey;
}

DwtKeyEvent.prototype.setFromDhtmlEvent =
function(ev, obj) {
	ev = DwtUiEvent.prototype.setFromDhtmlEvent.apply(this, arguments);
	if (!ev) { return; }
	this.charCode = ev.charCode || ev.keyCode;
	this.keyCode = ev.keyCode;
}

/**
 * Simple function to return key code from a key event. The code is in keyCode for keydown/keyup.
 * Gecko puts it in charCode for keypress.
 */
DwtKeyEvent.getCharCode =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var key = AjxEnv.isSafari ? ev.keyCode : (ev.charCode || ev.keyCode);
	if (key == 0 && AjxEnv.isMac && AjxEnv.isGeckoBased && ev.type == "keyup" && DwtKeyEvent._geckoCode) {
		// if Mac Gecko, return keyCode saved from keypress event
		key = DwtKeyEvent._geckoCode;
		DwtKeyEvent._geckoCode = null;
	}
	return key;
}

DwtKeyEvent.copy =
function(dest, src) {
	DwtUiEvent.copy(dest, src);
	dest.charCode = src.charCode;
	dest.keyCode = src.keyCode;
}

/**
 * Workaround for the bug where Mac Gecko returns a keycode of 0 for many shifted chars for
 * keydown and keyup. Since it returns a char code for keypress, we save it so that the
 * ensuing keyup can pick it up.
 *
 * FF2 returns keycode 0 for: ~ ! @ # $ % ^ & * ( ) - _ + | : < > ? Alt-anything
 * FF3 returns keycode 0 for: ~ _ | : < > ?
 *
 * FF2 returns incorrect keycode for Ctrl plus any of: 1 2 3 4 5 6 7 8 9 0 ; ' , . /
 *
 * https://bugzilla.mozilla.org/show_bug.cgi?id=448434
 *
 * @param ev
 */
DwtKeyEvent.geckoCheck =
function(ev) {

	ev = DwtUiEvent.getEvent(ev);
	if (ev.type == "keypress") {
		DwtKeyEvent._geckoCode = null;
		if (AjxEnv.isMac && AjxEnv.isGeckoBased) {
			var ch = String.fromCharCode(ev.charCode);
			DwtKeyEvent._geckoCode = DwtKeyEvent.MAC_FF_CODE[ch];
		}
	}
};
