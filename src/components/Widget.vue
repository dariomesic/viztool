<template>
    <div
      class='img-with-text scale-on-hover'
      draggable='true'
      @dragstart="startDrag($event, widget)"
    >
      <img :src="require(`@/assets/${widget.src}`)" style="width:50px;height:50px">
      <p>{{ widget.text.match(/[A-Z][a-z]+|[0-9]+/g).join(" ") }}</p>
    </div>
</template>

<script>
export default {
  props:['widget','draggable'],
  methods: {
    startDrag (evt, widget) {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('widgetType', widget.text)
    }
  }
}
</script>

<style scoped>
.img-with-text {
    width: 50px;
    padding-left:26px;
    text-align:center
}

.img-with-text img {
    display: block;
    margin: 0 auto;
}
img {
  pointer-events: none
}
</style>