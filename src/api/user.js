/*
 * @Author: yangxingchen
 * @Date: 2020-12-14 16:34:52
 * @LastEditors: yangxingchen
 * @LastEditTime: 2020-12-20 00:07:45
 * @Description:
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/signin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/user_info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/signout',
    method: 'post'
  })
}
