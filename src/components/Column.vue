<template>
    <div @drop="onDrop($event)" class="hover"  
        :class="{ 'borderless': (!admin_viewer || this.store.role === 'viewer'), 'box-h' : this.store.role === 'admin' && admin_viewer && !(column.data || column.name || column.text === 'Text') }" :id="widgetID" 
        :style="['min-height:460px; flex: 1;display:grid', 
                ((this.store.role === 'admin' && admin_viewer) ? {'box-shadow' : '0 0 10px rgba(0, 0, 0, 0.6)', 'border-radius' : '15px'} : {'box-shadow': 'none', 'min-height':'0px'}),
                (((column.backgroundColor === undefined || column.backgroundColor === '')) ? {'background' : ''} : {'background': column.backgroundColor})
                ]" >
        <!-- <div v-if="!column.text && this.store.role === 'admin' && admin_viewer">
              <h2 style="position: absolute;top: 45%;left: 50%;transform: translate(-50%, -50%);text-align:center">Drag widget element to start working on your component</h2>
        </div> -->
        <div v-if="this.store.role === 'admin' && admin_viewer">
            <h2>{{ column.text }}</h2>
        </div>
        <div v-if="styleMode && admin_viewer">
            <component :is="column.text+'Style'" 
              :column="column"
              :styleMode="editMode"
              @setObject="saveObjects"
              >
            </component>
        </div>

        <component
          :is="column.text"
          :cellId="cellId"
          :column="column"
          :editMode="editMode" @editModeChanged="this.editMode = $event" 
          :styleMode="styleMode"
          @setObject="saveObjects"
        />

        <div class="topright" v-if="this.store.role === 'admin' && admin_viewer">
            <nav>
              <div @click="$emit('leftColumn', column.id)" class="menuicon-button">
                  <div class="tooltip">
                      <button style="border:none;background:none;cursor:pointer" class="scale-on-hover">
                          <span class="tooltiptext">Move column left</span>
                          <div style="font-size:25px;margin-top: -10px;">&larr;</div>
                      </button>
                  </div>
              </div>
              <div @click="$emit('rightColumn', column.id)" class="menuicon-button">
                  <div class="tooltip">
                      <button style="border:none;background:none;cursor:pointer" class="scale-on-hover">
                          <span class="tooltiptext">Move column right</span>
                          <div style="font-size:25px;margin-top: -10px;">&rarr;</div>
                      </button>
                  </div>
              </div>
              <div @click="enableEditMode()" class="menuicon-button">
                  <div class="tooltip">
                      <button style="border:none;background:none;cursor:pointer" class="scale-on-hover">
                          <span class="tooltiptext">Edit mode</span>
                          <div style="font-size:25px;margin-top: -10px;">&#x270e;</div>
                      </button>
                  </div>
              </div>
              <div class="menuicon-button" @click="copyToClibBoard()">
                  <div class="tooltip">
                      <button style="border:none;background:none;cursor:pointer" @mouseout="outFunc()" id="button-copy" class="scale-on-hover">
                          <span class="tooltiptext" :id="'myTooltip' + cellId + column.id">Copy to clipboard</span>
                          <div style="font-size:30px;margin-top: -10px;">&#x2398;</div>
                      </button>
                  </div>
              </div>
              <div @click="paste()" class="menuicon-button">
                  <div class="tooltip">
                      <button style="border:none;background:none;cursor:pointer" class="scale-on-hover">
                          <span class="tooltiptext">Paste</span>
                          <img :src="require(`@/assets/drop.png`)" style="width:25px;height:25px">
                      </button>
                  </div>
              </div>
              <div @click="$emit('removeColumn', column.id)" class="menuicon-button">
                  <div class="tooltip">
                      <button style="border:none;background:none;cursor:pointer" class="scale-on-hover">
                          <span class="tooltiptext">Remove</span>
                          <img :src="require(`@/assets/garbage.png`)" style="width:25px;height:25px">
                      </button>
                  </div>
              </div>
            </nav>
        
        </div>
        <button @click="$emit('addColumn', {cellId: cellId, columnId: column.id})" class="style-four" v-if="this.store.role === 'admin' && admin_viewer">+</button>
        <Teleport to="body">
          <loading v-if="loading"/>
        </Teleport>
    </div>
</template>

<script>
import Image from '../charts/Image.vue'
import Text from '../charts/Text.vue'
import AreaChart from '../charts/AreaChart.vue'
import LineChart from '../charts/LineChart.vue'
import PieChart from '../charts/PieChart.vue'
import PivotGrid from '../charts/PivotGrid.vue'
import ListView from '../charts/ListView.vue'
import Table from '../charts/Table.vue'
import ScatterPlot from '../charts/ScatterPlot.vue'
import GeoMap from '../charts/GeoMap.vue'
import BarChart from '../charts/BarChart.vue'
import RadarChart from '../charts/RadarChart'

import AreaChartStyle from '../styles/AreaChartStyle.vue'
import LineChartStyle from '../styles/LineChartStyle.vue'
import BarChartStyle from '../styles/BarChartStyle.vue'
import RadarChartStyle from '../styles/RadarChartStyle.vue'
import PieChartStyle from '../styles/PieChartStyle.vue'
import ScatterPlotStyle from '../styles/ScatterPlotStyle.vue'
import PivotGridStyle from '../styles/PivotGridStyle.vue'
import TableStyle from '../styles/TableStyle.vue'
import ImageStyle from '../styles/ImageStyle.vue'
import ListViewStyle from '../styles/ListViewStyle.vue'

