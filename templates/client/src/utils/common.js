import axios from './axios';

export default {
  /**
   *  GET请求加载数据
   * @param url {String} ajax请求地址
   * @param data {JSON} ajax请求提交的数据
   * @example
   const result = await this.$getJSON('/login');
   if(result.errcode){ this.$toast(data.errmsg); return;};
   alert('登录成功');
   */
  getJSON: function (url, data) {
    return new Promise((resolve, reject) => {
      axios.get(url, { params: data || {} })
        .then((response) => {
          resolve(response.data);
        }, (err) => {
          reject(err);
        });
    });
  },
  /**
   * POST请求加载数据
   * @param url {String} ajax请求地址
   * @param data {JSON} ajax请求提交的数据
   * @example
   const result = await this.$postJSON('/login');
   if(result.errcode){ this.$toast(data.errmsg); return;};
   alert('登录成功');
   */
  postJSON: function (url, data) {
    return new Promise((resolve, reject) => {
      axios.post(url, (data || {}))
        .then((response) => {
          resolve(response.data);
        }, (err) => {
          reject(err);
        });
    });
  },
  putJSON: function (url, data) {
    return new Promise((resolve, reject) => {
      axios.put(url, (data || {}))
        .then((response) => {
          resolve(response.data);
        }, (err) => {
          reject(err);
        });
    });
  },
  deleteJSON: function (url, data) {
    return new Promise((resolve, reject) => {
      axios.delete(url, (data || {}))
        .then((response) => {
          resolve(response.data);
        }, (err) => {
          reject(err);
        });
    });
  },
  
  /**
   * 深度拷贝
   * @param data{object} 数据对象
   * @example
   const data = this.$getFormatData(this.form);
   */
  serializeJsonData: function (data) {
    return JSON.parse(JSON.stringify(data));
    // 或者return Object.assign({}, data)
  },
  /**
   * 获取对象内指定的字段并赋值(当包含不存在的字段时默认填充null,如果想保留原数据可用str字段不包含实现)
   * @param todata{object} 需要赋值的对象
   * @param data{object} 数据对象（数据源）
   * @param str{String} 赋值的字段名用多个用逗号隔开(没有该参数时，默认为todata的属性集合)
   * @example
   * this.$setFormatData(this.syncForm, data.retobj, 'brandName,originPlace,manufactorId');
   */
  setFormData: (todata, data, str) => {
    if (typeof str === 'string') {
      const keys = str.split(',');
      keys.forEach((t) => {
        todata[t] = typeof data[t] === 'undefined' ? null : data[t];
      });
      return;
    }
    const propertys = Object.getOwnPropertyNames(todata);
    propertys.forEach((t) => {
      todata[t] = typeof data[t] === 'undefined' ? null : data[t];
    });
  },
  /**
   * 倒计时
   * @param num{Number} 初始数字
   * @param cb{Function} 初始数字
   * @example
   this.$countdown(60, (data)=> {
         console.log(data);
       })
   */
  countdown: function (num, cb) {
    cb(num);
    const IntervalName = setInterval(() => {
      num--;
      if (!num) {
        clearInterval(IntervalName);
      }
      cb(num);
    }, 1000);
  },
  getDate(date){
	  let year = (date.getFullYear()).toString()
	  let month = (date.getMonth()+1).toString()
	  let day = (date.getDate()).toString()
	  if(month.length < 2){
	      month = '0'+month
	  }
	  if(day.length < 2){
	      day = '0'+day
	  }
	  return `${year}-${month}-${day}`
	}
  

};
