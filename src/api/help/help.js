import request from '@/utils/request'

export function addHelp(data) {
    return request({
        url: 'help/add',
        method: 'post',
        data
    })
}


export function updateHelp(data) {
    return request({
        url: 'help/update',
        method: 'post',
        data
    })
}

export function findHelp(data) {
    return request({
        url: 'help/pcFindList',
        method: 'post',
        data
    })
}

export function deleteHelp(id) {
    return request({
        url: 'help/delete',
        method: 'get',
        params: {
            'id': id,
        }
    })
}