<template>
  <div class="editor">
    <Panel v-if="this.store.role === 'admin'"/>
    <Preview/>
  </div>
</template>

<script>
import Panel from './Panel.vue'
import Preview from './Preview.vue'
import { useAuthUserStore } from '../store/index'
export default {
  name: 'Editor',
  components: {
    Panel,
    Preview,
  },
  data(){
    return{
      store: useAuthUserStore(),
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editor{
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  padding-top: 60px;
}
</style>
