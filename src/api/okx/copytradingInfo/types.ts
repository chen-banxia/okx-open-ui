export interface CopytradingInfoVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 姓名
   */
  name: string;

  /**
   * 标识码
   */
  uniqueCode: string;

  /**
   * 推荐指数
   */
  recomIndex: string;

  /**
   * 平台
   */
  platform: string;

}

export interface CopytradingInfoForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 姓名
   */
  name?: string;

  /**
   * 标识码
   */
  uniqueCode?: string;

  /**
   * 推荐指数
   */
  recomIndex?: string;

  /**
   * 平台
   */
  platform?: string;

}

export interface CopytradingInfoQuery extends PageQuery {

  /**
   * 姓名
   */
  name?: string;

  /**
   * 标识码
   */
  uniqueCode?: string;

  /**
   * 推荐指数
   */
  recomIndex?: string;

  /**
   * 平台
   */
  platform?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



