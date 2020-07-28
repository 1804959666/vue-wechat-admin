import axios from 'axios';

//登录
let login = (data) => axios.post('/api/admin/login', data);
//注册
let register = (data) => axios.post('/api/admin/register', data);
//获取个人资料
let edit = (data) => axios.get('/api/admin', { params: data });
//获取角色列表
let role = (data) => axios.get('/api/role/list', { params: data });
//修改个人资料
let modify = (data) => axios.put('/api/admin', data);

let list = (data) => axios.get('/api/admin/list', { params: data });

let remove = (data) => axios.delete('/api/admin', { params: data });
export default {
	login,
	register,
	edit,
	role,
	modify,
	list,
	remove
}
