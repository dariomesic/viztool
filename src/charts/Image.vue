<template>
  <div id="image-resize" :style="['text-align: center', 
                                 ((column.imagePosition) ? {'text-align' : column.imagePosition} : {'text-align' : 'center'})
                                 ]">
    <img :id="widgetID" style="max-width:100%;max-height:100%" :src="Column.data" /> 
  </div>
</template>

<script>
import { useAuthUserStore } from '../store/index'
 export default {
  props:['column', 'cellId'],
  data(){
    return{
      Column: this.column,
      widgetID: 'image'+this.column.id+this.cellId,
      store: useAuthUserStore(),
    }
  },
  watch:{
    column: {
        handler(val){
          this.Column = val
        },
        deep: true
    },
    "store.admin_viewer": {
        handler: function(nv) {
            if(!nv && (this.store.role === 'admin')){
              document.getElementById(this.widgetID).style.border = ""
            }
        },
        immediate: true // provides initial (not changed yet) state
      },
  },
 }
</script>
<style scoped>
#image-resize{
  /* overflow:scroll;
  resize:both; */
  height: 400px;
}
</style>