import request from '@/utils/request'

//列表
export function findWalletLogn(data) {
    return request({
        url: 'wallet/findWalletLog',
        method: 'post',
        data
    })
}


export function walletEntranceList(data) {
    return request({
        url: 'walletEntrance/findList',
        method: 'post',
        data
    })
}


export function walletEntranceOperate(type,userName) {
    console.log("dsfoipdsjfipodsjfipdosjfdiopsjfpodsjfopdsfjkdopsk")
    return request({
        url: 'walletEntrance/operate',
        method: 'get',
        params: {
            'type': type,
            'userName':userName
        }
    })
}

export function walletTopUp(data) {
    return request({
        url: 'wallet/walletTopUp',
        method: 'post',
        data
    })
}


export function rechargeHistoryList(data) {
    return request({
        url: 'rechargeHistory/findList',
        method: 'post',
        data
    })
}
