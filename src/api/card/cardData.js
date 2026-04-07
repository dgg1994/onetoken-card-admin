import request from '@/utils/request'

//列表
export function cardList(data) {
    return request({
        url: 'card/findListPag',
        method: 'post',
        data
    })
}

export function pullList() {
    return request({
        url: 'card/pullList',
        method: 'get'
    })
}

export function cardUpdate(data) {
    return request({
        url: 'card/update',
        method: 'post',
        data
    })
}

export function cardUpdateImg(data) {
    return request({
        url: 'card/updateImg',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        data
    })
}

export function cardUpdateListImg(data) {
    return request({
        url: 'card/updateListImg',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        data
    })
}

export function cardCopyCard(uuid) {
    return request({
        url: 'card/copyCard',
        method: 'get',
        params: {
            'uuid': uuid
        }
    })
}