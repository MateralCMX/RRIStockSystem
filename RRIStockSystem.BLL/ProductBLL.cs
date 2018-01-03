using MateralTools.MEncryption;
using RRIStockSystem.DAL;
using RRIStockSystem.Model;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RRIStockSystem.BLL
{
    /// <summary>
    /// 商品业务逻辑层
    /// </summary>
    public sealed class ProductBLL : BaseBLL<ProductDAL, T_Product>
    {
        #region 公共方法
        /// <summary>
        /// 删除一个商品对象
        /// </summary>
        /// <param name="ID">商品ID</param>
        /// <exception cref="ArgumentException"></exception>
        public void Delete(Guid userID)
        {
            T_Product dbM = _dal.GetDBModelInfoByID(userID);
            if (dbM != null)
            {
                dbM.IfDelete = true;
                _dal.SaveChange();
            }
            else
            {
                throw new ArgumentException("商品不存在。");
            }
        }
        /// <summary>
        /// 修改一个商品对象
        /// </summary>
        /// <param name="model">商品对象</param>
        /// <exception cref="ArgumentException"></exception>
        public void Update(T_Product model)
        {
            T_Product dbM = _dal.GetDBModelInfoByID(model.ID);
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
                throw new ArgumentException("商品不存在");
            }
        }
        /// <summary>
        /// 添加一个商品对象(后台添加)
        /// </summary>
        /// <param name="model">商品对象</param>
        /// <exception cref="ArgumentException"></exception>
        public void Add(T_Product model)
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
        /// <summary>
        /// 获得二维码
        /// </summary>
        /// <param name="id">商品唯一标识</param>
        /// <returns></returns>
        public Bitmap GetRQCode(Guid id)
        {
            Bitmap img = EncryptionManager.QRCodeEncode(id.ToString());
            return img;
        }
        #endregion
        #region 私有方法
        /// <summary>
        /// 验证
        /// </summary>
        /// <param name="model"></param>
        /// <param name="msg"></param>
        /// <returns>验证结果</returns>
        protected override bool Verification(T_Product model, ref string msg)
        {
            if (!string.IsNullOrEmpty(model.Name))
            {
                msg += "名称不能为空，";
            }
            if (!string.IsNullOrEmpty(model.Manufactor))
            {
                msg += "厂家不能为空，";
            }
            if (!string.IsNullOrEmpty(model.Mobile))
            {
                msg += "手机不能为空，";
            }
            if (!string.IsNullOrEmpty(model.Region))
            {
                msg += "区域不能为空，";
            }
            return Verification(model, ref msg);
        }
        #endregion
    }
}
