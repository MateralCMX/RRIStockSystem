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
    public class VarietyBLLTests
    {
        private readonly VarietyBLL _bll = new VarietyBLL();
        [TestMethod()]
        public void AddTest()
        {
            T_Variety model = new T_Variety
            {
                Name = "火星茶"
            };
            _bll.Add(model);
        }

        [TestMethod()]
        public void DeleteTest()
        {
            _bll.Delete(Guid.Parse("012FA116-F518-4CF4-91B9-EF5200C3388A"));
        }
    }
}