import request from '@/utils/request'

//列表
export function messageTemplateAdd(data) {
    return request({
        url: 'messageTemplate/add',
        method: 'post',
        data
    })
}

export function messageTemplateUpdate(data) {
    return request({
        url: 'messageTemplate/update',
        method: 'post',
        data
    })
}


export function messageTemplateDelete(id) {
    return request({
        url: 'messageTemplate/delete',
        method: 'get',
        params: {
            'id': id,
        }
    })
}

export function messageTemplateList(data) {
    return request({
        url: 'messageTemplate/findList',
        method: 'post',
        data
    })
}

/**邮件模板 */

export function emailTemplateAdd(data) {
    return request({
        url: 'emailTemplate/add',
        method: 'post',
        data
    })
}

export function emailTemplateUpdate(data) {
    return request({
        url: 'emailTemplate/update',
        method: 'post',
        data
    })
}

export function emailTemplateList(data) {
    return request({
        url: 'emailTemplate/findList',
        method: 'post',
        data
    })
}

export function emailTemplateDelete(id) {
    return request({
        url: 'emailTemplate/delete',
        method: 'get',
        params: {
            'id': id,
        }
    })
}