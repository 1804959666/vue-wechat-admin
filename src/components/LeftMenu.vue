<template>

	<el-menu default-active="1" router class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#334e66"
	 text-color="#fff" active-text-color="#ffd04b">
		<el-submenu index="1">
			<template slot="title">
				<i class="el-icon-goods"></i>
				<span>商品管理</span>
			</template>
				
				<el-menu-item index="/goods/category">
					商品分类
				</el-menu-item>
				<el-menu-item index="/goods/goods">
					发布商品
				</el-menu-item>
				<el-menu-item index="/goods/list">
					商品列表
				</el-menu-item>
		</el-submenu>

		<el-submenu index="2">
			<template slot="title">
				<i class="el-icon-files"></i>
				<span>订单管理</span>
			</template>
				<el-menu-item index="/order/list">
					订单列表
				</el-menu-item>
		</el-submenu>
		
		<el-submenu index="3">
			<template slot="title">
				<i class="el-icon-setting"></i>
				<span>账户设置</span>
			</template>
				<el-menu-item index="/admin/edit">
					账户信息
				</el-menu-item>
		</el-submenu>
		
		<el-submenu index="4">
			<template slot="title">
				<i class="el-icon-user"></i>
				<span slot="title">用户管理</span>
			</template>
				<el-menu-item index="/admin/list">
					用户列表
				</el-menu-item>
		</el-submenu>

		<el-submenu index="5">
			<template slot="title">
				<i class="el-icon-set-up"></i>
				<span slot="title">权限设置</span>
			</template>
				<el-menu-item index="/role/list">
					用户角色
				</el-menu-item>
				<el-menu-item index="/role/sub">
					菜单权限
				</el-menu-item>
		</el-submenu>
	</el-menu>




</template>

<script>
</script>
<script>
	export default {
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		}
	}
</script>
<style>
	.el-header {
	    padding: 0 !important;
		height: 55px !important;
	}
	
	.el-menu-vertical-demo a{
		color: white;
	}
	.el-menu-vertical-demo{
		color: white;
		height: calc(100vh - 55px);
	}
</style>
