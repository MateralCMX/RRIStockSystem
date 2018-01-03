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
    /// 库存业务逻辑层
    /// </summary>
    public sealed class StockBLL : BaseBLL<StockDAL, T_Stock>
    {
        #region 公共方法
        /// <summary>
        /// 删除一个库存对象
        /// </summary>
        /// <param name="ID">库存ID</param>
        /// <exception cref="ArgumentException"></exception>
        public void Delete(Guid userID)
        {
            T_Stock dbM = _dal.GetDBModelInfoByID(userID);
            if (dbM != null)
            {
                dbM.IfDelete = true;
                _dal.SaveChange();
            }
            else
            {
                throw new ArgumentException("库存不存在。");
            }
        }
        /// <summary>
        /// 添加一个库存对象(后台添加)
        /// </summary>
        /// <param name="model">库存对象</param>
        /// <exception cref="ArgumentException"></exception>
        public void Add(T_Stock model)
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
        protected override bool Verification(T_Stock model, ref string msg)
        {
            if (model.StockNumber <= 0)
            {
                msg += "库存数量不能小于等于0，";
            }
            return Verification(model, ref msg);
        }
        #endregion
    }
}
