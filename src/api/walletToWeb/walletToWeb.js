import request from '@/utils/request'

export function walletToWebLogList(data) {
    return request({
        url: 'walletToWebLog/findList',
        method: 'post',
        data
    })
}

