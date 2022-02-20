// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * @constructor
 * @class
 * DwtDragEvent is generated by the Drag and Drop framework when a drag operation is
 * in process. The drag event is dispatched to the registered {@link DwtDragSource} instance.
 * 
 * @author Ross Dargahi
 * 
 * @see DwtDragSource
 */
DwtDragEvent = function() {
	/**
	 * Type of drag operation. One of:
	 * <ul>
	 * <li>{@link DwtDragEvent.DRAG_START}</li>
	 * <li>{@link DwtDragEvent.SET_DATA}</li>
	 * <li>{@link DwtDragEvent.DRAG_END}</li>
	 * </ul>
	 */
	this.operation = null;
	
	/**
	 * Drag source control
	 * @type DwtControl
	 */
	this.srcControl = null;
	
	/**
	 * Action being performed. One of:
	 * <ul>
	 * <li>{@link Dwt.DND_DROP_NONE}</li>
	 * <li>{@link Dwt.DND_DROP_COPY}</li>
	 * <li>{@link Dwt.DND_DROP_MOVE}</li>
	 * </ul>
	 */
	this.action = null;
	
	/**
	 * Whether the DnD framework should perform the operation. The application is
	 * responsible for setting this value based on whatever business logic it is
	 * implementing
	 * @type boolean
	 */
	this.doIt = false;
	
	/**
	 * Drag source data. This is the application data associated with the item being dragged.
	 */
	this.srcData = null;
};

/**
 * Drag initialization.
 */
DwtDragEvent.DRAG_INIT = "INIT";

/**
 * Drag is starting.
 */
DwtDragEvent.DRAG_START = "START";

/**
 * Set the <code>srcData</code> field of the event.
 */
DwtDragEvent.SET_DATA = "SET_DATA";

/**
 * Drag movement has occurred.
 */
DwtDragEvent.DRAG_MOVE = "MOVE";

/**
 * Drag has ended.
 */
DwtDragEvent.DRAG_END = "END";

/**
 * Drag canceled (i.e. dropped on invalid target).
 */
DwtDragEvent.DRAG_CANCEL = "CANCEL";
