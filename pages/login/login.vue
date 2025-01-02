<template>
	<view>
		<view class="content">
			<view class="header">
				<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
				<text class="title">欢迎登录</text>
			</view>
			
			<view class="form">
				<view class="form-item">
					<text class="label">账号</text>
					<input type="text" placeholder="请输入账号" v-model="loginForm.username" />
				</view>
				<view class="form-item">
					<text class="label">密码</text>
					<input type="password" placeholder="请输入密码" v-model="loginForm.password" />
				</view>
				
				<view class="remember-pwd">
					<checkbox :checked="rememberPwd" @change="handleCheckboxChange" style="transform:scale(0.7)"/>
					<text>记住密码</text>
				</view>
				
				<view class="actions">
					<text class="link" @click="toRegister">注册账号</text>
					<text class="link" @click="toForgetPassword">忘记密码</text>
				</view>
				
				<button class="submit-btn" @click="loginBtn" :loading="loading">登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginForm: {
					username: '',
					password: ''
				},
				rememberPwd: false,
				loading: false
			};
		},

		onLoad() {
			this.getStorageAccount()
		},

		methods: {
			validateForm() {
				if (!this.loginForm.username) {
					uni.showToast({
						title: '请输入账号',
						icon: 'none'
					})
					return false
				}
				if (!this.loginForm.password) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return false
				}
				return true
			},

			getStorageAccount() {
				try {
					const accountInfo = uni.getStorageSync('accountInfo')
					if (accountInfo) {
						this.loginForm = JSON.parse(accountInfo)
						this.rememberPwd = true
					}
				} catch (e) {
					console.error('获取存储账号失败', e)
				}
			},

			saveAccount() {
				if (this.rememberPwd) {
					uni.setStorageSync('accountInfo', JSON.stringify(this.loginForm))
				} else {
					uni.removeStorageSync('accountInfo')
				}
			},

			async loginBtn() {
				if (!this.validateForm()) return
				if (this.loading) return
				
				this.loading = true
				try {
					const res = await uni.$request.post('/api/login/userLogin', this.loginForm)
					
					if (res.data.code === 200) {
						this.saveAccount()
						
						uni.setStorageSync('token', res.data.token)
						
						uni.showToast({
							title: "登录成功",
							icon: "success"
						})
						
						setTimeout(() => {
							uni.reLaunch({
								url: "/pages/index/index"
							})
						}, 2000)
					} else {
						uni.showToast({
							title: res.data.msg || '登录失败',
							icon: 'none',
							duration: 2000
						})
					}
				} catch (error) {
					console.error('登录失败', error)
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					})
				} finally {
					this.loading = false
				}
			},

			handleCheckboxChange(e) {
				this.rememberPwd = e.target.value
			},

			toRegister() {
				uni.navigateTo({
					url: '/pages/register/register'
				})
			},

			toForgetPassword() {
				uni.navigateTo({
					url: '/pages/forget-password/forget-password'
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		padding: 30rpx;
		
		.header {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 60rpx;
			
			.logo {
				width: 200rpx;
				height: 200rpx;
				margin-bottom: 20rpx;
			}
			
			.title {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
			}
		}
		
		.form {
			.form-item {
				margin-bottom: 30rpx;
				
				.label {
					display: block;
					margin-bottom: 10rpx;
					font-size: 28rpx;
					color: #333;
				}
				
				input {
					width: 650rpx;
					height: 80rpx;
					border: 1px solid #ddd;
					border-radius: 8rpx;
					padding: 0 20rpx;
					font-size: 28rpx;
				}
			}
			
			.remember-pwd {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
				
				text {
					font-size: 28rpx;
					color: #666;
					margin-left: 10rpx;
				}
			}
			
			.actions {
				display: flex;
				justify-content: space-between;
				margin-bottom: 50rpx;
				
				.link {
					font-size: 28rpx;
					color: #0239ff;
				}
			}
			
			.submit-btn {
				width: 100%;
				height: 88rpx;
				line-height: 88rpx;
				background-color: #0239ff;
				color: #fff;
				font-size: 32rpx;
				border-radius: 8rpx;
				
				&[loading] {
					opacity: 0.7;
				}
			}
		}
	}
</style>