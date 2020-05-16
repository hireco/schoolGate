$(function () {
  
});
//生成分页条 请求数据的方法名（该方法必须有一个pageIndex的参数，方法名要以字符串方式传进来）
function makePageBar(barPageIndex, pageSize, rows, sFnName) {
    var nowPage = barPageIndex;
    var urlNum = pageSize > 10 ? 10 : pageSize; //分页链接接数(6个)
    var pages = Math.ceil(rows / pageSize); //取得总页数


    if (nowPage == 1) {
        strS = '<strong>首页 </strong>';
    }
    else {
        strS = '<a id="sy" href="javascript:void(0)" onclick="' + sFnName + '(1)">首页 </a>';
    }
    var PageNum_2 = urlNum % 2 == 0 ? Math.ceil(urlNum / 2) + 1 : Math.ceil(urlNum / 2);
    var PageNum_3 = urlNum % 2 == 0 ? Math.ceil(urlNum / 2) : Math.ceil(urlNum / 2) + 1;
    var strC = "", startPage, endPage;
    if (urlNum >= pages) {
        startPage = 1;
        endPage = pages;
    }
    else if (nowPage < PageNum_2) {
        startPage = 1;
        endPage = pages > urlNum ? urlNum : pages
    } //首页
    else {
        startPage = nowPage + PageNum_2 >= pages ? (pages - urlNum + 1) : (nowPage - PageNum_2 + 2);
        var t = startPage + urlNum;
        endPage = t > pages ? pages : t - 1;
    }
    for (var i = startPage; i <= endPage; i++) { //根据页数进行循环 如果页数为2 则 循环两次 从0开始
        if (i == nowPage) {
            strC += '<strong style="color:red;font-weight:700;" >' + i + '</strong> ';
        }
        else {
            strC += '<a href="javascript:void(0)" onclick="' + sFnName + '(' + i + ')">' + i + '</a> ';
        }
    }
    if (nowPage == pages) {
        strE = '<strong> 尾页 </strong>';
    }
    else {
        strE = '<a id="my" href="javascript:void(0)" onclick="' + sFnName + '(' + pages + ')"> 尾页 </a>';
    }
    strE2 = nowPage + "/" + pages + "页" + "  共" + rows + "条";
    //document.getElementById("changpage").innerHTML = strS + strC + strE + strE2
    return strS + strC + strE + strE2;
}

//设置数据 div内容垂直居中
function autoDiv() {
    $("div.jdsj div.sj div").height(function () {
        var f_obj = this;
        $(this).height($(f_obj).parent().innerHeight());
        //$(this).css({ "line-height": $(f_obj).parent().innerHeight() / 12 });
        //$(this).parent().css({ "display": "table-row" });
        //$(this).parent().parent().css({ "display": "table" });
        //$(this).children("span").css({ "display": "block", "margin": "0 auto", "margin-top": $(f_obj).parent().innerHeight() / 2 });
        //$(this).css({ "padding-top": $(f_obj).parent().innerHeight() / 12 });
        $(this).children("span").css({ "display": "block", "margin-top": ($(f_obj).parent().innerHeight() - $(this).children("span").innerHeight()) / 2, "margin-bottom": ($(f_obj).parent().innerHeight() - $(this).children("span").innerHeight()) / 2 });
    });
}

