<template>
  <div class='custom-form' :style="[getStyle(config.style.container)]">
    <input v-model.trim="form.name"
      placeholder="请输入姓名"
      class="custom-input"
      :style="[getStyle(config.style.input)]"
    />
    <input v-model.trim="form.mobile"
      placeholder="请输入联系电话"
      class="custom-input"
      :style="[getStyle(config.style.input)]"
    />
    <input v-model.trim="form.email"
      placeholder="请输入邮箱地址"
      class="custom-input"
      :style="[getStyle(config.style.input)]"
    />
    <textarea v-model.trim="form.message"
      placeholder="请输入内容"
      class="custom-textarea"
      :style="[getStyle(config.style.input)]"
    />
    <div class="submit-btn" :style="[getStyle(config.style.button)]" @click="handleSubmit">提交</div>
  </div>
</template>

<script>
  import { Vue, Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';
  import Schema from 'async-validator';
  import { request, alert } from '@/utils';

  @Component
  export default class CustomForm extends Mixins(CustomComponent) {
    @Prop(Object) config

    form = {
      name: '',
      mobile: '',
      email: '',
      message: ''
    }

    @Vue.autoLoading
    async handleSubmit() {
      const descriptor = {
        name: { required: true, message: '姓名不能为空' },
        mobile: { required: true, message: '联系电话不能为空' },
        email: { required: true, message: '邮箱地址不能为空' },
        message: { required: true, message: '内容不能为空' }
      };
      const validator = new Schema(descriptor);
      await validator.validate(this.form)
        .catch(({ errors }) => {
          throw new Error(errors.map(err => err.message).join('\n'));
        });

      await request.post('inqueries', this.form);
      alert('提交成功');
      Object.keys(this.form).forEach((key) => {
        this.form[key] = '';
      });
    }
  }
</script>

<style lang='scss' scoped>
  .custom-input,
  .custom-textarea {
    display: block;
    box-sizing: border-box;
    width: 100%;
    padding: 0 10px;
    margin-bottom: 10px;
    border: 1px solid #eee;
    border-radius: 8px;
  }

  .custom-input {
    height: 40px;
    line-height: 40px;
    background-color: #fff;
  }

  .custom-textarea {
    padding: 10px;
    background-color: #fff;
  }

  .submit-btn {
    height: 40px;
    border-radius: 8px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background-color: #007aff;
  }
</style>
