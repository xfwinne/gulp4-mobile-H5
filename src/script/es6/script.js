/*global Swiper, BScroll, isPassive*/
// JavaScript Document

//按需写入所需的函数名
$(function () {
    checkBrowser();
    // 阻止默认行为写法，Chrome56以上版本
    // document.addEventListener('touchmove', func, isPassive() ? {
    //         capture: false,
    //         passive: false
    //     } : false);
});


// 以下不用可以删除

//表单相关
function forms () {

    //输入框文字清空还原，控制value
    // <input type="text" value="请输入关键字" />
    $(".deaSearch .inp").focus(function () {
        if ($(this).val() === this.defaultValue) {
            $(this).val("");
        }
    }).blur(function () {
        if ($(this).val() === "") {
            $(this).val(this.defaultValue);
        }
    });

}

//简单标签切换
function tabs (tit, box) {
    /*html结构
     <div class="tabs">

     <div class="tabhd">
     <ul>
     <li class="on">标题一</li>
     <li>标题二</li>
     </ul>
     </div>

     <div class="tabbd">
     <div>内容一</div>
     <div>内容二</div>
     </div>

     </div>
     */
    var oDivLi = $(tit).children();
    var oBoxLi = $(box).children();
    var i;
    oBoxLi.hide();
    oDivLi.each(function () {
        if ($(this).hasClass("on")) {i = $(this).index();}
    });
    oBoxLi.eq(i).show();
    oDivLi.click(function () {
        $(this).addClass("on").siblings().removeClass("on");
        var index = oDivLi.index(this);
        oBoxLi.eq(index).fadeIn("linear").siblings().hide();
    });
}

// 判断浏览器
var checkBrowser = function () {
    var userAgent = window.navigator.userAgent.toLowerCase();
    console.log(userAgent);
    var msie8 = /msie 8\.0/i.test(userAgent);
    var msie7 = /msie 7\.0/i.test(userAgent);
    var msie6 = /msie 6\.0/i.test(userAgent);
    var checkHtml = "";

    if (msie8) {
        checkHtml = "<div class=\"checkBrowser\"><span>您现在使用的是IE8内核，版本过低！建议您升级到IE9+或者使用极速模式浏览，以体验最佳效果!</span><a title=\"关闭\" onclick=\"checkBrowser.close();\">×</a></div>";
        $("body").append(checkHtml);
    } else if (msie7) {
        checkHtml = "<div class=\"checkBrowser\"><span>您现在使用的是IE7内核，版本过低！建议您升级到IE9+或者使用极速模式浏览，以体验最佳效果!</span><a title=\"关闭\" onclick=\"checkBrowser.close();\">×</a></div>";
        $("body").append(checkHtml);
    } else if (msie6) {
        checkHtml = "<div class=\"checkBrowser\"><span>您现在使用的是IE6内核，版本过低！建议您升级到IE9+或者使用极速模式浏览，以体验最佳效果!</span><a title=\"关闭\" onclick=\"checkBrowser.close();\">×</a></div>";
        $("body").append(checkHtml);
    }

    checkBrowser.close = function () {
        $(".checkBrowser").remove();
    };
};

// 判断是否移动设备
var isMobile = function () {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.indexOf("ipad") >= 0;
    var bIsIphoneOs = sUserAgent.indexOf("iphone os") >= 0;
    var bIsMidp = sUserAgent.indexOf("midp") >= 0;
    var bIsUc7 = sUserAgent.indexOf("rv:1.2.3.4") >= 0;
    var bIsUc = sUserAgent.indexOf("ucweb") >= 0;
    var bIsAndroid = sUserAgent.indexOf("android") >= 0;
    var bIsCE = sUserAgent.indexOf("windows ce") >= 0;
    var bIsWM = sUserAgent.indexOf("windows mobile") >= 0;

    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return true;
    } else {
        return false;
    }
};

function func (e) {
    e.preventDefault();
}

/**
 * 弹出框
 * @param option
 * - type 弹出框类型 success, error, info, question, alert
 * - title 显示标题
 * - content 显示内容
 * - footerHide 是否显示底部按钮
 * - cancelHide 是否显示取消按钮
 * - btnColor 按钮主题色
 * - duration 显示时间, 毫秒。设为 0 则不会自动关闭
 * doneClick {function} 确认点击回调
 * cancelClick {function} 取消点击回调
 * @method success(option) - 弹出成功提示
 * @method error(option) - 弹出错误提示
 * @method prompt(option) - 弹出框提示
 * @returns {Alert}
 * @constructor
 */
// var alertBox = new Alert();
// alertBox.alert({
//     title: '提示信息',
//     content: '成功提交',
//     doneClick: function (e) {
//         console.log('测试');
//     }
// });

class Alert {
    constructor () {
        this.boxId = Math.random().toString(36).substring(2, 6);
        this.option = {
            type: "",
            title: "提示信息",
            content: null,
            submitText: "确定",
            cancelText: "取消",
            footerHide: false,
            cancelHide: false,
            duration: 0,
            btnColor: "#2d8cf0",
            doneClick: function (e) {
                //确认
            },
            cancelClick: function (e) {
                //取消
            }
        };
    }

