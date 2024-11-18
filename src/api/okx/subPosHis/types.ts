export interface SubPosHisVO {
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
   * 平仓时间
   */
  closeTimeDate: string;

  /**
   * 平仓均价
   */
  closeAvgPx: string;

  /**
   * 收益额
   */
  pnl: string;

  /**
   * 收益率
   */
  pnlRatio: string;

  /**
   * 产品类型
   */
  instType: string;

  /**
   * 保证金
   */
  margin: string;

  /**
   * 币种
   */
  ccy: string;

  /**
   * 交易员唯一标识代码
   */
  uniqueCode: string;

}

export interface SubPosHisForm extends BaseEntity {
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
   * 平仓时间
   */
  closeTimeDate?: string;

  /**
   * 平仓均价
   */
  closeAvgPx?: string;

  /**
   * 收益额
   */
  pnl?: string;

  /**
   * 收益率
   */
  pnlRatio?: string;

  /**
   * 产品类型
   */
  instType?: string;

  /**
   * 保证金
   */
  margin?: string;

  /**
   * 币种
   */
  ccy?: string;

  /**
   * 交易员唯一标识代码
   */
  uniqueCode?: string;

}

export interface SubPosHisQuery extends PageQuery {

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
   * 平仓时间
   */
  closeTimeDate?: string;

  /**
   * 产品类型
   */
  instType?: string;

  /**
   * 交易员唯一标识代码
   */
  uniqueCode?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



