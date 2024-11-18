export interface UserSwapConfigVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 交易员标识码
   */
  uniqueCode: string;

  /**
   * 产品ID
   */
  instId: string | number;

  /**
   * 保证金模式
   */
  mgnMode: string;

  /**
   * 产品类型
   */
  instType: string;

  /**
   * 杠杆倍数
   */
  lever: string;

  /**
   * 投入u数量
   */
  num: string;

}

export interface UserSwapConfigForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 交易员标识码
   */
  uniqueCode?: string;

  /**
   * 产品ID
   */
  instId?: string | number;

  /**
   * 保证金模式
   */
  mgnMode?: string;

  /**
   * 产品类型
   */
  instType?: string;

  /**
   * 杠杆倍数
   */
  lever?: string;

  /**
   * 投入u数量
   */
  num?: string;

}

export interface UserSwapConfigQuery extends PageQuery {

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 交易员标识码
   */
  uniqueCode?: string;

  /**
   * 产品ID
   */
  instId?: string | number;

  /**
   * 保证金模式
   */
  mgnMode?: string;

  /**
   * 产品类型
   */
  instType?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



