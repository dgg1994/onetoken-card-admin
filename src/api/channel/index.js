import request from "@/utils/request";

//新增渠道商等级
export function channelLevelAdd(data) {
  return request({
    url: "channelLevel/add",
    method: "post",
    data,
  });
}
//修改渠道商等级
export function channelLevelUpdate(data) {
  return request({
    url: "channelLevel/update",
    method: "post",
    data,
  });
}
//渠道商等级列表
export function channelLevelFindList(data) {
  return request({
    url: "channelLevel/findAll",
    method: "post",
    data,
  });
}
export function findChannelLevelList() {
  return request({
    url: "channelUser/findChannelLevel",
    method: "get",
  });
}
//删除渠道商等级
export function channelLevelDelete(params) {
  return request({
    url: "channelLevel/delete",
    method: "get",
    params,
  });
}
//channelUser/findAll渠道商用户列表
export function channelUserFindAll(data) {
  return request({
    url: "channelUser/findAll",
    method: "post",
    data,
  });
}
export function getChannelList() {
  return request({
    url: "channelUser/findChannelUserInfo",
    method: "get"
  });
}
//channelUser/add 渠道用户添加
export function channelUserAdd(data) {
  return request({
    url: "channelUser/add",
    method: "post",
    data,
  });
}
//channelUser/update   渠道用户修改
export function channelUserUpdate(data) {
  return request({
    url: "channelUser/update",
    method: "post",
    data,
  });
}
//channelUser/delete  渠道用户删除
export function channelUserDelete(params) {
  return request({
    url: "channelUser/deleteChannelUser",
    method: "get",
    params,
  });
}
// 密码修改
export function channelUserUpdatePwd(data) {
  return request({
    url: "channelUser/updatePwd",
    method: "post",
    data,
  });
}

// 返回佣金日志列表
export function brokerageLogFindAll(data) {
  return request({
    url: "brokerageLog/findAll",
    method: "post",
    data,
  });
}
// 邀请日志列表
export function appUserIntiterFindAll(data) {
  return request({
    url: "appUserIntiter/findAll",
    method: "post",
    data,
  });
}

// channelCard/findAll
export function channelCardFindAll(data) {
  return request({
    url: "channelCard/findAll",
    method: "post",
    data,
  });
}
export function channelCardUpdate(data) {
  return request({
    url: "channelCard/update",
    method: "post",
    data,
  });
}
export function channelTotal(data) {
  return request({
    url: "stat/channelTotal",
    method: "post",
    data,
  });
}
export function bindChannel(data) {
  return request({
    url: "appUserIntiter/addAppUserIntiter",
    method: "post",
    data,
  });
}

export function findInviteCode(params) {
  return request({
    url: `appUserIntiter/findChannelInvitationCodeByUserId/${params}`,
    method: "get",
  });
}

/**
 * c2c
 */
// 佣金比例新增
export function sysBrokerageRatesAdd(data) {
  return request({
    url: "sysBrokerageRates/add",
    method: "post",
    data,
  });
}
// 查询用户返佣配置
export function sysBrokerageRatesFindAll(data) {
  return request({
    url: "sysBrokerageRates/findAll",
    method: "post",
    data,
  });
}
// 查询用户返佣配置
export function sysBrokerageRatesUpdatel(data) {
  return request({
    url: "sysBrokerageRates/update",
    method: "post",
    data,
  });
}
