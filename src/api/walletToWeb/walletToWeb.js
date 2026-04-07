import request from '@/utils/request'

export function walletToWebLogList(data) {
    return request({
        url: 'walletToWebLog/findList',
        method: 'post',
        data
    })
}


export function walletToWebLogReject(id,rejectContent) {
    return request({
        url: 'walletToWebLog/reject',
        method: 'get',
        params: {
            id,
            rejectContent
        }
    })
}

export function walletToWebLogPass(id) {
    return request({
        url: 'walletToWebLog/pass',
        method: 'get',
        params: {
            id
        }
    })
}


