// import 'whatwg-fetch';
import Notice from 'COMPONENTS/Notice/index';
import History from 'ROUTERS/history';
import systemUrl from 'SRC/path';

let config = {
    ...systemUrl
};

/**
 * 数据帮助类
 */
class dataUtil {
    static GetQueryString = (k) => {
        let regExp = new RegExp('([?]|&)' + k + '=([^&]*)(&|$)');
        let result = window.location.href.match(regExp);
        if (result) {
            return decodeURIComponent(result[2]);
        } else {
            return null;
        }
    }
    /**
     * [获取数据方法]
     */
    static post = async (url, param, successCall = () => {}, errorCall = () => {}) => {
        try {
            Notice.loading('加载中...', 0, null);

            let json = {};
            json.v = dataUtil.GetQueryString('v');
            json.version_code = dataUtil.GetQueryString('version_code');
            if (dataUtil.GetQueryString('signature')) {
                json.signature = dataUtil.GetQueryString('signature');
            } else if (dataUtil.GetQueryString('token')) {
                json.token = dataUtil.GetQueryString('token');
            }
            /**
            json.v = 5;
            json.signature = '';
            json.version_code = '1.8.0';
            ***/
            let param2 = Object.assign({}, json, param);

            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(param2)

            }).then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    errorCall({msg: '服务器请求失败'});
                    console.log(res);
                }
            });

            console.log('请求地址：', config.baseUrl, '接口名：', url, '\n请求参数：', param2, '\n请求结果：', result);
            if (result.msg === 'nologin') {
                // 账号未登录 被踢
                if (dataUtil.GetQueryString('v') === '5') {
                    dataUtil.requestType('nologin');
                } else {
                    window.wst.goLoingPage();
                }
            } else if (result.status === true || result.status === 'success') {
                successCall(result);
            } else {
                errorCall(result);
            }

            Notice.hide();
        } catch (err) {
            console.log(err);
        }
    };

    static get = async (url, param, successCall = () => {}, errorCall = () => {}) => {
        Notice.loading('加载中...', 0, null);

        let str = '';
        let param2 = '';

        if (dataUtil.GetQueryString('signature')) {
            param2 = Object.assign({}, {v: dataUtil.GetQueryString('v'), signature: dataUtil.GetQueryString('signature'), version_code: dataUtil.GetQueryString('version_code')}, param);
        } else if (dataUtil.GetQueryString('token')) {
            param2 = Object.assign({}, {v: dataUtil.GetQueryString('v'), token: dataUtil.GetQueryString('token'), version_code: dataUtil.GetQueryString('version_code')}, param);
        }
        // param2 = Object.assign({},{v: '5', signature:'f53c390a55e6296b670c1748b573e1f3' , version_code: '3.0.3'},param);
        for (let i in param2) {
            str += '&' + i + '=' + param2[i];
        }
        try {
            const result = await fetch(url + '?time=' + new Date().getTime() + str, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log('发生了什么？？', res.url);
                if (res.status === 200) {
                    return res.json();
                } else {
                    errorCall({msg: '服务器请求失败'});
                    console.log(res);
                }
            });
            console.log('请求地址：', config.baseUrl, '接口名：', url, '\n请求参数：', str, '\n请求结果：', result);
            if (result.msg === 'nologin') {
                // 账号未登录 被踢
                if (dataUtil.GetQueryString('v') === '5') {
                    dataUtil.requestType('nologin');
                } else {
                    window.wst.goLoingPage();
                }
            } else if (result.status === true || result.status === 'success') {
                successCall(result);
            } else {
                errorCall(result);
            }
            Notice.hide();
        } catch (err) {
            console.log(err);
        }
    };
    /**
     * Android 打开一个新的webview
     * 1、要传带 https 的全链接
     *    window.wst.goOpenWebViewPage("");
     * 2、window.wst.openWebViewPage('masterRank');
     */
    static pushPath = (path, data = {}) => {
        if (dataUtil.GetQueryString('signature')) {
            History.push({pathname: path, search: '?v=' + dataUtil.GetQueryString('v') + '&signature=' + dataUtil.GetQueryString('signature') + '&version_code=' + dataUtil.GetQueryString('version_code'), state: data});
        } else if (dataUtil.GetQueryString('token')) {
            History.push({pathname: path, search: '?v=' + dataUtil.GetQueryString('v') + '&token=' + dataUtil.GetQueryString('token') + '&version_code=' + dataUtil.GetQueryString('version_code'), state: data});
        } else {
            History.push({pathname: path, state: data});
        }
    }

    static requestType = (type) => {
        return window.postMessage(JSON.stringify({
            'type': 'requestEvent',
            'state': {
                'status': type
            }
        }), '*');
    }
}

class dateUtil {
    /**
     * 获取当前时间
     * @return {[type]} [description]
     */
    static getTime = (time) => {
        if (time) {
            time = time.replace(/-/g, '/');
            time = time.replace(/\.\d/g, '');
            return new Date(time);
        } else {
            return new Date();
        }
    }

    /**
     * 获取年份 如2015
     * @return {[type]} [description]
     */
    static getFullYear = (time) => {
        return dateUtil.getTime(time).getFullYear();
    }

