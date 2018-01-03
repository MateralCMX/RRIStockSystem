using Microsoft.VisualStudio.TestTools.UnitTesting;
using RRIStockSystem.BLL;
using RRIStockSystem.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RRIStockSystem.BLL.Tests
{
    [TestClass()]
    public class UserBLLTests
    {
        private readonly UserBLL _bll = new UserBLL();
        [TestMethod()]
        public void AddTest()
        {
            T_User userM = new T_User
            {
                TrueName = "管理员",
                UserName = "Admin"
            };
            try
            {
                _bll.Add(userM);
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        [TestMethod()]
        public void LoginTest()
        {
            LoginOutModel loM = _bll.Login("Admin", "123456");
        }

        [TestMethod()]
        public void DeleteTest()
        {
            try
            {
                _bll.Delete(Guid.Parse("43454034-0AD4-4256-8250-4D3245EE1937"));
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        [TestMethod()]
        public void UpdateTest()
        {
            T_User userM = _bll.GetDBModelInfoByID(Guid.Parse("43454034-0AD4-4256-8250-4D3245EE1937"));
            userM.TrueName = "陈明旭";
            try
            {
                _bll.Update(userM);
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        [TestMethod()]
        public void ResetPasswordTest()
        {
            try
            {
                _bll.ResetPassword(Guid.Parse("43454034-0AD4-4256-8250-4D3245EE1937"));
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        [TestMethod()]
        public void EditMyPasswordTest()
        {
            try
            {
                _bll.EditMyPassword(Guid.Parse("43454034-0AD4-4256-8250-4D3245EE1937"), "123456", "1234567", Guid.Parse("43454034-0AD4-4256-8250-4D3245EE1937"));
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}