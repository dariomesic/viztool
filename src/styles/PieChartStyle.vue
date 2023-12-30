<template>
    <div class="sidebar">
        <transition name="slide">
            <div v-if="isBurgerActive" class="sidebar-panel">
              <a @click="zatvori" class="close"/>
                <li class="style-name">
                  <img :src="require(`@/assets/icon-pie-chart.png`)" style="width:25px;height:25px;margin-right:5px">
                  <h3>Pie Chart Settings</h3>
                </li>

                <div style="margin-top : 50px">
                  <div class="floating">
                    <input id="input__title" class="floating__input" name="title" type="text" placeholder="TITLE" v-model="title"/>
                    <label for="input__title" class="floating__label" data-content="TITLE"></label>
                  </div>

                  <div style="display:inline;position:relative">

                    <div class="floating">
                        <span @click="colorOptions = true" class="color" :style="'background:'+Column.backgroundColor" style="border:1px solid #bdbdbd"></span>
                        <input id="input__color" class="floating__input" name="title" type="text" placeholder="BACKGROUND COLOR" :value="Column.backgroundColor"  readonly/>
                        <label for="input__color" class="floating__label" data-content="BACKGROUND COLOR"></label>
                    </div>

                    <palette 
                        v-if="colorOptions"
                        :selected="Column.backgroundColor ? Column.backgroundColor : 'rgba(255, 255, 255, 0.99)'" 
                        @close="colorOptions = false"
                        @setColor="$emit('setObject',{type : 'backgroundColor', objects : $event})"
                    />


                  </div>

                  <div class="floating" style="margin-top:35px">
                      <span class="color checkbox">
                        <input type="checkbox" id="checkbox1" :checked="(Column.showLegend === '' || Column.showLegend === false) ? false : true" style="margin-left:0px;top:-15px;" @change="$emit('setObject',{type : 'showLegend', objects : $event.target.checked})">
                        <label for="checkbox1" style="top: -20px;right: 5px;"></label>
                      </span>
                      <input id="input__color" class="floating__input" name="title" type="text" placeholder="Show Legend" readonly/>
                      <label for="fixed-layout" class="floating__label" data-content="SHOW LEGEND"></label>
                  </div>

                  
                </div>

            </div>
        </transition>
    </div>
</template>

<script>
import palette from '../palette/palette.vue';

export default{
  props:['styleMode','column'],
  components:{
    //DataRange, 
    palette},
  data(){
    return{
      isBurgerActive: true,
      openGraphOptions: true,
      colorOptions: false,
      Column: this.column,
      title: this.column.title,
    }
  },
  watch:{
    column: {
        handler(val){
          this.Column = val
        },
        deep: true
    },
    title(){
      this.$emit('setObject',{type : 'title', objects : this.title})
    },
  },
  methods:{
    toggleGraphOptions(){
      this.openGraphOptions = !this.openGraphOptions
    },
    closeItem(){
      this.isBurgerActive = false
    },
    setyAxisRange(objects){
      this.$emit('setyAxisRange',objects)
    },
  }
}
</script>