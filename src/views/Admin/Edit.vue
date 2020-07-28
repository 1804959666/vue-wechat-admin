<template>

	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>账户资料</span>
		</div>

		<el-form ref="form" :rules="rules" :model="form" label-width="80px">

			<el-form-item label="账户" prop="username">
				<el-input v-model="form.username" disabled=""></el-input>
			</el-form-item>

			<el-form-item label="姓名" prop="fullname">
				<el-input v-model="form.fullname"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="sex">
				<el-radio-group v-model="form.sex">
					<el-radio label="男"></el-radio>
					<el-radio label="女"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="手机" prop="tel">
				<el-input v-model="form.tel"></el-input>
			</el-form-item>
			<el-form-item label="权限" prop="role_name">
				<el-select v-model="form.role_name">
					<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="头像">
				<Upload :action="action" :form="form.avatar" :type="type" @success="Success($event)" @remove="form.avatar = ''"></Upload>
			</el-form-item>

			<el-button type="primary" style="margin-left: 80px;" @click="submitForm('form')">修改资料</el-button>
		</el-form>

	</el-card>
</template>

<script>
	import { Admin } from "@/api/index";
	import Upload from '@/components/Upload.vue'
	export default {
		components: {
			Upload,
		},
		data() {
			var checkphone = (rule, value, callback) => {
				// let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
				if (value == "") {
					callback(new Error("请输入手机号"));
				} else if (!this.isCellPhone(value)) { //引入methods中封装的检查手机格式的方法
					callback(new Error("请输入正确的手机号!"));
				} else {
					callback();
				}
			};
			return {
				type: 'avatar',
				action: "/api/upload/avatar",
				form: {
					id: '',
					username: '',
					fullname: '',
					role_name: '',
					sex: '',
					tel: '',
					email: '',
					avatar: '',
				},
				options: [],
				rules: {
					username: [{
							required: true,
							message: '请输入账户',
							trigger: 'blur'
						},

					],

					fullname: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}, ],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					role_name: [{
						required: true,
						message: '请选择权限',
						trigger: 'change'
					}],
					tel: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							validator: checkphone,
							message: '请输入正确格式的手机号',
							trigger: 'blur'
						}
					],

					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},

					],

				}
			}
		},
		methods: {
			Success(res) {
				console.log(res)
				this.form.avatar = res.src
			},
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						return false
					}
					let { status, msg } = await Admin.modify(this.form)
					if (status) {
						this.$message.success(msg);
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			isCellPhone(val) {
				if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
					return false;
				} else {
					return true;
				}
			},
			async loadEdit(id) {
				let { status, data, msg } = await Admin.edit({ id })
				if (status) {
					// this.$message.success(msg);
					this.form = data
				}
			},
			async loadRole() {
				let { status, msg, data } = await Admin.role()
				if (status) {
					// this.$message.success(msg);
					this.options = data
				}
			},
		},
		mounted() {
			let id = sessionStorage.uid;
			// console.log(id)
			this.loadEdit(id)
			this.loadRole()
		}
	}
</script>

<style scoped>
	.login-bg {
		width: 100%;
		height: 100%;
	}

	a {
		/* color: black; */
	}

	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.box-card {
		width: 100%;
	}
</style>
