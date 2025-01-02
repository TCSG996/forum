<template>
	<view class="announcement-detail">
		<view class="header">
			<view class="title">{{detail.title}}</view>
			<view class="info">
				<text class="tag" :class="detail.type">{{getTypeName(detail.type)}}</text>
				<text class="date">发布时间：{{detail.date}}</text>
			</view>
		</view>
		<view class="content">
			<rich-text :nodes="detail.content"></rich-text>
		</view>
		
		<view class="attachments" v-if="detail.attachments && detail.attachments.length">
			<view class="section-title">附件</view>
			<view 
				class="attachment-item" 
				v-for="(item, index) in detail.attachments" 
				:key="index"
				@click="downloadFile(item)"
			>
				<text class="file-name">{{item.name}}</text>
				<text class="file-size">{{item.size}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
				detail: {}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.getAnnouncementDetail()
			}
		},
		methods: {
			getTypeName(type) {
				const typeMap = {
					event: '活动',
					official: '官方',
					system: '系统',
					security: '安全'
				}
				return typeMap[type] || type
			},
			
			getAnnouncementDetail() {
				uni.request({
					url: `/api/announcements/detail?id=${this.id}`,
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							// 处理富文本内容
							if (res.data.data.content) {
								res.data.data.content = res.data.data.content.replace(/\n/g, '<br>')
							}
							this.detail = res.data.data
						} else {
							uni.showToast({
								title: '获取详情失败',
								icon: 'none'
							})
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络错误',
							icon: 'none'
						})
					}
				})
			},
			
			downloadFile(file) {
				if (!file.url) {
					uni.showToast({
						title: '文件地址无效',
						icon: 'none'
					})
					return
				}
				
				uni.showLoading({
					title: '下载中...'
				})
				
				uni.downloadFile({
					url: file.url,
					success: (res) => {
						if (res.statusCode === 200) {
							uni.openDocument({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: '打开文件成功',
										icon: 'success'
									})
								},
								fail: function() {
									uni.showToast({
										title: '打开文件失败',
										icon: 'none'
									})
								}
							})
						} else {
							uni.showToast({
								title: '下载失败',
								icon: 'none'
							})
						}
					},
					fail: () => {
						uni.showToast({
							title: '下载失败',
							icon: 'none'
						})
					},
					complete() {
						uni.hideLoading()
					}
				})
			}
		}
	}
</script>

<style lang="less">
.announcement-detail {
	padding: 30rpx;
	background: #fff;
	min-height: 100vh;
	
	.header {
		margin-bottom: 40rpx;
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #eee;
		
		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
		
		.info {
			display: flex;
			align-items: center;
			
			.tag {
				padding: 4rpx 12rpx;
				border-radius: 4rpx;
				font-size: 22rpx;
				margin-right: 20rpx;
				
				&.event {
					background: #e6f3ff;
					color: #1890ff;
				}
				
				&.official {
					background: #f6ffed;
					color: #52c41a;
				}
				
				&.system {
					background: #fff7e6;
					color: #fa8c16;
				}
				
				&.security {
					background: #fff1f0;
					color: #f5222d;
				}
			}
			
			.date {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
	
	.content {
		font-size: 28rpx;
		color: #333;
		line-height: 1.75;
		
		// /deep/ {
		// 	p {
		// 		margin-bottom: 20rpx;
		// 	}
			
		// 	strong {
		// 		font-weight: bold;
		// 	}
		// }
	}
	
	.attachments {
		margin-top: 40rpx;
		padding-top: 30rpx;
		border-top: 1rpx solid #eee;
		
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
		
		.attachment-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			background: #f5f5f5;
			border-radius: 8rpx;
			margin-bottom: 20rpx;
			
			&:active {
				opacity: 0.7;
			}
			
			.file-name {
				font-size: 28rpx;
				color: #0239ff;
			}
			
			.file-size {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
}
</style> 