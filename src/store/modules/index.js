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



import o_c_complement from './overseas-configuration/complement'
import o_c_divided_into from './overseas-configuration/divided_into'

import o_c_budget from './overseas-configuration/budget'
import o_c_pkg_manager from './overseas-configuration/pkg_manager'
import overseas_common from './overseas-common'
import overseas_common_realTime from './overseas-common/realTime/'

import o_s_c_reports from './overseas-sub-channel/reports'

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

}