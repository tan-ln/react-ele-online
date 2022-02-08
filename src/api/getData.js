import axios from 'axios'
import { URL } from './config.js'
import shopList from './rsts'

export const getGeoHash = (latitude, longitude) => new Promise((resolve, reject) => {
  const url = URL.geohash
  axios.get(url, {
    params: {
      latitude,
      longitude
    }
  }).then(res => {
    resolve(res.data)
  })
})

// 店铺详情
export const getShopdetails = (id) => new Promise((resolve, reject) => {
  shopList.forEach(item => {
    if (item.rst.id === id) {
      window.localStorage.setItem('RESTAURANT_DATA', JSON.stringify(item))
      resolve(item)
    }
  })
})

// 商家列表
export const requestRestList = () => new Promise((resolve, reject) => {
  let location = JSON.parse(window.localStorage.getItem('LOCATION'))
  const url = URL.restaurants
  axios.get(`${url}`, {
    params: {
      latitude: location.latitude,
      longitude: location.longitude,
      offset: 0,
      limit: 8,
      extras: ['activities', 'tags'],
      extra_filters: 'home',
      rank_id: null,
      terminal: 'h5'
    }
  }).then(res => {
    resolve(res.data.items)
  }).catch((error) => {
    axios.get(URL.root).then(res => {
      if (res) { 
        resolve(res.data) 
        console.log(res.data)
      } else {
        console.log(error)
      }
    }).catch(err => {
      console.log(err)
    })
  })
})

// 搜索结果商品列表
export const requestSearchResult = (keyword) => new Promise((resolve, reject) => {
  let location = JSON.parse(window.localStorage.getItem('LOCATION'))
  if (!keyword || !location) return
  const url = URL.searchEntity
  axios.get(url, {
    params: {
      kw: keyword,
      latitude: location.latitude,
      longitude: location.longitude,
      city_id: location.city_id
    }
  }).then(res => {
    let result = res.data
    resolve(result)
  }).catch(err => {
    console.log(err)
  })
})

// 搜索结果商家列表
export const requestSearhShopList = (keyword) => new Promise(resolve => {
  let location = JSON.parse(window.localStorage.getItem('LOCATION'))
  if (!keyword || !location) return
  const url = URL.searchShopList
  axios.get(url, {
    params: {
      offset: 0,
      limit: 15,
      keyword,
      latitude: location.latitude,
      longitude: location.longitude,
      search_item_type: 3,
      is_rewrite: 1,
      extras: ['activities', 'coupon'],
      terminal: 'h5'
    }
  }).then(res => {
    const data = res.data
    resolve(data)
  }).catch(err => {
    console.log(err)
  })
})

// 分类 id 集
export const requestGetSiftFactors = (entry_id) => new Promise(resolve => {
  const url = URL.siftFactors
  let location = JSON.parse(window.localStorage.getItem('LOCATION'))
  if (!url || !location) return
  axios.get(url, {
    params: {
      entry_id,
      latitude: location.latitude,
      longitude: location.longitude,
      terminal: 'h5'
    }
  }).then(res => {
    resolve(res.data)
  }).catch(err => {
    console.log(err)
  })
})

// 根据 name 获取 id 集
export const requestGetCateIds = (cate_name) => new Promise(resolve => {
  const url = URL.category, location = JSON.parse(window.localStorage.getItem('LOCATION')),
  cateIds = JSON.parse(window.localStorage.getItem('CATEGORY_IDS'))
  let result = []
  if (!cate_name || !location) return
  if (cateIds) {
    result = findIdsByName(cate_name, cateIds)
  } else {
    axios.get(url, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    }).then(res => {
      let data = res.data
      window.localStorage.setItem('CATEGORY_IDS', JSON.stringify(data))
      result = findIdsByName(cate_name, cateIds)
    }).catch(err => {
      console.log(err)
    })
  }
  resolve(result)
})

// 简单模糊查询一下
const findIdsByName = (name, list) => {
  let arr = [], nameArr = name.split('')
  list.forEach((item, index) => {
    nameArr.forEach((char, i) => {
      if (item.name.indexOf(char) > -1) {
        arr.push(item.id)
      }
    })
  })
  if (arr.length === 0) {
    arr = Object.assign([], list[0].ids)
  }
  return arr
}

// 获取详细地址
export const requestGetReceiveAddress = () => new Promise((resolve) => {
  let addr = window.localStorage.getItem('RECEIVE_ADDRESS')
  resolve(JSON.parse(addr) || [])
})

// 读取订单
export const requestGetOrderList = () => new Promise((resolve) => {
    let orderList = JSON.parse(window.localStorage.getItem('ORDER_LIST'))
    resolve(orderList)
})
