// 异步操作
function nextTick (t) {
    setTimeout(t);
}
// 判断是否是数字
function isNumber (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * 将url参数转成对象返回
 * url String url字符串如https://www.baidu.com/s?ie=utf-8
 * name String 如果需要获取参数某个值传入
 * 返回值: 参数对象或者某个参数值
 */

export function paramToObj (url, name) {
    let obj = {};
    let a = document.createElement('a');
    a.href = url;
    let search = a.search;
    a = null;
    if (search.indexOf('?') === 0) {
        let str = search.substr(1);
        let arr = str.split('&');
        arr.forEach((item, i) => {
            let paramArr = item.split('=');
            // 防止编码，把编码也解析出来
            obj[decodeURIComponent(paramArr[0])] = decodeURIComponent(paramArr[1]);
        });
    }
    return name ? obj[name] : obj;
}

/**
 * 将url上增加参数
 * url String url字符串如https://www.baidu.com/s?ie=utf-8
 * param Object 参数对象
 * 返回值: 拼接好的URL字符串
 */

export function addUrlParam (url, param) {
    let a = document.createElement('a');
    a.href = url;
    let arr = [];
    let search = a.search;
    if (param) {
        Object.keys(param).forEach((item) => {
            if (param[item] !== '' && param[item] !== null && param[item] !== undefined) {
                arr.push(encodeURIComponent(item) + '=' + encodeURIComponent(param[item]));
            }
        });
    }
    if (arr.length !== 0) {
        search += search === '' ? '?' + arr.join('&') : '&' + arr.join('&');
    }
    let retUrl = a.origin + a.pathname + search + a.hash;
    a = null;
    return retUrl;
}

/**
 * localStorage和sessionStorage操作
 * obj Object key, value
 * k key
 * cb 异步后回调
 * 返回值: 拼接好的URL字符串
 */

const _key = 'ltn_';
// 存储改为异步操作
export let storage = {
    localStorage: {
        setItem: (obj, cb, async = true) => {
            let key = _key + obj.key;
            let val = obj.value;
            if (async) {
                nextTick(() => {
                    let k = JSON.stringify(key);
                    let v = JSON.stringify(val);
                    window.localStorage.setItem(k, v);
                    cb && cb(null);
                });
            } else {
                let k = JSON.stringify(key);
                let v = JSON.stringify(val);
                window.localStorage.setItem(k, v);
                cb && cb(null);
            }
        },
        getItem: (k, cb, async = true) => {
            let key = _key + k;
            if (async) {
                nextTick(() => {
                    let val = JSON.parse(window.localStorage.getItem(JSON.stringify(key)));
                    cb && cb(val, null);
                });
            } else {
                let val = JSON.parse(window.localStorage.getItem(JSON.stringify(key)));
                cb && cb(val, null);
                return val;
            }
        },
        removeItem: (k, cb) => {
            let key = _key + k;
            nextTick(() => {
                window.localStorage.removeItem(JSON.stringify(key));
                cb && cb(null);
            });
        },
        clear: (cb) => {
            nextTick(() => {
                window.localStorage.clear();
                cb && cb(null);
            });
        }
    },
    sessionStorage: {
        setItem: (obj, cb, async = true) => {
            let key = _key + obj.key;
            let val = obj.value;
            if (async) {
                nextTick(() => {
                    let k = JSON.stringify(key);
                    let v = JSON.stringify(val);
                    window.sessionStorage.setItem(k, v);
                    cb && cb(null);
                });
            } else {
                let k = JSON.stringify(key);
                let v = JSON.stringify(val);
                window.sessionStorage.setItem(k, v);
                cb && cb(null);
            }
        },
        getItem: (k, cb, async = true) => {
            let key = _key + k;
            if (async) {
                nextTick(() => {
                    let val = JSON.parse(window.sessionStorage.getItem(JSON.stringify(key)));
                    cb && cb(val, null);
                });
            } else {
                let val = JSON.parse(window.sessionStorage.getItem(JSON.stringify(key)));
                cb && cb(val, null);
                return val;
            }
        },
        removeItem: (k, cb) => {
            let key = _key + k;
            nextTick(() => {
                window.sessionStorage.removeItem(JSON.stringify(key));
                cb && cb(null);
            });
        },
        clear: (cb) => {
            nextTick(() => {
                window.sessionStorage.clear();
                cb && cb(null);
            });
        }
    }
};
// key 取cookie值, val value, opts
export function cookie (key, val, opts) {
    if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(val)) || val === null || val === undefined)) {
        opts = opts || {};
        val !== null && val !== undefined || (opts.expires = -1);
        if (typeof opts.expires === 'number') {
            let r = opts.expires;
            let o = opts.expires = new Date();
            o.setDate(o.getDate() + r);
        }
        key = encodeURIComponent(key);
        val = opts.raw ? val + '' : encodeURIComponent(val + '');
        let expires = opts.expires ? '; expires=' + opts.expires.toUTCString() : '';
        let path = opts.path ? '; path=' + opts.path : '';
        let domain = opts.domain ? '; domain=' + opts.domain : '';
        let secure = opts.secure ? '; secure' : '';
        let arr = [key, '=', val, expires, path, domain, secure];
        return document.cookie = arr.join('');
    }
    opts = val || {};
    let a = opts.raw ? function (t) { return t; } : decodeURIComponent;
    let s = document.cookie.split('; ');
    let i;
    for (let c = 0; c < s.length; c++) {
        i = s[c] && s[c].split('=');
        if (a(i[0]) === key) {
            return a(i[1] || '');
        }
    }
    return null;
};

