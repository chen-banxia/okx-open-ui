import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SubPosHisVO, SubPosHisForm, SubPosHisQuery } from '@/api/okx/subPosHis/types';

/**
 * 查询交易员带单历史列表
 * @param query
 * @returns {*}
 */

export const listSubPosHis = (query?: SubPosHisQuery): AxiosPromise<SubPosHisVO[]> => {
  return request({
    url: '/okx/subPosHis/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询交易员带单历史详细
 * @param id
 */
export const getSubPosHis = (id: string | number): AxiosPromise<SubPosHisVO> => {
  return request({
    url: '/okx/subPosHis/' + id,
    method: 'get'
  });
};

/**
 * 新增交易员带单历史
 * @param data
 */
export const addSubPosHis = (data: SubPosHisForm) => {
  return request({
    url: '/okx/subPosHis',
    method: 'post',
    data: data
  });
};

/**
 * 修改交易员带单历史
 * @param data
 */
export const updateSubPosHis = (data: SubPosHisForm) => {
  return request({
    url: '/okx/subPosHis',
    method: 'put',
    data: data
  });
};

/**
 * 删除交易员带单历史
 * @param id
 */
export const delSubPosHis = (id: string | number | Array<string | number>) => {
  return request({
    url: '/okx/subPosHis/' + id,
    method: 'delete'
  });
};
