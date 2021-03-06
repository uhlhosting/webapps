<%@ page session="false" %>
<%--
SPDX-FileCopyrightText: 2022 Synacor, Inc.

SPDX-License-Identifier: GPL-2.0-only
--%>
<%
    String contextPath = request.getContextPath();
    if (contextPath.equals("/")) contextPath = "";

	String dev = request.getParameter("dev");
	boolean isDev = dev != null && dev.equals("1");
	if (isDev) {
		request.setAttribute("mode", "mjsf");
//		request.setAttribute("gzip", "false");
//		request.setAttribute("fileExtension", "");
//		request.setAttribute("debug", "1");
//		request.setAttribute("packages", "dev");
	}

	String mode = (String)request.getAttribute("mode");
	boolean isDevMode = mode != null && mode.equalsIgnoreCase("mjsf");

    String vers = (String)request.getAttribute("version");
    if (vers == null) vers = "";

    String ext = (String)request.getAttribute("fileExtension");
    if (ext == null) ext = "";

    String offline = (String)request.getAttribute("offline");
    if (offline == null) offline = application.getInitParameter("offlineMode");
    boolean isOfflineMode = offline != null && offline.equals("true");

%>
<!-- bootstrap classes -->
<% if (isDevMode) { %>
	<jsp:include page="jsp/Boot.jsp" />
<% } else { %>
	<script type="text/javascript">
	<jsp:include>
		<jsp:attribute name='page'>/js/Boot_all.js<%= isDevMode || isOfflineMode ? "" : ".min" %></jsp:attribute>
	</jsp:include>
	</script>
<% } %>

<script type="text/javascript">
AjxPackage.setBasePath("<%=contextPath%>/js");
AjxPackage.setExtension("<%= isDevMode ? "" : "_all" %>.js<%=ext%>");
AjxPackage.setQueryString("v=<%=vers%>");

AjxTemplate.setBasePath("<%=contextPath%>/templates");
AjxTemplate.setExtension(".template.js");
</script>
