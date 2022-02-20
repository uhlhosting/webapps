<%@ page buffer="8kb" session="false" autoFlush="true" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<%@ page import="java.util.*,javax.naming.*,com.zimbra.client.ZAuthResult" %>
<%@ taglib prefix="zm" uri="com.zimbra.zm" %>
<%@ taglib prefix="fmt" uri="com.zimbra.i18n" %>
<%@ taglib prefix="app" uri="com.zimbra.htmlclient" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<app:skinAndRedirect />
<%
	// Set to expire far in the past.
	response.setHeader("Expires", "Tue, 24 Jan 2000 17:46:50 GMT");

	// Set standard HTTP/1.1 no-cache headers.
	response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

	// Set standard HTTP/1.0 no-cache header.
	response.setHeader("Pragma", "no-cache");
%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<fmt:setBundle basename="/messages/ZmMsg" scope="request"/>
<html>
<head>
<!--
SPDX-FileCopyrightText: 2022 Synacor, Inc.

SPDX-License-Identifier: GPL-2.0-only
-->
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<title><fmt:message key="zimbraTitle"/></title>
	<link rel="stylesheet" type="text/css" href="<c:url value='/css/images,common,dwt,msgview,login,zm,spellcheck,skin' />">
	<fmt:message key="favIconUrl" var="favIconUrl"/>
</head>
<body>

<!-- BEGIN ERROR SCREEN -->
<div id="skin_container_error_screen" class="ErrorScreen">

	<div id="ZErrorPanel" class="center">
		<div class="contentBox">
			<div class="InlineErrorPanel">
				<table width="100%" style="margin-bottom:2em;">
					<tr>
						<td width="1%" valign="top">
							<img src="<c:url value="/img/dwt/ImgWarning_32.png?v=${version}" />"
								 title="<fmt:message key='error'/>" alt="<fmt:message key='error'/>" id="ZErrorIcon">
						</td>
						<td style="padding-top:.3em;">
							<fmt:message key='errorJavaScriptRequired'>
								<fmt:param>
									<c:url value='/'></c:url>
								</fmt:param>
								<fmt:param>
									<c:url value='/h/'></c:url>
								</fmt:param>
							</fmt:message>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="decor1"></div>
	</div>
	<div class="decor2"></div>

</div>

</body>
</html>
