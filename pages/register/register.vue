<template>
    <view class="register-container">
        <view class="form-item">
            <text class="label">用户名</text>
            <input type="text" v-model="form.username" placeholder="请输入用户名"/>
        </view>
        <view class="form-item">
            <text class="label">手机号</text>
            <input type="text" v-model="form.phone" placeholder="请输入手机号"/>
        </view>
        <view class="form-item">
            <text class="label">密码</text>
            <input type="password" v-model="form.password" placeholder="请输入密码"/>
        </view>
        <view class="form-item">
            <text class="label">密保问题</text>
            <input type="text" v-model="form.mibao1" placeholder="请输入密保问题"/>
        </view>
        <view class="form-item">
            <text class="label">密保答案</text>
            <input type="text" v-model="form.mibao2" placeholder="请输入密保答案"/>
        </view>
        <button class="submit-btn" @click="handleRegister">注册</button>
        <view class="links">
            <text @click="toLogin">已有账号？去登录</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: '',
                phone: '',
                password: '',
                mibao1: '',
                mibao2: ''
            }
        }
    },
    methods: {
        validateForm() {
            if (!this.form.username) {
                uni.showToast({
                    title: '请输入用户名',
                    icon: 'none'
                })
                return false
            }
            if (!this.form.phone) {
                uni.showToast({
                    title: '请输入手机号',
                    icon: 'none'
                })
                return false
            }
            if (!this.form.password) {
                uni.showToast({
                    title: '请输入密码',
                    icon: 'none'
                })
                return false
            }
            if (!this.form.mibao1) {
                uni.showToast({
                    title: '请输入密保问题',
                    icon: 'none'
                })
                return false
            }
            if (!this.form.mibao2) {
                uni.showToast({
                    title: '请输入密保答案',
                    icon: 'none'
                })
                return false
            }
            return true
        },
        
        async handleRegister() {
            if (!this.validateForm()) return
            
            try {
                const res = await uni.$request.post('/api/login/userAdd', this.form)
                
                if (res.data.code === 200) {
                    uni.showToast({
                        title: '注册成功',
                        icon: 'success'
                    })
                    setTimeout(() => {
                        uni.navigateTo({
                            url: '/pages/login/login'
                        })
                    }, 1500)
                } else {
                    uni.showToast({
                        title: res.data.msg || '注册失败',
                        icon: 'none'
                    })
                }
            } catch (error) {
                uni.showToast({
                    title: '注册失败，请稍后重试',
                    icon: 'none'
                })
            }
        },
        
        toLogin() {
            uni.navigateTo({
                url: '/pages/login/login'
            })
        }
    }
}
</script>

<style lang="less">
.register-container {
    padding: 30rpx;
    
    .form-item {
        margin-bottom: 30rpx;
        
        .label {
            display: block;
            margin-bottom: 10rpx;
            font-size: 28rpx;
        }
        
        input {
            width: 100%;
            height: 80rpx;
            border: 1px solid #ddd;
            border-radius: 8rpx;
            padding: 0 20rpx;
        }
    }
    
    .submit-btn {
        margin-top: 50rpx;
        background-color: #0239ff;
        color: #fff;
    }
    
    .links {
        margin-top: 30rpx;
        text-align: center;
        color: #666;
        font-size: 28rpx;
        
        text {
            color: #0239ff;
        }
    }
}
</style> 