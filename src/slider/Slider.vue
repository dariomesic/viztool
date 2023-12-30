<template>
  <div class="wrapper" v-show="showData(this.min,this.max)">
    <p style="font-size: 9px;margin-bottom: 20px;margin-left: -15px;">Y-AXIS RANGE</p>
    <div class="values">
      <span id="range-low">{{low}}</span>
      <span> - </span>
      <span id="range-high">{{high}}</span>
    </div>
    <div class="container">
      <div class="slider-track" id="slider-track"></div>
      <input type="range" class="data-range"
        :min="this.min"
        :max="this.max" 
        :value="!this.value[0] ? this.min : Math.round(value[0]*100)/100"
        :step="0.01"
        id="slider-low"
        @input="addLow"
      >
      <input type="range" class="data-range"
        :min="this.min"
        :max="this.max" 
        :value="!this.value[1] ? this.max : Math.round(value[1]*100)/100"
        :step="0.01"
        id="slider-high"
        @input="addHigh"
      >
    </div>

  </div>
</template>

<script>
export default {
  name: "Slider",
  props:['min','max','value'],
  emits:['setyAxisRange'],

  data() {
    return {
      low: Math.round(this.min*100)/100,
      high: Math.round(this.max*100)/100,
    };
  },

  watch:{
    value: {
        handler(){
          this.update()
        },
        deep: true
    },
    min: {
        handler(){
          this.update()
        },
        deep: true
    },
    max: {
        handler(){
          this.update()
        },
        deep: true
    },
  },


  mounted() {
      let sliderLow = document.getElementById('slider-low');
      let sliderHigh = document.getElementById('slider-high');
      let displayValLow = document.getElementById('range-low');
      let displayValHigh = document.getElementById('range-high');
      let sliderTrack = document.querySelector('#slider-track');
      displayValLow.textContent = Math.round(sliderLow.value*100)/100
      displayValHigh.textContent = Math.round(sliderHigh.value*100)/100;
      let percentLow = ((sliderLow.value - sliderLow.min) / (sliderLow.max - sliderLow.min)) * 100
      let percentHigh = ((sliderHigh.value - sliderLow.min) / (sliderLow.max - sliderLow.min)) * 100
      sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percentLow}% , #1a6e4d ${percentLow}% , #1a6e4d ${percentHigh}%, #dadae5 ${percentHigh}%)`;
  },

  methods:{
    update(){
        this.$nextTick(() => {
          let sliderLow = document.getElementById('slider-low');
          let sliderHigh = document.getElementById('slider-high');
          let displayValLow = document.getElementById('range-low');
          let displayValHigh = document.getElementById('range-high');
          let sliderTrack = document.querySelector('#slider-track');
          displayValLow.textContent = Math.round(sliderLow.value*100)/100
          displayValHigh.textContent = Math.round(sliderHigh.value*100)/100;
          let percentLow = ((sliderLow.value - sliderLow.min) / (sliderLow.max - sliderLow.min)) * 100
          let percentHigh = ((sliderHigh.value - sliderLow.min) / (sliderLow.max - sliderLow.min)) * 100
          sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percentLow}% , #1a6e4d ${percentLow}% , #1a6e4d ${percentHigh}%, #dadae5 ${percentHigh}%)`;
        })
    },
    addLow(){
      let sliderLow = document.getElementById('slider-low');
      let sliderHigh = document.getElementById('slider-high');
      let displayValLow = document.getElementById('range-low');
      sliderLow.oninput = (()=>{
        let value = Math.round(sliderLow.value*100)/100;
        sliderLow.textContent = value;
        displayValLow.textContent = value;
      });
      this.fillColor()
      let yAxisRangeSettings = [Number(sliderLow.value), Number(sliderHigh.value)]
      this.$emit("setyAxisRange", yAxisRangeSettings)
    },
    addHigh(){
      let sliderLow = document.getElementById('slider-low');
      let sliderHigh = document.getElementById('slider-high');
      let displayValHigh = document.getElementById('range-high');
      sliderHigh.oninput = (()=>{
        let value = Math.round(sliderHigh.value*100)/100;
        sliderHigh.textContent = value;
        displayValHigh.textContent = value;
      });
      this.fillColor()
      let yAxisRangeSettings = [Number(sliderLow.value), Number(sliderHigh.value)]
      this.$emit("setyAxisRange", yAxisRangeSettings)
    },

    fillColor() {
      let sliderLow = document.getElementById('slider-low');
      let sliderHigh = document.getElementById('slider-high');
      let sliderTrack = document.querySelector('#slider-track');
      let percentLow = ((sliderLow.value - sliderLow.min) / (sliderLow.max - sliderLow.min)) * 100
      let percentHigh = ((sliderHigh.value - sliderLow.min) / (sliderLow.max - sliderLow.min)) * 100
      sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percentLow}% , #1a6e4d ${percentLow}% , #1a6e4d ${percentHigh}%, #dadae5 ${percentHigh}%)`;
    },

    showData(value1, value2){
       if(value1 !== '' && value2 !== ''){
        return true
      }
    }

  }

};
</script>