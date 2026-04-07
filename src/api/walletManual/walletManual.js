import request from '@/utils/request'

export function walletManualLogList(data) {
    return request({
        url: 'walletManualLog/findList',
        method: 'post',
        data
    })
}