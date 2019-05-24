// import agent from './agent'
// import channel from './channel'
import power from './power'

import aside from './aside'
import common from './common'
import layout from './layout'

import {
  Login,
  Common,
  RegChannel,
  Agent,
  PayChannel,
  OS
} from './System'
import {
  FiveForceModel
} from './UserAnalysis'
import {
  NewServerMonitor
} from './OperationMonitoring'
import {
  ChargeHotList,
  BigCustomerTrend
} from './MarketingAnalysis'

import o_r_delivery from './overseas-reports/delivery'
import o_r_real from './overseas-reports/real'
import o_r_reconciliation from './overseas-reports/reconciliation'

import o_r_overall from './overseas-roi/overall'
import o_r_channel_status from './overseas-roi/channel_status'
import o_r_service_status from './overseas-roi/service_status'

import h5_game_url from './h5-system-deploy/game-url/index'
import h5_channel_config from './h5-system-deploy/channel-config/index'
import h5_link_config from './h5-system-deploy/link-config/index'
import h5_data_supplement from './h5-system-deploy/data-supplement/index'
import h5_budget_supplement from './h5-system-deploy/budget-supplement/index'
import h5_divided_supplement from './h5-system-deploy/divided-supplement/index'
import h5_delivery_report from './h5-system-deploy/delivery-report/index'
import h5_detailed_report from './h5-system-deploy/detailed-report/index'





import o_c_complement from './overseas-configuration/complement'
import o_c_divided_into from './overseas-configuration/divided_into'

import o_c_budget from './overseas-configuration/budget'
import o_c_pkg_manager from './overseas-configuration/pkg_manager'
import overseas_common from './overseas-common'
import overseas_common_realTime from './overseas-common/realTime/'

import o_s_c_reports from './overseas-sub-channel/reports'
import gameUrl from './h5-system-deploy/game-url';

export default {
  // agent,
  // channel,
  aside,
  common,
  layout,
  power,
  // System
  // Language,
  Login,
  Common,
  RegChannel,
  PayChannel,
  Agent,
  OS,

  // UserAnalysis
  FiveForceModel,
  // OperationMonitoring
  NewServerMonitor,
  // MarketingAnalysis
  ChargeHotList,
  BigCustomerTrend,

  // CommonRelease,
  overseas_common,
  overseas_common_realTime,
  o_r_delivery,
  o_r_real, //实时报表模块
  o_r_reconciliation, //對賬报表模块
  o_c_complement,
  o_c_divided_into,//分成补充模块
  o_c_budget,
  o_c_pkg_manager,
  o_s_c_reports,
  o_r_overall,        //roi整体情况模块
  o_r_channel_status, //roi渠道状况模块
  o_r_service_status, //roi渠道状况模块
  
  h5_game_url,        //h5游戏URL模块
  h5_channel_config,  //h5渠道配置模块
  h5_link_config,     //h5游戏link配置模块
  h5_data_supplement, //h5数据补充模块
  h5_budget_supplement,//h5预算补充模块
  h5_divided_supplement,//分成补充模块
  h5_delivery_report, //h5投放报表模块
  h5_detailed_report, //h5详细报表模块


}