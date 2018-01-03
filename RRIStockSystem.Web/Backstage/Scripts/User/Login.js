/// <reference path="../../../scripts/jquery.d.ts" />
/// <reference path="../../../scripts/base.ts" />
/// <reference path="../../../lib/m-tools/m-tools.ts" />
var RRIStockSystem;
(function (RRIStockSystem) {
    var Backstage;
    (function (Backstage) {
        /**
         * 登录页面
         */
        var LoginPage = /** @class */ (function () {
            /**
             * 构造方法
             */
            function LoginPage() {
                this.BindEvent();
                var InputUserName = MDMa.$("InputUserName");
                var InputPassword = MDMa.$("InputPassword");
                var InputValidateCode = MDMa.$("InputValidateCode");
                InputUserName.focus();
            }
            /**
             * 绑定事件
             */
            LoginPage.prototype.BindEvent = function () {
                MDMa.AddEvent("ValidateImg", "click", this.ValidateImgEvent_Click);
                MDMa.AddEvent("BtnLogin", "click", this.BtnLoginEvent_Click);
                MDMa.AddEvent("InputUserName", "keypress", this.InputEvent_KeyPress);
                MDMa.AddEvent("InputPassword", "keypress", this.InputEvent_KeyPress);
                MDMa.AddEvent("InputValidateCode", "keypress", this.InputEvent_KeyPress);
                MDMa.AddEvent("InputUserName", "invalid", function (e) {
                    var setting = new RRIStockSystem.InvalidOptionsModel();
                    setting.Required = "用户名不能为空";
                    RRIStockSystem.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputPassword", "invalid", function (e) {
                    var setting = new RRIStockSystem.InvalidOptionsModel();
                    setting.Required = "密码不能为空";
                    RRIStockSystem.common.InputInvalidEvent_Invalid(e, setting);
                });
                MDMa.AddEvent("InputValidateCode", "invalid", function (e) {
                    var setting = new RRIStockSystem.InvalidOptionsModel();
                    setting.Required = "验证码不能为空";
                    RRIStockSystem.common.InputInvalidEvent_Invalid(e, setting);
                });
            };
            /**
             * 重新加载验证码
             */
            LoginPage.prototype.ValidateImgEvent_Click = function (e) {
                var img = MDMa.$("ValidateImg");
                RRIStockSystem.common.LoadValidateImg(img);
            };
            /**
             * 输入框回车事件
             * @param e
             */
            LoginPage.prototype.InputEvent_KeyPress = function (e) {
                if (e.keyCode == 13) {
                    var BtnElement = MDMa.$("BtnLogin");
                    LoginPage.Login(BtnElement);
                }
            };
            /**
             * 登录按钮单击事件
             * @param e
             */
            LoginPage.prototype.BtnLoginEvent_Click = function (e) {
                var BtnElement = e.target;
                LoginPage.Login(BtnElement);
            };
            /**
             * 登录方法
             */
            LoginPage.Login = function (BtnElement) {
                RRIStockSystem.common.ClearErrorMessage();
                var data = LoginInputModel.GetInputData();
                if (data != null) {
                    BtnElement.textContent = "登录中......";
                    BtnElement.disabled = true;
                    var url = "api/User/AdminLogin";
                    var SFun = function (resM, xhr, state) {
                        RRIStockSystem.common.SaveLoginUserInfo(resM["Data"]);
                        RRIStockSystem.common.GoToPage("Index");
                    };
                    var FFun = function (resM, xhr, state) {
                        RRIStockSystem.common.ShowMessageBox(resM["Message"]);
                    };
                    var CFun = function (resM, xhr, state) {
                        BtnElement.textContent = "登录";
                        BtnElement.disabled = false;
                    };
                    RRIStockSystem.common.SendPostAjax(url, data, SFun, FFun, CFun);
                }
            };
            return LoginPage;
        }());
        /**
         * 登录输入模型
         */
        var LoginInputModel = /** @class */ (function () {
            function LoginInputModel() {
            }
            /**
             * 获得输入模型
             */
            LoginInputModel.GetInputData = function () {
                var data = null;
                var InputForm = document.forms["InputForm"];
                if (!MTMa.IsNullOrUndefined(InputForm) && InputForm.checkValidity()) {
                    data = {
                        UserName: MDMa.GetInputValue("InputUserName"),
                        Password: MDMa.GetInputValue("InputPassword"),
                        ValidateCode: MDMa.GetInputValue("InputValidateCode"),
                    };
                }
                return data;
            };
            return LoginInputModel;
        }());
        /*页面加载完成时触发*/
        MDMa.AddEvent(window, "load", function () {
            var pageM = new LoginPage();
        });
    })(Backstage = RRIStockSystem.Backstage || (RRIStockSystem.Backstage = {}));
})(RRIStockSystem || (RRIStockSystem = {}));
//# sourceMappingURL=Login.js.map