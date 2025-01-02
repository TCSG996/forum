// 创建请求拦截器
const request = {
	post(url, data) {
		return new Promise((resolve, reject) => {
			uni.request({
				url,
				data,
				method: 'POST',
				header: {
					'content-type': 'application/json',
					'Authorization': uni.getStorageSync('token') || ''
				},
				success: (res) => {
					resolve(res);
				},
				fail: (err) => {
					reject(err);
				}
			});
		});
	},
	
	get(url, data) {
		return new Promise((resolve, reject) => {
			uni.request({
				url,
				data,
				method: 'GET',
				header: {
					'content-type': 'application/json',
					'Authorization': uni.getStorageSync('token') || ''
				},
				success: (res) => {
					resolve(res);
				},
				fail: (err) => {
					reject(err);
				}
			});
		});
	},

	put(url, data) {
		return new Promise((resolve, reject) => {
			uni.request({
				url,
				data,
				method: 'PUT',
				header: {
					'content-type': 'application/json',
					'Authorization': uni.getStorageSync('token') || ''
				},
				success: (res) => {
					resolve(res);
				},
				fail: (err) => {
					reject(err);
				}
			});
		});
	}
};

export default request; 