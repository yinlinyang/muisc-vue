<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots" ref="dots">
      <span v-for="(item, index) in dots" :key="index" class="dot" :class="{'active': currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import { addClass } from 'common/js/dom';
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
    }, 20);
    
  },
  methods: {
    _setSliderWidth(isResize) {
      // *轮播结构: 容器(固定宽高)) -> 滚动的容器（要根据children计算自身的宽度） -> n个项目（宽度等于宽度的）
      const sliderWidth = this.$refs.slider.clientWidth
      const sliderGroup = this.$refs.sliderGroup
      // !缓存
      this.children = [...sliderGroup.children]
      let width = 0
      this.children.forEach(element => {
        element.style.width = sliderWidth + 'px'
        addClass(element, 'slider-item')
        width += sliderWidth
      });
      if (this.loop && !isResize) {
        width += sliderWidth * 2
      }
      sliderGroup.style.width = width + 'px'
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSlider() {
      // !实例化
      this.slider = new Bscroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false, // true的时候会根据滚动的距离开启动画，轮播图的时候需要关闭
        snap: { // slider的配置项
          loop: this.loop,
          threshold: 0.3, // 
          speed: 400
        }
      })

      // 注册事件 beforeScrollStart start end
      this.slider.on('beforeScrollStart', () => {
        this.timer && clearTimeout(this.timer) // 避免动画bug
      })
      this.slider.on('scrollEnd', this._onScrollEnd)
      this.slider.on('tounchEnd', () => {
        this.autoPlay && this._play()
      })
      this.autoPlay && this._play()
    },
    _play() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval);
    },
    _onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX
      this.currentPageIndex = pageIndex
      this.autoPlay && this._play()
    },
    // DOM结构和 resize时要重新实例话
    refresh() {
      if(this.slder) {
        this._setSliderWidth(true)
        this.slder.refresh()
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>