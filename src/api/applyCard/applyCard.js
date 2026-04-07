import request from '@/utils/request'

//列表
export function openCardApplyList(data) {
    return request({
        url: 'cardApply/openCardApply',
        method: 'post',
        data
    })
}

//开卡首次充值激活
export function openCard(id) {
    return request({
        url: 'cardApply/openCard',
        params: {
            'id': id
        }
    })
}

//申请kyc
export function kycApply(id) {
    return request({
        url: 'kyc/apply',
        params: {
            'applyId': id
        }
    })
}

//实体卡分配
export function cardBinding(id,cardNumber) {
    return request({
        url: 'card/cardBinding',
        params: {
            'applyId': id,
            'cardNumber':cardNumber
        }
    })
}

export function shipping(data) {
    return request({
        url: 'card/shipping',
        method: 'post',
        data
    })
}

export function cardTopUp(data) {
    return request({
        url: 'card/topUp',
        method: 'post',
        data
    })
}

export function cardApplyReject(data) {
    return request({
        url: 'cardApply/reject',
        method: 'post',
        data
    })
}

export function cardApplyOpenCardV2(id) {
    return request({
        url: 'cardApply/openCardV2',
        method: 'get',
        params: {
            'id': id
        }
    })
}

export function cardApplyRejectV2(data) {
    return request({
        url: 'cardApply/rejectV2',
        method: 'post',
        data
    })
}