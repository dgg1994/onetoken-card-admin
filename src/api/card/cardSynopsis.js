import request from '@/utils/request'

//列表
export function cardSynopsisList(data) {
    return request({
        url: 'cardSynopsis/findList',
        method: 'post',
        data
    })
}

export function cardSynopsisAdd(data) {
    return request({
        url: 'cardSynopsis/add',
        method: 'post',
        data
    })
}

export function cardSynopsisDelete(id) {
    return request({
        url: 'cardSynopsis/delete',
        method: 'get',
        params: {
            'id': id
        }
    })
}

export function cardSynopsisUpdate(data) {
    return request({
        url: 'cardSynopsis/update',
        method: 'post',
        data
    })
}

export function cardSynopsisFindAll() {
    return request({
        url: 'cardSynopsis/findAll',
        method: 'get',
    })
}