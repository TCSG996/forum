<template>
	<view class="post-detail">
		<!-- 帖子内容 -->
		<view class="post-content">
			<view class="user-info">
				<image class="avatar" :src="detail.avatar" mode="aspectFill"></image>
				<view class="info">
					<text class="username">{{detail.username}}</text>
					<text class="time">{{detail.time}}</text>
				</view>
			</view>
			
			<view class="content">
				<text class="text">{{detail.content}}</text>
				<view class="images" v-if="detail.images && detail.images.length">
					<image 
						v-for="(img, index) in detail.images" 
						:key="index" 
						:src="img" 
						mode="aspectFill"
						@click="previewImage(detail.images, index)"
					></image>
				</view>
			</view>
			
			<view class="actions">
				<view class="action-item" @click="toggleLike">
					<text class="iconfont icon-heart" :class="{liked: detail.isLiked}"></text>
					<text>{{detail.likes}} 赞</text>
				</view>
				<view class="action-item" @click="focusComment">
					<text class="iconfont icon-comment"></text>
					<text>{{detail.comments}} 评论</text>
				</view>
			</view>
		</view>
		
		<!-- 评论列表 -->
		<view class="comments-section">
			<view class="section-title">全部评论</view>
			<view class="comment-list">
				<view 
					class="comment-item" 
					v-for="(item, index) in commentList" 
					:key="index"
					@click="replyComment(item)"
				>
					<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
					<view class="comment-content">
						<view class="comment-header">
							<text class="username">{{item.username}}</text>
							<text class="time">{{item.time}}</text>
						</view>
						<text class="text">{{item.content}}</text>
						<!-- 回复列表 -->
						<view class="replies" v-if="item.replies && item.replies.length">
							<view 
								class="reply-item"
								v-for="(reply, replyIndex) in item.replies"
								:key="replyIndex"
							>
								<text class="username">{{reply.username}}</text>
								<text class="reply-text">{{reply.content}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 评论输入框 -->
		<view class="comment-input">
			<input 
				type="text"
				v-model="commentText"
				:placeholder="replyTo ? `回复 ${replyTo}` : '说点什么...'"
				:focus="showInput"
				@blur="onBlur"
			/>
			<button class="send-btn" @click="submitComment" :disabled="!commentText.trim()">发送</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: null,
			// 帖子详情模拟数据
			detail: {
				id: 1,
				username: '匿名用户',
				avatar: '/static/avatar/default.png',
				time: '2024-03-18 10:30',
				content: '今天在图书馆遇见一个女生，穿着白色连衣裙，看起来很温柔。想认识她，但是不敢上前搭讪。希望有缘再见！',
				images: [
					'/static/posts/library1.jpg',
					'/static/posts/library2.jpg'
				],
				likes: 12,
				comments: 3,
				isLiked: false
			},
			// 评论列表模拟数据
			commentList: [
				{
					id: 1,
					username: '小明',
					avatar: '/static/avatar/user1.png',
					time: '10分钟前',
					content: '我也经常在图书馆看到她，好像是外语系的学生',
					replies: [
						{
							id: 3,
							username: '楼主',
							content: '真的吗？她经常去哪个阅览室？'
						},
						{
							id: 4,
							username: '小明',
							content: '一般在四楼自习室'
						}
					]
				},
				{
					id: 2,
					username: '小红',
					avatar: '/static/avatar/user2.png',
					time: '5分钟前',
					content: '祝你们有缘相遇~',
					replies: []
				}
			],
			commentText: '',
			showInput: false,
			replyTo: '',
			replyId: null
		}
	},
	onLoad(options) {
		if (options.id) {
			this.id = options.id
			// 在实际开发时打开这两个接口
			// this.getPostDetail()
			// this.getComments()
		}
	},
	methods: {
		async getPostDetail() {
			try {
				const res = await uni.$request.get(`/api/posts/detail?id=${this.id}`)
				if (res.data.code === 200) {
					this.detail = res.data.data
				}
			} catch (error) {
				console.error('获取帖子详情失败', error)
				uni.showToast({
					title: '获取详情失败',
					icon: 'none'
				})
			}
		},
		
		async getComments() {
			try {
				const res = await uni.$request.get(`/api/comments/list?post_id=${this.id}`)
				if (res.data.code === 200) {
					this.commentList = res.data.data
				}
			} catch (error) {
				console.error('获取评论失败', error)
				uni.showToast({
					title: '获取评论失败',
					icon: 'none'
				})
			}
		},
		
		async toggleLike() {
			try {
				// 模拟接口调用
				await new Promise(resolve => setTimeout(resolve, 500))
				this.detail.isLiked = !this.detail.isLiked
				this.detail.likes += this.detail.isLiked ? 1 : -1
				
				// 实际接口调用
				/*
				const res = await uni.$request.post('/api/likes/create', {
					post_id: this.id
				})
				
				if (res.data.code === 200) {
					this.detail.isLiked = !this.detail.isLiked
					this.detail.likes += this.detail.isLiked ? 1 : -1
				}
				*/
			} catch (error) {
				uni.showToast({
					title: '操作失败',
					icon: 'none'
				})
			}
		},
		
		focusComment() {
			this.showInput = true
			this.replyTo = ''
			this.replyId = null
		},
		
		replyComment(comment) {
			this.showInput = true
			this.replyTo = comment.username
			this.replyId = comment.id
		},
		
		onBlur() {
			setTimeout(() => {
				this.showInput = false
			}, 100)
		},
		
		async submitComment() {
			if (!this.commentText.trim()) return
			
			try {
				// 模拟评论提交
				const newComment = {
					id: this.commentList.length + 1,
					username: '我',
					avatar: '/static/avatar/default.png',
					time: '刚刚',
					content: this.commentText,
					replies: []
				}
				
				if (this.replyId) {
					// 回复评论
					const parentComment = this.commentList.find(item => item.id === this.replyId)
					if (parentComment) {
						parentComment.replies.push({
							id: Date.now(),
							username: '我',
							content: this.commentText
						})
					}
				} else {
					// 新评论
					this.commentList.unshift(newComment)
				}
				
				this.detail.comments += 1
				this.commentText = ''
				this.replyTo = ''
				this.replyId = null
				this.showInput = false
				
				uni.showToast({
					title: '评论成功',
					icon: 'success'
				})
				
				// 实际接口调用
				/*
				const data = {
					post_id: this.id,
					content: this.commentText,
					parent_id: this.replyId
				}
				
				const res = await uni.$request.post('/api/comments/create', data)
				
				if (res.data.code === 200) {
					this.getComments()
					this.detail.comments += 1
					this.commentText = ''
					this.replyTo = ''
					this.replyId = null
					this.showInput = false
				}
				*/
			} catch (error) {
				uni.showToast({
					title: '评论失败',
					icon: 'none'
				})
			}
		},
		
		previewImage(images, current) {
			uni.previewImage({
				urls: images,
				current: current
			})
		}
	}
}
</script>

