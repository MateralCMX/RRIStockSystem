using MateralTools.MLinq;
using MateralTools.MResult;
using RRIStockSystem.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace RRIStockSystem.DAL
{
    /// <summary>
    /// 业务数据层
    /// </summary>
    public sealed class UserDAL : BaseDAL<T_User, V_User>
    {
        /// <summary>
        /// 根据用户名获取用户信息
        /// </summary>
        /// <param name="userName">用户名</param>
        /// <returns>用户信息</returns>
        public T_User GetUserInfoByUserName(string userName)
        {
            return _DB.T_User.Where(m => m.UserName == userName && m.IfDelete == false).FirstOrDefault();
        }
        /// <summary>
        /// 根据用户名获取用户信息
        /// </summary>
        /// <param name="userName">用户名</param>
        /// <returns>用户信息</returns>
        public V_User GetUserViewInfoByUserName(string userName)
        {
            return _DB.V_User.Where(m => m.UserName == userName).FirstOrDefault();
        }
        /// <summary>
        /// 根据条件获得用户信息
        /// </summary>
        /// <param name="userName">用户名</param>
        /// <param name="trueName">真实姓名</param>
        /// <param name="pageM">分页对象</param>
        /// <returns>用户信息</returns>
        public List<V_User> GetUserViewInfoByWhere(string userName, string trueName, MPagingModel pageM)
        {
            Expression<Func<V_User, bool>> expression = m => true;

            if (!string.IsNullOrEmpty(userName))
            {
                expression = LinqManager.And(expression, m => m.UserName == userName);
            }
            if (!string.IsNullOrEmpty(trueName))
            {
                expression = LinqManager.And(expression, m => m.TrueName.Contains(trueName));
            }
            pageM.DataCount = _DB.V_User.Count(expression.Compile());
            List<V_User> listM = null;
            if (pageM.DataCount > 0)
            {
                listM = _DB.V_User.Where(expression.Compile()).Skip((pageM.PagingIndex - 1) * pageM.PagingSize).Take(pageM.PagingSize).OrderBy(m => m.CreateTime).ToList();
            }
            return listM;
        }
    }
}
