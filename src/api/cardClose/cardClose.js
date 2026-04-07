import request from '@/utils/request'

export function cardCloseList(data) {
    return request({
        url: 'cardClose/findList',
        method: 'post',
        data
    })
}
