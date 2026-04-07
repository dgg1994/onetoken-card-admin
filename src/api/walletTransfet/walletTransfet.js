import request from '@/utils/request'

export function walletTransfetList(data) {
    return request({
        url: 'walletTransfetList/findList',
        method: 'post',
        data
    })
}