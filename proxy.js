//这是一个代理服务，主要是因为知乎的api是禁止跨域访问的，所以我们要将请求的地址的域名改写为本地地址
//也就是127.0.0.1
const http = require('http');
const request = require('request');

const hostname = '127.0.0.1';
const port = 8020;
const imgPort = 8021;
const cssPort = 8022;

//创建API代理服务
const apiServer = http.createServer((req, res) => {
    const url = 'http://news-at.zhihu.com/api/4' + req.url;
    
    const options = {
        url: url
    };
    function callback(error, response, body) {
        if(!error && response.statusCode === 200){
            console.log("success!");
            //设置编码类型，不然中文会乱码
            res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
            //所有域允许跨域
            res.setHeader('Access-Control-Allow-Origin','*');
            //返回代理后内容
            res.end(body);
        }
    }
    request.get(options, callback);
}).listen(port, hostname, () => {
    console.log("代理服务运行在http://" + hostname + ":" +port);
});

//创建图片代理服务
const imgServer = http.createServer( (req,res) => {
    const url = req.url.split('/img/')[1];
    const options = {
        url: url,
        encoding: null
    };
    function callback(error, response, body){
        if(!error && response.statusCode === 200){
            //设置编码类型，不然中文会乱码
            res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
            //所有域允许跨域
            res.setHeader('Access-Control-Allow-Origin','*');
            //返回代理后内容
            res.end(body);
        }
    }
    request.get(options, callback)
}).listen(imgPort, hostname, () => {
    console.log("图片代理服务运行在http://" + hostname + ":" +imgPort)
});

//css代理服务
const cssServer = http.createServer((req, res) => {
    const url = req.url.split('/css1/')[1];
    console.log(url);
    const options = {
        url: url
    };
    function callback(error, response, body) {
        if(!error && response.statusCode === 200){
            console.log("success!");
            //设置编码类型，不然中文会乱码
            res.setHeader('Content-Type', 'text/css;charset=UTF-8');
            //所有域允许跨域
            res.setHeader('Access-Control-Allow-Origin','*');
            //返回代理后内容
            res.end(body);
        }
    }
    request.get(options, callback);
}).listen(cssPort, hostname, () => {
    console.log("CSS代理服务运行在http://" + hostname + ":" + cssPort);
});
