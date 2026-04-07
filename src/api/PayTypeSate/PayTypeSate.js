import request from '@/utils/request'

export function PayTypeSateList(data) {
    return request({
        url: 'PayTypeSate/findList',
        method: 'post',
        data
    })
}


export function PayTypeSateUpdate(data) {
    return request({
        url: 'PayTypeSate/update',
        method: 'post',
        data
    })
}
