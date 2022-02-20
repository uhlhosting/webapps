// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @class ZaDataSource
* @contructor ZaDataSource
* @param ZaApp app
* this class is a model for zimbraDataSource and zimbraGalDataSource ldap objects
* @author Greg Solovyev
**/
ZaDataSource = function(noInit) {
	if (noInit) return;	
	ZaItem.call(this, "ZaDataSource");
	this._init();
	this.type = ZaItem.DATASOURCE;
}

ZaDataSource.prototype = new ZaItem;
ZaDataSource.prototype.constructor = ZaDataSource;

ZaDataSource.DS_TYPE_GAL = "gal";
ZaDataSource.GAL_TYPE_ZIMBRA = "zimbra";
ZaDataSource.GAL_TYPE_LDAP = "ldap";

ZaDataSource.A_zimbraGalLdapAttrMap = "zimbraGalLdapAttrMap";
ZaDataSource.A_zimbraGalSyncLdapURL = "zimbraGalSyncLdapURL";
ZaDataSource.A_zimbraGalSyncLdapSearchBase = "zimbraGalSyncLdapSearchBase";
ZaDataSource.A_zimbraGalSyncLdapFilter = "zimbraGalSyncLdapFilter";
ZaDataSource.A_zimbraGalSyncLdapAuthMech = "zimbraGalSyncLdapAuthMech";
ZaDataSource.A_zimbraGalSyncLdapBindDn = "zimbraGalSyncLdapBindDn";
ZaDataSource.A_zimbraGalSyncLdapBindPassword = "zimbraGalSyncLdapBindPassword";
ZaDataSource.A_zimbraGalSyncLdapKerberos5Principal = "zimbraGalSyncLdapKerberos5Principal";
ZaDataSource.A_zimbraGalSyncLdapKerberos5Keytab = "zimbraGalSyncLdapKerberos5Keytab";
ZaDataSource.A_zimbraGalSyncLdapPageSize = "zimbraGalSyncLdapPageSize";
ZaDataSource.A_zimbraGalSyncInternalSearchBase = "zimbraGalSyncInternalSearchBase";
ZaDataSource.A_zimbraGalSyncLdapStartTlsEnabled = "zimbraGalSyncLdapStartTlsEnabled";
ZaDataSource.A_zimbraGalLastSuccessfulSyncTimestamp = "zimbraGalLastSuccessfulSyncTimestamp";
ZaDataSource.A_zimbraGalLastFailedSyncTimestamp = "zimbraGalLastFailedSyncTimestamp";
ZaDataSource.A_zimbraGalStatus = "zimbraGalStatus";
ZaDataSource.A_zimbraGalType = "zimbraGalType";
ZaDataSource.A_zimbraGalSyncTimestampFormat = "zimbraGalSyncTimestampFormat";
ZaDataSource.A_zimbraDataSourceType = "zimbraDataSourceType";
ZaDataSource.A_zimbraDataSourcePollingInterval = "zimbraDataSourcePollingInterval";

ZaDataSource.myXModel = {
    items: [
    	{id:ZaDataSource.A_zimbraDataSourceType, type:_STRING_, ref:"attrs/" + ZaDataSource.A_zimbraDataSourceType},
    	{id:ZaDataSource.A_zimbraGalType, type:_STRING_, ref:"attrs/" + ZaDataSource.A_zimbraGalType},
    	{id:ZaDataSource.A_zimbraGalSyncLdapURL, type:_LIST_,  listItem:{type:_SHORT_URL_},  ref:"attrs/" + ZaDataSource.A_zimbraGalSyncLdapURL},
    	{id:ZaDataSource.A_zimbraGalSyncLdapFilter, type:_STRING_, ref:"attrs/" + ZaDataSource.A_zimbraGalSyncLdapFilter,required:true},
    	{id:ZaDataSource.A_zimbraGalSyncInternalSearchBase, type:_STRING_, ref:"attrs/" + ZaDataSource.A_zimbraGalSyncInternalSearchBase},
		{id:ZaDataSource.A_zimbraGalSyncLdapBindDn, type:_ENUM_, choices:ZaModel.BOOLEAN_CHOICES, ref:"attrs/" + ZaDataSource.A_zimbraGalSyncLdapBindDn},
		{id:ZaDataSource.A_zimbraGalSyncLdapBindPassword, type:_STRING_, ref:"attrs/" + ZaDataSource.A_zimbraGalSyncLdapBindPassword},
    	{id:ZaDataSource.A_zimbraGalSyncLdapStartTlsEnabled, type:_ENUM_, choices:ZaModel.BOOLEAN_CHOICES, ref:"attrs/" + ZaDataSource.A_zimbraGalSyncLdapStartTlsEnabled},
    	{id:ZaDataSource.A_zimbraGalSyncLdapAuthMech, type:_STRING_, ref:"attrs/" + ZaDataSource.A_zimbraGalSyncLdapAuthMech},
    	{id:ZaDataSource.A_zimbraDataSourcePollingInterval,type:_MLIFETIME_, ref:"attrs/" + ZaDataSource.A_zimbraDataSourcePollingInterval}
    ]
};