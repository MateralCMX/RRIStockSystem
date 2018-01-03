using RRIStockSystem.DAL;
using RRIStockSystem.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RRIStockSystem.BLL
{
    /// <summary>
    /// 种类业务逻辑层
    /// </summary>
    public sealed class VarietyBLL : BaseBLL<VarietyDAL, T_Variety>
    {
        #region 公共方法
        /// <summary>
        /// 删除一个种类对象
        /// </summary>
        /// <param name="ID">种类ID</param>
        /// <exception cref="ArgumentException"></exception>
        public void Delete(Guid userID)
        {
            T_Variety dbM = _dal.GetDBModelInfoByID(userID);
            if (dbM != null)
            {
                dbM.IfDelete = true;
                _dal.SaveChange();
            }
            else
            {
                throw new ArgumentException("种类不存在。");
            }
        }
        /// <summary>
        /// 修改一个种类对象
        /// </summary>
        /// <param name="model">种类对象</param>
        /// <exception cref="ArgumentException"></exception>
        public void Update(T_Variety model)
        {
            T_Variety dbM = _dal.GetDBModelInfoByID(model.ID);
            if (dbM != null)
            {
                string msg = "";
                if (Verification(model, ref msg))
                {
                    dbM.Name = model.Name;
                    _dal.SaveChange();
                }
                else
                {
                    throw new ArgumentException(msg);
                }
            }
            else
            {
                throw new ArgumentException("种类不存在");
            }
        }
        /// <summary>
        /// 添加一个种类对象(后台添加)
        /// </summary>
        /// <param name="model">种类对象</param>
        /// <exception cref="ArgumentException"></exception>
        public void Add(T_Variety model)
        {
            model.IfDelete = false;
            string msg = "";
            if (Verification(model, ref msg))
            {
                _dal.Insert(model);
            }
            else
            {
                throw new ArgumentException(msg);
            }
        }
        #endregion
        #region 私有方法
        /// <summary>
        /// 验证
        /// </summary>
        /// <param name="model"></param>
        /// <param name="msg"></param>
        /// <returns>验证结果</returns>
        protected override bool Verification(T_Variety model, ref string msg)
        {
            if (!string.IsNullOrEmpty(model.Name))
            {
                msg += "名称不能为空，";
            }
            return Verification(model, ref msg);
        }
        #endregion
    }
}
