<script>
import request from './utils/request.js'

export default {
	onLaunch: function() {
		console.log('App Launch')
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	}
}

// 挂载到 uni 对象上
uni.$request = request
</script>

<style>
	/*每个页面公共css */
</style>
