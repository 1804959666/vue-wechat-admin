import axios from 'axios';

let menu = (data) => axios.get('/api/menu/sub', { params: data });

let add = (data) => axios.post('/api/menu', data);

let remove = (data) => axios.delete('/api/menu', { params: data });

let edit = (data) => axios.put('/api/menu', data);

let icon = (data) => axios.get('/api/admin/icon/list', { params: data });

let addIcon = (data) => axios.put('/api/menu/icon', data);



export default {
	menu,
	add,
	remove,
	edit,
	icon,
	addIcon,
}
