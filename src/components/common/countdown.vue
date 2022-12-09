<template>
  <div class="countdown"></div>
</template>

<script>
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
  import { countdown } from '@/utils';
  import dayjs from 'dayjs';

  @Component
  export default class Countdown extends Vue {
    @Prop(String) currentTime; // 当前时间
    @Prop(String) endTime; // 倒计时结束时间 不能传空
    @Prop(Boolean) hideDay // 是否倒计时不要天，最大为小时

    secondsLeft = 0;

    get duration() {
      // 小程序 空值dayjs解析有问题
      return dayjs(this.endTime).diff(dayjs(this.currentTime || new Date()), 'second');
    }

    get time() {
      let remainings = this.secondsLeft;
      const oneDay = 24 * 60 * 60;
      const oneHour = 60 * 60;
      const oneMinute = 60;
      let day = Math.floor(remainings / oneDay);
      if (!this.hideDay) {
        remainings = remainings - day * oneDay;
      }
      let hour = Math.floor(remainings / oneHour);
      remainings = remainings - hour * oneHour;
      let minute = Math.floor(remainings / oneMinute);
      remainings = remainings - minute * oneMinute;
      let second = Math.floor(remainings / 1);
      const data = {
        remainings: this.secondsLeft,
        hour,
        minute,
        second
      };
      if (!this.hideDay) {
        data.day = day;
      }
      Object.keys(data).forEach(key => {
        if (key === 'remainings') {
          return;
        }
        if (data[key] < 10) {
          data[key] = '0' + data[key];
        }
      });
      return data;
    }

    beforeDestroy() {
      this.handleClear();
    }

    handleClear() {
      if (this.countdown && this.countdown.abort) {
        this.countdown && this.countdown.abort();
      }
    }

    @Watch('duration', { immediate: true })
    onDurationChange(duration) {
      this.handleClear();
      const onTick = secondsLeft => {
        this.secondsLeft = secondsLeft;
        this.$emit('change', this.time);
      };
      const onComplete = () => {
        this.secondsLeft = 0;
        this.$emit('completed');
      };
      this.countdown = countdown(duration, onTick, onComplete);
    }
  }
</script>

<style lang="scss" scoped>
  .countdown {
    display: none;
  }
</style>
