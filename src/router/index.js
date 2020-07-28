import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui';
import Layout from '@/components/Layout.vue';
Vue.use(VueRouter)

const routes = [{
		path: '/login',
		alias: '/',
		name: 'Login',
		component: () => import('@/views/Login.vue'),
		meta: { requiresAuth: false }
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/views/Register.vue'),
		meta: { requiresAuth: false }
	},
	{
		path: '/goods/',
		name: 'Goods',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
				path: 'list',
				name: 'GoodsList',
				component: () => import('@/views/Goods/List.vue')
			},
			{
				path: 'goods',
				name: 'GoodsGoods',
				component: () => import('@/views/Goods/Goods.vue')
			},
			{
				path: 'category',
				name: 'GoodsCategory',
				component: () => import('@/views/Goods/Category.vue')
			},
			{
				path: 'edit:id',
				name: 'GoodsEdit',
				props:true,
				component: () => import('@/views/Goods/Edit.vue')
			},
		]
	},
	{
		path: '/order/',
		name: 'Order',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
			path: 'list',
			name: 'OrderList',
			component: () => import('@/views/Order/List.vue')
		}, ]
	},
	{
		path: '/admin/',
		name: 'Admin',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
				path: 'edit',
				name: 'AdminEdit',
				component: () => import('@/views/Admin/Edit.vue')
			},
			{
				path: 'list',
				name: 'AdminList',
				component: () => import('@/views/Admin/List.vue')
			},
		]
	},
	{
		path: '/role/',
		name: 'Role',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
				path: 'list',
				name: 'RoleList',
				component: () => import('@/views/Role/List.vue')
			},
			{
				path: 'sub',
				name: 'RoleSub',
				component: () => import('@/views/Role/Sub.vue')
			},
		]
	},
]

const router = new VueRouter({
	routes
})

//全局守卫
router.beforeEach((to, from, next) => {
	console.log(to);
	console.log(from);
	//根据meta元信息，校验路由是否需要授权
	// console.log(to.matched)
	let isRequireAuth = to.matched.some((path) => path.meta.requiresAuth)
	//不需要登录授权，直接放行
	if(!isRequireAuth){
		next();
		return
	}
	//校验token
	let token = sessionStorage.token;
	//有token，立即放行
	if (token) {
		next();
		return
	}
	//无token，强制跳转登录
	Message.error("无效的token,请重新登陆")
	setTimeout(() => {
		next(`/login?redirect=${to.path}`);
	}, 2000);
})


export default router
