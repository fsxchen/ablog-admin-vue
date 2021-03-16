<!--
 * @Author: yangxingchen
 * @Date: 2020-12-14 16:34:52
 * @LastEditors: yangxingchen
 * @LastEditTime: 2021-02-05 10:54:36
 * @Description:
-->
<template>
  <div id="main">
    <mavon-editor v-model="md" @change="contentChange" />
  </div>
</template>

<script>
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'MarkdownEditor',
  components: {
    'mavon-editor': mavonEditor.mavonEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      md: this.value
    }
  },
  computed: {},
  watch: {
    value: function(newVal, oldVal) {
      this.md = newVal // newVal即是chartData
    }
  },
  methods: {
    contentChange(md, html) {
      this.$emit('input', md)
      this.$emit('content_generate', html)
    }
  }
}
</script>
