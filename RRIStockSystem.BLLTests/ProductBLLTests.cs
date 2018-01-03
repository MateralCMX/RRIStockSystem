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
    public class ProductBLLTests
    {
        private readonly ProductBLL _bll = new ProductBLL();
        [TestMethod()]
        public void AddTest()
        {
            T_Product model = new T_Product
            {
                Name="aaaa",
                Manufactor="qwe",
                Mobile="12345678901",
                FK_Variety=Guid.Parse("012FA116-F518-4CF4-91B9-EF5200C3388A"),
                Region="asd",
                Remark=""
            };
            _bll.Add(model);
        }
    }
}