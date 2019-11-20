/**系统Id*/
export const DistributionSystemId = 2;//发行
export const OverseasReleaseSysId = 4; //投放
export const H5OverseasReleaseSysId = 5; //投放

/**接口Id*/
export const deliveryMenuId = 1001;
export const realTimeMenuId = 1002;
export const reconciliationId = 1004;
export const PackageManagerId = 1102;
export const ComplementMenuId = 1101;
export const dividedIntoId = 1105; 
export const overallId = 1201;
export const serviceId = 1202;
export const channelId = 1203;

export const H5GameUrlId = 1301;          //h5游戏URL
export const H5ChannelConfiglId = 1302;   //h5渠道配置
export const H5LinkConfiglId = 1303;      //h5游戏link
export const H5DataSupplementId = 1304;   //h5数据补充
export const H5BudgetSupplementId = 1305; //h5预算补充
export const H5DividedIntoSupplementsId = 1306;//h5分成补充
export const H5DeliveryReportId = 1401;   //h5投放报表
export const H5DetailedReportId = 1402;   //h5详细报表







var config = {}
config[OverseasReleaseSysId] = {
  _1dirofmenu: {
    // sort: 
  }
}
export { config }

export const defaultMenu = deliveryMenuId;
