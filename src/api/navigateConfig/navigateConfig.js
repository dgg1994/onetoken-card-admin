import request from '@/utils/request'

//列表
export function sysNavigateConfigList(data) {
    return request({
        url: 'sysNavigateConfig/findList',
        method: 'post',
        data
    })
}

export function sysNavigateConfigUpdate(data) {
    return request({
        url: 'sysNavigateConfig/update',
        method: 'post',
        data
    })
}

export function sysNavigateConfigAdd(data) {
    return request({
        url: 'sysNavigateConfig/add',
        method: 'post',
        data
    })
}

export function sysNavigateConfigDelete(id) {
    return request({
        url: 'sysNavigateConfig/delete',
        method: 'get',
        params: {
            'id': id
        }
    })
}


