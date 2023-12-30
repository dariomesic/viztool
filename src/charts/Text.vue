<template>
  <div id="text-editor" class="text-editor">
    <quill-editor
      :id="textID"
      ref="quill"
      v-model:content="value"
      contentType="html"
      toolbar="full"
      @blur="onEditorBlur()"
    />
  </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useAuthUserStore } from '../store/index'
export default {
  emits:['setData'],
  props:['data','column','cellId'],
  components:{QuillEditor},
  data(){
    return{
      value: '',
      admin_viewer: false,
      textID: 'quillEditor'+this.column.id+this.cellId,
      store: useAuthUserStore(),
    }
  },
  watch:{
    column: {
        handler(val){
            const qe = this.$refs.quill
            qe.setHTML(val.data)
        },
        deep: true
    },
    "store.admin_viewer": {
        handler: function(nv) {
            this.admin_viewer = nv
            if(this.$refs.quill){
              const qe = this.$refs.quill
              const quill = qe.getQuill()
              let i = 0
              if(!this.admin_viewer){
                quill.disable()
                for(i = 0 ; i < document.getElementsByClassName("ql-toolbar").length ; i++){
                  document.getElementById(this.textID).style.minHeight = ""
                  document.getElementById(this.textID).style.height = "auto"
                  document.getElementById(this.textID).style.border = "none"
                  document.getElementsByClassName("ql-toolbar")[i].style.display = "none"//.tooltip.hide()
                }
              }
              else{
                quill.enable()
                for(i = 0 ; i < document.getElementsByClassName("ql-toolbar").length ; i++){
                  document.getElementById(this.textID).style.height = "350px"
                  document.getElementsByClassName("ql-toolbar")[i].style.display = ""//.tooltip.show()
                  document.getElementById(this.textID).style.border = "1px solid #d1d5db"
                }
              }
            }
        },
        immediate: true // provides initial (not changed yet) state
    }
  },
  mounted(){
    const qe = this.$refs.quill
    if((this.store.role === 'viewer') || !this.admin_viewer){
      const quill = qe.getQuill()
      quill.disable()
      document.getElementById(this.textID).style.minHeight = ""
      document.getElementById(this.textID).style.height = "auto"
      document.getElementById(this.textID).style.border = "none"
      document.getElementsByClassName("ql-toolbar")[document.getElementsByClassName("ql-toolbar").length - 1].style.display = "none"//.tooltip.hide()
    }
    else{
      document.getElementById(this.textID).style.minHeight = "300px"
    }
    qe.setHTML(this.column.data)
  },
  methods:{
    onEditorBlur() {
      const qe = this.$refs.quill
      this.$emit('setObject',{type : 'data', objects : qe.getHTML()})
      //this.$emit('setData',qe.getHTML())
      //console.log('editor blur!', quill)
    },

  }
}
</script>
<style scoped>
.text-editor{
  background: inherit;
  /* overflow: hidden;
  resize: horizontal; */
}
</style>