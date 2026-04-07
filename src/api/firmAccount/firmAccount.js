import request from '@/utils/request'

//列表
export function firmAccountList(data) {
    return request({
        url: 'firmAccount/findList',
        method: 'post',
        data
    })
}

export function firmAccountUpdate(data) {
    return request({
        url: 'firmAccount/update',
        method: 'post',
        data
    })
}

export function firmAccountAdd(data) {
    return request({
        url: 'firmAccount/add',
        method: 'post',
        data
    })
}

export function firmAccountDelete(id) {
    return request({
        url: 'firmAccount/delete',
        method: 'get',
        params: {
            'id': id
        }
    })
}


