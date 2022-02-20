// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only


/**
 * Creates and loads a key map.
 * @constructor
 * @class
 * This class provides the basic keyboard mappings for {@link Dwt} components. The
 * key bindings are taken from the class AjxKeys, which is populated from a
 * properties file. The identifiers used in the properties file must match
 * those used here.
 * 
 * @author Ross Dargahi
 * 
 * @param	{boolean}		subclassInit		if <code>true</code>, the sub-class will initialize
 * 
 */
DwtKeyMap = function(subclassInit) {
	if (subclassInit) {	return };

	this._map			= {};
	this._args			= {};
	this._checkedMap	= {};	// cache results of _checkMap()

	this._load(this._map, AjxKeys);

	DwtKeyMap.MOD_ORDER[DwtKeyMap.ALT]		= 1;
	DwtKeyMap.MOD_ORDER[DwtKeyMap.CTRL]		= 2;
	DwtKeyMap.MOD_ORDER[DwtKeyMap.META]		= 3;
	DwtKeyMap.MOD_ORDER[DwtKeyMap.SHIFT]	= 4;
};

DwtKeyMap.prototype.isDwtKeyMap = true;
DwtKeyMap.prototype.toString = function() { return "DwtKeyMap"; };

// This is how modifiers need to appear in *.keycode values
DwtKeyMap.ALT   = 'Alt';
DwtKeyMap.CTRL  = 'Ctrl';
DwtKeyMap.META  = 'Meta';
DwtKeyMap.SHIFT = 'Shift';

DwtKeyMap.deserialize =
function(keymap) {
	alert("DwtKeyMap.deserialize: NOT IMPLEMENTED");
};

DwtKeyMap.serialize =
function(keymap) {
	alert("DwtKeyMap.serialize: NOT IMPLEMENTED");
};

DwtKeyMap.MAP_DIALOG		= "dialog";
DwtKeyMap.MAP_OPTION_DIALOG	= "optionDialog";
DwtKeyMap.MAP_BUTTON		= "button";
DwtKeyMap.MAP_LIST			= "list";
DwtKeyMap.MAP_MENU			= "menu";
DwtKeyMap.MAP_EDITOR		= "editor";
DwtKeyMap.MAP_TOOLBAR_HORIZ	= "toolbarHorizontal";
DwtKeyMap.MAP_TOOLBAR_VERT	= "toolbarVertical";
DwtKeyMap.MAP_TAB_VIEW		= "tabView";
DwtKeyMap.MAP_TREE			= "tree";


// Returns true if the given key is a modifier. The list of modifier keys is
// taken from the AjxKeys properties file.
DwtKeyMap.IS_MODIFIER = {};

// Order filled in by DwtKeyMapMgr._processKeyDefs()
DwtKeyMap.MOD_ORDER		= {};

// Key names
DwtKeyMap.ARROW_DOWN		= "ArrowDown";
DwtKeyMap.ARROW_LEFT		= "ArrowLeft";
DwtKeyMap.ARROW_RIGHT		= "ArrowRight";
DwtKeyMap.ARROW_UP			= "ArrowUp";
DwtKeyMap.BACKSLASH			= "Backslash";
DwtKeyMap.BACKSPACE			= "Backspace";
DwtKeyMap.COMMA				= "Comma";
DwtKeyMap.DELETE			= "Del";
DwtKeyMap.END				= "End";
DwtKeyMap.ENTER				= "Enter";
DwtKeyMap.ESC				= "Esc";
DwtKeyMap.HOME				= "Home";
DwtKeyMap.PGDOWN			= "PgDown";
DwtKeyMap.PGUP			    = "PgUp";
DwtKeyMap.SEMICOLON			= "Semicolon";
DwtKeyMap.SPACE				= "Space";
DwtKeyMap.TAB				= "Tab";

