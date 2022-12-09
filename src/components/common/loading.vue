<template>
  <div class="van-loading">
    <div class="van-loading__spinner van-loading__spinner--spinner">
      <div v-for="v in 12" :key="v" class="van-loading__dot"/>
    </div>
    <div class="van-loading__text">{{ text }}</div>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String, default: '加载中...'
      }
    }
  };
</script>

<style lang="scss">
  .van-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    color: #c8c9cc;
  }

  .van-loading__spinner {
    position: relative;
    box-sizing: border-box;
    width: 30px;
    max-width: 100%;
    height: 30px;
    max-height: 100%;
    animation: van-rotate .8s linear infinite;
  }

  .van-loading__spinner--spinner {
    animation-timing-function: steps(12);
  }

  .van-loading__spinner--circular {
    border: 1px solid transparent;
    border-top-color: initial;
    border-radius: 100%;
  }

  .van-loading__text {
    margin-left: 8px;
    font-size: 14px;
    line-height: 20px;
    color: #969799;
  }

  .van-loading__text:empty {
    display: none;
  }

  .van-loading__dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .van-loading__dot:before {
    display: block;
    width: 2px;
    height: 25%;
    margin: 0 auto;
    border-radius: 40%;
    background-color: currentColor;
    content: " "
  }

  @for $i from 1 through 12 {
    .van-loading__dot:nth-of-type(#{$i}) {
      opacity: 1 - (0.75 / 12) * ($i - 1);
      transform: rotate($i * 30deg);
    }
  }

  @keyframes van-rotate {
    0% {
      transform: rotate(0deg)
    }

    to {
      transform: rotate(1turn)
    }
  }
</style>
