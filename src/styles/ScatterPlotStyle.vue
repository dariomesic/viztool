<template>
    <div class="sidebar">
        <transition name="slide">
            <div v-if="isBurgerActive" class="sidebar-panel">
              <a @click="this.isBurgerActive = false" class="close"/>
                <li class="style-name">
                  <img :src="require(`@/assets/icon-line-chart.png`)" style="width:25px;height:25px;margin-right:5px">
                  <h3>Scatter Plot Settings</h3>
                </li>

                <div style="margin-top : 50px">
                  <div class="tree-view-item-node" @click.stop="this.openGeneralOptions = !this.openGeneralOptions">         	
                    <span :class="{opened: openGeneralOptions}" style="background:none;padding-left:5px" class="tree-view-item-key tree-view-item-key-with-chevron-1"><h3 class="text-bold-main style-black">General Options</h3></span>
                  </div>
                  <div v-show="openGeneralOptions">
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


                  <!--SLIDER1-->
                   <div class="floating">
                    <div class="range">
                      <div class="sliderValue">
                        <span id="sliderSpan">{{(Column.lineWidth === '') ? 1 : Column.lineWidth}}</span>
                      </div>
                      <div class="field" style="top:10%">
                        <div class="value left">1</div>
                        <input id="sliderInput" type="range" min="1" max="10" :value="(Column.lineWidth === '' || !Column.hasOwnProperty('lineWidth')) ? 1 : Column.lineWidth" steps="1"/>
                          <div class="value right">10</div>
                      </div>
                    </div>
                    <label for="input__password" class="floating__label" data-content="LINE WIDTH"></label>
                  </div>

                </div>



                <div style="margin-top:70px">
                  <div class="tree-view-item-node" @click.stop="this.openDataOptions = !this.openDataOptions">         	
                    <span :class="{opened: openDataOptions}" style="background:none;padding-left:5px;" class="tree-view-item-key tree-view-item-key-with-chevron-1"><h3 class="text-bold-main style-black">Data Options</h3></span>
                  </div>
                  <div v-show="openDataOptions" v-for="(y,index) in yAxis" :key="index">
                    <div>
                      <div class="card" style="background:#f5f5f5">
                        {{y.title}}
                      </div>
                    </div>
                    <div class="floating">
                      <input id="input__label" class="floating__input" name="title" type="text" placeholder="GRAPH LABEL" :value="y.title" @input="itemChange($event.target.value,index, 'label')"/>
                      <label for="input__label" class="floating__label" data-content="GRAPH LABEL"></label>
                    </div>


                    <div style="position: relative;">
                        <div class="floating">
                          <span @click="showDataColor(index)" class="color" :style="'background:'+(y.color ? y.color : backgroundColor[index])" style="border:1px solid #bdbdbd"/>
                          <input id="input__color" class="floating__input" name="title" type="text" placeholder="GRAPH COLOR" :value="y.color ? y.color : backgroundColor[index]"/>
                          <label for="input__color" class="floating__label" data-content="GRAPH COLOR"></label>
                        </div>

                        <palette 
                            v-if="colorDataOptions[index]"
                            :selected="y.color" 
                            @close="colorDataOptions[index] = false"
                            @setColor="itemChange($event, index, 'color')"
                        />
                    </div>

                    <div style="position: relative;">
                        <div class="floating">
                          <span @click="showBorderDataColor(index)" class="color" :style="'background:'+(y.border_color ? y.border_color : borderColor[index])" style="border:1px solid #bdbdbd"/>
                          <input id="input__border" class="floating__input" name="title" type="text" placeholder="GRAPH BORDER COLOR" :value="y.border_color ? y.border_color : borderColor[index]"/>
                          <label for="input__border" class="floating__label" data-content="GRAPH BORDER COLOR"></label>
                        </div>

                        <palette 
                            v-if="borderColorDataOptions[index]"
                            :selected="y.border_color" 
                            @close="borderColorDataOptions[index] = false"
                            @setColor="itemChange($event, index, 'border_color')"
                        />
                    </div>

                    <div class="floating">
                      <select class="floating__input" id="input__point" name="point" :value="y.point ? y.point : 'circle'" @change="itemChange($event.target.value,index, 'point')">
                        <option selected value="circle">circle</option>
                        <option value="cross">cross</option>
                        <option value="crossRot">crossRot</option>
                        <option value="dash">dash</option>
                        <option value="line">line</option>
                        <option value="rect">rect</option>
                        <option value="rectRounded">rectRounded</option>
                        <option value="rectRot">rectRot</option>
                        <option value="star">star</option>
                        <option value="triangle">triangle</option>
                      </select>
                      <label for="input__point" class="floating__label" data-content="GRAPH POINT STYLE"></label>
                    </div>

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
  emits:['setObject'],
  components:{palette},
  data(){
    return{
      isBurgerActive: true,
      openDataOptions: true,
      openGraphOptions: true,
      openGeneralOptions: true,
      colorOptions: false,
      colorDataOptions: [],
      borderColorDataOptions: [],
      Column: this.column,
      title: this.column.title,
      items: this.column.items ? this.column.items : [],
      backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
    }
  },
  watch:{
    column: {
        handler(val){
          this.Column = val
          this.items = val.items
        },
        deep: true
    },
    title(){
      this.$emit('setObject',{type : 'title', objects : this.title})
    },
  },
  computed:{
    value: function () {
      if(typeof this.column.yAxisRange !== 'undefined'){
        return this.column.yAxisRange
      }
      return ''
    }, 
    yAxis() {
      return this.items.filter((item) => item.list === 1)
    },
  },
  mounted(){
    const slideValue = document.querySelector("#sliderSpan");
    const inputSlider = document.querySelector("#sliderInput");
    inputSlider.oninput = (()=>{
      let value = inputSlider.value;
      slideValue.textContent = value;
      var percent = ((value - inputSlider.min) / (inputSlider.max - inputSlider.min)) * 100
      this.$emit('setObject',{type : 'lineWidth', objects : inputSlider.value})
      slideValue.style.left = percent + "%";
      slideValue.classList.add("show");
    });
    inputSlider.onblur = (()=>{
      slideValue.classList.remove("show");
    });
  },
  methods:{
    showDataColor(index){
      if(typeof this.colorDataOptions[index] === 'undefined' || this.colorDataOptions[index] === false){
        this.colorDataOptions[index] = true
      }
      else{
        this.colorDataOptions[index] = false
      }
    },
    showBorderDataColor(index){
      if(typeof this.borderColorDataOptions[index] === 'undefined' || this.borderColorDataOptions[index] === false){
        this.borderColorDataOptions[index] = true
      }
      else{
        this.borderColorDataOptions[index] = false
      }
    },
    itemChange(event, index1, object){
      const item = this.yAxis.find((item, index) => index === index1 )
      item[object] = event
      this.$emit('setObject',{type : 'items', objects : this.items})
    },
  }
}
</script>