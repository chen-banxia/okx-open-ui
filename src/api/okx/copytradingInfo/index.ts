import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CopytradingInfoVO, CopytradingInfoForm, CopytradingInfoQuery } from '@/api/okx/copytradingInfo/types';

/**
 * 查询交易员信息列表
 * @param query
 * @returns {*}
 */

export const listCopytradingInfo = (query?: CopytradingInfoQuery): AxiosPromise<CopytradingInfoVO[]> => {
  return request({
    url: '/okx/copytradingInfo/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询交易员信息详细
 * @param id
 */
export const getCopytradingInfo = (id: string | number): AxiosPromise<CopytradingInfoVO> => {
  return request({
    url: '/okx/copytradingInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增交易员信息
 * @param data
 */
export const addCopytradingInfo = (data: CopytradingInfoForm) => {
  return request({
    url: '/okx/copytradingInfo',
    method: 'post',
    data: data
  });
};

/**
 * 修改交易员信息
 * @param data
 */
export const updateCopytradingInfo = (data: CopytradingInfoForm) => {
  return request({
    url: '/okx/copytradingInfo',
    method: 'put',
    data: data
  });
};

/**
 * 删除交易员信息
 * @param id
 */
export const delCopytradingInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/okx/copytradingInfo/' + id,
    method: 'delete'
  });
};
