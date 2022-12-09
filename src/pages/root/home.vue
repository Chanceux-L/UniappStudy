<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="home-page">
    <common-navbar title="beansmile" fixed/>

    <!-- 自定义swiper -->
    <swiper
      :current="swiperCurrentIndex"
      previous-margin="50px"
      next-margin="50px"
      indicator-color="#8a8a8a"
      interval="3000"
      circular
      autoplay
      class="swiper"
      @change="handleSwiperChange"
    >
      <swiper-item v-for="(item, index) in swiperImages" :key="index" class="swiper-item">
        <img
          :src="item"
          class="swiper-image"
          :class="[ swiperCurrentIndex === index ? 'active' : 'common' ]"
          mode="aspectFill"
          alt=""
        >
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class Home extends Vue {
    // 自定义swiper
    swiperCurrentIndex = 0
    swiperImages = [
      require('@/static/swiper/swiper-image1.jpeg'),
      require('@/static/swiper/swiper-image2.jpeg'),
      require('@/static/swiper/swiper-image3.jpeg'),
      require('@/static/swiper/swiper-image4.jpeg'),
      require('@/static/swiper/swiper-image5.jpeg'),
    ]
    handleSwiperChange(e) {
      const { current, source } = e.detail;

      if (!source) {
        return;
      }
      this.swiperCurrentIndex = current;
    }
  }
</script>

<style lang="scss" scoped>
  .swiper {
    display: flex;
    height: 250px;

    .swiper-item {
      display: flex;
      align-items: center;
      overflow: unset;

      .swiper-image {
        width: calc(100% - 40px);
        height: 60%;
        margin: 0 20px;
        border-radius: 10px;
        box-shadow: 5px 5px 20px rgba($color: #000000, $alpha: 0.5);

        &.active {
          opacity: 1;
          transform: scale(1.2);
          transition: all .3s ease-in 0s;
        }

        &.common {
          opacity: 0.4;
          transform: scale(1);
          transition: all .3s ease-in 0s;
        }
      }
    }
  }
</style>
