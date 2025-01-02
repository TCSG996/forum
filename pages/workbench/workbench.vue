<template>
	<view class="workbench">
		<!-- 顶部导航栏 -->
		<view class="nav-tabs">
			<view 
				v-for="(tab, index) in tabs" 
				:key="index"
				:class="['tab-item', currentTab === index ? 'active' : '']"
				@click="switchTab(index)"
			>
				{{tab.name}}
			</view>
		</view>
		
		<!-- 表白墙内容 -->
		<view v-if="currentTab === 0" class="confession-wall">
			<!-- 发布按钮 -->
			<view class="post-btn" @click="showPostModal">
				<text class="iconfont icon-edit"></text>
				<text>发表新帖</text>
			</view>
			
			<!-- 帖子列表 -->
			<view class="post-list">
				<view class="post-item" v-for="(item, index) in posts" :key="index" @click="viewPostDetail(item)">
					<view class="post-header">
						<view class="user-info">
							<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
							<view class="user-detail">
								<text class="username">{{item.username}}</text>
								<text class="time">{{item.time}}</text>
							</view>
						</view>
						<view class="post-actions">
							<text class="iconfont icon-heart" :class="{liked: item.isLiked}" @click.stop="toggleLike(index)"></text>
						</view>
					</view>
					<view class="post-content">
						<text class="text">{{item.content}}</text>
						<view class="images" v-if="item.images && item.images.length">
							<image 
								v-for="(img, imgIndex) in item.images" 
								:key="imgIndex" 
								:src="img" 
								mode="aspectFill"
								@click.stop="previewImage(item.images, imgIndex)"
							></image>
						</view>
					</view>
					<view class="post-footer">
						<view class="stats">
							<text>{{item.likes}} 赞</text>
							<text>{{item.comments}} 评论</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 消息列表 -->
		<view v-if="currentTab === 1" class="message-list">
			<view 
				class="message-item" 
				v-for="(item, index) in messages" 
				:key="index"
				@click="toChat(item)"
			>
				<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
				<view class="message-content">
					<view class="message-header">
						<text class="username">{{item.username}}</text>
						<text class="time">{{item.time}}</text>
					</view>
					<text class="last-message">{{item.lastMessage}}</text>
				</view>
				<view class="unread" v-if="item.unread">{{item.unread}}</view>
			</view>
		</view>
		
		<!-- 发帖弹窗 - 使用原生弹出层 -->
		<view class="modal" v-if="showModal" @click.stop="closePostModal">
			<view class="modal-mask"></view>
			<view class="modal-content" @click.stop>
				<view class="post-form">
					<view class="form-header">
						<text>发表新帖</text>
						<text class="close" @click="closePostModal">×</text>
					</view>
					<view class="form-content">
						<textarea 
							v-model="newPost.content" 
							placeholder="说点什么吧..."
							maxlength="500"
						></textarea>
						<view class="image-uploader">
							<view class="image-list">
								<view 
									class="image-item" 
									v-for="(img, index) in newPost.images" 
									:key="index"
								>
									<image :src="img" mode="aspectFill"></image>
									<text class="delete" @click="deleteImage(index)">×</text>
								</view>
								<view class="upload-btn" @click="chooseImage" v-if="newPost.images.length < 9">
									<text class="iconfont icon-camera"></text>
								</view>
							</view>
						</view>
					</view>
					<view class="form-footer">
						<button class="submit-btn" @click="submitPost" :loading="submitting">发布</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showModal: false, // 控制弹窗显示
				currentTab: 0,
				tabs: [
					{ name: '表白墙' },
					{ name: '消息' }
				],
				// 帖子列表模拟数据
				posts: [
					{
						id: 1,
						username: '匿名用户',
						avatar: '/static/avatar/default.png',
						time: '10分钟前',
						content: '今天在图书馆遇见一个女生，穿着白色连衣裙，看起来很温柔...',
						images: ['/static/posts/library1.jpg'],
						likes: 12,
						comments: 3,
						isLiked: false
					},
					{
						id: 2,
						username: '小王',
						avatar: '/static/avatar/user3.png',
						time: '30分钟前',
						content: '有没有一起去看电影的？最近上映了一部很不错的片子...',
						images: [],
						likes: 5,
						comments: 8,
						isLiked: true
					},
					{
						id: 3,
						username: '小李',
						avatar: '/static/avatar/user4.png',
						time: '1小时前',
						content: '食堂二楼新开的面馆真的很好吃！推荐大家去尝尝~',
						images: [
							'/static/posts/food1.jpg',
							'/static/posts/food2.jpg'
						],
						likes: 28,
						comments: 15,
						isLiked: false
					}
				],
				// 消息列表模拟数据
				messages: [
					{
						id: 1,
						from_user_id: 2,
						username: '小明',
						avatar: '/static/avatar/user1.png',
						lastMessage: '你好，我看到你发的帖子了',
						time: '12:30',
						unread: 2
					},
					{
						id: 2,
						from_user_id: 3,
						username: '小红',
						avatar: '/static/avatar/user2.png',
						lastMessage: '电影什么时候去看？',
						time: '昨天',
						unread: 0
					},
					{
						id: 3,
						from_user_id: 4,
						username: '系统通知',
						avatar: '/static/avatar/system.png',
						lastMessage: '您的帖子已通过审核',
						time: '周一',
						unread: 1
					}
				],
				newPost: {
					content: '',
					images: []
				},
				submitting: false
			}
		},
		onLoad() {
			// 在实际开发时打开这两个接口
			// this.getPosts()
			// this.getMessages()
		},
		methods: {
			switchTab(index) {
				this.currentTab = index
			},
			showPostModal() {
				this.showModal = true
			},
			closePostModal() {
				this.showModal = false
			},
			toggleLike(index) {
				this.posts[index].isLiked = !this.posts[index].isLiked
				this.posts[index].likes += this.posts[index].isLiked ? 1 : -1
			},
			viewPostDetail(post) {
				uni.navigateTo({
					url: `/pages/posts/detail?id=${post.id}`
				})
			},
			toChat(message) {
				uni.navigateTo({
					url: `/pages/chat/chat?id=${message.id}&userId=${message.from_user_id}`
				})
			},
			async chooseImage() {
				try {
					const res = await uni.chooseImage({
						count: 9 - this.newPost.images.length,
						sizeType: ['compressed'],
						sourceType: ['album', 'camera']
					})
					this.newPost.images = [...this.newPost.images, ...res.tempFilePaths]
				} catch (e) {
					console.error(e)
				}
			},
			deleteImage(index) {
				this.newPost.images.splice(index, 1)
			},
			previewImage(images, current) {
				uni.previewImage({
					urls: images,
					current: current
				})
			},
			async getPosts() {
				try {
					const res = await uni.$request.get('/api/posts/list')
					if (res.data.code === 200) {
						this.posts = res.data.data
					}
				} catch (error) {
					console.error('获取帖子列表失败', error)
					uni.showToast({
						title: '获取帖子失败',
						icon: 'none'
					})
				}
			},
			async getMessages() {
				try {
					const res = await uni.$request.get('/api/conversations/list')
					if (res.data.code === 200) {
						this.messages = res.data.data
					}
				} catch (error) {
					console.error('获取消息列表失败', error)
					uni.showToast({
						title: '获取消息失败',
						icon: 'none'
					})
				}
			},
			async submitPost() {
				if (!this.newPost.content.trim()) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					})
					return
				}
				
				this.submitting = true
				try {
					// 模拟发帖
					await new Promise(resolve => setTimeout(resolve, 1000))
					
					const newPost = {
						id: this.posts.length + 1,
						username: '我',
						avatar: '/static/avatar/default.png',
						time: '刚刚',
						content: this.newPost.content,
						images: [...this.newPost.images],
						likes: 0,
						comments: 0,
						isLiked: false
					}
					
					this.posts.unshift(newPost)
					this.closePostModal()
					this.newPost = {
						content: '',
						images: []
					}
					
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					})
					
					// 实际接口调用
					/*
					const imageUrls = []
					if (this.newPost.images.length > 0) {
						for (let image of this.newPost.images) {
							const uploadRes = await this.uploadImage(image)
							if (uploadRes.success) {
								imageUrls.push(uploadRes.url)
							}
						}
					}

					const postData = {
						content: this.newPost.content,
						images: imageUrls.join(','),
						is_anonymous: false
					}

					const res = await uni.$request.post('/api/posts/create', postData)
					
					if (res.data.code === 200) {
						this.closePostModal()
						this.newPost = {
							content: '',
							images: []
						}
						this.getPosts()
					}
					*/
				} catch (error) {
					uni.showToast({
						title: '发布失败',
						icon: 'none'
					})
				} finally {
					this.submitting = false
				}
			},
			async uploadImage(filePath) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: '/api/images/create',
						filePath: filePath,
						name: 'file',
						success: (res) => {
							const data = JSON.parse(res.data)
							if (data.code === 200) {
								resolve({
									success: true,
									url: data.data.url
								})
							} else {
								resolve({
									success: false,
									message: data.msg
								})
							}
						},
						fail: (err) => {
							resolve({
								success: false,
								message: '上传失败'
							})
						}
					})
				})
			},
			async toggleLike(index) {
				try {
					// 模拟接口调用
					await new Promise(resolve => setTimeout(resolve, 500))
					this.posts[index].isLiked = !this.posts[index].isLiked
					this.posts[index].likes += this.posts[index].isLiked ? 1 : -1
					
					// 实际接口调用
					/*
					const res = await uni.$request.post('/api/likes/create', {
						post_id: this.posts[index].id
					})
					
					if (res.data.code === 200) {
						this.posts[index].isLiked = !this.posts[index].isLiked
						this.posts[index].likes += this.posts[index].isLiked ? 1 : -1
					}
					*/
				} catch (error) {
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					})
				}
			},
			async sendMessage(toUserId, content) {
				try {
					const res = await uni.$request.post('/api/messages/create', {
						to_user_id: toUserId,
						content: content
					})
					
					if (res.data.code === 200) {
						// 更新消息列表
						this.getMessages()
						return true
					}
					return false
				} catch (error) {
					uni.showToast({
						title: '发送失败',
						icon: 'none'
					})
					return false
				}
			},
			async updateConversation(userId) {
				try {
					await uni.$request.post('/api/conversations/create', {
						user_id: userId
					})
				} catch (error) {
					console.error('更新会话失败', error)
				}
			}
		}
	}
