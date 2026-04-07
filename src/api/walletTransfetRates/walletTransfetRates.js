import request from '@/utils/request'

//列表
export function walletTransfetRatesList() {
    return request({
        url: 'walletTransfetRates/findList',
        method: 'get'
    })
}

export function walletTransfetRatesAdd(data) {
    return request({
        url: 'walletTransfetRates/add',
        method: 'post',
        data
    })
}

export function walletTransfetRateUpdate(data) {
    return request({
        url: 'walletTransfetRates/update',
        method: 'post',
        data
    })
}
