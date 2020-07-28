//引入axios
import axios from 'axios'
//获取角色列表
let list = (data) => axios.get('/api/role/list', { params: data });
//更新角色
let edit = (data) => axios.put('/api/role', data);
//删除角色
let remove = (id) => axios.delete('/api/role', { params: id });
//添加角色
let add = (data) => axios.post('/api/role', data);

let config = (data) => axios.get('/api/role/config', { params: data });

let removeMenu = (data) => axios.delete('/api/role/menu', { params: data });

let addMenu = (data) => axios.post('/api/role/menu', data);

export default {
	list,
	edit,
	remove,
	add,
	config,
	removeMenu,
	addMenu
}
