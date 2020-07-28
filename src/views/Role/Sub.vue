<template>
	<div>
		<el-card class="box-card">
			<div slot="header">
				<span>分类列表</span>
			</div>
			<!-- 树形组件 -->
			<el-tree ref="tree" :load="loadNode" node-key="id" lazy :default-expanded-keys="[1]" :props="defaultProps">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<el-popover placement="left-start" width="200" trigger="hover" :popper-class="data.icon">
							<el-button type="text" slot="reference" :icon="data.icon" :disabled="node.level==1" size="mini" @click.stop="showIcon(node,data)">
								图标
							</el-button>
						</el-popover>
						<el-button type="text" icon="el-icon-edit" :disabled="node.level==1" size="mini" @click.stop="() => openEditModal(node,data)">
							编辑
						</el-button>
						<el-button type="text" icon="el-icon-plus" size="mini" @click.stop="() => openInsertModal(node,data)">
							添加
						</el-button>
						<el-button type="text" icon="el-icon-delete" size="mini" @click.stop="() => remove(node, data)">
							删除
						</el-button>
						<div class="node-order">
							显示序号:
							<el-tag size="mini">
								{{data.order}}
							</el-tag>
						</div>
					</span>
				</span>
			</el-tree>
		</el-card>
		<el-dialog title="选择图标" :visible.sync="IconShow">
			<!-- <el-form :model="iconForm"> -->
			<ul class="icon">
				<li class="floor" v-for="(item,index) in iconForm" @click='isChecked(index,item)' :key="item.id" :class="{checked: item.checked == true}">
					<div style="width:100%;height:100%">
						<i :class="item.name"></i>
						<p>{{item.name}}</p>
					</div>
				</li>
			</ul>
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage1" :page-size="1" layout="->,prev, pager, next"
			 :total="10">
			</el-pagination>
			<div slot="footer" class="dialog-footer">
				<!-- <Upload :form="insertForm.img" @success="Success($event)" @remove="insertForm.img = ''"></Upload> -->
				<el-button @click="IconShow = false">取 消</el-button>
				<el-button type="primary" @click="handleIcon">修 改</el-button>
			</div>
		</el-dialog>
		<!-- 添加弹窗 -->
		<el-dialog title="添加节点" :visible.sync="insertModalShow">
			<el-form :rules="rules" :model="insertForm">
				<el-form-item label="菜单名称" label-width="120px" prop='name'>
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" label-width="120px" prop='name'>
					<el-input v-model="insertForm.path" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="120px" prop='name'>
					<el-input v-model="insertForm.order" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!-- <Upload :form="insertForm.img" @success="Success($event)" @remove="insertForm.img = ''"></Upload> -->
				<el-button @click="insertModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleInsertNode">添 加</el-button>
			</div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑分类" :visible.sync="editModalShow">
			<el-form :rules="rules" :model="editForm">
				<el-form-item label="菜单名称" label-width="120px" prop='name'>
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" label-width="120px" prop='name'>
					<el-input v-model="editForm.path" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="120px" prop='name'>
					<el-input v-model="editForm.order" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="edit">保 存</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import Upload from '@/components/Upload.vue'
	import { Sub } from "@/api/index";
	export default {
		components: {
			Upload,
		},
		data() {
			return {
				item: {},
				data: [],
				index: '',
				action: "/api/upload/goods",
				defaultProps: {
					label: 'name'
				},
				insertForm: {
					name: '',
					order: '',
					pId: '',
					path: '',
				},
				editForm: {},
				nodeData: {}, //节点数据
				node: {}, //节点
				iconForm: [],
				iconAddForm: {
					id: '',
					icon: ''
				},
				editIcon: {
					id: '',
					name: '',
				},
				insertModalShow: false,
				editModalShow: false,
				IconShow: false,

				pagesize: 30,
				pageindex: 1,
				currentPage1: 1,
				rules: {
					name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}],
				}
			};
		},

		methods: {
			async handleIcon() {
				for (var i = 0; i < this.iconForm.length; i++) {
					if (this.iconForm[i].checked == true) {
						this.iconAddForm.icon = this.iconForm[i].id
					}
				}
				let { status, msg } = await Sub.addIcon(this.iconAddForm);
				if (status) {
					console.log(this.data);
					this.data.icon = this.item.name
					this.$message.success(msg);
					this.IconShow = false
				}
			},

			isChecked(i, item) {
				console.log(item.name)
				this.item = item
				this.$forceUpdate(this.iconForm[i].checked = true)
				for (var j = 0; j < this.iconForm.length; j++) {
					if (i != j) {
						this.iconForm[j].checked = false
					}
				}
			},

			async handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pagesize = val;
				let index = this.pageindex;
				let { status, icons } = await Sub.icon({ pageSize: val, pageIndex: index });
				if (status) {
					this.iconForm = icons
					this.iconForm.forEach((item) => {
						item.name = 'el-icon-' + item.name
						item.checked = false
					})
				}
			},
			async handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.pageindex = val;
				let size = this.pagesize;
				let { status, icons } = await Sub.icon({ pageSize: size, pageIndex: val });
				if (status) {
					this.iconForm = icons
					this.iconForm.forEach((item) => {
						item.name = 'el-icon-' + item.name
						item.checked = false
					})
				}
			},

			async loadList() {
				let { status, icons } = await Sub.icon({ pageSize: 30, pageIndex: 1 })
				if (status) {
					this.iconForm = icons
					this.iconForm.forEach((item) => {
						item.name = 'el-icon-' + item.name
						item.checked = false
					})
				}
			},

			async showIcon(node, data) {
				console.log(data.id)
				this.iconAddForm.id = data.id
				this.data = data
				this.IconShow = true
			},
			//删除
			remove(node, data) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					console.log(data.id)
					let id = data.id;
					let { status, msg } = await Sub.remove({ id })
					if (status) {
						this.$message.success(msg);
					} else {
						this.$message.info(msg);
					}
				}).catch(() => {
					this.$message.info('删除失败');
					console.log(data.id)
				});
			},
			async loadNode(node, resolve) {
				// node:节点对象
				// resolve: 返回节点数据的方法
				if (node.level === 0) {
					let { status, data } = await Sub.menu({ pId: 0 });
					return resolve(data);
				}
				//父级节点pId
				let pId = node.data.id;
				//获取子级节点
				let { status, data } = await Sub.menu({ pId });
				if (status) {
					data.forEach((item, index) => {
						item.icon = 'el-icon-' + item.icon
					})
					return resolve(data);
				}
			},
			//打开编辑的madal
			openEditModal(node, data) {
				this.editForm = { ...data }
				this.node = node;
				this.editModalShow = true
				console.log(data)
			},
			//编辑节点
			async edit() {
				// 1.表单验证
				// 2.发送ajax
				let { status, msg, data } = await Sub.edit({ ...this.editForm })
				if (status) {
					this.$message.success(msg);
					//更新tree节点
					this.node.data = this.editForm;
					this.editModalShow = false
				}
			},
			//打开添加的madal
			openInsertModal(node, data) {
				//node:节点对象；data:节点数据
				this.node = node;
				console.log(node, data)
				this.insertForm.pId = data.id
				this.insertModalShow = true
			},
			//插入节点
			async handleInsertNode() {
				//表单验证
				let { status, msg, data } = await Sub.add({ ...this.insertForm })
				if (status) {
					this.$message.success(msg);
					//更新tree节点
					this.$refs.tree.append({ ...data, ...this.insertForm }, this.node);
					this.insertModalShow = false
					this.insertForm.name = ''
					this.insertForm.pId = ''
					this.insertForm.order = ''
					this.insertForm.path = ''
				}
			}
		},
		created() {
			this.loadList()
		}
	};
</script>

<style>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	.node-order {
		width: 100px;
		display: inline-block;
		font-size: 12px;
		margin-left: 10px;
	}

	.floor {
		/* width: 118px; */
		list-style: none;
		float: left;
		width: 10%;
		text-align: center;
		height: 100px;
		/* line-height: 100px; */
		color: #666;
		font-size: 10px;
		border-right: 1px solid #eee;
		border-bottom: 1px solid #eee;
		margin-right: -1px;
		margin-bottom: -1px;
	}

	.floor:hover {
		color: #5cb6ff;
	}

	.floor:hover i {
		color: #5cb6ff;
	}

	.floor i {
		display: block;
		font-size: 26px;
		margin-bottom: 10px;
		color: #606266;
		transition: color .15s linear;
		margin-top: 20px;
	}

	.floor p {
		display: inline-block;
		padding: 0 3px;
		height: 1em;
		transition: color .15s linear;
	}

	.icon {
		overflow: hidden;
		list-style: none;
		padding: 0 !important;
		border: 1px solid #eaeefb;
		border-radius: 4px;
	}

	.el-dialog {
		width: 72% !important;
	}

	.checked {
		background-color: #5cb6ff !important;
		color: #fff;
	}

	.checked i {
		color: #fff;
	}
</style>
