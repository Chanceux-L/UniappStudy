<template>
  <mp-html :content="content" :container-style="containerStyle" :tag-style="tagStyle" />
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator';
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html';

@Component({
  components: {
    'mp-html': mpHtml
  }
})
export default class RichText extends Vue {
  @Prop(String) content;

  containerStyle = 'font-size: 14px;overflow: hidden;line-height: 1.7; color: #404040;';
  tagStyle = {
    p: 'color: #404040; font-size: 15px; line-height: 1.8',
    img: 'max-width: 100%;',
    blockquote: 'color: rgba(0,0,0,0.5); padding-left: 10px; border-left: 3px solid #dbdbdb; color: rgba(0,0,0,0.5); font-size: 15px; padding-top: 4px; margin: 1em 0;'
  }
}
</script>
