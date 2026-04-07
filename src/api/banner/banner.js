import request from '@/utils/request'

//列表
export function BannerList(data) {
    return request({
        url: 'cardBanner/findAll',
        method: 'post',
        data
    })
}

export function BannerAdd(data) {
    return request({
        url: 'cardBanner/add',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        data
    })
}

export function BannerUpdate(data) {
    return request({
        url: 'cardBanner/update',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        data
    })
}

export function BannerDelete(id) {
    return request({
        url: 'cardBanner/delete',
        method: 'get',
        params: {
            'id': id,
        }
    })
}

export function BannerChangeStatus(id,statusType) {
    return request({
        url: 'cardBanner/changeStatus',
        method: 'get',
        params: {
            'id': id,
            'statusType':statusType
        }
    })
}
