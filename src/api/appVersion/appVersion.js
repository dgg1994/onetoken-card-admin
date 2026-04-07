import request from '@/utils/request'

export function appVersionAdd(data) {
    return request({
        url: 'sysApk/add',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function appVersionUpdate(data) {
    return request({
        url: 'sysApk/update',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        data
    })
}

export function appVersionFindList(data) {
    return request({
        url: 'sysApk/findList',
        method: 'post',
        data
    })
}

export function appVersionFindRelease(id) {
    return request({
        url: 'sysApk/release',
        method: 'get',
        params: {
            'id': id,
        }
    })
}
