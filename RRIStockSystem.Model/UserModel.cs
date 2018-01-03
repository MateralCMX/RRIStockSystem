using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RRIStockSystem.Model
{
    /// <summary>
    /// 登录模型
    /// </summary>
    public sealed class LoginInModel
    {
        /// <summary>
        /// 登录名
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 登录密码
        /// </summary>
        public string Password { get; set; }
        /// <summary>
        /// 验证码
        /// </summary>
        public string ValidateCode { get; set; }
    }
    /// <summary>
    /// 登录成功模型
    /// </summary>
    public sealed class LoginOutModel
    {
        /// <summary>
        /// 用户唯一标识
        /// </summary>
        public Guid ID { get; set; }
        /// <summary>
        /// Token
        /// </summary>
        public string Token { get; set; }
    }
    /// <summary>
    /// 修改用户模型
    /// </summary>
    public sealed class EditUserInModel : T_User, IVerificationLoginModel
    {
        /// <summary>
        /// 登录用户唯一标识
        /// </summary>
        public Guid LoginUserID { get; set; }
        /// <summary>
        /// 登录用户Token
        /// </summary>
        public string LoginUserToken { get; set; }
    }
    /// <summary>
    /// 修改密码模型
    /// </summary>
    public sealed class EditPasswordInModel : BaseQueryModel
    {
        /// <summary>
        /// 用户唯一标识
        /// </summary>
        public Guid ID { get; set; }
        /// <summary>
        /// 旧密码
        /// </summary>
        public string OldPassword { get; set; }
        /// <summary>
        /// 新密码
        /// </summary>
        public string NewPassword { get; set; }
    }
}
