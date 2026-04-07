import request from '@/utils/request'

//列表
export function appUserList(data) {
    return request({
        url: 'appUser/findList',
        method: 'post',
        data
    })
}

//钱包入口控制
export function upWalletState(id,state) {
    return request({
        url: 'appUserSys/upWalletState',
        method: 'get',
        params: {
            'id': id,
            'state':state
        }
    })
}

//查询用户kyc认证信息
export function findKycFile(uid) {
    return request({
        url: 'appUser/findKycFile',
        method: 'get',
        params: {
            'uid': uid,
        }
    })
}

//查询用户持卡人信息
export function findHolderByUid(uid) {
    return request({
        url: 'cardholder/findByUid',
        method: 'get',
        params: {
            'uid': uid,
        }
    })
}