<style lang="less">
.post-detail {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 120rpx;
	
	.post-content {
		background: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
		
		.user-info {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			
			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			
			.info {
				.username {
					font-size: 28rpx;
					color: #333;
					font-weight: bold;
					display: block;
				}
				
				.time {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
		
		.content {
			.text {
				font-size: 30rpx;
				color: #333;
				line-height: 1.6;
			}
			
			.images {
				display: flex;
				flex-wrap: wrap;
				margin-top: 20rpx;
				
				image {
					width: 220rpx;
					height: 220rpx;
					margin-right: 10rpx;
					margin-bottom: 10rpx;
					border-radius: 8rpx;
					
					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}
		
		.actions {
			display: flex;
			margin-top: 30rpx;
			border-top: 1rpx solid #f5f5f5;
			padding-top: 20rpx;
			
			.action-item {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.iconfont {
					font-size: 40rpx;
					color: #999;
					margin-right: 10rpx;
					
					&.liked {
						color: #ff4444;
					}
				}
				
				text {
					font-size: 28rpx;
					color: #666;
				}
			}
		}
	}
	
	.comments-section {
		background: #fff;
		padding: 30rpx;
		
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 30rpx;
		}
		
		.comment-list {
			.comment-item {
				display: flex;
				margin-bottom: 30rpx;
				
				.avatar {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
				
				.comment-content {
					flex: 1;
					
					.comment-header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 10rpx;
						
						.username {
							font-size: 28rpx;
							color: #333;
							font-weight: bold;
						}
						
						.time {
							font-size: 24rpx;
							color: #999;
						}
					}
					
					.text {
						font-size: 28rpx;
						color: #333;
						line-height: 1.5;
					}
					
					.replies {
						margin-top: 20rpx;
						background: #f5f5f5;
						padding: 20rpx;
						border-radius: 8rpx;
						
						.reply-item {
							margin-bottom: 10rpx;
							
							&:last-child {
								margin-bottom: 0;
							}
							
							.username {
								font-size: 26rpx;
								color: #0239ff;
								margin-right: 10rpx;
							}
							
							.reply-text {
								font-size: 26rpx;
								color: #333;
							}
						}
					}
				}
			}
		}
	}
	
	.comment-input {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
		padding: 20rpx;
		display: flex;
		align-items: center;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		
		input {
			flex: 1;
			height: 80rpx;
			background: #f5f5f5;
			border-radius: 40rpx;
			padding: 0 30rpx;
			font-size: 28rpx;
			margin-right: 20rpx;
		}
		
		.send-btn {
			width: 120rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background: #0239ff;
			color: #fff;
			border-radius: 40rpx;
			font-size: 28rpx;
			
			&[disabled] {
				opacity: 0.7;
			}
		}
	}
}
</style> 