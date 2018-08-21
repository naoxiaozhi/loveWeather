let API_HOST = "https://icredit.jd.com";
let DEBUG = true;//切换数据入口
var Mock = require('mock.js')
function ajax(data = '', fn, method = "get", header = {}) {
    if (!DEBUG) {
        wx.request({
            url: config.API_HOST + data,
            method: method ? method : 'get',
            data: {},
            header: header ? header : { "Content-Type": "application/json" },
            success: function (res) {
                fn(res);
            }
        });
    } else {
        // 模拟数据
        var res = Mock.mock({
            "obj":[
                {
                    "encryptName":"ot2iS6O0Lut4ERmQPVjGBuolp9JgHHLLFx3aDX00dXBLqi1DpX%2FrMQ%3D%3D",
                    "entName":"重庆市<em style='color:red'>小</em>米<em style='color:red'>小</em>额贷款有限公司",
                    "originalName":"重庆市小米小额贷款有限公司"
                },
                {
                    "encryptName":"RTkGWUl0%2BjvxvdNX7RprQMpYyNVPTeqwGr0ZmIMKgPYDGtmI3M%2B1%2Fw%3D%3D",
                    "entName":"马上<em style='color:red'>消</em>费金融股份有限公司",
                    "originalName":"马上消费金融股份有限公司"
                },
                {
                    "encryptName":"nVP9uz12DYAC7HX7%2BFWtAPTjLIvAubxdfnUbncXq5sE%3D",
                    "entName":"<em style='color:red'>小</em>米科技有限责任公司",
                    "originalName":"小米科技有限责任公司"
                },
                {
                    "encryptName":"gCK%2BOGipFYvjgzIrGjN9AlInaIRvuP%2BcC6A%2FbxOzBi6vzqc607K0%2FQ%3D%3D",
                    "entName":"重庆乐视<em style='color:red'>小</em>额贷款有限公司",
                    "originalName":"重庆乐视小额贷款有限公司"
                }
            ]
        })
        // 输出结果
       // console.log(JSON.stringify(res, null, 2))
        fn(res);
    }
}
module.exports = {
    ajax: ajax
}