</script>

<style lang="less">
.workbench {
	min-height: 100vh;
	background: #f5f5f5;
	
	.nav-tabs {
		display: flex;
		background: #fff;
		padding: 20rpx 30rpx;
		border-bottom: 1rpx solid #eee;
		position: sticky;
		top: 0;
		z-index: 100;
		
		.tab-item {
			flex: 1;
			text-align: center;
			font-size: 30rpx;
			color: #666;
			position: relative;
			
			&.active {
				color: #0239ff;
				font-weight: bold;
				
				&:after {
					content: '';
					position: absolute;
					bottom: -20rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 40rpx;
					height: 4rpx;
					background: #0239ff;
					border-radius: 2rpx;
				}
			}
		}
	}
	
	.post-btn {
		position: fixed;
		right: 30rpx;
		bottom: 100rpx;
		background: #0239ff;
		color: #fff;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(2, 57, 255, 0.3);
		z-index: 99;
		
		.iconfont {
			font-size: 40rpx;
			margin-bottom: 4rpx;
		}
	}
	
	.post-list {
		padding: 20rpx;
		
		.post-item {
			background: #fff;
			border-radius: 12rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;
			
			.post-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 16rpx;
				
				.user-info {
					display: flex;
					align-items: center;
					
					.avatar {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						margin-right: 16rpx;
					}
					
					.user-detail {
						.username {
							font-size: 28rpx;
							color: #333;
							font-weight: bold;
						}
						
						.time {
							font-size: 24rpx;
							color: #999;
							margin-top: 4rpx;
						}
					}
				}
				
				.post-actions {
					.iconfont {
						font-size: 40rpx;
						color: #999;
						
						&.liked {
							color: #ff4444;
						}
					}
				}
			}
			
			.post-content {
				.text {
					font-size: 28rpx;
					color: #333;
					line-height: 1.6;
				}
				
				.images {
					display: flex;
					flex-wrap: wrap;
					margin-top: 16rpx;
					
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
			
			.post-footer {
				margin-top: 16rpx;
				padding-top: 16rpx;
				border-top: 1rpx solid #f5f5f5;
				
				.stats {
					display: flex;
					font-size: 24rpx;
					color: #999;
					
					text {
						margin-right: 20rpx;
					}
				}
			}
		}
	}
	
	.message-list {
		padding: 20rpx;
		
		.message-item {
			display: flex;
			align-items: center;
			background: #fff;
			padding: 20rpx;
			margin-bottom: 20rpx;
			border-radius: 12rpx;
			
			.avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			
			.message-content {
				flex: 1;
				
				.message-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 8rpx;
					
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
				
				.last-message {
					font-size: 26rpx;
					color: #666;
				}
			}
			
			.unread {
				background: #ff4444;
				color: #fff;
				font-size: 24rpx;
				min-width: 40rpx;
				height: 40rpx;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 10rpx;
			}
		}
	}
	
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		
		.modal-mask {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);
		}
		
		.modal-content {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			background: #fff;
			border-radius: 24rpx 24rpx 0 0;
			transform: translateY(0);
			transition: transform 0.3s;
			
			&.hide {
				transform: translateY(100%);
			}
		}
	}
}
</style>