    /**
     * 获取年份 如115
     * @return {[type]} [description]
     */
    static getYear = (time) => {
        return dateUtil.getTime(time).getYear();
    }

    /**
     * 获取月份 返回0-11 0表示一月 11表示十二月
     */
    static getMonth = (time) => {
        return dateUtil.getTime(time).getMonth();
    }

    /**
     * 获取星期几  返回的是0-6的数字，0 表示星期天
     * @return {[type]} [description]
     */
    static getWeek = (time) => {
        return dateUtil.getTime(time).getDay();
    }

    /**
     * 获取当天日期
     * @return {[type]} [description]
     */
    static getDate = (time) => {
        return dateUtil.getTime(time).getDate();
    }

    /**
     * 获取小时数
     */
    static getHours = (time) => {
        return dateUtil.getTime(time).getHours();
    }

    /**
     * 获取分钟数
     */
    static getMinutes = (time) => {
        return dateUtil.getTime(time).getMinutes();
    }

    /**
     * 获取秒数
     */
    static getSeconds = (time) => {
        return dateUtil.getTime(time).getSeconds(); // 获取秒数
    }

    /**
     * 获取当前日期：
     * formatStr：可选，格式字符串，默认格式：yyyy-MM-dd hh:mm:ss
     * 约定如下格式：
     * （1）YYYY/yyyy/YY/yy 表示年份
     * （2）MM/M 月份
     * （3）W/w 星期
     * （4）dd/DD/d/D 日期
     * （5）hh/HH/h/H 时间
     * （6）mm/m 分钟
     * （7）ss/SS/s/S 秒
     * （8）iii 毫秒
     */
    static formatDate = (formatStr, time) => {
        var str = formatStr;
        if (!formatStr) {
            str = 'yyyy-MM-dd hh:mm:ss'; // 默认格式
        }
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        str = str.replace(/yyyy|YYYY/, dateUtil.getFullYear(time));
        str = str.replace(/yy|YY/, (dateUtil.getYear(time) % 100) > 9 ? (dateUtil
            .getYear(time) % 100).toString() : '0' + (dateUtil.getYear(time) % 100));
        str = str.replace(/MM/, dateUtil.getMonth(time) >= 9 ? (parseInt(dateUtil
            .getMonth(time)) + 1).toString() : '0' + (parseInt(dateUtil.getMonth(
            time)) + 1));
        str = str.replace(/M/g, (parseInt(dateUtil.getMonth(time)) + 1));
        str = str.replace(/w|W/g, Week[dateUtil.getWeek(time)]);
        str = str.replace(/dd|DD/, dateUtil.getDate(time) > 9 ? dateUtil.getDate(
            time).toString() : '0' + dateUtil.getDate(time));
        str = str.replace(/d|D/g, dateUtil.getDate(time));
        str = str.replace(/hh|HH/, dateUtil.getHours(time) > 9 ? dateUtil.getHours(
            time).toString() : '0' + dateUtil.getHours(time));
        str = str.replace(/h|H/g, dateUtil.getHours(time));
        str = str.replace(/mm/, dateUtil.getMinutes(time) > 9 ? dateUtil.getMinutes(
            time).toString() : '0' + dateUtil.getMinutes(time));
        str = str.replace(/m/g, dateUtil.getMinutes(time));
        str = str.replace(/ss|SS/, dateUtil.getSeconds(time) > 9 ? dateUtil.getSeconds(
            time).toString() : '0' + dateUtil.getSeconds(time));
        str = str.replace(/s|S/g, dateUtil.getSeconds(time));
        str = str.replace(/iii/g, dateUtil.millSecond < 10 ? '00' + dateUtil.millSecond
            : (dateUtil.millSecond < 100 ? '0' + dateUtil.millSecond : dateUtil.millSecond)
        );
        return str;
    }

    static formateTimestamp (timestamp, aformate) {
        let format = aformate || 'yyyy-MM-dd hh:mm';

        let date = new Date(timestamp * 1000);// 如果date为13位不需要乘1000
        let o = {
            'M+': date.getMonth() + 1, // month
            'd+': date.getDate(), // day
            'h+': date.getHours(), // hour
            'm+': date.getMinutes(), // minute
            's+': date.getSeconds(), // second
            'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
            'S': date.getMilliseconds() // millisecond
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        for (let k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
            }
        }
        return format;
    }

    static formateClockStr (str) {
        const d = str.substr(str.length - 2, 2);
        const m = str.substr(str.length - 4, 2);
        const y = str.substr(0, 4);
        return y + '-' + m + '-' + d;
    }

    /**
     * 格式化数字 强制x位小数
     * @param num num
     * @returns {Boolean}
     */
    static toDecimal (num, x) {
        num = num + '';
        num = num.replace(/\s/, '');
        let fx = parseFloat(num);
        if (isNaN(fx)) {
            return 0;
        }
        fx = Math.round(num * 100) / 100;
        let sx = fx.toString();
        let posDecimal = sx.indexOf('.');
        if (posDecimal < 0) {
            posDecimal = sx.length;
            sx += '.';
        }
        while (sx.length <= posDecimal + x) {
            sx += '0';
        }
        return sx;
    }
}

export {
    config,
    dataUtil,
    dateUtil
};
