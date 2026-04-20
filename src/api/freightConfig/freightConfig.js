import request from '@/utils/request'

//列表
export function firmAccountList(data) {
    return request({
        url: 'firmAccount/findList',
        method: 'post',
        data
    })
}

export function freightConfigList() {
    return request({
        url: 'freightConfig/findList',
        method: 'get',
    })
}

export function freightConfigUpdate(data) {
    return request({
        url: 'freightConfig/update',
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


