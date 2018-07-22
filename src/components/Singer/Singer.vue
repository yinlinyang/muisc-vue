<template>
  <div class="singer"
    ref="singer">
    <list-view @select="selectSinger"
      :data="singers"
      ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
  import ListView from 'base/ListView/ListView'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'
  
  export default {
    components: {
      ListView
    },

    data() {
      return {
        singers: []
      }
    },

    methods: {
      _getSingerList() {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            items: [],
            title: HOT_NAME
          }
        }

        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          let key = item.Findex
          if (!map[key]) {
            map[key] = {
              items: [],
              title: key
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })

        // 排序
        let ret = []
        let hot = []
        for (let key in map) {
          let value = map[key]
          if (/[a-zA-Z]/.test(value.title)) {
            ret.push(value)
          } else if (value.title === HOT_NAME) {
            hot.push(value)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },

      selectSinger() {

      }
    },

    created() {
      this._getSingerList()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>

