import axios from 'axios';

let category = (data) => axios.get('/api/category/sub', { params: data });


let edit = (data) => axios.put('/api/category',data);

let add = (data) => axios.post('/api/category', data);

let remove = (data) => axios.delete('/api/category',{ params: data });

let list = (data) => axios.get('/api/goods/list', { params: data });

let dele = (data) => axios.delete('/api/admin/goods',{ params: data });
//发布商品
let good = (data) => axios.post('/api/admin/goods', data);

let details = (data) => axios.get('/api/admin/goods', { params: data });

let addedit = (data) => axios.put('/api/admin/goods',data);

let deleimg = (data) => axios.delete('/api/upload',{ params: data });

export default {
	category,
	edit,
	add,
	remove,
	list,
	dele,
	good,
	details,
	addedit,
	deleimg
}
