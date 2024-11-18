export interface SubPosCurrentVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 产品ID
   */
  instId: string | number;

  /**
   * 持仓方向
   */
  posSide: string | number;

  /**
   * 保证金模式
   */
  mgnMode: string;

  /**
   * 杠杆倍数
   */
  lever: string;

  /**
   * 开仓均价
   */
  openAvgPx: string;

  /**
   * 开仓时间
   */
  openTimeDate: string;

  /**
   * 持仓张数
   */
  subPos: string;

  /**
   * 产品类型
   */
  instType: string;

  /**
   * 保证金
   */
  margin: string;

  /**
   * 未实现收益
   */
  upl: string;

  /**
   * 未实现收益率
   */
  uplRatio: string;

  /**
   * 标记价格（仅适用于合约）
   */
  markPx: string;

  /**
   * 交易员标识码
   */
  uniqueCode: string;

}

export interface SubPosCurrentForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 产品ID
   */
  instId?: string | number;

  /**
   * 带单仓位ID
   */
  subPosId?: string | number;

  /**
   * 持仓方向
   */
  posSide?: string | number;

  /**
   * 保证金模式
   */
  mgnMode?: string;

  /**
   * 杠杆倍数
   */
  lever?: string;

  /**
   * 开仓均价
   */
  openAvgPx?: string;

  /**
   * 开仓时间
   */
  openTimeDate?: string;

  /**
   * 持仓张数
   */
  subPos?: string;

  /**
   * 产品类型
   */
  instType?: string;

  /**
   * 保证金
   */
  margin?: string;

  /**
   * 未实现收益
   */
  upl?: string;

  /**
   * 未实现收益率
   */
  uplRatio?: string;

  /**
   * 标记价格（仅适用于合约）
   */
  markPx?: string;

  /**
   * 交易员标识码
   */
  uniqueCode?: string;

}

export interface SubPosCurrentQuery extends PageQuery {

  /**
   * 产品ID
   */
  instId?: string | number;

  /**
   * 持仓方向
   */
  posSide?: string | number;

  /**
   * 保证金模式
   */
  mgnMode?: string;

  /**
   * 杠杆倍数
   */
  lever?: string;

  /**
   * 开仓时间
   */
  openTimeDate?: string;

  /**
   * 产品类型
   */
  instType?: string;

  /**
   * 交易员标识码
   */
  uniqueCode?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