//1经济型 2二星级/其它 3三星级/舒适 4四星级/高档 5五星级/豪华
var HotelRank = [{ value: 1, text: "经济型" }, { value: 2, text: "二星级/其它" }, { value: 3, text: "三星级/舒适" }, { value: 4, text: "四星级/高档" }, { value: 5, text: "五星级/豪华" }];
//表单验证
function cheformcomfn(obj) {
    switch ($(obj).attr("validtype")) {
        case "faxno":
            return /^((\d{3}\-)|(\d{4}\-))\d{6,8}$/.test($(obj).val());//验证传真号码
            break;
        case "chs":
            return /^[\u0391-\uFFE5]+$/.test($(obj).val());//验证中文
            break;
        case "telno":
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test($(obj).val());//验证传真、固话
            break;
        case "zip":
            return /^[1-9]\d{5}$/.test($(obj).val());//邮政编码
            break;
        case "qq":
            return /^[1-9]\d{4,10}$/.test($(obj).val());//验证QQ
            break;
        case "mobile":
            return /^((\(\d{2,3}\))|(\d{3}\-))?1\d{10}$/.test($(obj).val());//验证手机号码
            break;
        case "username":
            return /^[\u0391-\uFFE5\w]+$/.test($(obj).val());//'登录名称只允许汉字、英文字母、数字及下划线。'
            break;
        case "password":
            return !(/^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/.test($(obj).val()));// '密码由字母(区分大小写)和数字组成，至少6位'
            break;
        case "pyname":
            return !(/^(([A-Z]{0,3}|[a-z]{0,3}|\d*))$|\s/.test($(obj).val()));// '拼音名字由字母组成，至少4位'
            break;
    }
}

