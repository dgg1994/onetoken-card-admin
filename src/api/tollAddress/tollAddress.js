import request from '@/utils/request'

export function tollAddressAdd(data) {
    return request({
        url: 'tollAddress/add',
        method: 'post',
        data
    })
}


export function tollAddressUpdate(data) {
    return request({
        url: 'tollAddress/update',
        method: 'post',
        data
    })
}

export function tollAddressList(data) {
    return request({
        url: 'tollAddress/findList',
        method: 'post',
        data
    })
}

export function tollAddressDelete(id) {
    return request({
        url: 'tollAddress/delete',
        method: 'get',
        params: {
            id: id
        }
    })
}