import request from '@/utils/request'

export function walletNetworkTopUpList(data) {
    return request({
        url: 'walletNetworkTopUp/findList',
        method: 'post',
        data
    })
}

export function walletNetworkTopUpClose(id,reviewRemark) {
    return request({
        url: 'walletNetworkTopUp/close',
        method: 'get',
          params: {
            'id': id,
            'reviewRemark': reviewRemark
        }
    })
}


export function walletManualTopUp(data) {
    return request({
        url: 'wallet/walletTopUp',
        method: 'post',
        data
    })
}

export function walletTopupLogList(data) {
    return request({
        url: 'walletTopupLog/findList',
        method: 'post',
        data
    })
}