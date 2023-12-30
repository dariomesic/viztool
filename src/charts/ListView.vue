<template>
  <div style="height:400px;overflow:scroll">
    <ParaterizedSlot :Column="Column" @modelChanged="$emit('setObject', $event)"/>
    <div v-if="editMod" id="axis"  class="drop-zone border-chart">
      <div id="axis" >
        <td class="data-widgets" v-for="object in Column.items" :key="object.id">
          <div class="data-widgets-icon" :draggable="true" @dragstart="drag($event, object.title)">{{object.title}}</div>
        </td>
      </div>
    </div>
    <ul style="padding:0;min-height:100px" @drop="onDrop($event)">
      <li v-for="(company, index) in dataLoaded" :key="index" class="list-item-content" @click="addFocus($event)">
        <div class="item-content">
          {{ company }}
        </div>
      </li>
    </ul>
    <div style="width:100%;text-align:center" v-show="Column.data">
      <button class="button-load-more scale-on-hover" @click="loadMore">Load</button>
    </div>
  </div>
</template>
<script>
import ParaterizedSlot from '../components/ParameterizedSlot.vue'

export default {
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    column: Object
  },
  components:{ParaterizedSlot},
  data() {
    return {
      Column: this.column,
      x_data : [],
      length: 9,
    };
  },
  computed: {
      dataLoaded() {
        return this.x_data.slice(0, this.length);
      },
    },
    watch:{
      editMode: {
          handler(val){
            this.editMod = val
          },
          deep: true
      },
      column:{
        handler(val){
          this.Column = val
        },
        deep:true,
      },
  },
  methods: {
    loadMore() {
      if (this.length > this.x_data.length) return;
      this.length = this.length + 9;
    },
    addFocus(evt){
      var tablinks = document.getElementsByClassName("list-item-content");
      for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("focused", "");
      }
      evt.currentTarget.className += " focused";
    },
    drag(ev, item) {
        ev.dataTransfer.setData("axis", item);
    },
    onDrop (evt) {
        if(evt.dataTransfer.getData('buckettype')){
            return
        }
        const item = evt.dataTransfer.getData('axis')
        this.x_data = []
        for(var i = 0 ; i < this.Column.data.length ; i++){
          this.x_data.push(this.Column.data[i][item])
        }

    },
  },
};
</script>