<template>
  <img src="../assets/excel_export.png"
       class="excel-export-icon scale-on-hover pointer-on-hover"
       @click="exportTable"/>
  <div :id="pivotTableID"></div>
</template>
<script setup>
import {defineProps, defineEmits, onMounted, watch} from 'vue'
import TableToExcel from "@linways/table-to-excel"
// Import order is important for jquery and jquery-ui. Also, these specifit imports for jquery-ui are needed to be imported like here for pivottable to work.
import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui/ui/widgets/sortable'
import 'pivottable'
import 'pivottable/dist/pivot.css'
import {setConditionalFormatting} from "@/utils/conditionalFormatting"
const props = defineProps([
  'data',
  'columnID',
  'cellId',
  'tableConfiguration',
  'conditionalFormatting',
  'editMode',
  'backgroundColor',
  'showRowTotal',
  'showRowGrandTotal',
  'showColumnGrandTotal',
])
const emit = defineEmits(['setObject'])
const pivotTableID = 'pivot-table-' + props.columnID + props.cellId
const pivotTableSelector = `#${pivotTableID}`
let pivotConfig = {}
let configLoaded = false
onMounted(() => {
  if(props.tableConfiguration) {
    pivotConfig = props.tableConfiguration
  }
  renderTable()
})
watch(() => props.conditionalFormatting, () => {
      renderTable()
    },
    {deep: true})
watch([
  () => props.editMode,
  () => props.columnID,
  () => props.cellId,
  () => props.data,
  () => props.showRowGrandTotal,
  () => props.showColumnGrandTotal,
  () => props.backgroundColor,
], () => {
  if(!configLoaded) {
    return
  }
  renderTable()
})
function renderTable() {
  if (!props.data) {
    return
  }
  $(pivotTableSelector).pivotUI(
      props.data || {},
      {
        ...pivotConfig,
        showUI: props.editMode,
        onRefresh: function () {
          let config = $(pivotTableSelector).data("pivotUIOptions")
          delete config["aggregators"]
          delete config["renderers"]
          delete config['showUI']
          pivotConfig = config
          emit('setObject', {type : 'x_data', objects : pivotConfig})
          configLoaded = true
          if (props.backgroundColor) {
            $(`${pivotTableSelector} .pvtAxisContainer,
            ${pivotTableSelector} .pvtVals,
            ${pivotTableSelector} .pvtUi,
            ${pivotTableSelector} th,
            ${pivotTableSelector} td
            `).css('background-color', props.backgroundColor)
          }
          toggleFieldVisible('.colTotal', props.showColumnGrandTotal)
          toggleFieldVisible('.rowTotal', props.showRowGrandTotal)
          toggleFieldVisible('.pvtColTotalLabel', props.showColumnGrandTotal)
          toggleFieldVisible('.pvtRowTotalLabel', props.showRowGrandTotal)
          toggleFieldVisible('.pvtGrandTotal', props.showRowGrandTotal && props.showColumnGrandTotal)
          toggleFieldVisible('.pvtRows li', props.showRowFields)
          // Disable selecting renderer, set it to table.
          const selectRendererElement = $(`${pivotTableSelector} .pvtRenderer`);
          if(selectRendererElement.length > 0) {
            selectRendererElement.parent()[0].innerHTML = 'Table';
          }
          setConditionalFormatting($(pivotTableSelector).find('.pvtVal, .pvtTotal'), props.conditionalFormatting)
        },
        rendererOptions: {
          rowTotals: props.showRowGrandTotal,
          colTotals: props.showColumnGrandTotal,
          // Example for custom heatmap values and colors. Other scales can be used from d3.
          // d3 first needs to be installed as a package to use this. I deleted it from dependencies because it's not used currently.
          // heatmap: {
          //   colorScaleGenerator: function() {
          //     return d3.scaleLinear()
          //         .domain([0, 15, 35])
          //         .range(["#ABEBC6", "#F4D03F", "#D35400 "])
          //   }
          // }
        }
      },
      true
  )
}
function toggleFieldVisible(elementSelector, value) {
  // Explicit false because field can be empty and that is default (true) value
  $(`${pivotTableSelector} ${elementSelector}`).css('display', value !== false ? '' : 'none')
}
function exportTable() {
  if ($(`${pivotTableSelector} table.pvtTable`).length == 0) {
    return
  }
  TableToExcel.convert($(`${pivotTableSelector} table.pvtTable`)[0], {
    name: "CrossTab.xlsx"
  })
}
</script>
<style scoped>
.excel-export-icon {
  height: 20px;
}

</style>
<style>
table.pvtTable thead tr th,
table.pvtTable tbody tr th,
table.pvtTable {
  font-size: unset;
  width: -moz-available;
  /*table-layout: fixed; 
  width: 100%;*/
}
.pvtUi{
  width: -moz-available;
}
.pointer-on-hover {
  cursor: pointer;
}
.pvtAxisContainer, .pvtVals, .pvtUiCell{
  border: 1px solid #ddd;
  height: 30px;
}
.pvtAxisContainer li{
  padding: 10px 2px;
}
.pvtAxisContainer li span.pvtAttr{
  background-color: #fff;
  margin-bottom: 4px;
  border: 1px solid #ddd;
  padding: 7px 10px;
}
table.pvtTable thead tr th, table.pvtTable tbody tr th{
  background-color: #f8f8f8;
}
.pvtAggregator{
  background: white;
  border-radius: 7px;
  height: 28px;
  border: 2px solid #ddd;
}
.pvtRowLabel {
  color: #a7a7a7;
}
.pvtColLabel {
  color: #a7a7a7;
}
th{
  height: 21px;
}
.pvtFilterBox input[type="checkbox"] {
  margin-right: 10px;
  margin-left: 10px;
  background: unset;
  display: unset;
  width: unset;
  border-width: unset;
}
.pvtFilterBox input[type="text"] {
  border-width: revert;
  display: unset;
}
</style>