using MateralTools.MCache;
using RRIStockSystem.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Hosting;
using System.Web.Http;

namespace RRIStockSystem.Web.Controllers.API
{
    /// <summary>
    /// API父级控制器
    /// </summary>
    public class ApiBaseController<T> : ApiBaseController
    {
        /// <summary>
        /// 业务操作对象
        /// </summary>
        public readonly T _bll;
        /// <summary>
        /// 构造方法
        /// </summary>
        public ApiBaseController()
        {
            ConstructorInfo[] constructors = typeof(T).GetConstructors();
            ConstructorInfo constructor = (from m in constructors
                                           where m.GetParameters().Length == 0
                                           select m).FirstOrDefault();
            if (constructor != null)
            {
                _bll = (T)constructor.Invoke(new object[0]);
            }
        }
    }
    /// <summary>
    /// API父级控制器
    /// </summary>
    public class ApiBaseController : ApiController
    {
        /// <summary>
        /// 验证验证码
        /// </summary>
        /// <param name="ValidateCode">验证码</param>
        /// <returns></returns>
        protected bool VerificationImageCode(string ValidateCode)
        {
            ValidateCode = ValidateCode.ToUpper();
            //string ValidateCodeValue = ApplicationManager.GetSession<string>(RRIStockSystemManager.VALIDATECODEKEY);
            string ValidateCodeValue = WebCacheManager.Get<string>(RRIStockSystemManager.VALIDATECODEKEY + ValidateCode);
            return (!string.IsNullOrEmpty(ValidateCodeValue) && !string.IsNullOrEmpty(ValidateCode) && ValidateCodeValue == ValidateCode);
        }
    }
}
