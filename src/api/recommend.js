import {commonParams, ERR_OK, options} from './config'
import axios from 'axios'
import jsonp from 'common/js/jsonp'

const isProd = process.env.MODE_ENV === 'prodution'

export const getRecommend = function (params) {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getDiscList() {
  // 线上环境地址，同学们根据自己的需要配置修改
  const url = !isProd ? '/api/getDiscList' : 'http://ustbhuangyi.com/music/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}