<template>
  <div @drop="onDrop($event)" class="pivot" :class="{ 'pivot-resize-center': !props.column.data }">
    <ParaterizedSlot :Column="props.column" @modelChanged="$emit('setObject', $event)"/>
    <PivotTableJS
        v-if="props.column.data"
        :data="props.column.data"
        :columnID="props.column.id"
        :cellId="props.cellId"
        :conditional-formatting="props.column.conditionals"
        :table-configuration="props.column.x_data"
        :edit-mode="editMode"
        :show-row-grand-total="props.column.showRowGrandTotal"
        :show-column-grand-total="props.column.showColumnGrandTotal"
        :background-color="props.column.backgroundColor"
        :show-column-fields="props.column.showColumnFields"
        :show-filter-fields="props.column.showFilterFields"
        :show-row-fields="props.column.showRowFields"
        @setObject="emit('setObject',$event)"
    />
  </div>
</template>
<script setup>
import DataService from '../services/data.services'
import PivotTableJS from './PivotTableJS';
import ParaterizedSlot from '../components/ParameterizedSlot.vue'

import { defineProps, defineEmits, ref, watch} from 'vue';
const props = defineProps(['column', 'data', 'cellId', 'duljina', 'editMode'])
const emit = defineEmits(['setData', 'setxData', 'setSql', 'setParameters']);
const editMode = ref(false);
const loading = ref(false);
const msg = ref('');
const showModal = ref(false);
watch(() => props.editMode, (value) => {
  editMode.value = value;
})
function onDrop(evt) {
  if (evt.dataTransfer.getData('widgettype')) {
    return
  }
  const id = evt.dataTransfer.getData('buckettype');
  loading.value = true
  DataService.visualizeComponent(id).then(
      (res) => {
        const data = res.dataTable;
        const objects = [];
        for (const key in data[0]) {
          objects.push(key)
        }
        const test = [];
        for (const key in objects) {
          test.push({caption: objects[key], dataField: objects[key], area: 'filter'});
        }
        loading.value = false
        emit('setObject',{type : 'data', objects : data})
        emit('setObject',{type : 'x_data', objects : test})
      },
      error => {
        loading.value = false
        console.log(error);
        msg.value = "Something went wrong. Please try again"
        showModal.value = true
      }
  );
}
watch(() => viewerValue => {
      editMode.value = viewerValue;
    },
    {immediate: true})
</script>
<style scoped>
.pivot {
  overflow: auto;
}
.pivot-resize-center {
  min-height: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>