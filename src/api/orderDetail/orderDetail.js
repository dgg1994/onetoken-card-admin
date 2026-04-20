import request from '@/utils/request'

/** 理财收益异常列表查询 */
export function findOrderDetailsErrList(data) {
  return request({
    url: 'orderDetail/findOrderDetailsErrList',
    method: 'post',
    data
  })
}

/** 理财收益异常处理*/
export function editOrderDetailsErr(data) {
  return request({
    url: 'orderDetail/editOrderDetailsErr',
    method: 'post',
    data
  })
}
