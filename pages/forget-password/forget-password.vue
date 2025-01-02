<template>
    <view class="forget-password-container">
        <view v-if="step === 1">
            <view class="form-item">
                <text class="label">手机号</text>
                <input type="text" v-model="phone" placeholder="请输入手机号"/>
            </view>
            <button class="submit-btn" @click="handleQuerySecurityQuestion">查询密保问题</button>
        </view>
        
        <view v-if="step === 2">
            <view class="security-question">
                <text class="label">密保问题：</text>
                <text>{{securityInfo.mibao1}}</text>
            </view>
            <view class="form-item">
                <text class="label">密保答案</text>
                <input type="text" v-model="answer" placeholder="请输入密保答案"/>
            </view>
            <button class="submit-btn" @click="handleVerifyAnswer">验证答案</button>
        </view>
        
        <view v-if="step === 3">
            <view class="form-item">
                <text class="label">新密码</text>
                <input type="password" v-model="newPassword" placeholder="请输入新密码"/>
            </view>
            <button class="submit-btn" @click="handleResetPassword">重置密码</button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            step: 1,
            phone: '',
            answer: '',
            newPassword: '',
            securityInfo: null,
            userId: null
        }
    },
    methods: {
        async handleQuerySecurityQuestion() {
            if (!this.phone) {
                uni.showToast({
                    title: '请输入手机号',
                    icon: 'none'
                })
                return
            }
            
            try {
                const res = await uni.$request.post('/api/login/userRetrievePassword', {
                    phone: this.phone
                })
                
                if (res.data.code === 200) {
                    this.securityInfo = res.data.data
                    this.userId = res.data.data.id
                    this.step = 2
                } else {
                    uni.showToast({
                        title: res.data.msg || '查询失败',
                        icon: 'none'
                    })
                }
            } catch (error) {
                uni.showToast({
                    title: '查询失败，请稍后重试',
                    icon: 'none'
                })
            }
        },
        
        handleVerifyAnswer() {
            if (!this.answer) {
                uni.showToast({
                    title: '请输入密保答案',
                    icon: 'none'
                })
                return
            }
            
            if (this.answer === this.securityInfo.mibao2) {
                this.step = 3
            } else {
                uni.showToast({
                    title: '密保答案错误',
                    icon: 'none'
                })
            }
        },
        
        async handleResetPassword() {
            if (!this.newPassword) {
                uni.showToast({
                    title: '请输入新密码',
                    icon: 'none'
                })
                return
            }
            
            try {
                const res = await uni.$request.put('/api/login/userEdit', {
                    id: this.userId,
                    password: this.newPassword
                })
                
                if (res.data.code === 200) {
                    uni.showToast({
                        title: '密码重置成功',
                        icon: 'success'
                    })
                    setTimeout(() => {
                        uni.navigateTo({
                            url: '/pages/login/login'
                        })
                    }, 1500)
                } else {
                    uni.showToast({
                        title: res.data.msg || '重置失败',
                        icon: 'none'
                    })
                }
            } catch (error) {
                uni.showToast({
                    title: '重置失败，请稍后重试',
                    icon: 'none'
                })
            }
        }
    }
}
</script>

<style lang="less">
.forget-password-container {
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
    
    .security-question {
        margin-bottom: 30rpx;
        padding: 20rpx;
        background-color: #f5f5f5;
        border-radius: 8rpx;
    }
    
    .submit-btn {
        margin-top: 50rpx;
        background-color: #0239ff;
        color: #fff;
    }
}
</style> 