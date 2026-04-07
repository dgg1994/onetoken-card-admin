import request from '@/utils/request'

//列表
export function cardTagList(data) {
    return request({
        url: 'cardLable/findList',
        method: 'post',
        data
    })
}

export function cardTagAdd(data) {
    return request({
        url: 'cardLable/add',
        method: 'post',
        data
    })
}

export function cardTagDelete(id) {
    return request({
        url: 'cardLable/delete',
        method: 'get',
         params: {
            'id': id
        }
    })
}

export function cardTagFindAll() {
    return request({
        url: 'cardLable/findAll',
        method: 'get'
    })
}