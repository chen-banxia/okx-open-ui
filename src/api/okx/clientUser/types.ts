export interface ClientUserVO {
  /**
   * 用户ID
   */
  id: string | number;

  /**
   * 账号
   */
  username: string;

  /**
   * 昵称
   */
  nickName: string;

  /**
   * 头像
   */
  avatar: string;

  /**
   * 手机
   */
  tel: string;

  /**
   * 钉钉号
   */
  dingTel: string;

  /**
   * QQ
   */
  qq: string;

  /**
   * 性别
   */
  sex: string;

  /**
   * 上次登录时间
   */
  lastLoginTime: string;

}

export interface ClientUserForm extends BaseEntity {
  /**
   * 用户ID
   */
  id?: string | number;

  /**
   * 账号
   */
  username?: string;

  /**
   * 密码
   */
  password?: string;

  /**
   * 昵称
   */
  nickName?: string;

  /**
   * 头像
   */
  avatar?: string;

  /**
   * 手机
   */
  tel?: string;

  /**
   * 钉钉号
   */
  dingTel?: string;

  /**
   * QQ
   */
  qq?: string;

  /**
   * 性别
   */
  sex?: string;

  /**
   * 简介
   */
  introduction?: string;

  /**
   * 上次登录时间
   */
  lastLoginTime?: string;

}

export interface ClientUserQuery extends PageQuery {

  /**
   * 账号
   */
  username?: string;

  /**
   * 昵称
   */
  nickName?: string;

  /**
   * 手机
   */
  tel?: string;

  /**
   * 钉钉号
   */
  dingTel?: string;

  /**
   * QQ
   */
  qq?: string;

  /**
   * 性别
   */
  sex?: string;

  /**
   * 上次登录时间
   */
  lastLoginTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



