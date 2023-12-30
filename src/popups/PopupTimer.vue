<template>
  <loading v-if="loading"/>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" style="margin:0px">
      <div class="modal-wrapper">
        <div class="modal-container" style="width:400px">
          <div class="modal-up">
            <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin: 0 -5px;padding: 0 5px;font-size:15px">
                <h2 style="margin:15px;">Timer</h2>
            </div>
            <a class="close" @click="$emit('close')" style="top:13px"/>
          </div>
          <div class="modal-content">
            <p v-if="date" style="font-size:12px; float:right">Data shown are as of: {{date}} </p>
            <p>Set refresh frequency: </p>
                  <div style="display:flex;padding:5px;justify-content:center">
                    <div @click="(selected == '1') ? selected = '' : selected = '1'" class="circle" :class="{ 'change': (selected === '1')}">
                        <div style="font: 25px Arial, sans-serif;">1</div>
                        <div style="font: 10px Arial, sans-serif;margin-top:-5px">min</div>
                    </div>
                    <div @click="(selected == '5') ? selected = '' : selected = '5'" class="circle" :class="{ 'change': (selected === '5')}">
                        <div style="font: 25px Arial, sans-serif;">5</div>
                        <div style="font: 10px Arial, sans-serif;margin-top:-5px">min</div>
                    </div>
                    <div @click="(selected == '30') ? selected = '' : selected = '30'" class="circle" :class="{ 'change': (selected === '30')}">
                        <div style="font: 25px Arial, sans-serif;">30</div>
                        <div style="font: 10px Arial, sans-serif;margin-top:-5px">min</div>
                    </div>
                    <div @click="(selected == '60') ? selected = '' : selected = '60'" class="circle" :class="{ 'change': (selected === '60')}">
                        <div style="font: 25px Arial, sans-serif;">60</div>
                        <div style="font: 10px Arial, sans-serif;margin-top:-5px">min</div>
                    </div>
                </div>
                <div>
                    <p>Custom timer:</p>
                    <input class="input-website" :disabled="!(selected === '')" v-model="customTime" placeholder="e.g. 40min"/>
                </div>
            </div>
            <div class="modal-footer" style="padding:15px;display:flex">
              <slot name="footer">
                <button
                  :disabled="!(selected || customTime)"
                  class="button-original green scale-on-hover" style="margin-left:unset"
                  @click="$emit('close'); addTimer()"
                >Turn On
                </button>
                <button
                  :disabled="!(timer)"
                  class="button-original red scale-on-hover"
                  @click="$emit('close'); reset()"
                >Turn Off
                </button>
              </slot>
            </div>

        </div>
      </div>
    </div>
  </Transition>
</template>


<script>
import DataService from '../services/data.services'
import { useAuthUserStore } from '../store/index'
export default {
  props: {
    show: Boolean,
  },
  emits: ['close'],
  data(){
    return{
      selected: '',
      customTime: '',
      loading: false,
      myTimeout: '',
      timer:null,
      showIndicator: true,
      date: '',
      store: useAuthUserStore(),
    }
  },
  watch:{
    "store.viewer_timer": {
        handler: function(nv) {
            if(nv === false){
              this.reset()
            }
        },
        immediate: true // provides initial (not changed yet) state
    },
    $route (){
        this.reset()
    }
  }, 
  created(){
    //console.log(this.store.viewer_timer)
    if(this.store.viewer_timer){
      this.start(this.store.viewer_timer)
    }
  },
  methods: {
    addTimer(){
      this.store.set_reportTimer((this.selected ? this.selected : this.customTime))
      this.start((this.selected ? this.selected : this.customTime))
    },
    start (time) {
      if (!this.timer) {
        this.timer = setInterval( () => {
          this.loading = true
          if(this.store.report_id.length != 64){
            DataService.getReport(this.store.report_id).then(
              (res) => {
                this.date = new Date();
                this.store.set_reportContent(JSON.parse(res[0].content));
              },
              error => {
                console.log(error);
              }
            );
          }
          else{
            DataService.getFrame(this.store.report_id).then(
              (res) => {
                this.date = new Date();
                this.store.set_reportContent(JSON.parse(res[0].content));
              },
              error => {
                console.log(error);
              }
            );
          }
          this.myTimeout = setTimeout(() => {
            this.loading = false;
          }, 2000);
          //this.start()
				}, time * 60 * 1000 )
      }
    },
    reset(){
      this.store.set_reportTimer(false)
      clearInterval(this.timer)
			this.timer = null
      this.selected = ''
      this.customTime = ''
    },
  }
}
</script>