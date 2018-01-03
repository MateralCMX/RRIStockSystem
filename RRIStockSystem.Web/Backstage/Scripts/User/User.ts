/// <reference path="../../../scripts/jquery.d.ts" />
/// <reference path="../../../scripts/base.ts" />
/// <reference path="../../../lib/m-tools/m-tools.ts" />
namespace RRIStockSystem.Backstage {
    /**
     * 用户页面
     */
    class UserPage {
        /*页面数据*/
        public static PageData = {
            ID: null
        }
        /**
         * 构造方法
         */
        constructor() {
            if (common.IsLogin(true)) {
                UserPage.GetList();
                this.BindEvent();
            }
        }
        /**
         * 绑定事件
         */
        private BindEvent() {
            MDMa.AddEvent("BtnSearch", "click", this.BtnSearchEvent_Click);
            MDMa.AddEvent("BtnAdd", "click", UserPage.BtnAddEvent_Click);
            MDMa.AddEvent("BtnSave", "click", this.BtnSaveEvent_Click);
            MDMa.AddEvent("BtnDelete", "click", this.BtnDeleteEvent_Click);
            MDMa.AddEvent("InputUserName", "invalid", function (e: Event) {
                let element = e.target as HTMLInputElement;
                let setting: InvalidOptionsModel = new InvalidOptionsModel();
                setting.Max = "长度不能超过" + element.maxLength;
                setting.Required = "不能为空";
                setting.Pattern = "只可使用英文和数字";
                common.InputInvalidEvent_Invalid(e, setting);
            });
            MDMa.AddEvent("InputTrueName", "invalid", function (e: Event) {
                let element = e.target as HTMLInputElement;
                let setting: InvalidOptionsModel = new InvalidOptionsModel();
                setting.Max = "长度不能超过" + element.maxLength;
                setting.Required = "不能为空";
                setting.Pattern = "请填写正确的中文真实姓名";
                common.InputInvalidEvent_Invalid(e, setting);
            });
        }
        /**
         * 获得列表
         */
        private static GetList() {
            let url: string = "api/User/GetUserInfoByWhere";
            let data = UserSearchModel.GetInputData();
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                UserPage.BindListInfo(resM["Data"]);
                common.BindPageInfo(resM["PagingInfo"] as MPagingModel, UserPage.GetList);
            };
            let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                common.ShowMessageBox(resM["Message"])
            };
            let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
            };
            common.SendGetAjax(url, data, SFun, FFun, CFun);
        }
        /**
         * 绑定列表信息
         * @param listM 
         */
        private static BindListInfo(listM: Array<any>): void {
            let DataTable = MDMa.$("DataTable") as HTMLTableSectionElement;
            DataTable.innerHTML = "";
            if (!MTMa.IsNullOrUndefined(listM)) {
                for (let i = 0; i < listM.length; i++) {
                    let Item = document.createElement("tr");
                    let Index = document.createElement("td");
                    Index.textContent = (common.PagingM.PageModel.PagingSize * (common.PagingM.PageModel.PagingIndex - 1) + i + 1).toString();
                    Item.appendChild(Index);
                    let TrueName = document.createElement("td");
                    TrueName.textContent = listM[i]["TrueName"];
                    Item.appendChild(TrueName);
                    let UserName = document.createElement("td");
                    UserName.textContent = listM[i]["UserName"];
                    Item.appendChild(UserName);
                    let Operation = document.createElement("td");
                    let OperationBtnGroup = document.createElement("div");
                    MDMa.AddClass(OperationBtnGroup, "btn-group");
                    let EditBtn = document.createElement("button");
                    MDMa.AddClass(EditBtn, "btn btn-default");
                    EditBtn.setAttribute("type", "button");
                    EditBtn.textContent = "编辑";
                    MDMa.AddEvent(EditBtn, "click", UserPage.BtnEditEvent_Click);
                    EditBtn.dataset.id = listM[i]["ID"];
                    OperationBtnGroup.appendChild(EditBtn);
                    let RemoveBtn = document.createElement("button");
                    MDMa.AddClass(RemoveBtn, "btn btn-danger");
                    RemoveBtn.setAttribute("type", "button");
                    RemoveBtn.textContent = "删除";
                    RemoveBtn.dataset.toggle = "modal";
                    RemoveBtn.dataset.target = "#DeleteModal";
                    MDMa.AddEvent(RemoveBtn, "click", UserPage.BtnRemoveEvent_Click);
                    RemoveBtn.dataset.id = listM[i]["ID"];
                    OperationBtnGroup.appendChild(RemoveBtn);
                    Operation.appendChild(OperationBtnGroup);
                    Item.appendChild(Operation);
                    DataTable.appendChild(Item);
                }
            }
        }
        /**
         * 查询按钮
         * @param e
         */
        private BtnSearchEvent_Click(e: MouseEvent) {
            common.PagingM.PageModel.PagingIndex = 1;
            common.PagingM.PageModel.PagingCount = 99;
            UserPage.GetList();
        }
        /**
         * 新增按钮单击事件
         */
        private static BtnAddEvent_Click(e: MouseEvent) {
            let btnElement = e.target as HTMLButtonElement;
            common.ClearModalForm("EditModal");
            let EditModalLabel = MDMa.$("EditModalLabel") as HTMLHeadingElement;
            EditModalLabel.textContent = "新增";
            UserPage.PageData.ID = null;
        }
        /**
         * 编辑按钮单击事件
         */
        private static BtnEditEvent_Click(e: MouseEvent) {
            let btnElement = e.target as HTMLButtonElement;
            common.ClearModalForm("EditModal");
            let EditModalLabel = MDMa.$("EditModalLabel") as HTMLHeadingElement;
            EditModalLabel.textContent = "新增";
            UserPage.PageData.ID = btnElement.dataset.id;
            UserPage.GetUserInfoByID();
        }
        /**
         * 移除按钮单击事件
         */
        private static BtnRemoveEvent_Click(e: MouseEvent) {
            let btnElement = e.target as HTMLButtonElement;
            UserPage.PageData.ID = btnElement.dataset.id;
        }
        /**
         * 根据ID获得用户信息
         * @param ID
         */
        private static GetUserInfoByID() {
            let url = "api/User/GetUserViewInfoByID";
            let data = {
                ID: UserPage.PageData.ID
            };
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                let perM = resM["Data"];
                common.BindInputInfo(perM);
                $('#EditModal').modal('toggle');
            };
            let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                common.ShowMessageBox(resM["Message"]);
            };
            let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
            };
            common.SendGetAjax(url, data, SFun, FFun, CFun);
        }
        /**
         * 保存按钮单击事件
         * @param e
         */
        private BtnSaveEvent_Click(e: MouseEvent) {
            common.ClearErrorMessage();
            let data = UserInputModel.GetInputData();
            if (data != null) {
                let BtnElement = e.target as HTMLButtonElement;
                BtnElement.textContent = "保存中......";
                BtnElement.disabled = true;
                let url: string;
                if (MTMa.IsNullOrUndefinedOrEmpty(UserPage.PageData.ID)) {
                    url = "api/User/AddUser";
                }
                else {
                    url = "api/User/EditUser";
                }
                let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    UserPage.GetList();
                    $('#EditModal').modal('toggle');
                };
                let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    common.ShowMessageBox(resM["Message"]);
                };
                let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                    BtnElement.textContent = "保存";
                    BtnElement.disabled = false;
                };
                common.SendPostAjax(url, data, SFun, FFun, CFun);
            }
        }
        /**
         * 删除按钮单击事件
         * @param e
         */
        private BtnDeleteEvent_Click(e: MouseEvent) {
            let BtnElement = e.target as HTMLButtonElement;
            BtnElement.textContent = "删除中......";
            BtnElement.disabled = true;
            let url = "api/User/DeleteUser";
            let data = {
                ID: UserPage.PageData.ID
            };
            let SFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                $('#DeleteModal').modal('toggle');
                UserPage.GetList();
            };
            let FFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                common.ShowMessageBox(resM["Message"]);
            };
            let CFun = function (resM: Object, xhr: XMLHttpRequest, state: number) {
                BtnElement.textContent = "删除";
                BtnElement.disabled = false;
            };
            common.SendPostAjax(url, data, SFun, FFun, CFun);
        }
    }
    /**
     * 用户查询模型
     */
    class UserSearchModel {
        public UserName: string;
        public TrueName: string;
        public PageIndex: number;
        public PageSize: number;
        /**
         * 获得输入模型
         */
        public static GetInputData(): UserSearchModel {
            let data: UserSearchModel = {
                UserName: MDMa.GetInputValue("SearchUserName"),
                TrueName: MDMa.GetInputValue("SearchTrueName"),
                PageIndex: common.PagingM.PageModel.PagingIndex,
                PageSize: common.PagingM.PageModel.PagingSize,
            };
            return data;
        }
    }
    /**
     * 用户输入模型
     */
    class UserInputModel {
        /*唯一标识*/
        public ID: string;
        /*用户名*/
        public UserName: string;
        /*真实姓名*/
        public TrueName: string;
        /**
         * 获得输入模型
         */
        public static GetInputData(): UserInputModel {
            let data: UserInputModel = null;
            let InputForm = document.forms["InputForm"] as HTMLFormElement;
            if (!MTMa.IsNullOrUndefined(InputForm) && InputForm.checkValidity()) {
                data = {
                    ID: UserPage.PageData.ID,
                    UserName: MDMa.GetInputValue("InputUserName"),
                    TrueName: MDMa.GetInputValue("InputTrueName"),
                };
            }
            return data;
        }
    }
    /*页面加载完成时触发*/
    MDMa.AddEvent(window, "load", function () {
        let pageM = new UserPage();
    });
}