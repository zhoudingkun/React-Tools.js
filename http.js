/**
 * @author sunny
 * @email yanlihui@wshifu.com
 * @create date 2018-04-02 17:16
 * @desc 接口请求封装
*/

import React from 'react';
import systemUrl, { systemStatus } from 'SRC/path';
import Notice from 'COMPONENTS/Notice/index';
import History from 'ROUTERS/history';

const fetchTime = 20000; // 请求超时时间
export default {
    http: {
        async request (options, cb) {
            options.mask = options.mask || false;
            options.method = (options.method && options.method.toLocaleUpperCase()) || 'POST';
            options.headers = options.headers ? options.headers : {};
            // 检测是否把域名带过来了
            options.url = /^http(s)?:\/\//.test(options.url) ? options.url : (systemUrl.wxUrl + options.url);
            const json = {}; // 默认参数
            const param = Object.assign({}, json, options.param); // 参数
            const spin = options.spin; // 是否显示loading，默认不显示
            const errorToast = options.errorToast === undefined ? true : options.errorToast; // 是否显示错误警告，默认弹出
            const successToast = options.successToast; // 是否显示成功警告
            if (spin) {
                if (window.responseCount === undefined) window.responseCount = 0;
                if (!window.responseCount++) Notice.loading('加载中...', 0, null, options.mask);
            }
            let result;
            if (options.method === 'GET') {
                try {
                    let str = '';
                    for (let i in param) {
                        str += '&' + i + '=' + param[i];
                    }
                    result = await fetch(options.url + '?getTime=' + new Date().getTime() + str, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            ...options.headers
                        },
                        credentials: 'include',
                        timeout: fetchTime
                    }).then((res) => {
                        if (res.status === 200) {
                            return res.json();
                        } else {
                            const errJson = {
                                status: '1234567',
                                msg: res.statusText || '服务器请求失败！'
                            };
                            return errJson;
                        }
                    });
                } catch (e) {
                    console.warn(e);
                    result = {
                        status: '123456',
                        msg: '服务器请求失败！'
                    };
                }
            } else if (options.method === 'POST') {
                try {
                    result = await fetch(options.url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            ...options.headers
                        },
                        credentials: 'include',
                        body: JSON.stringify(param),
                        timeout: fetchTime
                    }).then((res) => {
                        if (res.status === 200) {
                            return res.json();
                        } else {
                            const errJson = {
                                status: '1234567',
                                msg: res.statusText || '服务器请求失败！'
                            };
                            return errJson;
                        }
                    });
                } catch (e) {
                    console.warn(e);
                    result = {
                        status: '123456',
                        msg: '服务器请求失败！'
                    };
                }
            }
            if (spin) {
                if (!window.responseCount || !--window.responseCount) Notice.hide();
            }
            if (systemStatus === 'prod') {
                console.log('请求地址：', options.url, '\n请求参数：', param, '\n请求结果：', result);
            }
            if (result.status === 1) {
                successToast && result.msg && Notice.success(<div style={{textAlign: 'center'}}>{result.msg}</div>, 2, null, false);
                cb && cb(result);
            } else if (result.status === -1) {
                Notice.fail(<div style={{textAlign: 'center'}}>{result.msg}</div>, 1.5, () => {
                    History.replace('login');
                }, true);
            // 避免刷新报错
            } else if (result.status === '123456') {
                cb && cb(result);
            } else {
                errorToast && result.msg && Notice.fail(<div style={{textAlign: 'center'}}>{result.msg}</div>, 2, null, false);
                cb && cb(result);
            }
        }
    }
};
