import request from '@/utils/request'

//理财产品类型
export function productTypeAdd(data) {
    return request({
        url: 'productType/add',
        method: 'post',
        data
    })
}

export function productTypeList(data) {
    return request({
        url: 'productType/findList',
        method: 'post',
        data
    })
}

export function productTypeDelete(id) {
    return request({
        url: 'productType/delete',
        method: 'get',
        params: {
            'id': id
        }
    })
}

export function productTypeAll(language) {
    return request({
        url: 'productType/pcFindAll',
        method: 'get',
        params: {
            'language': language
        }
    })
}

//理财产品
export function productList(data) {
    return request({
        url: 'product/pcFindList',
        method: 'post',
        data
    })
}

export function productAdd(data) {
    return request({
        url: 'product/add',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        data
    })
}

export function productUpdate(data) {
    return request({
        url: 'product/update',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        data
    })
}

export function productOnAndOff( id, type, language) {
    return request({
        url: 'product/OnAndOff',
        method: 'get',
        params: {
            'id': id,
            'type':type,
            'language':language,
        }
    })
}
//理财订单
export function productOrderList(data) {
    return request({
        url: 'product/orderList',
        method: 'post',
        data
    })
}

export function productDelete( id) {
    return request({
        url: 'product/delete',
        method: 'get',
        params: {
            'id': id,
        }
    })
}