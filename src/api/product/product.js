import request from '@/utils/request'

//理财产品类型
export function productTypeAdd(data) {
    return request({
        url: 'productType/edit',
        method: 'post',
        data
    })
}

export function productTypeList(data) {
    return request({
        url: 'productType/list',
        method: 'post',
        data
    })
}

export function productTypeDelete(id) {
    return request({
        url: 'productType/delete/' + id,
        method: 'get'
    })
}

export function productTypeAll(data) {
    return request({
        url: 'productType/list',
        method: 'post',
        data
    })
}

export function productTypeFind(id) {
    return request({
        url: 'productType/find/' + id,
        method: 'get'
    })
}

//理财产品
export function productList(data) {
    return request({
        url: 'product/financeProductsList',
        method: 'post',
        data
    })
}

export function productAdd(data) {
    return request({
        url: 'product/insertFinanceProducts',
        method: 'post',
        data
    })
}

export function productUpdate(data) {
    return request({
        url: 'product/updateFinanceProducts',
        method: 'post',
        data
    })
}

export function productOnAndOff( id, type) {
    return request({
        url: 'product/OnAndOff',
        method: 'get',
        params: {
            'id': id,
            'type':type,
        }
    })
}
//理财订单
export function productOrderList(data) {
    return request({
        url: 'order/list',
        method: 'post',
        data
    })
}

export function productDelete( id) {
    return request({
        url: 'product/delFinanceProducts/' + id,
        method: 'get'
    })
}

export function productDetail(id) {
    return request({
        url: 'product/financeProductById/' + id,
        method: 'get'
    })
}

// 通用文件上传，返回 data（文件URL）
export function uploadCommonFile(data) {
    return request({
        url: 'wiki/uploadImage',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        data
    })
}