import request from '@/utils/request'

// 查询语言列表
export function getLanguage() {
    return request({
        url: 'dic/getLanguage',
        method: 'get',
    })
}

//银行卡状态
export function findCardState() {
    return request({
        url: 'dic/findCardState',
        method: 'get',
    })
}

//充值方式
export function findPayType() {
    return request({
        url: 'dic/findPayType',
        method: 'get',
    })
}

//kyc认证状态
export function findKycState() {
    return request({
        url: 'dic/findKycState',
        method: 'get',
    })
}

//用户状态
export function findUserState() {
    return request({
        url: 'dic/findUserState',
        method: 'get',
    })
}

//查询协议类型
export function findProtocolTypeList() {
    return request({
        url: 'dic/findProtocolType',
        method: 'get',
    })
}

//查询外部链接类型
export function findJumpAddress() {
    return request({
        url: 'dic/findJumpAddress',
        method: 'get',
    })
}

//查询系统配置类型
export function findSysConfigType() {
    return request({
        url: 'dic/findSysConfigType',
        method: 'get',
    })
}

//查询网络类型
export function findNetwokList() {
    return request({
        url: 'dic/findNetwokList',
        method: 'get',
    })
}