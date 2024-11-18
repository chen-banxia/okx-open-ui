import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SubPosCurrentVO, SubPosCurrentForm, SubPosCurrentQuery } from '@/api/okx/subPosCurrent/types';

/**
 * 查询交易员当前带单列表
 * @param query
 * @returns {*}
 */

export const listSubPosCurrent = (query?: SubPosCurrentQuery): AxiosPromise<SubPosCurrentVO[]> => {
  return request({
    url: '/okx/subPosCurrent/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询交易员当前带单详细
 * @param id
 */
export const getSubPosCurrent = (id: string | number): AxiosPromise<SubPosCurrentVO> => {
  return request({
    url: '/okx/subPosCurrent/' + id,
    method: 'get'
  });
};

/**
 * 新增交易员当前带单
 * @param data
 */
export const addSubPosCurrent = (data: SubPosCurrentForm) => {
  return request({
    url: '/okx/subPosCurrent',
    method: 'post',
    data: data
  });
};

/**
 * 修改交易员当前带单
 * @param data
 */
export const updateSubPosCurrent = (data: SubPosCurrentForm) => {
  return request({
    url: '/okx/subPosCurrent',
    method: 'put',
    data: data
  });
};

/**
 * 删除交易员当前带单
 * @param id
 */
export const delSubPosCurrent = (id: string | number | Array<string | number>) => {
  return request({
    url: '/okx/subPosCurrent/' + id,
    method: 'delete'
  });
};
