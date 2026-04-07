import request from '@/utils/request'

//列表
export function noticeList(data) {
    return request({
        url: 'notice/findList',
        method: 'post',
        data
    })
}

export function noticeAdd(data) {
    return request({
        url: 'notice/add',
        method: 'post',
        data
    })
}

export function noticeUpdate(data) {
    return request({
        url: 'notice/update',
        method: 'post',
        data
    })
}

export function noticeDelete(id) {
    return request({
        url: 'notice/delete',
        method: 'get',
         params: {
            'id': id,
        }
    })
}

export function noticeSend(id) {
    return request({
        url: 'notice/send',
        method: 'get',
         params: {
            'id': id,
        }
    })
}




