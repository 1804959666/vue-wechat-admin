<template>
	<div class="navbar">
		<div class="navbar-logo">
			<img src="../assets/img/logo.png" height="55px">
			<i class="el-icon-s-fold"></i>
		</div>
		<div class="navbar-select">
			<el-dropdown>
				<span class="el-dropdown-link">
					<el-avatar id="img" :src="form.avatar"></el-avatar>
					{{form.fullname}}<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item>修改信息</el-dropdown-item>
					<el-dropdown-item>退出系统</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
	import { Admin } from "@/api/index";
	import Upload from '@/components/Upload.vue'
	export default {
		components: {
			Upload,
		},
		data() {
			return {
				form: {},
			}
		},
		methods: {
			async loadEdit(id) {
				let { status, data, msg } = await Admin.edit({ id })
				if (status) {
					// this.$message.success(msg);
					this.form = data
				}
			},
		},
		mounted() {
			let id = sessionStorage.uid;
			// console.log(id)
			this.loadEdit(id)
			// this.loadRole()
		}
	}
</script>

<style>
	.navbar {
		background-color: black;
		height: 55px;
		color: white;
		line-height: 55px;
		padding-left: 20px;
		display: flex;
		justify-content: space-between;
		padding-right: 20px;
	}

	.navbar-logo {
		height: 55px;
		box-sizing: border-box;
	}

	.el-icon-s-fold {
		position: absolute;
		top: 21px;
	}

	.el-dropdown-link {
		cursor: pointer;
		color: #fff;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}

	#img {
		width: 30px;
		height: 30px;
		/* margin-top: 10px; */
		vertical-align: middle;
	}
</style>
