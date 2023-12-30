<template>
  <Navbar/>
  <Editor/>
  <Teleport to="body">
  <!-- use the modal component, pass in the prop -->
    <popup :show="showModal" @close="showModal = false"/>
  </Teleport>
</template>

<script>
import Editor from '../components/Editor.vue'
import Navbar from '../components/Navbar.vue'
import Popup from '../popups/PopupCreate.vue'
import { useAuthUserStore } from '../store/index'
export default {
  name: 'Reports',
  components: {
    Editor,
    Navbar,
    Popup
  },
  data(){
    return{
      showModal: false,
      store: useAuthUserStore(),
    }
  },
  watch:{
    "store.report_name": {
          handler: function(nv) {
              if(nv === ''){
                this.showModal = true
              }
          },
          immediate: true // provides initial (not changed yet) state
      },
  },
  created(){
    this.showModal = !this.store.report_name
    window.onbeforeunload = function(){
      return "Are you sure you want to reload your page. Data will be saved, but content will be lost from your page."

    }
  },
}
</script>