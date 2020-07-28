<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>卡片名称</span>
		</div>
		<el-form ref="form" :rules="rules" :model="form" label-width="100px" class="demo-ruleForm">
			<el-form-item label="商品分类" prop='cate_1st'>
				<el-select @change="handleCate_1stChang" v-model="form.cate_1st" placeholder="请选择">
					<el-option v-for="option in options_1st" :key="option.id" :label="option.name" :value="option.id">
					</el-option>
				</el-select>
				<el-select @change="handleCate_2ndtChang" v-model="form.cate_2nd" placeholder="请选择">
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
			<el-form-item label="商品轮播图">
				<div class="demo-image">
					<div class="block" style="margin-right: 10px;float: left;width: 148px;height: 148px;" v-for="(item,index) in add"
					 :key="index">
						<div class="box" style="margin-right: 10px;width: 148px;height: 148px;line-height: 148px;text-align: center;"
						 v-show="form">
							<i style="width: 148px;height: 148px;line-height: 148px;text-align: center;margin-right: 10px;" class="el-icon-delete"
							 @click="handleDelete(index)"></i>
						</div>
						<el-image style="width: 148px; height: 148px;float: left;margin-right: 10px;" :src="item"></el-image>
					</div>
				</div>
				<el-upload :headers="headers" action="/api/upload/slider" :show-file-list="true" :on-success="handleAvatarSuccess" list-type="picture-card"
				 :auto-upload="true">
					<i slot="default" class="el-icon-plus"></i>
					<div slot="file" slot-scope="{file}">
						<img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
						<span class="el-upload-list__item-actions">
							<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
								<i class="el-icon-zoom-in"></i>
							</span>
							<span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
								<i class="el-icon-download"></i>
							</span>
							<span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
								<i class="el-icon-delete"></i>
							</span>
						</span>
					</div>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
				<p>上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸 800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</p>
			</el-form-item>
			<div style="background-color: #f5f5f5; width: calc(100% - 20px); margin: 10px 0px; height: 40px; line-height: 40px;padding:0px 10px;">
				<span>商品详情描述</span>
			</div>
			<el-form-item label="商品品牌" prop='price'>
				<el-input v-model="form.brand" placeholder="请输入内容" style="width: 60%;"></el-input>
			</el-form-item>
			<el-form-item label="内容" prop='price'>
				<div ref="editor" style="text-align:left" v-model="form.details"></div>
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
	let token = sessionStorage.token;
	export default {
		props: ['id'],
		components: {
			Upload,
		},
		data() {
			return {
				headers: {
					Authorization: `Bearer ${token}`
				},
				action: "/api/upload/goods",
				dialogImageUrl: '',
				dialogVisible: false,
				disabled: false,
				type: 'img_md',
				// input: '',
				form: {

				},
				options_1st: [],
				options_2nd: [],
				options_3rd: [],
				province: [],
				city: [],
				area: [],
				value: '',
				input2: '',
				add: [],

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
			async handleDelete(idx) {

				var src = this.add[idx]
				console.log(this.form.slider)
				console.log(src)
				let { status, msg } = await Category.deleimg({ src: src })
				if (status) {
					alert(111)
					this.add.splice(idx, 1)
					var a = this.form.slider.replace(src, '')
					this.form.slider = a
					// console.log(a)
					for (var i = 0; i < this.add.length; i++) {
						if (this.add[i] == '') {
							this.add.splice(i, 1)
						}
					}
				}
			},

			handleAvatarSuccess(res, file, fileList) {
				console.log(file)
				console.log(fileList)
				var src = res.src;
				this.add.push(src)
				fileList.splice(0, 1)
			},
			handleRemove(file) {
				console.log(file);

			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleDownload(file) {
				// var src = file.response.src
				// let { status, msg } = await Category.deleimg({src:src})
				// file.url =''
			},

			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						return false
					}

					var str = '';
					for (var i = 0; i < this.add.length; i++) {
						str += this.add[i] + ','
					}
					console.log(str)
					this.form.slider = str
					console.log(this.form)
					let { status, msg } = await Category.addedit(this.form)
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
			async loadInfo(id) {
				let { status, data } = await Category.details({ id })
				if (status) {
					return data;
				}
			},
			async loadSubcate(id) {
				let pId = id
				let { status, data } = await Category.category({ pId })
				return data;
			},
			async handleCate_1stChang(val) {
				let options = await this.loadSubcate(val)
				this.options_2nd = options
				this.form.cate_2nd = options[0].id
			},
			async handleCate_2ndtChang(val) {
				let options = await this.loadSubcate(val)
				this.options_3rd = options
				this.form.cate_3rd = options[0].id
			},
		},


		async mounted() {
			//获取一级分类
			this.options_1st = await this.loadSubcate(1);

			let article = await this.loadInfo(this.id)
			console.log(article)
			this.form = article;
			//获取二级分类
			this.options_2nd = await this.loadSubcate(article.cate_1st);
			//获取三级分类
			this.options_3rd = await this.loadSubcate(article.cate_2nd);

			this.add = this.form.slider.split(",")
			for (var i = 0; i < this.add.length; i++) {
				if (this.add[i] == '') {
					this.add.splice(i, 1)
				}
			}
			console.log(this.add)
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
			editor.txt.html(this.form.detail)
		}
	}
</script>

<style>
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
		/* overflow: hidden; */
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

	.box {
		position: absolute;
		top: 0;
		text-align: center;
		width: 178px;
		height: 178px;
		line-height: 178px;
		border-radius: 6px;
		background-color: rgba(0, 0, 0, 0.0);
		color: white;
		font-size: 26px;
		z-index: 20;
	}

	.box i {
		width: 178px;
		height: 178px;
		color: #fff;
		margin: auto;
		text-align: center;
		font-size: 24px;
		line-height: 178px;
		/* display: none; */
		color: rgba(0, 0, 0, 0);
	}

	.box:hover {
		background-color: rgba(0, 0, 0, 0.4);
	}

	.box i:hover {
		/* display: block; */
		color: #fff;
	}
</style>
