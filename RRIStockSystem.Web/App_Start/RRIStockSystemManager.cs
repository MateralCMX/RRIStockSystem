using RRIStockSystem.BLL;
using MateralTools.MResult;
using System;
using System.Web;

namespace RRIStockSystem.Web
{
    /// <summary>
    /// 应用程序管理类
    /// </summary>
    public static class RRIStockSystemManager
    {
        /// <summary>
        /// 保存上传文件地址
        /// </summary>
        public const string SAVEPATH = "UploadFiles\\";
        /// <summary>
        /// 保存临时文件地址
        /// </summary>
        public static string SAVETEMPPATH
        {
            get
            {
                return SAVEPATH + "Temp\\";
            }
        }
        /// <summary>
        /// 保存图片文件地址
        /// </summary>
        public static string SAVEIMAGEPATH
        {
            get
            {
                return SAVEPATH + "Images\\";
            }
        }
        /// <summary>
        /// 保存微信企业号图片文件地址
        /// </summary>
        public static string SAVEWECHATWORKIMAGEPATH
        {
            get
            {
                return SAVEPATH + "WeChatWorkImages\\";
            }
        }
        /// <summary>
        /// 富文本编辑器上传地址
        /// </summary>
        public static string SAVEKINDEDITORIMAGEPATH
        {
            get
            {
                return SAVEPATH + "KindEditorImages\\";
            }
        }
        /// <summary>
        /// 验证码SessionKey
        /// </summary>
        public const string VALIDATECODEKEY = "ValidateCodeValue";
        /// <summary>
        /// 设置Session
        /// </summary>
        /// <param name="key">key</param>
        /// <param name="value">值</param>
        public static void SetSession(string key, object value)
        {
            HttpContext.Current.Session[key] = value;
        }
        /// <summary>
        /// 获得Session
        /// </summary>
        /// <param name="key">key</param>
        /// <returns>保存的值</returns>
        public static object GetSession(string key)
        {
            return HttpContext.Current.Session[key];
        }
        /// <summary>
        /// 获得Session
        /// </summary>
        /// <param name="key">key</param>
        /// <returns>保存的值</returns>
        public static T GetSession<T>(string key)
        {
            return (T)GetSession(key);
        }
    }
}
