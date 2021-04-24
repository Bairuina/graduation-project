import http from '@/utils/http'
import api from '@/api'

// 新增
export function serviceCreateMemorandum(data: object) {
  return http.post(api.memorandum, data, {
    headers: { successAlert: true }
  })
}

// 查询所有
export function serviceGetMemorandum(params?: object) {
  return http.get(api.memorandum, {
    params
  })
}

// 通过id查询
export function serviceGetMemorandumById(id: unknown) {
  return http.get(`${api.memorandum}/${id}`)
}

// 删除
export function serviceDeleteMemorandum(id: unknown) {
  return http.delete(`${api.memorandum}/${id}`,{
    headers: { successAlert: true }
  })
}

// 更新
export function serviceUpdateMemorandum(id: unknown, data: object) {
  return http.put(`${api.memorandum}/${id}`, data, {
    headers: { successAlert: true }
  })
}