// Action codes
DwtKeyMap.ADD_SELECT_NEXT	= "AddNext";
DwtKeyMap.ADD_SELECT_PREV	= "AddPrevious";
DwtKeyMap.CANCEL			= "Cancel";
DwtKeyMap.COLLAPSE			= "Collapse";
DwtKeyMap.DBLCLICK			= "DoubleClick";
DwtKeyMap.DELETE			= "Delete";
DwtKeyMap.EXPAND			= "Expand";
DwtKeyMap.GOTO_TAB			= "GoToTab";
DwtKeyMap.HEADER1			= "Header1";
DwtKeyMap.HEADER2			= "Header2";
DwtKeyMap.HEADER3			= "Header3";
DwtKeyMap.HEADER4			= "Header4";
DwtKeyMap.HEADER5			= "Header5";
DwtKeyMap.HEADER6			= "Header6";
DwtKeyMap.INSERT_LINK	    = "InsertLink";
DwtKeyMap.JUSTIFY_CENTER	= "CenterJustify";
DwtKeyMap.JUSTIFY_LEFT		= "LeftJustify";
DwtKeyMap.JUSTIFY_RIGHT		= "RightJustify";
DwtKeyMap.NEXT				= "Next";
DwtKeyMap.NEXT_TAB			= "NextTab";
DwtKeyMap.NO				= "No";
DwtKeyMap.PAGE_UP			= "PageUp";
DwtKeyMap.PAGE_DOWN			= "PageDown";
DwtKeyMap.PARENTMENU		= "ParentMenu";
DwtKeyMap.PREV				= "Previous";
DwtKeyMap.PREV_TAB			= "PreviousTab";
DwtKeyMap.SELECT_ALL		= "SelectAll";
DwtKeyMap.SELECT			= "Select";
DwtKeyMap.SELECT_CURRENT	= "SelectCurrent";
DwtKeyMap.SELECT_FIRST		= "SelectFirst";
DwtKeyMap.SELECT_LAST		= "SelectLast";
DwtKeyMap.SELECT_NEXT		= "SelectNext";
DwtKeyMap.SELECT_PREV		= "SelectPrevious";
DwtKeyMap.SUBMENU			= "SubMenu";
DwtKeyMap.SWITCH_MODE		= "SwitchMode";
DwtKeyMap.TEXT_BOLD			= "Bold";
DwtKeyMap.TEXT_ITALIC		= "Italic";
DwtKeyMap.TEXT_UNDERLINE	= "Underline";
DwtKeyMap.TEXT_STRIKETHRU	= "Strikethru";
DwtKeyMap.YES				= "Yes";

DwtKeyMap.GOTO_TAB_RE = new RegExp(DwtKeyMap.GOTO_TAB + "(\\d+)");

DwtKeyMap.JOIN		= "+";			// Modifier join character
DwtKeyMap.SEP		= ",";			// Key separator
DwtKeyMap.INHERIT	= "INHERIT";	// Inherit keyword.

DwtKeyMap.prototype.getMap =
function() {
	return this._map;
};

/**
 * Converts a properties representation of shortcuts into a hash. The
 * properties version is actually a reverse map of what we want, so we
 * have to swap keys and values. Handles platform-specific shortcuts,
 * and inheritance. The properties version is made available via a
 * servlet.
 * 
 * @param {hash}	map			the hash to populate with shortcuts
 * @param {hash}	keys			the properties version of shortcuts
 * 
 * @private
 */
