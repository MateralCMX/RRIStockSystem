/// <reference path="../lib/m-tools/m-tools.ts" />
'use strict';
var MDMa = MateralTools.DOMManager;
var MTMa = MateralTools.ToolManager;
var MLDMa = MateralTools.LocalDataManager;
var RRIStockSystem;
(function (RRIStockSystem) {
    var Common = /** @class */ (function () {
        /**
         * 构造方法
         */
        function Common() {
            /*应用程序配置对象*/
            this.ApplicationSettingM = new ApplicationSettingModel();
            /*分页配置*/
            this.PagingM = {
                PageShowBtnNum: 9,
                PageModel: {
                    DataCount: 0,
                    PagingCount: 99,
                    PagingIndex: 1,
                    PagingSize: 10
                }
            };
            if (performance.navigation.type != 2) {
                ApplicationSettingModel.IsDebug = true;
                this.AddMessageBoxArticle();
                this.BindEvent();
            }
            else {
                window.location.reload();
            }
        }
        /**
         * 绑定事件
         */
        Common.prototype.BindEvent = function () {
            MDMa.AddEvent(window, "keypress", this.KeyEnterCloseMessageBoxEvent);
        };
        /**
         * 绑定分页信息
         * @param pageM 分页信息对象
         */
        Common.prototype.BindPageInfo = function (pageM, getList) {
            var PageInfo = MDMa.$("PageInfo");
            if (!MTMa.IsNullOrUndefined(PageInfo)) {
                PageInfo.innerHTML = "";
                var PageBody = document.createElement("ul");
                MDMa.AddClass(PageBody, "pagination");
                /*绑定首页和上一页*/
                var FirstBtn = document.createElement("li");
                var FirstBtnA = document.createElement("a");
                FirstBtnA.setAttribute("title", "首页");
                FirstBtnA.innerHTML = "&laquo;";
                FirstBtn.appendChild(FirstBtnA);
                PageBody.appendChild(FirstBtn);
                var UpBtn = document.createElement("li");
                var UpBtnA = document.createElement("a");
                UpBtnA.setAttribute("title", "上一页");
                UpBtnA.innerHTML = "&lt;";
                UpBtn.appendChild(UpBtnA);
                PageBody.appendChild(UpBtn);
                if (pageM.PagingIndex <= 1) {
                    MDMa.AddClass(FirstBtn, "disabled");
                    MDMa.AddClass(UpBtn, "disabled");
                }
                else {
                    FirstBtn.dataset.index = "1";
                    FirstBtnA.dataset.index = "1";
                    MDMa.AddEvent(FirstBtnA, "click", function (e) {
                        var index = parseInt(e.target.dataset["index"]);
                        RRIStockSystem.common.PagingM.PageModel.PagingIndex = index;
                        getList();
                    });
                    UpBtn.dataset.index = (pageM.PagingIndex - 1).toString();
                    UpBtnA.dataset.index = (pageM.PagingIndex - 1).toString();
                    MDMa.AddEvent(UpBtnA, "click", function (e) {
                        var index = parseInt(e.target.dataset["index"]);
                        RRIStockSystem.common.PagingM.PageModel.PagingIndex = index;
                        getList();
                    });
                }
                /*绑定数字*/
                var Count = 0;
                var index = pageM.PagingIndex - Math.round((RRIStockSystem.common.PagingM.PageShowBtnNum - 1) / 2);
                for (; index <= pageM.PagingCount && Count < RRIStockSystem.common.PagingM.PageShowBtnNum; index++) {
                    if (index >= 1) {
                        var itemBtn = document.createElement("li");
                        var itemBtnA = document.createElement("a");
                        itemBtnA.innerHTML = index.toString();
                        if (index == pageM.PagingIndex) {
                            MDMa.AddClass(itemBtn, "active");
                        }
                        else {
                            itemBtn.dataset.index = index.toString();
                            itemBtnA.dataset.index = index.toString();
                            MDMa.AddEvent(itemBtnA, "click", function (e) {
                                var index = parseInt(e.target.dataset["index"]);
                                RRIStockSystem.common.PagingM.PageModel.PagingIndex = index;
                                getList();
                            });
                        }
                        itemBtn.appendChild(itemBtnA);
                        PageBody.appendChild(itemBtn);
                        Count++;
                    }
                }
                /*绑定下一页和尾页*/
                var NextBtn = document.createElement("li");
                var NextBtnA = document.createElement("a");
                NextBtnA.setAttribute("title", "下一页");
                NextBtnA.innerHTML = "&gt;";
                NextBtn.appendChild(NextBtnA);
                PageBody.appendChild(NextBtn);
                var LastBtn = document.createElement("li");
                var LastBtnA = document.createElement("a");
                LastBtnA.setAttribute("title", "尾页");
                LastBtnA.innerHTML = "&raquo;";
                LastBtn.appendChild(LastBtnA);
                PageBody.appendChild(LastBtn);
                if (pageM.PagingIndex >= pageM.PagingCount) {
                    MDMa.AddClass(NextBtn, "disabled");
                    MDMa.AddClass(LastBtn, "disabled");
                }
                else {
                    NextBtn.dataset.index = (pageM.PagingIndex + 1).toString();
                    NextBtnA.dataset.index = (pageM.PagingIndex + 1).toString();
                    MDMa.AddEvent(NextBtnA, "click", function (e) {
                        var index = parseInt(e.target.dataset["index"]);
                        RRIStockSystem.common.PagingM.PageModel.PagingIndex = index;
                        getList();
                    });
                    LastBtn.dataset.index = pageM.PagingCount.toString();
                    LastBtnA.dataset.index = pageM.PagingCount.toString();
                    MDMa.AddEvent(LastBtnA, "click", function (e) {
                        var index = parseInt(e.target.dataset["index"]);
                        RRIStockSystem.common.PagingM.PageModel.PagingIndex = index;
                        getList();
                    });
                }
                PageInfo.appendChild(PageBody);
                RRIStockSystem.common.PagingM.PageModel = pageM;
            }
        };
        /**
         * 保存查询条件信息
         * @param data
         */
        Common.prototype.SaveSearchInfo = function (key, data) {
            MLDMa.SetSessionData(key, data, true);
        };
        /**
         * 获得查询条件信息
         */
        Common.prototype.GetSearchInfo = function (key) {
            return MLDMa.SetSessionData(key, true);
        };
        /**
         * 绑定查询信息
         * @param key key
         */
        Common.prototype.BindSearchInfo = function (key) {
            var data = this.GetSearchInfo(key);
            if (!MTMa.IsNullOrUndefined(data)) {
                for (var name in data) {
                    var SearchElement = MDMa.$("Search" + name);
                    if (!MTMa.IsNullOrUndefined(SearchElement)) {
                        switch (SearchElement.tagName) {
                            case "INPUT":
                                var InputElement = SearchElement;
                                switch (InputElement.type) {
                                    case "checkbox":
                                        InputElement.checked = data[name];
                                        break;
                                    default:
                                        InputElement.value = data[name];
                                        break;
                                }
                                break;
                            case "SELECT":
                                var SelectElement = SearchElement;
                                SelectElement.value = data[name];
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        };
        /**
         * 绑定输入信息
         * @param data 数据集
         */
        Common.prototype.BindInputInfo = function (data) {
            if (!MTMa.IsNullOrUndefined(data)) {
                for (var name in data) {
                    var SearchElement = MDMa.$("Input" + name);
                    if (!MTMa.IsNullOrUndefined(SearchElement)) {
                        switch (SearchElement.tagName) {
                            case "INPUT":
                                var InputElement = SearchElement;
                                switch (InputElement.type) {
                                    case "checkbox":
                                        InputElement.checked = data[name];
                                        break;
                                    default:
                                        InputElement.value = data[name];
                                        break;
                                }
                                break;
                            case "SELECT":
                                var SelectElement = SearchElement;
                                SelectElement.value = data[name];
                                break;
                            case "TEXTAREA":
                                var TextAreaElement = SearchElement;
                                TextAreaElement.value = data[name];
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        };
        /**
         * 保存登录用户信息
         * @param data
         */
        Common.prototype.SaveLoginUserInfo = function (data) {
            if (data != null) {
                var saveData = new LoginUserModel(data["ID"], data["Token"]);
                MLDMa.SetLocalData(this.ApplicationSettingM.SaveUserKey, saveData, true);
            }
            else {
                this.RemoveLoginUserInfo();
            }
        };
        /**
         * 移除登录用户信息
         */
        Common.prototype.RemoveLoginUserInfo = function () {
            MLDMa.RemoveLocalData(this.ApplicationSettingM.SaveUserKey);
        };
        /**
         * 获得登录用户信息
         */
        Common.prototype.GetLoginUserInfo = function () {
            return MLDMa.GetLocalData(this.ApplicationSettingM.SaveUserKey, true);
        };
        /**
         * 显示密码按钮单击事件
         * @param e
         */
        Common.prototype.BtnShowPasswordEvent_Click = function (e) {
            var btnElement = e.target;
            var targetID = btnElement.dataset.target;
            if (!MTMa.IsNullOrUndefinedOrEmpty(targetID)) {
                var inputElement = MDMa.$(targetID);
                if (!MTMa.IsNullOrUndefined(inputElement)) {
                    if (inputElement.type == "text") {
                        inputElement.type = "password";
                        btnElement.classList.remove("glyphicon-eye-close");
                        btnElement.classList.add("glyphicon-eye-open");
                    }
                    else {
                        inputElement.type = "text";
                        btnElement.classList.remove("glyphicon-eye-open");
                        btnElement.classList.add("glyphicon-eye-close");
                    }
                }
            }
        };
        /**
         * 输入框验证事件
         * @param e 事件对象
         * @param setting 错误提示设置对象
         */
        Common.prototype.InputInvalidEvent_Invalid = function (e, setting) {
            var options = MTMa.IsNullOrUndefined(setting) ? new InvalidOptionsModel() : setting;
            var inputElement = e.target;
            if (inputElement.validity.valueMissing) {
                RRIStockSystem.common.SetInputErrorMessage(inputElement, options.Required);
            }
            else if (inputElement.validity.patternMismatch) {
                RRIStockSystem.common.SetInputErrorMessage(inputElement, options.Pattern);
            }
            else if (inputElement.validity.rangeUnderflow) {
                RRIStockSystem.common.SetInputErrorMessage(inputElement, options.Min);
            }
            else {
                RRIStockSystem.common.SetInputErrorMessage(inputElement, options.Defult);
            }
        };
        /**
         * 设置错误信息
         * @param inputElement 输入元素
         * @param message 错误信息
         */
        Common.prototype.SetInputErrorMessage = function (inputElement, message) {
            inputElement = MDMa.$(inputElement);
            var formGroupElement = inputElement.parentElement;
            while (!MDMa.HasClass(formGroupElement, "form-group")) {
                formGroupElement = formGroupElement.parentElement;
            }
            formGroupElement.classList.add("has-error");
            var messageSpan = formGroupElement.lastElementChild;
            if (MDMa.HasClass(messageSpan, "help-block")) {
                messageSpan.textContent = message;
            }
        };
        /**
         * 清空错误信息
         */
        Common.prototype.ClearErrorMessage = function () {
            var ErrorMessages = document.getElementsByClassName("has-error");
            for (var i = ErrorMessages.length - 1; i >= 0; i--) {
                var messageSpan = ErrorMessages[i].lastElementChild;
                if (MDMa.HasClass(messageSpan, "help-block")) {
                    messageSpan.textContent = "";
                }
                ErrorMessages[i].classList.remove("has-error");
            }
        };
        /**
         * 跳转页面
         * @param act 标识
         */
        Common.prototype.GoToPage = function (act, params, isTop) {
            if (params === void 0) { params = null; }
            if (isTop === void 0) { isTop = false; }
            var url = this.ApplicationSettingM.DomainName;
            switch (act) {
                case "Login":
                    url += "Backstage/View/User/Login.html";
                    break;
                case "Index":
                    url += "Backstage/View/System/Index.html";
                    break;
                default:
                    url += "Backstage/View/User/Login.html";
                    break;
            }
            if (!MTMa.IsNullOrUndefined(params) && params.length > 0) {
                url += "?" + params.join("&");
            }
            window.location.href = url;
        };
        /**
         * 发送GetAjax请求
         * @param url 请求地址
         * @param data 请求参数
         * @param SFun 成功方法
         * @param SFun 失败方法
         * @param CFun 都执行方法
         * @param EFun 错误方法
         */
        Common.prototype.SendGetAjax = function (url, data, SFun, FFun, CFun, EFun) {
            if (EFun === void 0) { EFun = null; }
            this.SendAjax(url, data, SFun, FFun, CFun, EFun, "get", "json");
        };
        /**
         * 发送PostAjax请求
         * @param url 请求地址
         * @param data 请求参数
         * @param SFun 成功方法
         * @param SFun 失败方法
         * @param CFun 都执行方法
         * @param EFun 错误方法
         * @param dataType 数据类型
         */
        Common.prototype.SendPostAjax = function (url, data, SFun, FFun, CFun, EFun, dataType) {
            if (EFun === void 0) { EFun = null; }
            if (dataType === void 0) { dataType = "json"; }
            var LoginUserM = this.GetLoginUserInfo();
            if (LoginUserM != null) {
                data["LoginUserID"] = LoginUserM.ID;
                data["LoginUserToken"] = LoginUserM.Token;
            }
            this.SendAjax(url, data, SFun, FFun, CFun, EFun, "post", dataType);
        };
        /**
         * 发送Ajax请求
         * @param url 请求地址
         * @param data 请求参数
         * @param SFun 成功方法
         * @param SFun 失败方法
         * @param CFun 都执行方法
         * @param EFun 错误方法
         * @param type 请求类型
         * @param dataType 数据类型
         */
        Common.prototype.SendAjax = function (url, data, SFun, FFun, CFun, EFun, type, dataType) {
            if (EFun === void 0) { EFun = null; }
            if (type === void 0) { type = "post"; }
            if (dataType === void 0) { dataType = "json"; }
            url = this.ApplicationSettingM.DomainName + url;
            if (EFun == null) {
                EFun = function (resM, xhr, state) {
                    switch (state) {
                        case 400:
                        case 401:
                            RRIStockSystem.common.RemoveLoginUserInfo();
                            RRIStockSystem.common.GoToPage("Login", null, true);
                            break;
                        case 403:
                            RRIStockSystem.common.ShowMessageBox("您的权限不足。");
                            break;
                        case 404:
                            RRIStockSystem.common.ShowMessageBox("未能找到该资源。");
                            break;
                        default:
                            RRIStockSystem.common.ShowMessageBox(resM["Message"] != null ? resM["Message"] : "应用程序出错了");
                            break;
                    }
                };
            }
            var SuccessFun = function (resM, xhr, state) {
                if (resM["ResultType"] == 0) {
                    SFun(resM, xhr, state);
                }
                else if (resM["ResultType"] == 1) {
                    FFun(resM, xhr, state);
                }
                else {
                    EFun(resM, xhr, state);
                }
            };
            var config = new MateralTools.HttpConfigModel(url, type, data, dataType, SuccessFun, EFun, CFun);
            MateralTools.HttpManager.Send(config);
        };
        /**
         * 显示消息窗体
         * @param message 消息
         * @param title 标题
         */
        Common.prototype.ShowMessageBox = function (message, title) {
            if (title === void 0) { title = "提示"; }
            var MessageBoxTitle = MDMa.$("MessageBoxTitle");
            var MessageBoxBody = MDMa.$("MessageBoxBody");
            if (!MTMa.IsNullOrUndefined(MessageBoxTitle)) {
                MessageBoxTitle.textContent = title;
            }
            if (!MTMa.IsNullOrUndefined(MessageBoxBody)) {
                MessageBoxBody.textContent = message;
            }
            $('#MessageBox').modal('toggle');
        };
        /**
         * 添加信息提示窗体
         */
        Common.prototype.AddMessageBoxArticle = function () {
            var element = MDMa.$("MessageBox");
            if (MTMa.IsNullOrUndefined(element)) {
                element = document.createElement("article");
                element.id = "MessageBox";
                document.body.appendChild(element);
            }
            else {
                element.innerHTML = "";
            }
            MDMa.AddClass(element, "modal fade");
            element.setAttribute("tabindex", "-1");
            element.setAttribute("role", "dialog");
            element.setAttribute("aria-labelledby", "MessageBoxLabel");
            var modalDialog = document.createElement("div");
            MDMa.AddClass(modalDialog, "modal-dialog");
            modalDialog.setAttribute("role", "document");
            element.appendChild(modalDialog);
            var modalContent = document.createElement("div");
            MDMa.AddClass(modalContent, "modal-content");
            modalDialog.appendChild(modalContent);
            var modalHeader = document.createElement("div");
            MDMa.AddClass(modalHeader, "modal-header");
            modalContent.appendChild(modalHeader);
            var btnClose = document.createElement("button");
            MDMa.AddClass(btnClose, "close");
            btnClose.type = "button";
            btnClose.dataset.dismiss = "modal";
            btnClose.setAttribute("aria-label", "Close");
            var btnCloseSpan = document.createElement("span");
            btnCloseSpan.setAttribute("aria-hidden", "true");
            btnCloseSpan.innerHTML = "&times;";
            btnClose.appendChild(btnCloseSpan);
            modalHeader.appendChild(btnClose);
            var modalTitle = document.createElement("h4");
            MDMa.AddClass(modalTitle, "modal-title");
            modalTitle.id = "MessageBoxTitle";
            modalTitle.innerHTML = "提示";
            modalHeader.appendChild(modalTitle);
            var modalBody = document.createElement("div");
            MDMa.AddClass(modalBody, "modal-body");
            modalBody.id = "MessageBoxBody";
            modalContent.appendChild(modalBody);
            var modalFooter = document.createElement("div");
            MDMa.AddClass(modalFooter, "modal-footer");
            modalContent.appendChild(modalFooter);
            var btnOK = document.createElement("button");
            btnOK.id = "MessageBoxBtnOK";
            btnOK.type = "button";
            MDMa.AddClass(btnOK, "btn btn-default");
            btnOK.dataset.dismiss = "modal";
            btnOK.innerHTML = "确定";
            modalFooter.appendChild(btnOK);
        };
        /**
         * 回车关闭提示窗体
         * @param e
         */
        Common.prototype.KeyEnterCloseMessageBoxEvent = function (e) {
            if (e.keyCode == 13) {
                var MessageBox = MDMa.$("MessageBox");
                if (MDMa.HasClass(MessageBox, "modal fade in")) {
                    var MessageBoxBtnOK = document.getElementById("MessageBoxBtnOK");
                    if (!MTMa.IsNullOrUndefined(MessageBoxBtnOK)) {
                        MessageBoxBtnOK.click();
                    }
                }
            }
        };
        /**
         * 检测登录
         * @param gotoLogin 没登录是否跳转登录
         */
        Common.prototype.IsLogin = function (gotoLogin) {
            if (gotoLogin === void 0) { gotoLogin = false; }
            var userInfo = RRIStockSystem.common.GetLoginUserInfo();
            if (MTMa.IsNullOrUndefined(userInfo)) {
                if (gotoLogin) {
                    RRIStockSystem.common.GoToPage("Login", ["from=" + encodeURIComponent(window.location.pathname + window.location.search)], true);
                    return false;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        };
        /**
         * 设置标题
         * @param headerTitle 头部标题
         * @param pageTitle 页面标题
         */
        Common.prototype.SetTitle = function (headerTitle, pageTitle) {
            if (pageTitle === void 0) { pageTitle = null; }
            if (MTMa.IsNullOrUndefinedOrEmpty(pageTitle)) {
                pageTitle = headerTitle;
            }
            var HeaderTitle = MDMa.$("HeaderTitle");
            if (!MTMa.IsNullOrUndefined(HeaderTitle)) {
                HeaderTitle.textContent = headerTitle;
            }
            var PageTitle = MDMa.$("PageTitle");
            if (!MTMa.IsNullOrUndefined(PageTitle)) {
                PageTitle.textContent = pageTitle;
            }
        };
        /**
         * 获取滚动条位置
         */
        Common.prototype.GetScrollTop = function () {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            }
            else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        };
        /**
         * 获取可见高度
         */
        Common.prototype.GetClientHeight = function () {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            }
            else {
                var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            }
            return clientHeight;
        };
        /**
         * 设置验证码图片
         * @param img 验证码图片元素
         */
        Common.prototype.LoadValidateImg = function (img) {
            var dt = MateralTools.ToolManager.DateTimeFormat(new Date(), "yyyyMMddHHmmss");
            img.setAttribute("src", this.ApplicationSettingM.DomainName + "api/ValidateCode/GetValidateCode?time=" + dt);
        };
        /**
         * 清空模拟框form
         * @param id
         */
        Common.prototype.ClearModalForm = function (id) {
            this.ClearErrorMessage();
            var EditModal = MDMa.$(id);
            if (!MTMa.IsNullOrUndefined(EditModal)) {
                var elements = EditModal.getElementsByTagName("input");
                for (var i = 0; i < elements.length; i++) {
                    switch (elements[i].type) {
                        case "checkbox":
                            elements[i].checked = false;
                            break;
                        case "radio":
                            elements[i].checked = false;
                            break;
                        default:
                            elements[i].value = "";
                            break;
                    }
                }
                elements = EditModal.getElementsByTagName("select");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].selectedIndex = 0;
                }
                elements = EditModal.getElementsByTagName("textarea");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].value = "";
                }
            }
        };
        return Common;
    }());
    /**
     * 应用程序设置模型
     */
    var ApplicationSettingModel = /** @class */ (function () {
        function ApplicationSettingModel() {
            /*域名*/
            this._domainName = "http://localhost:11455/";
            /*调试域名*/
            this._deBugDomainName = "http://localhost:11455/";
            /*保存用户的值*/
            this.SaveUserKey = "LOGINUSERKEY";
        }
        Object.defineProperty(ApplicationSettingModel.prototype, "DomainName", {
            /*服务器域名*/
            get: function () {
                if (!ApplicationSettingModel.IsDebug) {
                    return this._domainName;
                }
                else {
                    return this._deBugDomainName;
                }
            },
            enumerable: true,
            configurable: true
        });
        /*调试模型*/
        ApplicationSettingModel.IsDebug = true;
        return ApplicationSettingModel;
    }());
    /**
     * 验证模型
     */
    var InvalidOptionsModel = /** @class */ (function () {
        function InvalidOptionsModel() {
            /*必填*/
            this.Required = "输入不能为空";
            /*正则*/
            this.Pattern = "输入未能通过验证";
            /*过小*/
            this.Min = "输入过小";
            /*过大*/
            this.Max = "输入过大";
            /*默认*/
            this.Defult = "输入有误";
        }
        return InvalidOptionsModel;
    }());
    RRIStockSystem.InvalidOptionsModel = InvalidOptionsModel;
    /**
     * 登录用户模型
     */
    var LoginUserModel = /** @class */ (function () {
        /**
         * 构造函数
         * @param id 用户唯一标识
         * @param token 用户Token
         */
        function LoginUserModel(id, token) {
            this.ID = id;
            this.Token = token;
        }
        return LoginUserModel;
    }());
    RRIStockSystem.LoginUserModel = LoginUserModel;
    /**
     * 登录用户模型
     */
    var MPagingModel = /** @class */ (function () {
        function MPagingModel() {
        }
        return MPagingModel;
    }());
    RRIStockSystem.MPagingModel = MPagingModel;
    /**
     * 公共处理对象
     */
    RRIStockSystem.common = new Common();
})(RRIStockSystem || (RRIStockSystem = {}));
//# sourceMappingURL=base.js.map