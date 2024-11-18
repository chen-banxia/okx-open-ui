export interface InitpushInfoVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 币的简称
   */
  name: string;

  /**
   * 产品id 
   */
  instId: string | number;

  /**
   * 产品类型
   */
  instType: string;

}

export interface InitpushInfoForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 币的简称
   */
  name?: string;

  /**
   * 产品id 
   */
  instId?: string | number;

  /**
   * 产品类型
   */
  instType?: string;

}

export interface InitpushInfoQuery extends PageQuery {

  /**
   * 币的简称
   */
  name?: string;

  /**
   * 产品id 
   */
  instId?: string | number;

  /**
   * 产品类型
   */
  instType?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



