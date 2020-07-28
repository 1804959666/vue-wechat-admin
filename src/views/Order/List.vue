<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>订单列表</span>
			</div>

			<div class="block">
				<!-- <span class="demonstration">完整功能</span> -->
				<el-table :data="tableData" style="width: 100%">
					<el-table-column prop="id" label="#" width="50">
					</el-table-column>
					<el-table-column label="" width="600">
						<template slot-scope="scope">
							<el-table :data="scope.row.goodsList" style="width: 100%">
								<el-table-column label="商品" width="400">
									<template scope='scope'>
										<div class="good-name">
											<div>
												<el-image :src="scope.row.img_md" style="width: 80px;"></el-image>
											</div>
											<div class="goods-name">
												<span>{{scope.row.name}}</span>
											</div>
										</div>
									</template>
								</el-table-column>
								<el-table-column prop="goods_price" label="单价"></el-table-column>
								<el-table-column prop="goods_num" label="数量"></el-table-column>
							</el-table>
						</template>
					</el-table-column>

					<el-table-column prop="payment" label="付款总额" sortable>
					</el-table-column>

					<el-table-column prop="create_time" label="下单时间" sortable>
					</el-table-column>

					<el-table-column prop="status" label="状态" width="150" sortable>
					</el-table-column>

					<el-table-column label="操作" width="230">
						<template scope="scope">
							<el-button type="primary" plain icon="el-icon-edit" size="mini">
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>

		</el-card>
	</div>
</template>

<script>
	import { Order } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [

				],
			}
		},
		created() {
			//只能用在new vue里，只能在组件内部使用，
			this.loadlist()

		},
		methods: {
			async loadlist() {
				let { status, data, msg } = await Order.list()
				if (status) {
					this.tableData = data
					// this.$message.success(msg);
				}
			}

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
