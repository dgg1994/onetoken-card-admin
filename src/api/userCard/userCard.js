import request from '@/utils/request'

//交易列表
export function findTransaction(data) {
    return request({
        url: 'appUserCard/pcFindTransaction',
        method: 'post',
        data
    })
}

//持有银行卡
export function findUserCardList(data) {
    return request({
        url: 'appUserCard/findUserCardList',
        method: 'post',
        data
    })
}

export function pcFindUserCardList(data) {
    return request({
        url: 'appUserCard/pcFindUserCardList',
        method: 'post',
        data
    })
}