/*
 * @Author: yangxingchen
 * @Date: 2020-12-20 16:32:25
 * @LastEditors: yangxingchen
 * @LastEditTime: 2021-03-04 23:20:48
 * @Description:
 */

import request from '@/utils/request'

export function listCategory(query) {
  return request({
    url: '/category',
    method: 'get',
    params: query
  })
}



export function fetchCategory(id) {
  return request({
    url: `/category/${id}`,
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}
