<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>角色列表</span>
				<el-button type="primary" plain size="mini" icon="el-icon-circle-plus-outline" style="float: right;" @click='dialogTableVisible = true;'>添加角色</el-button>
			</div>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="id" label="#">
				</el-table-column>
				<el-table-column label="角色">
					<template slot-scope='scope'>
						<el-tag>{{scope.row.name}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope='scope'>
						<el-button type="primary" plain size="mini" :disabled="scope.row.name === '超级管理员'" icon="el-icon-edit" @click="openModalEdit(scope.row.id,scope.row.name)"></el-button>
						<el-button plain size="mini" type="danger" :disabled="scope.row.name === '超级管理员'" icon="el-icon-delete" @click="openRemoveModal(scope.row.id,scope.$index)"></el-button>
						<el-button plain size="mini" type="primary" icon="el-icon-setting" :disabled="scope.row.name === '超级管理员'" @click="openSet(scope.row.id,scope.$index)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 添加模态框 -->
			<el-dialog title="添加角色" :visible.sync="dialogTableVisible">
				<el-form :rules="rules" ref="roleform" :model="roleform">
					<el-form-item label="名称" :label-width="formLabelWidth" prop='name'>
						<el-input v-model="roleform.name" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogTableVisible = false">取 消</el-button>
					<el-button type="primary" @click="addsubmitForm('form')">确 定</el-button>
				</div>
			</el-dialog>
			<!-- 编辑模态框 -->
			<el-dialog title="编辑角色" :visible.sync="dialogFormVisible">
				<el-form :rules="rules" ref="form" :model="form">
					<el-form-item label="名称" :label-width="formLabelWidth" prop='name'>
						<el-input v-model="form.name" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitForm('form')">确 定</el-button>
				</div>
			</el-dialog>
		</el-card>

		<template v-if="isShow">
			<div style="height: 100%;width: 55%;float: right;">
				<el-card class="box-card" style="width: 100%;" v-for="(item,index) in config" :key="item.id">
					<div slot="header" class="clearfix">
						<i class="el-icon-collection-tag" style="color: #409EFF;font-size: 14px;"></i>
						<span style="color: #409eff;font-size: 14px;">{{item.name}}</span>
						<el-switch @change="checkedAll(item.id,index)" style="float: right;" v-model="item.checked" active-color="#409eff"
						 inactive-color="#dcdfe6">
						</el-switch>
					</div>
					<div v-for="(floor,idx) in item.children" :key="floor.id">
						<span class="text" style="display: inline-block;">{{floor.name}}</span>
						<el-switch @change="checkedSingle(floor.id,idx,index)" style="float: right;" v-model="floor.checked" active-color="#409eff" inactive-color="#dcdfe6">
						</el-switch>
					</div>
				</el-card>
			</div>
		</template>

	</div>


</template>

<script>
	import { Auth } from '@/api/index'
	export default {
		data() {
			return {
				role_id: '',
				isShow: false,
				tableData: [],
				formLabelWidth: '120px',
				dialogTableVisible: false,
				dialogFormVisible: false,
				form: {
					id: '',
					name: ''
				},
				roleform: {
					name: ''
				},
				roleMenu: {
					menu_id: '',
					role_id: '',
				},
				config: [],
				rules: {
					name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}],
				}
			}
		},
		created() {
			this.loadList();
		},
		methods: {
			async checkedAll(menu_id, i) {
				if (this.config[i].checked == false) {
					this.roleMenu.role_id = this.role_id
					this.roleMenu.menu_id = menu_id
					let { status, data } = await Auth.removeMenu(this.roleMenu);
					for (var j = 0; j < this.config[i].children.length; j++) {
						this.config[i].children[j].checked = false
						var id = this.config[i].children[j].id
						this.roleMenu.menu_id = id
						let { status, data } = await Auth.removeMenu(this.roleMenu);
					}
				} else {
					this.roleMenu.role_id = this.role_id
					this.roleMenu.menu_id = menu_id
					let { status, data } = await Auth.addMenu(this.roleMenu);
					for (var j = 0; j < this.config[i].children.length; j++) {
						this.config[i].children[j].checked = true
						var id = this.config[i].children[j].id
						this.roleMenu.menu_id = id
						let { status, data } = await Auth.addMenu(this.roleMenu);
					}
				}
			},
			
			async checkedSingle(menu_id,i,idx){
				if(this.config[idx].children[i].checked == false){
					this.roleMenu.role_id = this.role_id
					this.roleMenu.menu_id = menu_id
					let { status, data } = await Auth.removeMenu(this.roleMenu);
					var num = 0
					for(var j = 0;j<this.config[idx].children.length;j++){
						if(this.config[idx].children[j].checked == true){
							num++
						}
					}
					if(num >=1){
						this.config[idx].checked = true
						var ID = this.config[idx].id
						this.roleMenu.menu_id = ID
						let { status, data } = await Auth.addMenu(this.roleMenu);
					}else{
						this.config[idx].checked = false
						var ID = this.config[idx].id
						this.roleMenu.menu_id = ID
						let { status, data } = await Auth.removeMenu(this.roleMenu);
					}
				}else{
					this.roleMenu.role_id = this.role_id
					this.roleMenu.menu_id = menu_id
					let { status, data } = await Auth.addMenu(this.roleMenu);
					var num = 0
					for(var j = 0;j<this.config[idx].children.length;j++){
						if(this.config[idx].children[j].checked == true){
							num++
						}
					}
					if(num >=1){
						this.config[idx].checked = true
						var ID = this.config[idx].id
						this.roleMenu.menu_id = ID
						let { status, data } = await Auth.addMenu(this.roleMenu);
					}else{
						this.config[idx].checked = false
						var ID = this.config[idx].id
						this.roleMenu.menu_id = ID
						let { status, data } = await Auth.removeMenu(this.roleMenu);
					}
				}
			},
			
			async openSet(id, i) {
				this.isShow = true
				this.role_id = id
				let { status, data } = await Auth.config({ id: id });
				if (status) {
					this.config = data
				}
			},
			//获取角色列表
			async loadList() {
				let { status, data } = await Auth.list({});
				if (status) {
					this.tableData = data;
				}
			},
			//显示点击修改的角色
			openModalEdit(id, name) {
				//打开模态框
				this.dialogFormVisible = true;
				this.form.id = id;
				this.form.name = name;

			},
			//修改角色
			async submitForm() {
				let { status, msg } = await Auth.edit({ ...this.form });
				if (status) {
					this.$message.success('修改成功!');
					this.dialogFormVisible = false;
					//更新DOM======================================================================
					this.loadList();
				} else {
					this.$message.info('修改失败!');
					return false;
				}
			},
			//添加角色
			async addsubmitForm() {
				let { status, data } = await Auth.add({ ...this.roleform });
				if (status) {
					this.$message.success('添加成功!');
					//调用获取列表
					this.loadList();
					this.dialogTableVisible = false;
					//清空添加
					this.roleform = {
						name: ''
					};
				} else {
					this.$message.info('添加失败!');
				}
			},
			//删除模态框
			openRemoveModal(id, i) {
				this.$confirm('此操作将永久删除该角色及其关联账户, 是否继续?', {
						type: 'warning'
					})
					.then(async () => {
						let { status, data } = await Auth.remove({ id });
						if (status) {
							//更新Dom，更新页面
							this.tableData.splice(i, 1)
							this.$message.success('删除成功!');
						}
					})
					.catch(() => {
						this.$message.info('取消删除');
					});
			}
		}
	}
</script>

<style scoped="scoped">
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
		width: 580px;
	}

	.el-card {
		float: left !important;
		margin-right: 20px;
		border: 1px solid #ebeef5;
		background-color: #fff;
		color: #303133;
		transition: .3s;
	}

	.text {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #909399;
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>