/**
 * 时间格式化
 * date 时间戳
 * format 时间格式
 * 返回值: 根据时间格式返回字符串
 */

export function formatDate (date = new Date(), format = 'yyyy-MM-dd HH:mm:ss') {
    if (isNumber(date) || date.constructor === Date) {
        /* 这里只适用于常用的时间戳长度：10位/13位 */
        date = (isNumber(date) && date.length) === 10 ? (date * 1000) : date;
        date = typeof +date === 'number' ? new Date(+date) : date;
        let timeObj = {
            y: date.getFullYear(),
            M: date.getMonth() + 1,
            d: date.getDate(),
            q: Math.floor((date.getMonth() + 3) / 3),
            w: date.getDay(),
            H: date.getHours(),
            h: date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
            m: date.getMinutes(),
            s: date.getSeconds(),
            S: date.getMilliseconds()
        };
        let week = ['天', '一', '二', '三', '四', '五', '六'];
        for (let time in timeObj) {
            format = format.replace(new RegExp(time + '+', 'g'), (t) => {
                let e = timeObj[time] + '';
                if (time === 'w') {
                    return (t.length > 2 ? '星期' : '周') + week[e];
                }
                for (let i = 0, len = e.length; i < t.length - len; i++) {
                    e = '0' + e;
                }
                return t.length === 1 ? e : e.substring(e.length - t.length);
            });
        }
        return format;
    } else {
        return date;
    }
}

/**
 * 秒数格式化
 * seconds 时间戳
 * format 时间格式
 * 返回值: 根据时间格式返回字符串
 */

export function formatSecond (seconds = 0, format = 'HH:mm:ss') {
    if (isNumber(seconds)) {
        let [days, hours, mins, secs] = [0, 0, 0, 0];
        secs = parseInt(seconds) % 60;
        mins = parseInt(seconds / 60);
        if (seconds > (60 * 60 - 1)) {
            mins = parseInt(seconds / 60) % 60;
            hours = parseInt(parseInt(seconds / 60) / 60);
            if (seconds > (60 * 60 * 24 - 1)) {
                hours = parseInt(parseInt(seconds / 60) / 60) % 24;
                days = parseInt(parseInt(parseInt(seconds / 60) / 60) / 24);
            }
        }
        let secObj = {
            d: days,
            H: hours,
            m: mins,
            s: secs
        };
        for (let sec in secObj) {
            format = format.replace(new RegExp(sec + '+', 'g'), (t) => {
                let e = secObj[sec] + '';
                for (let i = 0, len = e.length; i < t.length - len; i++) {
                    e = '0' + e;
                }
                return t.length === 1 ? e : e.substring(e.length - t.length);
            });
        }
        return format;
    } else {
        return seconds;
    }
}

/**
 * 各种选择器固定页面，包括日历、城市、时间等
 * type 是固定还是scroll
 */

