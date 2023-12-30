<template>
  <div id="chart-demo-bar">
    <ParaterizedSlot :Column="Column" @modelChanged="$emit('setObject', $event)"/>
    <div v-if="editMod" id="axis" class="drop-zone border-chart" @drop="onDrop($event,0)">
      <div id="axis">
        <td class="data-widgets" v-for="item in mainAxis" :key="item.id">
          <div class="data-widgets-icon" :draggable="true" @dragstart="drag($event, item)">{{item.title}}</div>
        </td>
      </div>
    </div>
    <div style="overflow:hidden;">
        <div v-if="editMod" id="y-axis" @drop="onDrop($event,1)">
          <td class="data-widgets" v-for="item in yAxis" :key="item.id">
            <div class="data-widgets-icon"  :draggable="true" @dragstart="drag($event, item)">{{item.title}}</div>
          </td>
          <p style="text-align:center;position:relative;top:45%" v-if="!yAxis.length">y-axis</p>
        </div>
        <div class="renderChart" style="overflow:auto">
          <Line
            ref="area"
            id="area-test"
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
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler } from 'chart.js'
import ParaterizedSlot from '../components/ParameterizedSlot.vue'
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler)

export default {
  components : {Line, ParaterizedSlot},
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    chartId: {
      type: String,
      default: 'line-chart'
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
  emits:['editModeChanged', 'setObject'],
  data() {
    return {
      backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
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
          backgroundColor : (this.yAxis[i].color !== undefined) ? this.yAxis[i].color : this.backgroundColor[i],
          borderColor : (this.yAxis[i].border_color !== undefined) ? this.yAxis[i].border_color : this.borderColor[i],
          fill: true,
          pointStyle: (this.yAxis[i].point !== undefined) ? this.yAxis[i].point : 'circle',
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
          borderWidth : ((this.Column.lineWidth) !== undefined) ? Number(this.Column.lineWidth) : 1,
          plugins: {
            title: {
              display: true,
              text: this.Column.title,
            },
            legend: {
              display: this.Column.showLegend
            },
            datalabels: {
                display: false,
            },
          },
          scales: {}
        }
        this.Column.yAxisRange !== undefined ? options.scales = {y: {min: (this.Column.yAxisRange !== undefined) ? this.Column.yAxisRange[0] : '', max: (this.Column.yAxisRange !== undefined) ? this.Column.yAxisRange[1] : ''}} : ''
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
        this.$nextTick(() => {
          if (this.$refs.area.chart.config.data.datasets[0]){
            let values_max = []
            let values_min = []
            this.$refs.area.chart.config.data.datasets.forEach((y) => {
               values_max.push(Math.max(...y.data))
               values_min.push(Math.min(...y.data))
            })
            let range = {
              min: Math.min(...values_min),
              max: Math.max(...values_max),
            }
            this.$emit('setObject',{type : 'initialYAxisRange', objects : range})
          }
        })
    },
  },
};
</script>