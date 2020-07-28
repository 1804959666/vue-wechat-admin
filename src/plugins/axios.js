import { Message } from 'element-ui';
import router from '@/router/index'
//路由实例
import axios from 'axios';
//Loading 服务方式
import { Loading } from 'element-ui';
//Loading实例
let loading;
//设置默认baseURL
axios.defaults.baseURL = 'http://localhost:3003'

//添加请求拦截器
axios.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	// console.log(config)
	//开启Loadingf
	loading = Loading.service({ background: "rgba(0,0,0,0.3)" });
	
	//判断是否携带token
	if (config.url == '/admin/login' || config.url == '/admin/register') {
		return config;
	}
	//获取token
	let token = sessionStorage.token;

	//有token
	config.headers.Authorization = `Bearer ${token}`;
	
	return config;

}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});



//添加响应拦截器
axios.interceptors.response.use(function(response) {
	let { status, data } = response;
	//关闭Loading
	loading.close()
	return data;
}, function(error) {
	console.log(error)
	return Promise.reject(error)
})