import DataService from '../services/data.services'
import { useAuthUserStore } from '../store/index'
export default {
  props: {
    column: {
      type: Object,
      required: true
    },
    cellId: Number,
    duljina: Number
  },
  emits: ['sql','allowDeletion','setAllowDeletion','setObject', 'addColumn', 'removeColumn'],
  components:{Image,Text,AreaChart,LineChart,PieChart,ScatterPlotStyle,PivotGrid,ListView,Table,AreaChartStyle,LineChartStyle,BarChartStyle,RadarChartStyle,PieChartStyle,PivotGridStyle,TableStyle,ImageStyle,ListViewStyle, BarChart, ScatterPlot, GeoMap, RadarChart},
  data(){
    return{
      styleMode: false,
      editMode: false,
      widgetID: "cell:" + this.cellId + "column:" + this.column.id,
      backgroundColor: '',
      palette: '',
      title: '',
      tableType:'',
      sirina_prozora: this.duljina < 4 ? this.duljina : 3,
      admin_viewer: false,
      loading: false,
      store: useAuthUserStore(),
    }
  },
  computed:{
    columns: function () {
      console.log(this.column)
      return this.column
    }
  },
  created(){
      document.addEventListener('mouseup', function (e) {
          let container = document.getElementById(this.widgetID);
          if (container && !container.contains(e.target) && this.store.role === 'admin' && this.admin_viewer) {
              container.style.border = "none"
              this.editMode = false
              this.styleMode = false
          }
      }.bind(this));
  },
  watch:{
    duljina(){
      this.sirina_prozora = this.duljina < 4 ? this.duljina : 3
    },
    "store.admin_viewer": {
        handler: function(nv) {
            this.admin_viewer = nv
            if(!nv && this.store.role === 'admin'){
              document.getElementById(this.widgetID).style.border = ""
            }
        },
        immediate: true // provides initial (not changed yet) state
    }
  },
  methods: {
    enableEditMode(){
      let container = document.getElementById(this.widgetID);
      if (container && this.column.data != "" ){
        this.editMode = true
        this.styleMode = true
        container.style.border = "3px solid #1a6e4d"
      }
    },

    paste(){
      if(window.localStorage.getItem('copy')){
        this.$emit('paste',{content: JSON.parse(window.localStorage.getItem('copy')),id_cell: this.cellId, id_column: this.column.id})
      }
    },

    copyToClibBoard(){
        window.localStorage.setItem('copy',JSON.stringify(this.column))
    
        var tooltip = document.getElementById("myTooltip" + this.cellId + this.column.id);
        tooltip.innerHTML = "Copied"
    },

    outFunc() {
        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "Copy to clipboard";
    },


    onDrop (evt) {
        if(evt.dataTransfer.getData('axis') || evt.dataTransfer.getData('widgettype')){
          return
        }
        this.loading = true
        var id = evt.dataTransfer.getData('buckettype');
      /* LOCAL FILE !!!!*/
        if(isNaN(id)){
          let data = JSON.parse(id)
          this.saveObjects({type:'data', objects:data, special: true})
          return
          /* */
        }
        DataService.visualizeComponent(id).then(
            (res) => {
              if(res.stringParameters){
                  let parameters = JSON.parse(res.stringParameters)
                  for(var i = 0 ; i < parameters.length ; i++){
                    parameters[i].Options = parameters[i].DefaultValue
                  }
                  this.saveObjects({type:'parameters', objects: parameters})
                  this.saveObjects({type:'sql', objects: res.sqlStatement})
              }
              this.saveObjects({type:'data', objects: res.dataTable, special: true})
            },
            error => {
              console.log(error);
              this.loading = false
            },
        );
    },

    saveObjects({type, objects, special}){
      this.$emit('setObject',{type : type, objects : objects, id_cell: this.cellId, id_column: this.column.id})
      if(special){
        let items = []
        let br = 0
        for(const key in objects[0]){
            const object = 
            {
              id: br++,
              title: key,
              list: 0,
            }
            items.push(object)
        }
        this.$emit('setObject',{type : 'items', objects : items, id_cell: this.cellId, id_column: this.column.id})
        this.editMode = true
        this.styleMode = true
        document.getElementById(this.widgetID).style.border = "3px solid #1a6e4d"
        this.loading = false
      }
    }
	},


}
</script>

<style scoped>
.borderless{
  background: inherit;
}

.topright {
  display: none;
  position: absolute;
  top: 0px;
  right: 16px;
  font-size: 26px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.15),0 2px 2px rgba(0,0,0,0.15),0 4px 4px rgba(0,0,0,0.15),0 8px 8px rgba(0,0,0,0.15);
  background: #FFF;
}

.menuicon-button {
  display: inline-block;
  position: relative;
  padding: 0.5rem 0.4rem;
  transition: 0.25s;
  user-select: none;
  opacity: .8;
}

/* BOX DOT ANIMATION */
.box-h { background-image: repeating-linear-gradient(0deg, #aaaaaa, #aaaaaa 10px, transparent 10px, transparent 20px, #aaaaaa 20px), repeating-linear-gradient(90deg, #aaaaaa, #aaaaaa 10px, transparent 10px, transparent 20px, #aaaaaa 20px), repeating-linear-gradient(180deg, #aaaaaa, #aaaaaa 10px, transparent 10px, transparent 20px, #aaaaaa 20px), repeating-linear-gradient(270deg, #aaaaaa, #aaaaaa 10px, transparent 10px, transparent 20px, #aaaaaa 20px); background-size: 3px calc(100% + 20px), calc(100% + 20px) 3px, 3px calc(100% + 20px) , calc(100% + 20px) 3px; background-position: 0 0, 0 0, 100% 0, 0 100%; background-repeat: no-repeat; animation: borderAnimation 1s infinite linear; }

@keyframes borderAnimation { from { background-position: 0 0, -20px 0, 100% -20px, 0 100%; } to { background-position: 0 -20px, 0 0, 100% 0, -20px 100%; } } 

</style>