<template>
	<view class="announcements-list">
		<view class="filter-tabs">
			<view 
				v-for="(tab, index) in tabs" 
				:key="index"
				:class="['tab-item', currentTab === tab.type ? 'active' : '']"
				@click="switchTab(tab.type)"
			>
				{{tab.name}}
			</view>
		</view>
		
		<view class="list-content">
			<view 
				class="notice-item" 
				v-for="(item, index) in filteredAnnouncements" 
				:key="index"
				@click="viewDetail(item)"
			>
				<view class="notice-header">
					<text class="tag" :class="item.type">{{getTypeName(item.type)}}</text>
					<text class="date">{{item.date}}</text>
				</view>
				<view class="notice-title">{{item.title}}</view>
				<view class="notice-brief">{{item.brief}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentTab: 'all',
				tabs: [
					{ name: '全部', type: 'all' },
					{ name: '活动', type: 'event' },
					{ name: '官方', type: 'official' },
					{ name: '系统', type: 'system' },
					{ name: '安全', type: 'security' }
				],
				announcements: [
					{
						id: 1,
						title: '2024年元旦晚会通知',
						date: '2024-12-29',
						type: 'event',
						brief: '为庆祝2024年元旦的到来，学校将举办元旦晚会...'
					},
					{
						id: 2,
						title: '2024年放假通知',
						date: '2024-12-31',
						type: 'official',
						brief: '根据国家规定，现将2024年元旦放假安排通知如下...'
					},
					{
						id: 3,
						title: '关于系统维护的通知',
						date: '2024-12-30',
						type: 'system',
						brief: '为提升系统性能，计划于本周日凌晨进行系统维护...'
					},
					{
						id: 4,
						title: '账号安全的重要通知',
						date: '2024-12-28',
						type: 'security',
						brief: '近期发现有不法分子冒充校方人员，请同学们提高警惕...'
					}
				]
			}
		},
		computed: {
			filteredAnnouncements() {
				if (this.currentTab === 'all') {
					return this.announcements
				}
				return this.announcements.filter(item => item.type === this.currentTab)
			}
		},
		methods: {
			switchTab(type) {
				this.currentTab = type
			},
			viewDetail(item) {
				uni.navigateTo({
					url: `/pages/announcements/detail?id=${item.id}`
				})
			},
			getTypeName(type) {
				const typeMap = {
					event: '活动',
					official: '官方',
					system: '系统',
					security: '安全'
				}
				return typeMap[type] || type
			}
		}
	}
</script>

<style lang="less">
.announcements-list {
	.filter-tabs {
		display: flex;
		padding: 20rpx;
		background: #fff;
		border-bottom: 1rpx solid #eee;
		position: sticky;
		top: 0;
		z-index: 1;
		
		.tab-item {
			padding: 10rpx 30rpx;
			margin-right: 20rpx;
			font-size: 28rpx;
			color: #666;
			border-radius: 26rpx;
			
			&.active {
				color: #0239ff;
				background: #e6f3ff;
			}
		}
	}
	
	.list-content {
		padding: 20rpx;
		
		.notice-item {
			margin-bottom: 30rpx;
			padding: 20rpx;
			background: #fff;
			border-radius: 12rpx;
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
			
			.notice-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 16rpx;
				
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
				
				.date {
					font-size: 24rpx;
					color: #999;
				}
			}
			
			.notice-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 12rpx;
			}
			
			.notice-brief {
				font-size: 28rpx;
				color: #666;
				line-height: 1.5;
			}
		}
	}
}
</style> 