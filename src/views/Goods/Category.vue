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
						<el-button type="text" icon="el-icon-edit" :disabled="node.level==1" size="mini" @click.stop="() => openEditModal(node,data)">
							编辑
						</el-button>
						<el-button type="text" icon="el-icon-plus" size="mini" @click.stop="() => openInsertModal(node,data)">
							添加
						</el-button>
						<el-button type="text" icon="el-icon-delete" size="mini" @click.stop="() => remove(node, data)">
							删除
						</el-button>
					</span>
				</span>
			</el-tree>
		</el-card>
		<!-- 添加弹窗 -->
		<el-dialog title="添加分类" :visible.sync="insertModalShow">
			<el-form :rules="rules" :model="insertForm">
				<el-form-item label="名称" label-width="120px" prop="name">
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图片" label-width="120px">
					<Upload :action="action" :form="insertForm.img" @success="Success($event)" @remove="insertForm.img = ''"></Upload>
				</el-form-item>
				<!-- <el-button @click="insertModalShow = false">取 消</el-button> -->
				<!-- <el-button type="primary" @click="handleInsertNode">添 加</el-button> -->
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
				<el-form-item label="名称" label-width="120px" prop="name">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图片" label-width="120px">
					<Upload :action="action" :form="editForm.img" @success="Successs($event)" @remove="editForm.img = ''"></Upload>
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
	import { Category } from "@/api/index";
	export default {
		components: {
			Upload,
		},
		data() {
			return {
				action:"/api/upload/goods",
				defaultProps: {
					label: 'name'
				},
				insertForm: {
					name: '',
					pId: '',
					img:''
				},
				editForm: {
					// pId: '',
					name: '',
					parent_id: '',
				},
				nodeData: {}, //节点数据
				node: {}, //节点
				insertModalShow: false,
				editModalShow: false,
				
				rules: {
					name: [{
							required: true,
							message: '请输入名称',
							trigger: 'blur'
						},
					],
				}
			};
		},
		methods: {
			Success(res) {
				console.log(res)
				this.insertForm.img = res.lgImg
			},
			Successs(res) {
				console.log(res)
				this.editForm.img = res.lgImg
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
					let { status, msg } = await Category.remove({id})
					if (status) {
						this.$message.success(msg);
					}else{
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
					let { status, data } = await Category.category({ pId: 0 });
					return resolve(data);
				}
				// console.log(node)
				//父级节点pId
				let pId = node.data.id;
				//获取子级节点
				let { status, data } = await Category.category({ pId });
				if (status) {
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
				let { status, msg, data } = await Category.edit({ ...this.editForm })
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
				let { status, msg, data } = await Category.add({ ...this.insertForm })
				if (status) {
					this.$message.success(msg);
					//更新tree节点
					this.$refs.tree.append({ ...data, ...this.insertForm }, this.node);
					this.insertModalShow = false
					this.insertForm.name = ''
					this.insertForm.pId = ''
					this.insertForm.img = ''
				}
			}
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
</style>
