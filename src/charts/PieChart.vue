<template>
  <div id="chart-demo-pie">
    <ParaterizedSlot :Column="Column" @modelChanged="$emit('setObject', $event)"/>
    <div v-if="editMod" id="axis"  class="drop-zone border-chart" @drop="onDrop($event,0)">
      <div id="axis" >
        <td class="data-widgets" v-for="item in mainAxis" :key="item.id">
          <div class="data-widgets-icon" :draggable="true" @dragstart="drag($event, item)">{{item.title}}</div>
        </td>
      </div>
    </div>
    <div style="overflow:hidden;">
        <div v-if="editMod" id="y-axis"  @drop="onDrop($event,1)">
          <td class="data-widgets" v-for="item in yAxis" :key="item.id">
            <div class="data-widgets-icon"  :draggable="true" @dragstart="drag($event, item)">{{item.title}}</div>
          </td>
          <p style="text-align:center;position:relative;top:45%" v-if="!yAxis.length">y-axis</p>
        </div>
        <div class="renderChart" style="overflow:auto">
          <Pie
            :chart-options="chartOptions"
            :chart-data="dataChart"
            :chart-id="chartId"
            :dataset-id-key="datasetIdKey"
            :plugins="plugins"
            :css-classes="cssClasses"
            :styles="styles"
            :width="width"
          />
        </div>
    </div>
      <div v-if="editMod" id="x-axis" class="drop-zone border-chart" @drop="onDrop($event,2)">
        <td class="data-widgets" v-for="item in xAxis" :key="item.id">
            <div class="data-widgets-icon"  :draggable="true" @dragstart="drag($event, item)">{{item.title}}</div>
        </td>
        <p style="position:relative;left:50%" v-if="!xAxis.length">x-axis</p>
      </div>
  </div>
</template>
<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale,  } from 'chart.js'
import ParaterizedSlot from '../components/ParameterizedSlot.vue'
import ChartJSPluginDatalabels from 'chartjs-plugin-datalabels'
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, ChartJSPluginDatalabels)

export default {
  components : {Pie, ParaterizedSlot},
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    chartId: {
      type: String,
      default: 'pie-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Object,
      default: () => {}
    },
    column: Object,
  },
  emits:['editModeChanged'],
  data() {
    return {
      backgroundColor: ['#3366CC','#DC3912','#FF9900','#109618','#990099','#3B3EAC','#0099C6','#DD4477','#66AA00','#B82E2E','#316395','#994499','#22AA99','#AAAA11','#6633CC','#E67300','#8B0707','#329262','#5574A6','#3B3EAC'],
      //borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
      editMod: false,
      items: this.column.items ? this.column.items : [],
      Column: this.column
    };
  },

  computed: {
    mainAxis() {
      return this.items.filter((item) => item.list === 0)
    },
    yAxis() {
      return this.items.filter((item) => item.list === 1)
    },
    xAxis() {
      return this.items.filter((item) => item.list === 2)
    },
    dataChart: function () {
      let chartData =  {
        datasets: [],
        labels: []
      };
      chartData.labels = (this.Column.data !== undefined && this.xAxis[0]) ? this.Column.data.map(a => a[this.xAxis[0].title]) : [];
      this.yAxis.forEach((y, i) => {
        let updatedData =[];
        let tempDateCollection =[];
        if(this.xAxis[0]){
          this.Column.data.map((yData)=> {
            if(tempDateCollection.includes(yData[this.xAxis[0].title])){
              const index = tempDateCollection.indexOf(yData[this.xAxis[0].title]);
              const element = updatedData[index];
              updatedData[index] = {...element, y: element[yData[y.title]] + yData[yData[y.title]]}
            }
            else{
              tempDateCollection.push(yData[this.xAxis[0].title]);
              updatedData.push(yData);
            }
          })
        }
        chartData.labels = (updatedData !== undefined && this.xAxis[0]) ? updatedData.map(a => a[this.xAxis[0].title]) : [];
        let dataSet = {
          label : (this.yAxis[i].label !== undefined) ? this.yAxis[i].label : this.yAxis[i].title,
          backgroundColor : this.backgroundColor,
          borderWidth : 1,
          data: updatedData.map(a => a[y.title])
        }
        chartData.datasets.push(dataSet)
      })
      return chartData
    },
    chartOptions: function () {
      let options = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: this.Column.title,
            },
            legend: {
              display: this.Column.showLegend
            },
            datalabels: {
              backgroundColor: function(context) {
                return context.dataset.backgroundColor;
              },
              borderColor: 'white',
              borderRadius: 25,
              borderWidth: 2,
              color: 'white',
              anchor: 'end',
              display: 'auto',
              font: {
                weight: 'bold'
              },
              padding: 6,
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                    sum += data;
                });
                let percentage = (value*100 / sum).toFixed(2)+"%";
                return percentage;
              },
            },
          },
        }
        return options
    }
  },

  watch:{
    column: {
        handler(val){
          this.Column = val
          this.items = val.items
        },
        deep: true  //provides initial (not changed yet) state
    },
    editMode: {
        handler(val){
          this.editMod = val
        },
        deep: true
    },
  },

  methods: {
    drag(ev, item) {
      ev.dataTransfer.setData("axis", item.id);
    },
    onDrop (evt, list) {
        if(evt.dataTransfer.getData('buckettype')){
            return
        }
        const itemID = evt.dataTransfer.getData('axis')
        const item = this.items.find((item) => item.id == itemID)
        item.list = list
        this.$emit('setObject',{type : 'items', objects : this.items})
    },
  }
};
</script>
<style scoped>
#chart-demo-pie{
  background: initial;
  position: relative;
}
</style>
