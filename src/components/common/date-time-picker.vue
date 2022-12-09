<template>
  <picker class="picker"
    mode="multiSelector"
    :range="range"
    :value="pickValue"
    :disabled="disabled"
    @change="handleChange"
    @columnchange="handleColumnchange">
    <slot />
  </picker>
</template>

<script>
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import dayjs from 'dayjs';

  const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
  dayjs.extend(isSameOrAfter);
  const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
  dayjs.extend(isSameOrBefore);

  const months = [];
  const days31 = [];
  const days30 = [];
  const days29 = [];
  const days28 = [];
  const hours = [];
  const minutes = [];
  const seconds = [];

  const monthDays31 = [1, 3, 5, 7, 8, 10, 12];
  const monthdays30 = [4, 6, 9, 11];

  const config = {
    months: { list: months, len: 12, unit: '月' },
    days31: { list: days31, len: 31, unit: '日' },
    days30: { list: days30, len: 30, unit: '日' },
    days29: { list: days29, len: 29, unit: '日' },
    days28: { list: days28, len: 28, unit: '日' },
    hours: { list: hours, len: 24, start: 0, unit: '时' },
    minutes: { list: minutes, len: 60, start: 0, unit: '分' },
    seconds: { list: seconds, len: 60, start: 0, unit: '秒' }
  };

  for (const key in config) {
    const { list, len, start, unit } = config[key];
    for (let i = 0; i < len; i++) {
      let v = start === 0 ? i : i + 1;
      if (v < 10) {
        v = `0${v}`;
      }
      list.push(v + unit);
    }
  }

  @Component
  export default class DateTimePicker extends Vue {
    // 小程序传递Date dayjs会有问题
    @Prop({ type: String }) value
    @Prop({ type: String, default: 'YYYY-MM-DD HH:mm' }) format
    @Prop({ type: String, default: 'minute' }) fields // 粒度 hour minute second
    @Prop({ type: String, default: '1970-01-01 00:00:01' }) start // 开始日期
    @Prop({ type: String,  default: '2099-12-31 23:59:59' }) end // 结束日期
    @Prop(Boolean) disabled

    fieldsMap = {
      hour: {
        range: [hours],
        config: ['HH']
      },
      minute: {
        range: [hours, minutes],
        config: ['HH', 'mm']
      },
      second: {
        range: [hours, minutes, seconds],
        config: ['HH', 'mm', 'ss']
      },
    }

    rangeConfig = ['YYYY', 'MM', 'DD']
    range = [months, days31]
    pickValue = []

    lastMonthdays = [] // 记录上一次选的月

    created() {
      // 填充年
      let start = dayjs(this.start || new Date()).year();
      const end = dayjs(this.end || new Date()).year();
      const years = [`${start}年`];
      while (start < end) {
        start += 1;
        years.push(`${start}年`);
      }
      this.range.unshift(years);
      const { range, config } = this.fieldsMap[this.fields];
      this.range.push(...range);
      this.rangeConfig.push(...config);
      this.updatePicker();
    }

    updatePicker() {
      // 更新时间
      const dateTime = dayjs(this.value || new Date());
      const pickValue = this.rangeConfig.map((v, i) => {
        const value = dateTime.format(v);
        return this.range[i].findIndex(item => parseInt(item) === parseInt(value));
      });
      this.pickValue = pickValue;
      this.setDays();
    }

    async handleColumnchange(e) {
      const { column, value } = e.detail;
      const pickValue = [...this.pickValue];
      pickValue[column] = value;
      this.pickValue.forEach((v, i) => {
        if (i > column) {
          pickValue[i] = 0;
        }
      });
      const lastPickValue = [...this.pickValue];
      // pickValue改变才能触发回滚
      this.pickValue = pickValue;
      const dateTime = this.getDateTime(pickValue);
      // between 不能判断相等
      if (!dateTime.isSameOrAfter(this.start, this.fields) || !dateTime.isSameOrBefore(this.end, this.fields)) {
        // $nextTick 无法完全回到上次的点(会出现可能年月日变了，时分秒没有变)
        await this.$sleep(50);
        return this.pickValue = lastPickValue;
      }
      if ([0, 1].includes(column)) {
        this.setDays();
      }
    }

    setDays() {
      const year = parseInt(this.range[0][this.pickValue[0]]);
      const month = parseInt(this.range[1][this.pickValue[1]]);
      // 使用dayjs判断闰月 需要引入一个插件 这里就直接判断
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      // 不是二月情况下 判断上次选择 减少不必要的更新
      if (month !== 2 && this.lastMonthdays.includes(month)) {
        return;
      }
      let days = [];
      if (monthDays31.includes(month)) {
        days = days31;
        this.lastMonthdays = monthDays31;
      } else if (monthdays30.includes(month)) {
        days = days30;
        this.lastMonthdays = monthdays30;
      } else {
        days = isLeapYear ? days29 : days28;
      }
      this.range[2] = days;
    }

    getDateTime(pickValue) {
      const dateTimes = pickValue.map((v, i) => {
        let item = parseInt(this.range[i][v]);
        return item += i < 2 ? '-' : ':';
      });
      return dayjs(dateTimes.join(''));
    }

    async handleChange() {
      const text = this.getDateTime(this.pickValue).format(this.format);
      this.$emit('input', text);
      this.$emit('change', text);
    }
  }
</script>

<style lang='scss' scoped>
  .picker {
    width: 100%;
    height: 100%;
  }
</style>
