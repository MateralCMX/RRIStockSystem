using MateralTools.MEncryption;
using MateralTools.MResult;
using MateralTools.MVerify;
using RRIStockSystem.DAL;
using RRIStockSystem.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RRIStockSystem.BLL
{
    /// <summary>
    /// 用户业务逻辑层
    /// </summary>
    public sealed class UserBLL : BaseBLL<UserDAL, T_User,V_User>
    {
        #region 构造方法
        /// <summary>
        /// 构造方法
        /// </summary>
        public UserBLL()
        {
            string tokenOverdue = ConfigurationManager.AppSettings["TokenOverdue"];
            if (!string.IsNullOrEmpty(tokenOverdue) && VerifyManager.IsInteger(tokenOverdue))
            {
                TokenOverdue = Convert.ToDouble(tokenOverdue);
            }
        }
        #endregion
        #region 成员
        /// <summary>
        /// Token有效时间[分钟]
        /// </summary>
        private static double TokenOverdue = 1440;
        /// <summary>
        /// 默认密码
        /// </summary>
        private const string DEFUALTPASSWORD = "123456";
        #endregion
        #region 公共方法
        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="userName">登录用户名</param>
        /// <param name="password">密码</param>
        /// <returns>登录结果 用户ID,Token值</returns>
        /// <exception cref="ApplicationException"></exception>
        public LoginOutModel Login(string userName, string password)
        {
            T_User dbM = _dal.GetUserInfoByUserName(userName);
            if (dbM.Password == EncryptionManager.MD5Encode_32(password))
            {
                dbM.Token = GetNewToken();
                dbM.TokenReadTime = DateTime.Now;
                _dal.SaveChange();
                LoginOutModel resM = new LoginOutModel
                {
                    ID = dbM.ID,
                    Token = dbM.Token
                };
                return resM;
            }
            return null;
        }
        /// <summary>
        /// 删除一个用户对象
        /// </summary>
        /// <param name="ID">用户ID</param>
        /// <exception cref="ArgumentException"></exception>
        public void Delete(Guid userID)
        {
            T_User dbM = _dal.GetDBModelInfoByID(userID);
            if (dbM != null)
            {
                dbM.IfDelete = true;
                _dal.SaveChange();
            }
            else
            {
                throw new ArgumentException("用户不存在。");
            }
        }
        /// <summary>
        /// 修改一个用户对象
        /// </summary>
        /// <param name="model">用户对象</param>
        /// <exception cref="ArgumentException"></exception>
        public void Update(T_User model)
        {
            T_User dbM = _dal.GetDBModelInfoByID(model.ID);
            if (dbM != null)
            {
                string msg = "";
                if (VerificationUpdate(model, ref msg))
                {
                    dbM.UserName = model.UserName;
                    dbM.TrueName = model.TrueName;
                    _dal.SaveChange();
                }
                else
                {
                    throw new ArgumentException(msg);
                }
            }
            else
            {
                throw new ArgumentException("用户不存在");
            }
        }
        /// <summary>
        /// 添加一个用户对象(后台添加)
        /// </summary>
        /// <param name="model">用户对象</param>
        /// <exception cref="ArgumentException"></exception>
        public void Add(T_User model)
        {
            DateTime dt = DateTime.Now;
            model.IfDelete = false;
            model.CreateTime = dt;
            model.Password = EncryptionManager.MD5Encode_32(DEFUALTPASSWORD);
            string msg = "";
            if (VerificationAdd(model, ref msg))
            {
                _dal.Insert(model);
            }
            else
            {
                throw new ArgumentException(msg);
            }
        }
        /// <summary>
        /// 重置密码
        /// </summary>
        /// <param name="userID">要重置的用户唯一标识</param>
        public void ResetPassword(Guid userID)
        {
            T_User dbM = _dal.GetDBModelInfoByID(userID);
            if (dbM != null)
            {
                dbM.Password = EncryptionManager.MD5Encode_32(DEFUALTPASSWORD);
                _dal.SaveChange();
            }
            else
            {
                throw new ArgumentException("该用户不存在");
            }
        }
        /// <summary>
        /// 更改密码
        /// </summary>
        /// <param name="userID">用户ID</param>
        /// <param name="oldPassword">新密码</param>
        /// <param name="password">新密码</param>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="ApplicationException"></exception>
        public void EditMyPassword(Guid userID, string oldPassword, string password, Guid LoginUserID)
        {
            if (userID == LoginUserID)
            {
                T_User dbM = _dal.GetDBModelInfoByID(userID);
                if (dbM != null)
                {
                    if (dbM.Password == EncryptionManager.MD5Encode_32(oldPassword))
                    {
                        dbM.Password = EncryptionManager.MD5Encode_32(password);
                        _dal.SaveChange();
                    }
                    else
                    {
                        throw new ArgumentException("旧密码错误");
                    }
                }
                else
                {
                    throw new ArgumentException("该用户不存在");
                }
            }
            else
            {
                throw new ApplicationException("只能修改自己的密码");
            }
        }
        /// <summary>
        /// Token过期验证
        /// </summary>
        /// <param name="userID">用户ID</param>
        /// <param name="token">Token值</param>
        /// <returns>验证结果</returns>
        public bool TokenValid(Guid userID, string token)
        {
            bool resM = false;
            T_User model = _dal.GetDBModelInfoByID(userID);
            if (model != null)
            {
                if (model.Token.Equals(token))
                {
                    if (model.TokenReadTime != null && model.TokenReadTime.Value.AddMinutes(TokenOverdue) >= DateTime.Now)
                    {
                        resM = true;
                    }
                }
            }
            else
            {
                throw new ArgumentException($"参数{nameof(userID)}错误。");
            }
            return resM;
        }
        /// <summary>
        /// 根据条件获得用户信息
        /// </summary>
        /// <param name="userName">用户名</param>
        /// <param name="trueName">真实姓名</param>
        /// <param name="pageM">分页对象</param>
        /// <returns>用户信息</returns>
        public List<V_User> GetUserInfoByWhere(string userName, string trueName, MPagingModel pageM)
        {
            return _dal.GetUserViewInfoByWhere(userName, trueName, pageM);
        }
        #endregion
        #region 私有方法
        /// <summary>
        /// 获得新的Token
        /// </summary>
        /// <returns>Token值</returns>
        private string GetNewToken()
        {
            string lib = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            Random rd = new Random();
            int Count = rd.Next(15, 32);
            string token = "";
            for (int i = 0; i < Count; i++)
            {
                token += lib[rd.Next(0, lib.Length)];
            }
            return EncryptionManager.MD5Encode_32(token);
        }
        /// <summary>
        /// 验证添加
        /// </summary>
        /// <param name="model"></param>
        /// <param name="msg"></param>
        /// <returns>验证结果</returns>
        private bool VerificationAdd(T_User model, ref string msg)
        {
            V_User temp;
            if (!string.IsNullOrEmpty(model.UserName))
            {
                temp = _dal.GetUserViewInfoByUserName(model.UserName);
                if (temp != null)
                {
                    msg += "用户名已被占用，";
                }
            }
            return Verification(model, ref msg);
        }
        /// <summary>
        /// 验证修改
        /// </summary>
        /// <param name="model">要验证的模型</param>
        /// <param name="msg">提示信息</param>
        /// <returns>验证结果</returns>
        private bool VerificationUpdate(T_User model, ref string msg)
        {
            V_User temp;
            if (!string.IsNullOrEmpty(model.UserName))
            {
                temp = _dal.GetUserViewInfoByUserName(model.UserName);
                if (temp != null && temp.ID != model.ID)
                {
                    msg += "用户名已被占用，";
                }
            }
            return Verification(model, ref msg);
        }
        #endregion
    }
}
