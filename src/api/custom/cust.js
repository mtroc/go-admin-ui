import request from '@/utils/request'

// 查询Cust列表
export function listCust(query) {
  return request({
    url: '/api/v1/custom/custList',
    method: 'get',
    params: query
  })
}

// 查询Cust详细
export function getCust(id) {
  return request({
    url: '/api/v1/custom/cust/' + id,
    method: 'get'
  })
}

// 新增Cust
export function addCust(data) {
  return request({
    url: '/api/v1/custom/cust',
    method: 'post',
    data: data
  })
}

// 修改Cust
export function updateCust(data) {
  return request({
    url: '/api/v1/custom/cust',
    method: 'put',
    data: data
  })
}

// 删除Cust
export function delCust(id) {
  return request({
    url: '/api/v1/custom/cust/' + id,
    method: 'delete'
  })
}

