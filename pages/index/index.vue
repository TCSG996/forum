<template>
	<view class="content">
		<!-- 轮播图模块开始 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item>
				<view class="swiper-item">
					<image src="../../static/image/校背景.png" mode=""></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<image src="../../static/image/校门01.jpg" mode=""></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<image src="../../static/image/校门02.jpg" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
		<!-- 轮播图模块结束 -->
		<!-- 优化后的公告栏模块 -->
		<view class="announcement">
			<view class="header">
				<text class="title">最新公告</text>
				<text class="more" @click="toMoreAnnouncements">更多 ></text>
			</view>
			
			<view class="notice-list">
				<view class="notice-item" v-for="(item, index) in one.slice(0,5)" :key="index" @click="viewNotice(item)">
					<view class="notice-content">
						<text class="notice-title">{{item.title}}</text>
						<view class="notice-info">
							<text class="date">{{item.date}}</text>
							<text class="tag" :class="item.type">{{item.type}}</text>
						</view>
					</view>
					<text class="arrow">></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				one: [],
			}
		},
		onLoad() {
			this.getApp()
			this.getOne()
		},
		methods: {
			getOne() {
				uni.request({
					url: '/api/announcements/list',
					method: 'GET',
					success: res => {
						this.one = res.data.records
					}
				})
			},
			
			// 跳转到公告详情页面
			viewNotice(item) {
				uni.navigateTo({
					url: `/pages/announcements/detail?id=${item.id}`
				})
			},

			getApp() {
				uni.request({
					url: '/api/posts/list',
					method: 'GET',
					success: (res) => {
						// console.log(res)
					}
				})
			}
		}
	}
</script>

<style lang="less">
.content {
	.swiper-item {
		image {
			margin-left: 60rpx;
			height: 300rpx;
		}
	}
	
	.announcement {
		margin: 30rpx;
		padding: 20rpx;
		background: #fff;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #eee;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.more {
				font-size: 24rpx;
				color: #666;
			}
		}
		
		.notice-list {
			.notice-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 24rpx 0;
				border-bottom: 1rpx solid #f5f5f5;
				
				&:last-child {
					border-bottom: none;
				}
				
				.notice-content {
					flex: 1;
					margin-right: 20rpx;
					
					.notice-title {
						font-size: 28rpx;
						color: #333;
						margin-bottom: 10rpx;
						display: block;
					}
					
					.notice-info {
						display: flex;
						align-items: center;
						
						.date {
							font-size: 24rpx;
							color: #999;
							margin-right: 20rpx;
						}
						
						.tag {
							padding: 4rpx 12rpx;
							border-radius: 4rpx;
							font-size: 22rpx;
							
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
					}
				}
				
				.arrow {
					color: #ccc;
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>
