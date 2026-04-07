import request from '@/utils/request'

//列表
export function sysConfigList(data) {
    return request({
        url: 'info/findAll',
        method: 'post',
        data
    })
}

export function sysChangeStatus(id,statusType) {
    return request({
        url: 'info/changeStatus',
        method: 'get',
        params: {
            'id': id,
            'statusType':statusType
        }
    })
}


export function sysConfigAdd(data) {
    return request({
        url: 'info/add',
        method: 'post',
        data
    })
}

export function sysConfigUpdate(data) {
    return request({
        url: 'info/update',
        method: 'post',
        data
    })
}

export function sysConfigDelete(id) {
    return request({
        url: 'info/delete',
        method: 'get',
        params: {
            'id': id,
        }
    })
}

export function ipWhitelistList(data) {
    return request({
        url: 'ipWhitelist/findList',
        method: 'post',
        data
    })
}

export function ipWhitelistAdd(data) {
    return request({
        url: 'ipWhitelist/add',
        method: 'post',
        data
    })
}

export function ipWhitelistDelete(id) {
    return request({
        url: 'ipWhitelist/delete',
        method: 'get',
        params: {
            'id': id,
        }
    })
}