DwtKeyMap.prototype._load =
function(map, keys) {

	// preprocess for platform-specific bindings, and sanitize for misuse of {modifier} in keycode
	var curPlatform = AjxEnv.platform.toLowerCase();
	for (var propName in keys) {
		var parts = propName.split(".");
		var last = parts[parts.length - 1];
        // if we find the right platform-specific binding, promote it to be the main one
		if (last === "win" || last === "mac" || last === "linux") {
			if (last === curPlatform) {
				var baseKey = parts.slice(0, parts.length - 1).join(".");
				keys[baseKey] = keys[propName];
			}
			keys[propName] = null;
		}
        // clean up in case someone put something like {ctrl} in keycode rather than display
        var propValue = AjxStringUtil.trim(keys[propName]);
        if (parts[2] && parts[2] === 'keycode' && propValue && propValue.indexOf('{') !== -1) {
            keys[propName] = propValue.replace(/\{(\w)(\w+)\}/g, function(m, first, rest) {
                return first.toUpperCase() + rest;
            });
        }
	}
	
	for (var propName in keys) {
		var propValue = AjxStringUtil.trim(keys[propName]);
		if (!propValue || (typeof keys[propName] != "string")) { continue; }
		var parts = propName.split(".");
		var field = parts[parts.length - 1];
		var isMap = (parts.length == 2);
		var action = isMap ? null : parts[1];
		if (parts[0] == "keys") {
			this._processKeyDef(action, field, propValue);
			continue;
		}
		if (field != DwtKeyMap.INHERIT && field != "keycode") { continue; }
		var mapName = parts[0];
		if ((this._checkedMap[mapName] === false) ||
			(!this._checkedMap[mapName] && !this._checkMap(mapName))) { continue; }
		if (!map[mapName]) {
			map[mapName] = {};
		}
		if (!this._checkAction(mapName, action)) { continue; }
		var keySequences = propValue.split(/\s*;\s*/);
		for (var i = 0; i < keySequences.length; i++) {
			var ks = this._canonicalize(keySequences[i]);
			if (field == DwtKeyMap.INHERIT) {
				var parents = ks.split(/\s*,\s*/);
				var parents1 = [];
				for (var p = 0; p < parents.length; p++) {
					parents1[p] = parents[p];
				}
				map[mapName][parts[1]] = parents1.join(",");
			} else if (field == "keycode") {
				map[mapName][ks] = action;
			}
		}
	}
};

/**
 * Returns true if this map is valid. This class always returns true,
 * but subclasses may override to do more checking.
 *
 * @param {string}	mapName		the name of map
 * 
 * @private
 */
DwtKeyMap.prototype._checkMap =
function(mapName) {
	var result = true;
	this._checkedMap[mapName] = result;
	return result;
};

/**
 * Checks if this action is valid. This class always returns <code>true</code>,
 * but subclasses may override to do more checking.
 *
 * @param {string}	mapName	the name of map
 * @param {string}	action	the action to check
 * @param	{boolean}	<code>true</code> if this action is valid. 
 * @private
 */
DwtKeyMap.prototype._checkAction =
function(mapName, action) {
	return true;
};

/**
 * Sets up constants for a modifier key as described in a properties file.
 * 
 * @param {string}	key		the ctrl, alt, shift, or meta
 * @param {string}	field	the display or keycode
 * @param {string|number}	value	the property value
 * 
 * @private
 */
DwtKeyMap.prototype._processKeyDef = 
function(key, field, value) {
	if (!key || !field || !value) { return; }
	if (field == "keycode") {
		DwtKeyMap.IS_MODIFIER[value] = true;
	}
};

/**
 * Ensures a predictable order for the modifiers in a key sequence:
 * <pre>
 * Alt Ctrl Meta Shift
 * </pre>
 * 
 * Example: "Shift+Ctrl+U" will be transformed into "Ctrl+Shift+U"
 * 
 * @param {String}	ks	the key sequence
 * 
 * @private
 */
DwtKeyMap.prototype._canonicalize =
function(ks) {
	var keys = ks.split(DwtKeyMap.SEP);
	var result = [];
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var parts = key.split(DwtKeyMap.JOIN);
		if (parts.length > 2) {
			var mods = parts.slice(0, parts.length - 1);
			mods.sort(function(a, b) {
				var sortA = DwtKeyMap.MOD_ORDER[a] || 0;
				var sortB = DwtKeyMap.MOD_ORDER[b] || 0;
				return Number(sortA - sortB);
			});
			mods.push(parts[parts.length - 1]);
			result.push(mods.join(DwtKeyMap.JOIN));
		} else {
			result.push(key);
		}
	}
	return result.join(",");
};
