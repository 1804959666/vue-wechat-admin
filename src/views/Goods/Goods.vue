<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>卡片名称</span>
		</div>
		<el-form :rules="rules" ref="form" :model="form" label-width="100px" class="demo-ruleForm">
			<el-form-item label="商品分类" prop='cate_1st'>
				<el-select v-model="form.cate_1st" placeholder="请选择">
					<el-option v-for="option in options_1st" :key="option.id" :label="option.name" :value="option.id">
					</el-option>
				</el-select>
				<el-select v-model="form.cate_2nd" placeholder="请选择">
					<el-option v-for="option in options_2nd" :key="option.id" :label="option.name" :value="option.id">
					</el-option>
				</el-select>
				<el-select v-model="form.cate_3rd" placeholder="请选择">
					<el-option v-for="option in options_3rd" :key="option.id" :label="option.name" :value="option.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品名称" prop='name'>
				<el-input v-model="form.name" placeholder="请输入内容" style="width: 60%;"></el-input>
				<p style="font-size: 12px;">商品标题名称长度至少3个字符，最长200个汉字</p>
			</el-form-item>
			<el-form-item label="商品卖点" prop='hotPoint'>
				<el-input type="textarea" v-model="form.hotPoint" style="width: 60%;"></el-input>
				<p style="font-size: 12px;">商品卖点不能超过140个汉字</p>
			</el-form-item>

			<el-form-item label="商品价格" prop='price'>
				<el-input placeholder="请输入内容" v-model="form.price" style="width: 220px; height: 100%;">
					<template slot="append">元</template>
				</el-input>
				<p style="font-size: 12px;">价格必须是0-999999之间的数字，且不能高于市场价</p>
				<p style="font-size: 12px;">此价格为商品实际销售价格，如果商品存在规格，改价格显示最低价格</p>
			</el-form-item>
			<el-form-item label="市场价" prop='price'>
				<el-input placeholder="请输入内容" v-model="form.marketPrice" style="width: 220px; height: 100%;">
					<template slot="append">元</template>
				</el-input>
				<p style="font-size: 12px;">价格必须是0-999999之间的数字，此价格仅为市场参考价，请根据实际情况认真填写</p>
			</el-form-item>
			<el-form-item label="成本价" prop='price'>
				<el-input placeholder="请输入内容" v-model="form.cost" style="width: 220px; height: 100%;">
					<template slot="append">元</template>
				</el-input>
				<p style="font-size: 12px;">价格必须是0-999999之间的数字，此价格为商户对所销售的商品的实际成本价进行备注记录，非必填选项，不会在前台销售页面中显示</p>
			</el-form-item>
			<el-form-item label="折扣" prop='price'>
				<el-input placeholder="请输入内容" v-model="form.discount" style="width: 220px; height: 100%;">
					<template slot="append">折</template>
				</el-input>
				<p style="font-size: 12px;">根据销售价与市场价比例自动生成不需要编辑</p>
			</el-form-item>
			<el-form-item label="商品库存" prop='price'>
				<el-input placeholder="请输入内容" v-model="form.inventory" style="width: 220px; height: 100%;">
					<template slot="append">件</template>
				</el-input>
				<p style="font-size: 12px;">价格必须是0-999999之间的整数</p>
				<p style="font-size: 12px;">若启动了库存配置，则系统自动计算商品的总数，此处无需卖家填写</p>
			</el-form-item>
			<el-form-item label="商品货号" prop='price'>
				<el-input placeholder="请输入内容" v-model="form.articleNo" style="width: 220px; height: 100%;">
					<!-- <template slot="append">件</template> -->
				</el-input>
				<p style="font-size: 12px;">商品货号是商家管理商品的编号，买家不可见</p>
				<p style="font-size: 12px;">最多输入20个字符，只支持输入中文、字母、数字、_、/、-和小数点</p>
			</el-form-item>
			<el-form-item label="商品主图">
				<Upload :action="action" :form="form.img_md" :type="type" @success="Success($event)" @remove="form.img_md = ''"></Upload>
				<p>上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸 800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</p>
			</el-form-item>
			<el-form-item label="商品轮播图" prop="slider">
				<el-upload :headers="headers" action="/api/upload/slider" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="sliderSuccess"
				 :on-remove="handleRemove">
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img width="100%" :src="form.slider" alt="">
				</el-dialog>
			</el-form-item>
			<div style="background-color: #f5f5f5; width: calc(100% - 20px); margin: 10px 0px; height: 40px; line-height: 40px;padding:0px 10px;">
				<span>商品详情描述</span>
			</div>
			<el-form-item label="商品品牌" prop='price'>
				<el-input v-model="form.brand" placeholder="请输入内容" style="width: 60%;"></el-input>
			</el-form-item>
			<el-form-item label="内容" prop='price'>
				<div ref="editor" style="text-align:left" v-model="form.detail"></div>
			</el-form-item>
			<div style="background-color: #f5f5f5; width: calc(100% - 20px); margin: 10px 0px; height: 40px; line-height: 40px;padding:0px 10px;">
				<span>商品物流信息</span>
			</div>
			<el-form-item label="所在地" prop='cate_1st'>
				<el-select v-model="value" placeholder="请选择">
					<el-option v-for="item in province" :key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
				<el-select v-model="value" placeholder="请选择">
					<el-option v-for="item in city" :key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
				<el-select v-model="value" placeholder="请选择">
					<el-option v-for="item in area" :key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="运费" prop='price'>
				<el-input placeholder="请输入内容" v-model="form.freight" style="width: 220px; height: 100%;">
					<template slot="append">元</template>
				</el-input>
				<p style="font-size: 12px;">运费设为0，前台商品将显示免运费</p>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('form')">提交</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import { Category } from "@/api/index";
	import E from 'wangeditor'
	import Upload from '@/components/Upload.vue'
	import Uploads from '@/components/Upload1.vue'
	let token = sessionStorage.token;
	export default {
		components: {
			Upload,
			Uploads
		},
		data() {
			return {
				headers: {
					Authorization: `Bearer ${token}`
				},
				action:"/api/upload/goods",
				dialogVisible: false,
				type: 'img_md',
				// input: '',
				form: {
					cate_1st: '',
					cate_2nd: '',
					cate_3rd: '',
					name: '',
					hotPoint: '',
					price: '',
					marketPrice: '',
					cost: '',
					discount: '',
					inventory: '',
					articleNo: '',
					slider: '',
					brand: '',
					detail: '',
					freight: '',
					img_lg: '',
					img_md: '',
					// avatar:''
				},
				options_1st: [],
				options_2nd: [],
				options_3rd: [],
				province: [],
				city: [],
				area: [],
				value: '',
				input2: '',
				
				rules: {
					cate_1st: [{
						required: true,
						message: '请选择商品分类',
						trigger: 'change'
					}],
					hotPoint: [{
						required: true,
						message: '请输入商品卖点',
						trigger: 'blur'
					}],
					price: [{
						required: true,
						message: '请输入商品价格',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}],
				}
			}
		},
		methods: {
			//商品轮播图
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//轮播图上传
			sliderSuccess(res, file) {
				let { status, src, msg } = res;
				this.form.slider += (src + ',');
				console.log(this.form.slider);
			},

			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						return false
					}
					console.log(this.form)
					let { status, msg } = await Category.good(this.form)
					if (status) {
						this.$message.success(msg);
					}
				});
			},
			Success(res) {
				console.log(res)
				this.form.img_md = res.lgImg
			},
			Successs(res) {
				this.form.slider = res.src
			},
			onSubmit() {
				console.log('submit!');
			},
			async loadSubcate(id) {
				let pId = id
				let { status, data } = await Category.category({ pId })
				return data;
			},
		},
		watch: {
			"form.cate_1st": async function(val) {
				console.log(val)
				//获取二级分类
				let options = await this.loadSubcate(val)
				this.options_2nd = options
				//默认选中第一项
				// console.log(options[0].id)
				if (options.length > 0) {
					this.form.cate_2nd = options[0].id
				} else {
					this.form.cate_2nd = 0;
				}
				// this.form.cate_2nd = options[0].id
			},
			"form.cate_2nd": async function(val) {
				console.log(val)
				//获取二级分类
				let options = await this.loadSubcate(val)
				this.options_3rd = options
				//默认选中第一项
				if (val == 0) {
					this.form.cate_3rd = 0;

				} else {
					this.form.cate_3rd = options[0].id
				}

			},
		},
		async created() {
			let options = await this.loadSubcate(1) //.then((options) => {
			this.options_1st = options
			//})
			// this.loadInfo(this.id)
		},
		mounted() {
			// console.log(this.$refs.editor);
			var editor = new E(this.$refs.editor)
			//同步form数据
			editor.customConfig.onchange = (html) => {
				this.form.detail = html
			}
			//配置图片上传
			// 配置服务器端地址
			editor.customConfig.uploadImgServer = '/upload/editor/';
			//配置自定义filename
			editor.customConfig.uploadFileName = 'file';
			//配置自定义header
			editor.customConfig.uploadImgHeaders = {
				'Authorization': `Bearer ${sessionStorage.token}`
			}
			//base64储存图片
			editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
			editor.create()
		}
	}
</script>

<style scoped>
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

	p {
		font-size: 12px;
		margin: 0;
		padding: 0;
		color: #999;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
	
</style>
