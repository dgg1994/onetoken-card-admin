import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function logList(data) {
    return request({
        url: 'log/findList',
        method: 'post',
        data
    })
}
