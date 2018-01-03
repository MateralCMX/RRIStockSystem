/// <reference path="../../../scripts/jquery.d.ts" />
/// <reference path="../../../scripts/base.ts" />
/// <reference path="../../../lib/m-tools/m-tools.ts" />
var RRIStockSystem;
(function (RRIStockSystem) {
    var Backstage;
    (function (Backstage) {
        /**
         * 首页
         */
        var IndexPage = /** @class */ (function () {
            /**
             * 构造方法
             */
            function IndexPage() {
                if (RRIStockSystem.common.IsLogin(true)) {
                    this.BindEvent();
                    this.BindLoginUserInfo();
                    this.BinMenuInfo();
                }
            }
            /**
             * 绑定事件
             */
            IndexPage.prototype.BindEvent = function () {
                MDMa.AddEvent("BtnSave", "click", this.BtnSaveEvent_Click);
                MDMa.AddEvent("BtnSavePassword", "click", this.BtnSavePasswordEvent_Click);
                MDMa.AddEvent("BtnLogOut", "click", this.BtnLogOutEvent_Click);
                MDMa.AddEvent("InputUserName", "invalid", function (e) {
                    var element = e.target;
                    var setting = new RRIStockSystem.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    setting.Pattern = "只可使用英文和数字";
                    RRIStockSystem.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputTrueName", "invalid", function (e) {
                    var element = e.target;
                    var setting = new RRIStockSystem.InvalidOptionsModel();
                    setting.Max = "长度不能超过" + element.maxLength;
                    setting.Required = "不能为空";
                    setting.Pattern = "请填写正确的中文真实姓名";
                    RRIStockSystem.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputOldPassword", "invalid", function (e) {
                    var setting = new RRIStockSystem.InvalidOptionsModel();
                    setting.Required = "不能为空";
                    RRIStockSystem.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputNewPassword1", "invalid", function (e) {
                    var setting = new RRIStockSystem.InvalidOptionsModel();
                    setting.Required = "不能为空";
                    RRIStockSystem.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputNewPassword2", "invalid", function (e) {
                    var setting = new RRIStockSystem.InvalidOptionsModel();
                    setting.Required = "不能为空";
                    RRIStockSystem.common.InputInvalidEvent_Invalid(e, setting);
                });
            };
            /**
             * 绑定登录用户信息
             */
            IndexPage.prototype.BindLoginUserInfo = function () {
                var loginUserInfo = RRIStockSystem.common.GetLoginUserInfo();
                var url = "api/User/GetUserViewInfoByID";
                var data = {
                    ID: loginUserInfo.ID
                };
                var SFun = function (resM, xhr, state) {
                    var UserInfo = resM["Data"];
                    RRIStockSystem.common.BindInputInfo(UserInfo);
                    var LoginUserName = MDMa.$("LoginUserName");
                    LoginUserName.insertBefore(document.createTextNode(UserInfo["TrueName"]), LoginUserName.childNodes[0]);
                };
                var FFun = function (resM, xhr, state) {
                    RRIStockSystem.common.ShowMessageBox(resM["Message"]);
                };
                var CFun = function (resM, xhr, state) {
                };
                RRIStockSystem.common.SendGetAjax(url, data, SFun, FFun, CFun);
            };
            /**
             * 保存按钮单击事件
             * @param e
             */
            IndexPage.prototype.BtnSaveEvent_Click = function (e) {
                RRIStockSystem.common.ClearErrorMessage();
                var data = IndexInputModel.GetInputData();
                if (data != null) {
                    var BtnElement_1 = e.target;
                    BtnElement_1.textContent = "保存中......";
                    BtnElement_1.disabled = true;
                    var url = "api/User/EditUser";
                    var SFun = function (resM, xhr, state) {
                        $('#EditModal').modal('toggle');
                    };
                    var FFun = function (resM, xhr, state) {
                    };
                    var CFun = function (resM, xhr, state) {
                        BtnElement_1.textContent = "保存";
                        BtnElement_1.disabled = false;
                        RRIStockSystem.common.ShowMessageBox(resM["Message"]);
                    };
                    RRIStockSystem.common.SendPostAjax(url, data, SFun, FFun, CFun);
                }
            };
            /**
             * 退出登录按钮单击事件
             * @param e
             */
            IndexPage.prototype.BtnLogOutEvent_Click = function (e) {
                RRIStockSystem.common.RemoveLoginUserInfo();
                RRIStockSystem.common.GoToPage("Login");
            };
            /**
             * 保存密码按钮单击事件
             * @param e
             */
            IndexPage.prototype.BtnSavePasswordEvent_Click = function (e) {
                RRIStockSystem.common.ClearErrorMessage();
                var data = EditPasswordModel.GetInputData();
                if (data != null) {
                    var BtnElement_2 = e.target;
                    BtnElement_2.textContent = "保存中......";
                    BtnElement_2.disabled = true;
                    var url = "api/User/EditMyPassword";
                    var SFun = function (resM, xhr, state) {
                        $('#EditPassowrdModal').modal('toggle');
                    };
                    var FFun = function (resM, xhr, state) {
                    };
                    var CFun = function (resM, xhr, state) {
                        BtnElement_2.textContent = "保存";
                        BtnElement_2.disabled = false;
                        RRIStockSystem.common.ShowMessageBox(resM["Message"]);
                    };
                    RRIStockSystem.common.SendPostAjax(url, data, SFun, FFun, CFun);
                }
            };
            /**
     * 根据登录获得菜单信息
     */
            IndexPage.prototype.BinMenuInfo = function () {
                var TopNav = MDMa.$("TopNav");
                TopNav.innerHTML = "";
                for (var i = 0; i < IndexPage.PageData.Permissions.length; i++) {
                    var li = document.createElement("li");
                    var a = document.createElement("a");
                    if (IndexPage.PageData.Permissions[i]["Ico"] != null) {
                        var ico = document.createElement("i");
                        MDMa.AddClass(ico, IndexPage.PageData.Permissions[i]["Ico"]);
                        a.appendChild(ico);
                    }
                    a.appendChild(document.createTextNode(IndexPage.PageData.Permissions[i].Name));
                    a.dataset.topid = "TopNav";
                    if (IndexPage.PageData.Permissions[i].Items == null) {
                        a.dataset.href = IndexPage.PageData.Permissions[i]["Code"];
                        MDMa.AddEvent(a, "click", function (e) {
                            IndexPage.OpenIFramePage(e);
                            MDMa.AddClass("MainPanel", "NoLeft");
                        });
                    }
                    else {
                        a.dataset.index = i.toString();
                        MDMa.AddEvent(a, "click", IndexPage.BindLeftMenu);
                    }
                    li.appendChild(a);
                    TopNav.appendChild(li);
                }
            };
            /**
             * 打开左部页面
             * @param e
             */
            IndexPage.OpenIFramePage = function (e) {
                var btn = e.target;
                while (!btn.dataset.href) {
                    btn = btn.parentElement;
                }
                var href = btn.dataset.href;
                var MainFrame = document.getElementById("MainFrame");
                MainFrame.setAttribute("src", href);
                IndexPage.SetActive(btn);
            };
            /**
             * 设置选择样式
             * @param ActiveElement 要选择的元素
             */
            IndexPage.SetActive = function (ActiveElement) {
                var TopElement = MDMa.$(ActiveElement.dataset.topid);
                if (TopElement) {
                    var activeElement = TopElement.getElementsByClassName("active");
                    for (var i = activeElement.length - 1; i == activeElement.length || i >= 0; i--) {
                        MDMa.RemoveClass(activeElement[i], "active");
                    }
                }
                MDMa.AddClass(ActiveElement.parentElement, "active");
                while (MDMa.HasClass(ActiveElement.parentElement.parentElement, "collapse")) {
                    MDMa.AddClass(ActiveElement.parentElement.parentElement.parentElement, "active");
                    ActiveElement = ActiveElement.parentElement.parentElement.parentElement;
                }
            };
            /**
             * 绑定左部菜单
             * @param e
             */
            IndexPage.BindLeftMenu = function (e) {
                var btn = e.target;
                while (!btn.dataset.index) {
                    btn = btn.parentElement;
                }
                var index = btn.dataset.index;
                MDMa.RemoveClass("MainPanel", "NoLeft");
                var rightM = IndexPage.PageData.Permissions[index]["Items"];
                var mainNav = MDMa.$("main-nav");
                mainNav.innerHTML = "";
                for (var i = 0; i < rightM["length"]; i++) {
                    var li = IndexPage.GetLeftHrefBtn(rightM[i]);
                    mainNav.appendChild(li);
                }
                //let MainFrame = document.getElementById("MainFrame") as HTMLIFrameElement;
                //MainFrame.setAttribute("src", '/Home/Helper');
                IndexPage.SetActive(btn);
            };
            /**
             * 获得左部菜单单项
             * @param model
             */
            IndexPage.GetLeftHrefBtn = function (model) {
                var li = document.createElement("li");
                var a = document.createElement("a");
                if (model["Ico"] != null) {
                    var ico = document.createElement("i");
                    MDMa.AddClass(ico, model["Ico"]);
                    a.appendChild(ico);
                }
                a.appendChild(document.createTextNode(model["Name"]));
                if (model["Items"] == null) {
                    a.dataset.href = model["Code"];
                    a.dataset.topid = "main-nav";
                    MDMa.AddEvent(a, "click", function (e) {
                        IndexPage.OpenIFramePage(e);
                    });
                    li.appendChild(a);
                }
                else {
                    var span = document.createElement("span");
                    MDMa.AddClass(span, "pull-right glyphicon glyphicon-chevron-down");
                    a.setAttribute("href", "#" + model["Code"]);
                    MDMa.AddClass(a, "nav-header collapsed");
                    a.dataset.toggle = "collapse";
                    var subUl = document.createElement("ul");
                    subUl.setAttribute("id", model["Code"]);
                    MDMa.AddClass(subUl, "nav nav-list collapse secondmenu");
                    for (var i = 0; i < model["Items"]["length"]; i++) {
                        var subli = IndexPage.GetLeftHrefBtn(model["Items"][i]);
                        subUl.appendChild(subli);
                    }
                    a.appendChild(span);
                    li.appendChild(a);
                    li.appendChild(subUl);
                }
                return li;
            };
            IndexPage.PageData = {
                LoginUserID: "",
                Permissions: [
                    {
                        ID: "1",
                        Name: "首页",
                        Ico: "glyphicon glyphicon-home",
                        Code: "/Backstage/View/System/Helper.html",
                        Items: null
                    },
                    {
                        ID: "2",
                        Name: "库存管理",
                        Ico: "glyphicon glyphicon-book",
                        Code: "Stock",
                        Items: [
                            {
                                ID: "2-1",
                                Name: "库存查看",
                                Ico: "glyphicon glyphicon-eye-open",
                                Code: "/Backstage/View/Stock/StockList.html",
                                Items: null
                            },
                            {
                                ID: "2-2",
                                Name: "入库",
                                Ico: "glyphicon glyphicon-log-in",
                                Code: "/Backstage/View/Stock/JoinStock.html",
                                Items: null
                            },
                            {
                                ID: "3-2",
                                Name: "出库",
                                Ico: "glyphicon glyphicon-log-out",
                                Code: "/Backstage/View/Stock/OutStock.html",
                                Items: null
                            }
                        ]
                    },
                    {
                        ID: "3",
                        Name: "产品管理",
                        Ico: "glyphicon glyphicon-lock",
                        Code: "Product",
                        Items: [
                            {
                                ID: "3-1",
                                Name: "类别管理",
                                Ico: "glyphicon glyphicon-tag",
                                Code: "/Backstage/View/Variety/VarietyList.html",
                                Items: null
                            },
                            {
                                ID: "3-2",
                                Name: "产品管理",
                                Ico: "glyphicon glyphicon-file",
                                Code: "/Backstage/View/Product/ProductList.html",
                                Items: null
                            }
                        ]
                    },
                    {
                        ID: "4",
                        Name: "系统设置",
                        Ico: "glyphicon glyphicon-cog",
                        Code: "System",
                        Items: [
                            {
                                ID: "4-1",
                                Name: "用户管理",
                                Ico: "glyphicon glyphicon-user",
                                Code: "/Backstage/View/User/UserList.html",
                                Items: null
                            }
                        ]
                    },
                ]
            };
            return IndexPage;
        }());
        /**
         * 登录输入模型
         */
        var IndexInputModel = /** @class */ (function () {
            function IndexInputModel() {
            }
            /**
             * 获得输入模型
             */
            IndexInputModel.GetInputData = function () {
                var data = null;
                var InputForm = document.forms["InputForm"];
                if (!MTMa.IsNullOrUndefined(InputForm) && InputForm.checkValidity()) {
                    var loginUserInfo = RRIStockSystem.common.GetLoginUserInfo();
                    data = {
                        ID: loginUserInfo.ID,
                        UserName: MDMa.GetInputValue("InputUserName"),
                        TrueName: MDMa.GetInputValue("InputTrueName"),
                    };
                }
                return data;
            };
            return IndexInputModel;
        }());
        /**
         * 修改密码模型
         */
        var EditPasswordModel = /** @class */ (function () {
            function EditPasswordModel() {
            }
            /**
             * 获得输入模型
             */
            EditPasswordModel.GetInputData = function () {
                var data = null;
                var InputForm = document.forms["PasswordInputForm"];
                if (!MTMa.IsNullOrUndefined(InputForm) && InputForm.checkValidity()) {
                    var loginUserInfo = RRIStockSystem.common.GetLoginUserInfo();
                    data = {
                        ID: loginUserInfo.ID,
                        OldPassword: MDMa.GetInputValue("InputOldPassword"),
                        NewPassword: MDMa.GetInputValue("InputNewPassword1"),
                    };
                    var NewPassword = MDMa.GetInputValue("InputNewPassword2");
                    if (data.NewPassword != NewPassword) {
                        data = null;
                        RRIStockSystem.common.SetInputErrorMessage("InputNewPassword1", "两次输入的密码不一样");
                        RRIStockSystem.common.SetInputErrorMessage("InputNewPassword2", "两次输入的密码不一样");
                    }
                }
                return data;
            };
            return EditPasswordModel;
        }());
        /*页面加载完成时触发*/
        MDMa.AddEvent(window, "load", function () {
            var pageM = new IndexPage();
        });
    })(Backstage = RRIStockSystem.Backstage || (RRIStockSystem.Backstage = {}));
})(RRIStockSystem || (RRIStockSystem = {}));
//# sourceMappingURL=Index.js.map