import Taro from "@tarojs/taro";
import moment from "moment";
moment.locale("zh-cn");
let common = {
    moment: moment,
	/**
	 * ajax传送
	 */
    debug: "release",
    formatTimeToNow(timeStamps) {
        var day = moment(timeStamps * 1000);
        var now = moment();
        return Math.abs(now.diff(day, "day"));
    },
    defaultBg: {
        index: "http://cdn.xbpig.cn/common/indexBg.png",
        item:
            "http://cdn.xbpig.cn/common/colorful-bubble-with-reflection-of-prague-buildings-picjumbo-com.jpg?imageView2/0/w/300/h/250"
    },
	/**
	 * 检测用户是否登陆
	 */
    checkLogin: function (cbPass, cbError) {
        let token = Taro.getStorageSync("token");
        let info = Taro.getStorageSync("info");
        let that = this;
        if (token != "" && info != "") {
            this.checkUserInfo({}, function (data, code) {
                if (code === 1111 || code == 10001 || code == 10002) {
                    cbError && cbError();
                } else {
                    cbPass && cbPass();
                }
            });
        } else {
            cbError && cbError();
        }
    },
    url: function () {
        let str = "";
        if (this.debug == "local") {
            str = "http://api.xbpig.cn";
        } else {
            str = "https://api.daysnote.cn";
        }
        return str;
    },
    imgDefault:
        "http://cdn.xbpig.cn/common/colorful-bubble-with-reflection-of-prague-buildings-picjumbo-com.jpg?imageView2/0/w/300/h/250",
    getImgUrl(img, w, h, type) {
        if (!w) w = 300;
        if (!h) h = 250;
        if (type !== 0 && !type) type = 1;
        let url;
        url = "http://cdn.xbpig.cn/";

        return url + img + "?imageView2/" + type + "/w/" + w + "/h/" + h;
    },
    formatTimeLine: function (timestamps, type) {
        let str = "",
            nowTime = new Date().getTime(),
            interval,
            year,
            day,
            dateStr,
            timeStr;
        timestamps *= 1000;
        interval = Math.round(Math.abs((timestamps - nowTime) / 86400000));
        year = parseInt(interval / 365);
        day = parseInt(interval % 365);
        let timS = timestamps;
        let date = new Date(timS),
            date_year = date.getFullYear(),
            date_month = date.getMonth() + 1;
        dateStr =
            "距离" + date_year + "年" + date_month + "月" + date.getDate() + "日";
        if (year > 0) {
            timeStr = year + "年" + day + "天";
        } else {
            timeStr = day + "天";
        }
        if (type === "date") {
            str = dateStr;
        } else if (type === "time") {
            str = timeStr;
        } else if (type === "day") {
            str = interval + "天";
        }
        return str;
    },
    formatCreate: function (timestamp, type) {
        let time = new Date(timestamp * 1000),
            str;
        if (type === "time") {
            str = time.getHours() + ":" + time.getMinutes();
        } else if (type === "date") {
            str =
                time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate();
            // str = time.getDate();
        } else if (type === "all") {
            str =
                time.getFullYear() +
                "/" +
                (time.getMonth() + 1) +
                "/" +
                time.getDate() +
                " " +
                time.getHours() +
                ":" +
                time.getMinutes();
        }
        return str;
    },
    setUserInfo: function (cb) {
        let that = this;
        Taro.getUserInfo({
            success: function (res) {
                res.wx_token = Taro.getStorageSync("wx_token");
                if (process.env.TARO_ENV === "weapp") {
                    that.wxUserLogin(res, function (response) {
                        Taro.setStorageSync("token", response.token);
                        Taro.setStorageSync("info", response.info);
                        cb && cb();
                    });
                } else if (process.env.TARO_ENV === "swan") {
                    console.log(res)
                    that.bdUserLogin(res, function (response) {
                        Taro.setStorageSync("token", response.token);
                        Taro.setStorageSync("info", response.info);
                        cb && cb();
                    });
                }
            },
            fail: function (e) {
                console.log(e);
                Taro.navigateTo({
                    url: "/pages/error/error"
                });
            }
        });
    },
    userLogin: function (cb) {
        let that = this;
        Taro.login({
            success: function (res_main) {
                if (process.env.TARO_ENV === "weapp") {
                    that.wxUserCode(
                        {
                            code: res_main.code
                        },
                        function (response_code) {
                            Taro.setStorageSync("wx_token", response_code.token);
                            that.setUserInfo(cb);
                        }
                    );
                } else if (process.env.TARO_ENV === "swan") {
                    that.bdUserCode(
                        {
                            code: res_main.code
                        },
                        response_code => {
                            Taro.setStorageSync("wx_token", response_code.token);
                            that.setUserInfo(cb);
                        }
                    );
                }
            }
        });
    },
    ajaxFunc: function (url, data, callback, type) {
        let self = this;
        data.token = Taro.getStorageSync("token");
        data.info = Taro.getStorageSync("info");
        let urlStr = self.url() + url;
        Taro.showLoading({title: "加载中"});
        Taro.request({
            url: urlStr,
            data: data,
            method: type || "POST",
            header: {
                "Content-Type": "application/json"
            },
            success: function (res) {
                Taro.hideLoading();
                let response = res.data;
                if (response.code == 10001) {
                    Taro.clearStorage();
                    Taro.showToast({
                        title: response.msg || "接口异常 code:10001",
                        duration: 2000
                    });
                } else if (response.code != 0) {
                    Taro.showToast({
                        title: response.msg || "接口异常 code:" + res.code,
                        duration: 2000
                    });
                    if (response.code == 1111) {
                        Taro.removeStorageSync("token");
                        Taro.removeStorageSync("info");
                        self.userLogin();
                    }
                }
                if (
                    typeof callback == "function" &&
                    (response.code || response.code == 0)
                ) {
                    callback.call(null, response.data, response.code, response);
                } else {
                    return;
                }
            },
            fail: function (e) {
                console.error(e);
                Taro.showToast({
                    title: "网络连接异常",
                    duration: 2000
                });
            }
        });
    },
    wxUserLogin: function (data, callback) {
        this.ajaxFunc("/api2/wx/login", data, callback);
    },
    bdUserLogin: function (data, callback) {
        this.ajaxFunc("/api2/bd/login", data, callback);
    },
    getWxUser: function (data, callback) {
        this.ajaxFunc("/api2/user/detail", data, callback);
    },
    wxUserCode: function (data, callback) {
        this.ajaxFunc("/api2/wx/addCode", data, callback);
    },
    bdUserCode: function (data, callback) {
        this.ajaxFunc("/api2/bd/addCode", data, callback);
    },
    getOwnBox: function (data, callback) {
        this.ajaxFunc("/api2/box/own", data, callback);
    },
    getBoxDetailByOwn: function (data, callback) {
        this.ajaxFunc("/api2/box/one", data, callback);
    },
    addPic: function (data, callback) {
        let self = this;
        let urlStr = self.url() + "/api2/pic/add";
        Taro.uploadFile({
            url: urlStr,
            filePath: data[0],
            name: "img",
            formData: {
                token: Taro.getStorageSync("token"),
                info: Taro.getStorageSync("info")
            },
            success: function (res) {
                console.log(res);
                let response;
                if (process.env.TARO_ENV === "weapp") {
                    response = JSON.parse(res.data);
                } else if (process.env.TARO_ENV === "swan") {
                    response = res.data;
                }
                if (response.code == 0) {
                    if (!callback) return;
                    if (typeof callback == "function") {
                        callback.call(null, response.data);
                    }
                } else {
                    Taro.showToast({
                        title: response.msg || "fail",
                        duration: 2000
                    });
                    if (response.code == 1111) {
                        Taro.removeStorageSync("token");
                        Taro.removeStorageSync("info");
                    }
                }
            },
            fail: function (e) {
                console.log(e);
            }
        });
    },
    addBoxDetail: function (data, callback) {
        this.ajaxFunc("/api2/box/add", data, callback);
    },
    createUser: function (data, callback) {
        this.ajaxFunc("/api2/wx/loginNone", data, callback);
    },
    getAddress: function (data, callback) {
        this.ajaxFunc("/api2/address/get", data, callback);
    },
    addAdvice: function (data, callback) {
        this.ajaxFunc("/api2/advice/add", data, callback);
    },
    getUpdateList: function (data, callback) {
        this.ajaxFunc("/api2/system/update/list", data, callback);
    },
    delBoxOne: function (data, callback) {
        this.ajaxFunc("/api2/box/del", data, callback);
    },
    updateBoxOne: function (data, callback) {
        this.ajaxFunc("/api2/box/update", data, callback);
    },
    getRandomOne: function (data, callback) {
        this.ajaxFunc("/api2/box/randomOne", data, callback);
    },
    getUserAdvice: function (data, callback) {
        this.ajaxFunc("/api2/advice/get", data, callback);
    },
    checkUserInfo: function (data, callback) {
        this.ajaxFunc("/api2/user/check", data, callback);
    },
    getConfig: function (data, callback) {
        this.ajaxFunc("/api2/system/config", data, callback);
    }
};

export default common;
