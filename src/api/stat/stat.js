import request from '@/utils/request'

export function statTotal() {
    return request({
        url: 'stat/total',
        method: 'get'
    })
}
export function adminStat(data) {
    return request({
        url: 'stat/adminStat',
        method: 'post',
        data
    })
}
