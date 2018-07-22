<template>
  <Scroll class="listview"
    ref="listview"
    @scroll="scroll"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    :data='data'>
    <ul>
      <li v-for="group in data"
        class="list-group"
        ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)"
            v-for="item in group.items"
            class="list-group-item">
            <img class="avatar"
              v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item"
          :class="{current: currentIndex === index}"
          v-for="(item, index) in shortcutList"
          :data-index="index">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed"
      ref="fixedTitle"
      v-show="fixedTitle">
      <div class="fixed-title">
        {{fixedTitle}}
      </div>
    </div>
    <div class="loading-container"
      v-show="!data.length">
      <Loading></Loading>
    </div>
  </Scroll>
</template>

<script>
import Scroll from 'base/Scroll/Scroll'
import Loading from 'base/Loading/Loading'
import {getData} from 'common/js/dom'

const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18
export default {
  name: 'listview',

  components: {
    Scroll,
    Loading
  },

  data() {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    }
  },

  props: {
    data: {
      type: Array,
      default: []
    }
  },

  computed: {
    fixedTitle() {
      let currentIndex = this.currentIndex
      return this.data[currentIndex] ? this.data[currentIndex].title : ''
    },
    shortcutList() {
      return this.data.map(ele => {
        return ele.title.substr(0, 1)
      })
    }
  },

  watch: {
    scrollY(newVal) {
      // 1.同步diff 2.处理当前亮的快捷方式
      const listHeight = this.listHeight
      // 滚动到顶部
      if (newVal > 0) {
        this.currentIndex = 0
        return
      }
      // 滚动到中间
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newVal >= height1 && -newVal < height2) {
          this.currentIndex = i
          this.diff = newVal + height2
          return
        }
      }
      // 滚动到底部
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    },
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    }
  },

  methods: {
    _calculateHeight() {
      let listGroup = this.$refs.listGroup
      let height = 0
      this.listHeight = [0]
      listGroup.forEach(element => {
        height += element.clientHeight
        this.listHeight.push(height)
      })
    },
    _scrollToElement(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      let el = this.$refs.listGroup[index]
      this.$refs.listview.scrollToElement(el, 0)
      this.scrollY = this.$refs.listview.scroll.y
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTocuh = e.touches[0]
      this.touch.y1 = firstTocuh.pageY
      this.touch.anchorIndex = anchorIndex

      this._scrollToElement(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTocuh = e.touches[0]
      this.touch.y2 = firstTocuh.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = +this.touch.anchorIndex + delta
      // this.currentIndex = anchorIndex
      this._scrollToElement(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    selectItem(item) {
      this.$emit('select', item)
    }
  },

  created() {
    this.listenScroll = true
    this.probeType = 3
    this.touch = {}
  }
}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
