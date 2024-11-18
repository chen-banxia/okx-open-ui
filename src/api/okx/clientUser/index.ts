import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ClientUserVO, ClientUserForm, ClientUserQuery } from '@/api/okx/clientUser/types';

/**
 * 查询系统用户信息列表
 * @param query
 * @returns {*}
 */

export const listClientUser = (query?: ClientUserQuery): AxiosPromise<ClientUserVO[]> => {
  return request({
    url: '/okx/clientUser/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询系统用户信息详细
 * @param id
 */
export const getClientUser = (id: string | number): AxiosPromise<ClientUserVO> => {
  return request({
    url: '/okx/clientUser/' + id,
    method: 'get'
  });
};

/**
 * 新增系统用户信息
 * @param data
 */
export const addClientUser = (data: ClientUserForm) => {
  return request({
    url: '/okx/clientUser',
    method: 'post',
    data: data
  });
};

/**
 * 修改系统用户信息
 * @param data
 */
export const updateClientUser = (data: ClientUserForm) => {
  return request({
    url: '/okx/clientUser',
    method: 'put',
    data: data
  });
};

/**
 * 删除系统用户信息
 * @param id
 */
export const delClientUser = (id: string | number | Array<string | number>) => {
  return request({
    url: '/okx/clientUser/' + id,
    method: 'delete'
  });
};