    init () {
        let iconType = "tips-popup-icon",
            iconName = "",
            contentText = !this.option.content ? "" : "<div class=\"tips-popup-content\">" + this.option.content + "</div>",
            footerBtn = this.option.footerHide ? "" : this.option.cancelHide ? "<ul class=\"tips-popup-footer\"><li class=\"submit-btn\" style=\"border-color:" + this.option.btnColor + ";background-color:" + this.option.btnColor + "\">" + this.option.submitText + "</li></ul>" : "<ul class=\"tips-popup-footer\"><li class=\"cancle-btn\">" + this.option.cancelText + "</li><li class=\"submit-btn\" style=\"border-color:" + this.option.btnColor + ";background-color:" + this.option.btnColor + "\">" + this.option.submitText + "</li></ul>";

        switch (this.option.type) {
            case "success":
                iconName = "tips-icon-success";
                break;
            case "error":
                iconName = "tips-icon-error";
                break;
            case "info":
                iconName = "tips-icon-info";
                break;
            case "question":
                iconName = "tips-icon-question";
                break;
            case "alert":
                iconName = "tips-icon-alert";
                break;
            default:
                iconType = null;
                break;
        }
        let html = "<div class=\"tips-popup\" id=\"tipsP" + this.boxId + "\"><div class=\"tips-popup-mask\"></div><div class=\"tips-popup-box " + iconType + "\"><div class=\"tips-popup-head\"><span class=\"tips-icon " + iconName + "\">&nbsp;</span><div class=\"title\">" + this.option.title + "</div><span class=\"tips-popup-close\">&nbsp;</span></div>" + contentText + footerBtn + "</div></div>";

        $("body").append(html);
        $(`${"#tipsP" + this.boxId}`).show();
        setTimeout(() => {
            $(`${"#tipsP" + this.boxId}`).addClass("show");
            this.listenEvt();
        }, 200);
    }

    success (option) {
        $.extend(this.option, {type: "success", cancelHide: true}, option);
        this.init();
    }

    error (option) {
        $.extend(this.option, {type: "error", cancelHide: true}, option);
        this.init();
    }

    info (option) {
        $.extend(this.option, {type: "info"}, option);
        this.init();
    }

    question (option) {
        $.extend(this.option, {type: "question"}, option);
        this.init();
    }

    alert (option) {
        $.extend(this.option, {type: "alert", cancelHide: true}, option);
        this.init();
    }

    close () {
        $(`${"#tipsP" + this.boxId}`).removeClass("show");
        setTimeout(() => {
            $(`${"#tipsP" + this.boxId}`).remove();
        }, 400);
    }

    listenEvt () {
        let _this = this;

        if (_this.option.duration !== 0) {
            setTimeout(() => {
                _this.close();
            }, _this.option.duration);
        }

        // 确定按钮
        $(`${"#tipsP" + this.boxId} .submit-btn`).click(function () {
            _this.option.doneClick();
            _this.close();
        });

        // 取消按钮
        $(`${"#tipsP" + this.boxId} .cancel-btn`).click(function () {
            _this.close();
            _this.option.cancelClick();
        });

        // 关闭按钮
        $(`${"#tipsP" + this.boxId} .tips-popup-mask, ${"#tipsP" + this.boxId} .tips-popup-close`).click(function () {
            _this.close();
        });
    }
}

/**
 * 获取验证码的插件
 * params.url - {string} - 获取验证的地址，必填
 * params.el - {string} - 最外填充层的节点，必填
 * params.callback - {function} - 验证插件加载成功后返回
 */
function getVerCode (params) {
    if (!params.url) {
        throw console.error("请填写校验秘钥获取地址！");
    }
    let textHtml = "<div id=\"captchaText\" class=\"captcha-title\">安全组件加载中</div>";
    let loadingHtml = "<div id=\"captchaLoading\" class=\"captcha-show\">\n" +
        "                <div class=\"captcha-loading\">\n" +
        "                    <div class=\"captcha-loading-dot\"></div>\n" +
        "                    <div class=\"captcha-loading-dot\"></div>\n" +
        "                    <div class=\"captcha-loading-dot\"></div>\n" +
        "                    <div class=\"captcha-loading-dot\"></div>\n" +
        "                </div>\n" +
        "            </div>";

    // eslint-disable-next-line no-undef
    $(el).append(textHtml + loadingHtml);
    $.ajax({
        url: params.url,
        type: "get",
        dataType: "json",
        success: function (data) {
            $("#captchaText").hide();
            $("#captchaLoading").show();
            window.initGeetest({
                gt: data.code.gt,
                https: true,
                challenge: data.code.challenge,
                new_captcha: data.code.new_captcha,
                product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                width: "100%",
                offline: !data.code.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
            }, function (captchaObj) {
                var geetInit = captchaObj;
                captchaObj.appendTo(params.el);
                captchaObj.onReady(function () {
                    $("#captchaLoading").hide();
                });
                captchaObj.onError(function () {
                    geetInit.reset();
                });
                params.callback(captchaObj);
            });
        }
    });
}


