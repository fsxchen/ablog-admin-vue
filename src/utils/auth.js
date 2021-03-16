/*
 * @Author: yangxingchen
 * @Date: 2020-12-14 16:34:52
 * @LastEditors: yangxingchen
 * @LastEditTime: 2021-02-04 21:56:50
 * @Description:
 */
import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
