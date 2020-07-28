<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>用户列表</span>
			</div>

			<div class="block">
				<!-- <span class="demonstration">完整功能</span> -->
				<el-table :data="tableData" style="width: 100%">
					<el-table-column prop="id" label="#">
					</el-table-column>
					<el-table-column label="头像" sortable>
						<template scope='scope'>
							<div>
								<el-image :src="scope.row.avatar" style="width: 80px;"></el-image>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="username" label="账号" sortable>
					</el-table-column>

					<el-table-column prop="fullname" label="姓名" sortable>
					</el-table-column>

					<el-table-column prop="sex" label="性别" sortable>
					</el-table-column>

					<el-table-column prop="tel" label="手机" width="150" sortable>
					</el-table-column>
					<el-table-column prop="login_time" label="上次登录" width="150" sortable>
					</el-table-column>
					<el-table-column prop="login_count" label="登录次数" width="150" sortable>
					</el-table-column>
					<el-table-column label="操作" width="230">
						<template scope="scope">
							<el-button type="primary" plain icon="el-icon-edit" size="mini" @click="openEditModal(scope.row.id,scope.$index)"></el-button>
							<!-- <el-button type="primary" plain icon="el-icon-edit" @click="open"></el-button> -->
							<!-- <router-link :to="{name:'ArticleEdit',params:{id:scope.row.id}}"> -->
							<!-- <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="handleRemove(scope.row.id,scope.$index)"></el-button> -->
							<!-- </router-link> -->
							<el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleRemove(scope.row.id,scope.$index)"></el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-dialog title="修改分类" :visible.sync="editModalShow">
					<el-form :rules="rules" :model="form" label-width="80px">

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
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="editModalShow = false">取 消</el-button>
						<el-button type="primary" @click="edit">保 存</el-button>
					</div>
				</el-dialog>
			</div>

		</el-card>
	</div>
</template>

<script>
	import Upload from '@/components/Upload.vue'
	import { Admin } from '@/api/index'
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
				tableData: [

				],
				form: {},
				editModalShow: false,
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
		created() {
			//只能用在new vue里，只能在组件内部使用，

			//获取列表数据
			this.loadlist();
			this.loadRole();
		},
		methods: {
			Success(res) {
				console.log(res)
				this.form.avatar = res.src
			},
			//加载数据列表
			async loadlist() {
				let { status, data } = await Admin.list();
				if (status) {
					this.tableData = data
				}
			},
			async handleRemove(id, i) {
				this.$confirm('确定要删除该商品吗？删除之后无法恢复！！！', {
					type: 'warning'
				}).then(async () => {
					let { status, msg } = await Admin.remove({ id });
					if (status) {
						this.$message.success(msg);
						this.tableData.splice(i, 1);
					}
				}).catch(() => {
					this.$message.info("取消删除")
				});
			},
			//打开编辑的madal
			openEditModal(id, i) {
				this.form = { ...this.tableData[i] }
				this.editModalShow = true
			},
			//编辑节点
			async edit() {
				// 1.表单验证
				// 2.发送ajax
				let { status, msg } = await Admin.modify(this.form)
				if (status) {
					this.$message.success(msg);
					// this.tableData.push(this.form)
					this.editModalShow = false
					for (var i = 0; i < this.tableData.length; i++) {
						if (this.tableData[i].id == this.form.id) {
							this.tableData.splice(i, 1, this.form)
						}
					}
				}
			},
			async loadRole() {
				let { status, msg, data } = await Admin.role()
				if (status) {
					this.options = data
				}
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
		}
	}
</script>

<style>
	.good-name {
		display: flex;
		justify-content: space-between;
	}

	.goods-name {
		width: 440px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
