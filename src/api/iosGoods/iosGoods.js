import request from '@/utils/request'

export function iosGoodsAdd(data) {
    return request({
        url: 'iosGoods/add',
        method: 'post',
        data
    })
}


export function iosGoodsUpdate(data) {
    return request({
        url: 'iosGoods/update',
        method: 'post',
        data
    })
}

export function iosGoodsList(data) {
    return request({
        url: 'iosGoods/findList',
        method: 'post',
        data
    })
}

export function iosGoodsDelete(id) {
    return request({
        url: 'iosGoods/delete',
        method: 'get',
        params: {
            id: id
        }
    })
}