export function fixScroll (type) {
    if (type === 'fixed') {
        // 会引起页面重绘
        let scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
        storage.localStorage.setItem({
            key: 'scroll',
            value: {
                originHtmlScrollY: document.getElementsByTagName('html')[0].style.overflowY,
                originHtmlPosition: document.getElementsByTagName('html')[0].style.position,
                scrollTop: document.documentElement.scrollTop + document.body.scrollTop
            }
        }, null, false);
        document.getElementsByTagName('html')[0].style.overflowY = 'hidden';
        document.getElementsByTagName('html')[0].style.position = 'fixed';
        document.getElementsByTagName('html')[0].style.top = '-' + scrollTop + 'px';
    } else if (type === 'scroll') {
        let originHtmlScroll = storage.localStorage.getItem('scroll', null, false);
        storage.localStorage.removeItem('scroll', null);
        document.getElementsByTagName('html')[0].style.overflowY = originHtmlScroll.originHtmlScrollY;
        document.getElementsByTagName('html')[0].style.position = originHtmlScroll.originHtmlScrollY;
        window.scrollTo(0, originHtmlScroll.scrollTop);
    }
}

export function accAdd (arg1, arg2) {
    arg1 = arg1 + '';
    arg2 = arg2 + '';
    let r1, r2, m;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    if ((arg1 * m + arg2 * m) / m === 0) {
        return ((arg1 * m + arg2 * m) / m).toFixed(Math.max(r1, r2));
    } else if (isNaN((arg1 * m + arg2 * m) / m)) {
        return '';
    }
    return (arg1 * m + arg2 * m) / m;
}

export function getBytesLength (str) {
    str = str + '';
    let totalLength = 0;
    let charCode;
    for (let i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i);
        if (charCode < 0x007f) {
            totalLength++;
        } else if ((charCode >= 0x0080) && (charCode <= 0x07ff)) {
            totalLength += 2;
        } else if ((charCode >= 0x0800) && (charCode <= 0xffff)) {
            totalLength += 3;
        } else {
            totalLength += 4;
        }
    }
    return totalLength;
}

export let strUtil = {
    /*
     * 判断字符串是否为空
     * @param str 传入的字符串
     * @returns {Boolean}
     */
    isEmpty: (str) => {
        if (str === null || typeof (str) === 'undefined' || (str === '' && typeof (str) !== 'number')) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 判断是否是中文
     * @param str
     * @returns {Boolean}
     */
    isChina: (str) => {
        var reg = /^([u4E00-u9FA5]|[uFE30-uFFA0])*$/;
        if (reg.test(str)) {
            return false;
        }
        return true;
    },
    /**
     * 判断对象是否是字符串
     * @param obj
     * @returns {Boolean}
     */
    isString: (obj) => {
        return Object.prototype.toString.call(obj) === '[object String]';
    },
    /**
     * 格式化数字 强制x位小数
     * @param num num
     * @returns {Boolean}
     */
    toDecimal: (num, x) => {
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
    },
    /**
     * 数字相减 强制x位小数
     * @param array num
     * @returns {Boolean}
     */
    toSubtraction: (nums, x = 0) => {
        let sum = parseFloat(nums[0]);

        function getSum (item, index, array) {
            if (index !== 0) {
                sum = sum - parseFloat(item);
            }
        };
        nums.forEach(getSum);

        return sum.toFixed(x);
    },
    /**
     * 数字相加 强制x位小数
     * @param array num
     * @returns {Boolean}
     */
    toAddition: (nums, x = 0) => {
        let sum = 0;

        function getSum (item, index, array) {
            sum += parseFloat(item);
        };
        nums.forEach(getSum);

        return sum.toFixed(x);
    },
    /**
     * 除去两边空白
     * @param str
     * @returns {str}
     */
    trim: (str) => {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    /**
     * 是否为手机号码
     * @param str
     * @returns {str}
     */
    isPhone: (str) => {
        let pattern = /^1[23456789][0-9]{9}$/;
        return pattern.test(str);
    }
};

// 定时器类
export let timeUtil = {
    set: (count, fn = () => {}, callback = () => {}) => {
        return (function () {
            let i = count;
            fn(i);
            i--;
            let timer = null;
            return setInterval(() => {
                if (i > 0) {
                    fn(i);
                    i--;
                } else {
                    callback();
                    timeUtil.clear(timer);
                }
            }, 1000);
        })();
    },
    clear: (timer) => {
        timer && clearInterval(timer);
    }
};

// 判断当前设备类型
export const whatDevice = () => {
    let device = '';
    let ua = window.navigator.userAgent.toLowerCase();
    if (/(Android)/i.test(ua)) {
        device = 'android';
    } else if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
        device = 'ios';
    } else if (/MicroMessenger/i.test(ua)) {
        device = 'wx';
    }
    return device;
};
