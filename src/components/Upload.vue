<template>
	<div>
		<!-- 蒙版 -->
		<div class="box" v-show="form">
			<i class="el-icon-delete" @click="handleDelete"></i>
		</div>
		<!-- 组件下面v-if="form.avatar" :src="form.avatar"是props中定义的值，:data="{type:'avatar'}"中的type是props中定义的值-->
		<el-upload :headers="headers" class="avatar-uploader" :action="action" :data="{type:'avatar'}" :show-file-list="false"
		 :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
			<img v-if="form" :src="form" class="avatar">
			<!-- <img v-if="form.main_photo" :src="form.main_photo" class="avatar"> -->
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>
	</div>
</template>

<script>
	import { Upload } from '@/api/index.js'
	let token = sessionStorage.token;
	export default {
		// 传值
		props: ['form', 'type', 'action'],
		data() {
			return {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		},
		methods: {
			// 组件自带的代码
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			// 组件自带的代码
			handleAvatarSuccess(res, file, fileList) {
				if (res.status) {
					// this.form = res.lgImg;
					console.log(res)
					this.$message.success(res.msg)
					this.$emit('success', res);
				} else {

				}
			},
			// 点击删除图标，删除图片
			async handleDelete() {
				if (this.form == "/images/avatar/default.jpg") {
					// this.form= "";
					this.$emit('remove')
				} else {
					// let src = this.form.replace(/.+\/images/,'./images');
					// var src = this.form.replace("http://localhost:3003", ".")
					console.log(this.form)
					let { status } = await Upload.remove({ src: this.form });
					// let { status } = await Upload.remove( {src:this.form} );
					if (status) {
						this.$message.success("删除成功");
					}
					this.form = "";
				}
			},
			async handleDelete_2() {
				if (this.form.main_photo == "../images/avatar/default.jpg") {
					// this.form.avatar = "";
					this.$emit('remove')
				} else {
					// let src = this.form.replace(/.+\/images/,'./images');
					var src = this.form.main_photo.replace("http://localhost:3001", ".")
					this.form.main_photo = "";
					let { status, data } = await Upload.remove({ src });
					if (status) {
						this.$message.success("删除成功");
					}
				}

			},

		}
	}
</script>
<!-- 蒙版的样式 -->
<style>
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
		line-height: 178px !important;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
	/* .el-icon-plus{
		line-height: 178px !important;
	} */
</style>
