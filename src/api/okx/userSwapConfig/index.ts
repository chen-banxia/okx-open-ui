import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserSwapConfigVO, UserSwapConfigForm, UserSwapConfigQuery } from '@/api/okx/userSwapConfig/types';

/**
 * 查询用户合约跟单配置列表
 * @param query
 * @returns {*}
 */

export const listUserSwapConfig = (query?: UserSwapConfigQuery): AxiosPromise<UserSwapConfigVO[]> => {
  return request({
    url: '/okx/userSwapConfig/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户合约跟单配置详细
 * @param id
 */
export const getUserSwapConfig = (id: string | number): AxiosPromise<UserSwapConfigVO> => {
  return request({
    url: '/okx/userSwapConfig/' + id,
    method: 'get'
  });
};

/**
 * 新增用户合约跟单配置
 * @param data
 */
export const addUserSwapConfig = (data: UserSwapConfigForm) => {
  return request({
    url: '/okx/userSwapConfig',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户合约跟单配置
 * @param data
 */
export const updateUserSwapConfig = (data: UserSwapConfigForm) => {
  return request({
    url: '/okx/userSwapConfig',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户合约跟单配置
 * @param id
 */
export const delUserSwapConfig = (id: string | number | Array<string | number>) => {
  return request({
    url: '/okx/userSwapConfig/' + id,
    method: 'delete'
  });
};
