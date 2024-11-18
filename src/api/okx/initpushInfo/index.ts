import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InitpushInfoVO, InitpushInfoForm, InitpushInfoQuery } from '@/api/okx/initpushInfo/types';

/**
 * 查询定时推送币信息列表
 * @param query
 * @returns {*}
 */

export const listInitpushInfo = (query?: InitpushInfoQuery): AxiosPromise<InitpushInfoVO[]> => {
  return request({
    url: '/okx/initpushInfo/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询定时推送币信息详细
 * @param id
 */
export const getInitpushInfo = (id: string | number): AxiosPromise<InitpushInfoVO> => {
  return request({
    url: '/okx/initpushInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增定时推送币信息
 * @param data
 */
export const addInitpushInfo = (data: InitpushInfoForm) => {
  return request({
    url: '/okx/initpushInfo',
    method: 'post',
    data: data
  });
};

/**
 * 修改定时推送币信息
 * @param data
 */
export const updateInitpushInfo = (data: InitpushInfoForm) => {
  return request({
    url: '/okx/initpushInfo',
    method: 'put',
    data: data
  });
};

/**
 * 删除定时推送币信息
 * @param id
 */
export const delInitpushInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/okx/initpushInfo/' + id,
    method: 'delete'
  });
};
