<template>
  <div>
    <span style="position:absolute;right:10px;top:10px;z-index:1;cursor:pointer" @click="showModalTimer = true">
      <a class="cursor-iframe" data-hover="Set timer">
        <img :src="require(`@/assets/timer.png`)" alt="" style="height: 50px;width: 50px;">
      </a>
      <p style="color:black;text-align:center">{{time ? millisToMinutesAndSeconds(time * 60 * 1000) : 'OFF'}}</p>
    </span>
    <Cell
        v-for="cell in cells"
        :key="cell.id"
        :cell="cell"
    />
    <Teleport to="body">
      <popup-timer :show="showModalTimer" @close="showModalTimer = false"/>
    </Teleport>
  </div>
</template>
<script>
import PopupTimer from '../popups/PopupTimer.vue'
import Cell from '../components/Cell.vue'
import DataService from '../services/data.services'
import { useAuthUserStore } from '../store/index'
export default {
  name: 'IFrame',
  components:{
    Cell, PopupTimer
  },
  data () {
    return {
      cells: [],
      showModalTimer: false,
      time: 0,
      store: useAuthUserStore(),
    }
  },
  watch:{
      "store.report_content": {
          handler: function(nv) {
              this.cells = nv
          },
          immediate: true // provides initial (not changed yet) state
      },
      "store.viewer_timer": {
          handler: function(nv) {
              this.time = nv
          },
          immediate: true // provides initial (not changed yet) state
      },
  },
  mounted(){
    this.store.set_editMode(false)
    let q = this.$router.currentRoute.value.query
    this.store.set_reportId(q.report);
    DataService.getFrame(q.report).then(
      (res) => {
        this.cells = JSON.parse(res[0].content)
      },
      error => {
        console.log(error);
      }
    );
  },
  methods:{
    millisToMinutesAndSeconds(millis) {
      var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + "min :" + (seconds < 10 ? '0' : '') + seconds + 's';
    }
  }
}
</script>