var checode = {
    CHS: {
        validator: function (value, param) {
            return /^[\u0391-\uFFE5]+$/.test(value);
        },
        message: '请输入汉字'
    },
    faxno: {// 验证传真和固定电话
        validator: function (value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '格式不正确,请使用下面格式:020-8888888 或8888888'
    },
    minLength: {
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '不能少于 {0} 位.'
    },
    ZIP: {
        validator: function (value, param) {
            return /^[1-9]\d{5}$/.test(value);
        },
        message: '邮政不存在'
    },
    QQ: {
        validator: function (value, param) {
            return /^[1-9]\d{4,10}$/.test(value);
        },
        message: 'QQ号码不正确'
    },
    mobile: {
        validator: function (value, param) {

            return /^((\(\d{2,3}\))|(\d{3}\-))?1\d{10}$/.test(value);
        },
        message: '手机号码不正确'
    },
    loginName: {
        validator: function (value, param) {
            return /^[\u0391-\uFFE5\w]+$/.test(value);
        },
        message: '登录名称只允许汉字、英文字母、数字及下划线。'
    },
    safepass: {
        validator: function (value, param) {
            return safePassword(value);
        },
        message: '密码由字母和数字组成，至少6位'
    },
    equalTo: {
        validator: function (value, param) {
            return value == $(param[0]).val();
        },
        message: '两次输入的字符不一至'
    },
    number: {
        validator: function (value, param) {
            return /^\d+$/.test(value);
        },
        message: '请输入数字'
    },
    idcard: {
        validator: function (value, param) {
            return idCard(value);
        },
        message: '请输入正确的身份证号码'
    },
    safePassword: {
        validator: function (value, param) {
            return !(/^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/.test(value));
        },
        message: '密码由字母和数字组成，至少6位'
    },
    word: {
        validator: function (value, param) {
            return !(/^(([A-Z]{0,3}|[a-z]{0,3}|\d*))$|\s/.test(value));
        },
        message: '拼音名字由字母组成，至少4位'
    },
    idcard2: {
        validator: function (idcard, param) {
            var idcard = value;
            var Errors = new Array(
"验证通过!",
"身份证号码位数不对!",
"身份证号码出生日期超出范围或含有非法字符!",
"身份证号码校验错误!",
"身份证地区非法!"
);
            var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }

            var idcard, Y, JYM;
            var S, M;
            var idcard_array = new Array();
            idcard_array = idcard.split("");
            //地区检验
            if (area[parseInt(idcard.substr(0, 2))] == null) {
                alert(Errors[4]);
                return false;
            }
            //身份号码位数及格式检验
            switch (idcard.length) {
                case 15:
                    if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
                    } else {
                        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
                    }
                    if (ereg.test(idcard)) return true;
                    else {
                        alert(Errors[2]);
                        return false;
                    }
                    break;
                case 18:
                    //18位身份号码检测
                    //出生日期的合法性检查 
                    //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                    //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                    if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                    } else {
                        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                    }
                    if (ereg.test(idcard)) {//测试出生日期的合法性
                        //计算校验位
                        S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
+ parseInt(idcard_array[7]) * 1
+ parseInt(idcard_array[8]) * 6
+ parseInt(idcard_array[9]) * 3;
                        Y = S % 11;
                        M = "F";
                        JYM = "10X98765432";
                        M = JYM.substr(Y, 1); //判断校验位
                        if (M == idcard_array[17]) return true; //检测ID的校验位
                        else {
                            alert(Errors[3]);
                            return false;
                        }
                    }
                    else {
                        alert(Errors[2]);
                        return false;
                    }
                    break;
                default:
                    alert(Errors[1]);
                    return false;
                    break;
            }
        },
        message: '身份证号非法'
    },
    idCard: {
        validator: function (value, param) {
            if (value.length == 18 && 18 != value.length) return false;
            var number = value.toLowerCase();
            var d, sum = 0, v = '10x98765432', w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], a = '11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91';
            var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/);
            if (re == null || a.indexOf(re[1]) < 0) return false;
            if (re[2].length == 9) {
                number = number.substr(0, 6) + '19' + number.substr(6);
                d = ['19' + re[4], re[5], re[6]].join('-');
            } else d = [re[9], re[10], re[11]].join('-');
            if (!isDateTime.call(d, 'yyyy-MM-dd')) return false;
            for (var i = 0; i < 17; i++) sum += number.charAt(i) * w[i];
            return (re[2].length == 9 || number.charAt(17) == v.charAt(sum % 11));
        },
        message: '身份证号非法'
    },
    isDateTime:
    {
        validator: function (value, param) {
            format = param[0] || 'yyyy-MM-dd';
            var input = this, o = {}, d = new Date();
            var f1 = format.split(/[^a-z]+/gi), f2 = input.split(/\D+/g), f3 = format.split(/[a-z]+/gi), f4 = input.split(/\d+/g);
            var len = f1.length, len1 = f3.length;
            if (len != f2.length || len1 != f4.length) return false;
            for (var i = 0; i < len1; i++) if (f3[i] != f4[i]) return false;
            for (var i = 0; i < len; i++) o[f1[i]] = f2[i];
            o.yyyy = s(o.yyyy, o.yy, d.getFullYear(), 9999, 4);
            o.MM = s(o.MM, o.M, d.getMonth() + 1, 12);
            o.dd = s(o.dd, o.d, d.getDate(), 31);
            o.hh = s(o.hh, o.h, d.getHours(), 24);
            o.mm = s(o.mm, o.m, d.getMinutes());
            o.ss = s(o.ss, o.s, d.getSeconds());
            o.ms = s(o.ms, o.ms, d.getMilliseconds(), 999, 3);
            if (o.yyyy + o.MM + o.dd + o.hh + o.mm + o.ss + o.ms < 0) return false;
            if (o.yyyy < 100) o.yyyy += (o.yyyy > 30 ? 1900 : 2000);
            d = new Date(o.yyyy, o.MM - 1, o.dd, o.hh, o.mm, o.ss, o.ms);
            var reVal = d.getFullYear() == o.yyyy && d.getMonth() + 1 == o.MM && d.getDate() == o.dd && d.getHours() == o.hh && d.getMinutes() == o.mm && d.getSeconds() == o.ss && d.getMilliseconds() == o.ms;
            return reVal && reObj ? d : reVal;
            function s(s1, s2, s3, s4, s5) {
                s4 = s4 || 60, s5 = s5 || 2;
                var reVal = s3;
                if (s1 != undefined && s1 != '' || !isNaN(s1)) reVal = s1 * 1;
                if (s2 != undefined && s2 != '' && !isNaN(s2)) reVal = s2 * 1;
                return (reVal == s1 && s1.length != s5 || reVal > s4) ? -10000 : reVal;
            }
        },
        message: '身份证号非法'
    }

}