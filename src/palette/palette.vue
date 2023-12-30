<template>
    <div class="popup-style" style="z-index:1;" tabindex="0">
      <div @click="setColor($event.target.style.backgroundColor,$event)">
        <div class="e-palette" tabindex="0"><div class="e-row" role="presentation"><span class="e-tile" role="gridcell" aria-label="#000000ff" aria-selected="true" tabindex="0" style="background-color: rgba(0, 0, 0, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#f44336ff" aria-selected="false" tabindex="0" style="background-color: rgba(244, 67, 54, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#e91e63ff" aria-selected="false" tabindex="0" style="background-color: rgba(233, 30, 99, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#9c27b0ff" aria-selected="false" tabindex="0" style="background-color: rgba(156, 39, 176, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#673ab7ff" aria-selected="false" tabindex="0" style="background-color: rgba(103, 58, 183, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#2196f3ff" aria-selected="false" tabindex="0" style="background-color: rgba(33, 150, 243, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#03a9f4ff" aria-selected="false" tabindex="0" style="background-color: rgba(3, 169, 244, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#00bcd4ff" aria-selected="false" tabindex="0" style="background-color: rgba(0, 188, 212, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#009688ff" aria-selected="false" tabindex="0" style="background-color: rgba(0, 150, 136, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ffeb3bff" aria-selected="false" tabindex="0" style="background-color: rgba(255, 235, 59, 0.99);"></span></div><div class="e-row" role="presentation"><span class="e-tile" role="gridcell" aria-label="#ffffffff" aria-selected="false" tabindex="0" style="background-color: rgba(255, 255, 255, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ffebeeff" aria-selected="false" tabindex="0" style="background-color: rgba(255, 235, 238, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#fce4ecff" aria-selected="false" tabindex="0" style="background-color: rgba(252, 228, 236, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#f3e5f5ff" aria-selected="false" tabindex="0" style="background-color: rgba(243, 229, 245, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ede7f6ff" aria-selected="false" tabindex="0" style="background-color: rgba(237, 231, 246, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#e3f2fdff" aria-selected="false" tabindex="0" style="background-color: rgba(227, 242, 253, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#e1f5feff" aria-selected="false" tabindex="0" style="background-color: rgba(225, 245, 254, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#e0f7faff" aria-selected="false" tabindex="0" style="background-color: rgba(224, 247, 250, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#e0f2f1ff" aria-selected="false" tabindex="0" style="background-color: rgba(224, 242, 241, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#fffde7ff" aria-selected="false" tabindex="0" style="background-color: rgba(255, 253, 231, 0.99);"></span></div><div class="e-row" role="presentation"><span class="e-tile" role="gridcell" aria-label="#f2f2f2ff" aria-selected="false" tabindex="0" style="background-color: rgba(242, 242, 242, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ffcdd2ff" aria-selected="false" tabindex="0" style="background-color: rgba(255, 205, 210, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#f8bbd0ff" aria-selected="false" tabindex="0" style="background-color: rgba(248, 187, 208, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#e1bee7ff" aria-selected="false" tabindex="0" style="background-color: rgba(225, 190, 231, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#d1c4e9ff" aria-selected="false" tabindex="0" style="background-color: rgba(209, 196, 233, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#bbdefbff" aria-selected="false" tabindex="0" style="background-color: rgba(187, 222, 251, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#b3e5fcff" aria-selected="false" tabindex="0" style="background-color: rgba(179, 229, 252, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#b2ebf2ff" aria-selected="false" tabindex="0" style="background-color: rgba(178, 235, 242, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#b2dfdbff" aria-selected="false" tabindex="0" style="background-color: rgba(178, 223, 219, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#fff9c4ff" aria-selected="false" tabindex="0" style="background-color: rgba(255, 249, 196, 0.99);"></span></div><div class="e-row" role="presentation"><span class="e-tile" role="gridcell" aria-label="#e6e6e6ff" aria-selected="false" tabindex="0" style="background-color: rgba(230, 230, 230, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ef9a9aff" aria-selected="false" tabindex="0" style="background-color: rgba(239, 154, 154, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#f48fb1ff" aria-selected="false" tabindex="0" style="background-color: rgba(244, 143, 177, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ce93d8ff" aria-selected="false" tabindex="0" style="background-color: rgba(206, 147, 216, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#b39ddbff" aria-selected="false" tabindex="0" style="background-color: rgba(179, 157, 219, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#90caf9ff" aria-selected="false" tabindex="0" style="background-color: rgba(144, 202, 249, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#81d4faff" aria-selected="false" tabindex="0" style="background-color: rgba(129, 212, 250, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#80deeaff" aria-selected="false" tabindex="0" style="background-color: rgba(128, 222, 234, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#80cbc4ff" aria-selected="false" tabindex="0" style="background-color: rgba(128, 203, 196, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#fff59dff" aria-selected="false" tabindex="0" style="background-color: rgba(255, 245, 157, 0.99);"></span></div><div class="e-row" role="presentation"><span class="e-tile" role="gridcell" aria-label="#ccccccff" aria-selected="false" tabindex="0" style="background-color: rgba(204, 204, 204, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#e57373ff" aria-selected="false" tabindex="0" style="background-color: rgba(229, 115, 115, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#f06292ff" aria-selected="false" tabindex="0" style="background-color: rgba(240, 98, 146, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ba68c8ff" aria-selected="false" tabindex="0" style="background-color: rgba(186, 104, 200, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#9575cdff" aria-selected="false" tabindex="0" style="background-color: rgba(149, 117, 205, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#64b5f6ff" aria-selected="false" tabindex="0" style="background-color: rgba(100, 181, 246, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#4fc3f7ff" aria-selected="false" tabindex="0" style="background-color: rgba(79, 195, 247, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#4dd0e1ff" aria-selected="false" tabindex="0" style="background-color: rgba(77, 208, 225, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#4db6acff" aria-selected="false" tabindex="0" style="background-color: rgba(77, 182, 172, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#fff176ff" aria-selected="false" tabindex="0" style="background-color: rgba(255, 241, 118, 0.99);"></span></div><div class="e-row" role="presentation"><span class="e-tile" role="gridcell" aria-label="#b3b3b3ff" aria-selected="false" tabindex="0" style="background-color: rgba(179, 179, 179, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ef5350ff" aria-selected="false" tabindex="0" style="background-color: rgba(239, 83, 80, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ec407aff" aria-selected="false" tabindex="0" style="background-color: rgba(236, 64, 122, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ab47bcff" aria-selected="false" tabindex="0" style="background-color: rgba(171, 71, 188, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#7e57c2ff" aria-selected="false" tabindex="0" style="background-color: rgba(126, 87, 194, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#42a5f5ff" aria-selected="false" tabindex="0" style="background-color: rgba(66, 165, 245, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#29b6f6ff" aria-selected="false" tabindex="0" style="background-color: rgba(41, 182, 246, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#26c6daff" aria-selected="false" tabindex="0" style="background-color: rgba(38, 198, 218, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#26a69aff" aria-selected="false" tabindex="0" style="background-color: rgba(38, 166, 154, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ffee58ff" aria-selected="false" tabindex="0" style="background-color: rgba(255, 238, 88, 0.99);"></span></div><div class="e-row" role="presentation"><span class="e-tile" role="gridcell" aria-label="#999999ff" aria-selected="false" tabindex="0" style="background-color: rgba(153, 153, 153, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#e53935ff" aria-selected="false" tabindex="0" style="background-color: rgba(229, 57, 53, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#d81b60ff" aria-selected="false" tabindex="0" style="background-color: rgba(216, 27, 96, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#8e24aaff" aria-selected="false" tabindex="0" style="background-color: rgba(142, 36, 170, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#5e35b1ff" aria-selected="false" tabindex="0" style="background-color: rgba(94, 53, 177, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#1e88e5ff" aria-selected="false" tabindex="0" style="background-color: rgba(30, 136, 229, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#039be5ff" aria-selected="false" tabindex="0" style="background-color: rgba(3, 155, 229, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#00acc1ff" aria-selected="false" tabindex="0" style="background-color: rgba(0, 172, 193, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#00897bff" aria-selected="false" tabindex="0" style="background-color: rgba(0, 137, 123, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#fdd835ff" aria-selected="false" tabindex="0" style="background-color: rgba(253, 216, 53, 0.99);"></span></div><div class="e-row" role="presentation"><span class="e-tile" role="gridcell" aria-label="#808080ff" aria-selected="false" tabindex="0" style="background-color: rgba(128, 128, 128, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#d32f2fff" aria-selected="false" tabindex="0" style="background-color: rgba(211, 47, 47, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#c2185bff" aria-selected="false" tabindex="0" style="background-color: rgba(194, 24, 91, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#7b1fa2ff" aria-selected="false" tabindex="0" style="background-color: rgba(123, 31, 162, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#512da8ff" aria-selected="false" tabindex="0" style="background-color: rgba(81, 45, 168, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#1976d2ff" aria-selected="false" tabindex="0" style="background-color: rgba(25, 118, 210, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#0288d1ff" aria-selected="false" tabindex="0" style="background-color: rgba(2, 136, 209, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#0097a7ff" aria-selected="false" tabindex="0" style="background-color: rgba(0, 151, 167, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#00796bff" aria-selected="false" tabindex="0" style="background-color: rgba(0, 121, 107, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#fbc02dff" aria-selected="false" tabindex="0" style="background-color: rgba(251, 192, 45, 0.99);"></span></div><div class="e-row" role="presentation"><span class="e-tile" role="gridcell" aria-label="#666666ff" aria-selected="false" tabindex="0" style="background-color: rgba(102, 102, 102, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#c62828ff" aria-selected="false" tabindex="0" style="background-color: rgba(198, 40, 40, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#ad1457ff" aria-selected="false" tabindex="0" style="background-color: rgba(173, 20, 87, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#6a1b9aff" aria-selected="false" tabindex="0" style="background-color: rgba(106, 27, 154, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#4527a0ff" aria-selected="false" tabindex="0" style="background-color: rgba(69, 39, 160, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#1565c0ff" aria-selected="false" tabindex="0" style="background-color: rgba(21, 101, 192, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#0277bdff" aria-selected="false" tabindex="0" style="background-color: rgba(2, 119, 189, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#00838fff" aria-selected="false" tabindex="0" style="background-color: rgba(0, 131, 143, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#00695cff" aria-selected="false" tabindex="0" style="background-color: rgba(0, 105, 92, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#f9a825ff" aria-selected="false" tabindex="0" style="background-color: rgba(249, 168, 37, 0.99);"></span></div><div class="e-row" role="presentation"><span class="e-tile" role="gridcell" aria-label="#4d4d4dff" aria-selected="false" tabindex="0" style="background-color: rgba(77, 77, 77, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#b71c1cff" aria-selected="false" tabindex="0" style="background-color: rgba(183, 28, 28, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#880e4fff" aria-selected="false" tabindex="0" style="background-color: rgba(136, 14, 79, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#4a148cff" aria-selected="false" tabindex="0" style="background-color: rgba(74, 20, 140, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#311b92ff" aria-selected="false" tabindex="0" style="background-color: rgba(49, 27, 146, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#0d47a1ff" aria-selected="false" tabindex="0" style="background-color: rgba(13, 71, 161, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#01579bff" aria-selected="false" tabindex="0" style="background-color: rgba(1, 87, 155, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#006064ff" aria-selected="false" tabindex="0" style="background-color: rgba(0, 96, 100, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#004d40ff" aria-selected="false" tabindex="0" style="background-color: rgba(0, 77, 64, 0.99);"></span><span class="e-tile" role="gridcell" aria-label="#f57f17ff" aria-selected="false" tabindex="0" style="background-color: rgba(245, 127, 23, 0.99);"></span></div>
        </div>
      </div>
      <div class="e-switch">
        <p style="text-align:left">Opacity:</p>
        <input type="range" min="0" max="1" step="0.01" v-model="sliderVal" @input="sliderChanged()">
        <div class="e-controls">
          <button class="modal-default-button-close" title="Cancel" @click="$emit('close')">Cancel</button>
          <button class="modal-default-button-apply" title="Apply" @click="$emit('close')">Apply</button>
        </div>
      </div>
    </div>
     
</template>

<script>
export default {
  name: 'Palette',
  props:{
    selected: String,
  },
  data(){
    return{
      color: '',
      sliderVal: 1
    }
  },
  methods:{
    setColor(color,event){
        this.color = color
        let tablinks = document.getElementsByClassName("e-tile");
        for (let i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace("e-selected", "");
        }
        event.target.className += " e-selected";

        this.sliderChanged()
    },
    sliderChanged(){
      const lastIndex = this.color.lastIndexOf(',');
      this.color = this.color.slice(0, lastIndex) + ', ' + this.sliderVal + ')'
      this.$emit('setColor', this.color)
    }
  },
  mounted(){
    let value = this.selected
    if(value){
        this.sliderVal = value.replace(/^rgba?\(|\s+|\)$/g,'').split(',')[3]
        this.color = value
        const lastIndex = value.lastIndexOf(',');
        value = value.slice(0, lastIndex) + ', ' + 0.99 + ')'
        let tablinks = document.getElementsByClassName("e-tile");
        for (let i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace("e-selected", "");
          if(tablinks[i].style.backgroundColor === (value)){
            tablinks[i].className += " e-selected"
          }
        }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.popup-style{
  width: 270px;

}
.e-palette {
  border-bottom: 0;
  display: table;
  line-height: 0;
  outline: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.e-container .e-palette .e-row {
  display: table-row;
  white-space: nowrap;
}

.e-tile {
  border: .5px solid rgba(0,0,0,0);
    border-top-color: rgba(0, 0, 0, 0);
    border-right-color: rgba(0, 0, 0, 0);
    border-bottom-color: rgba(0, 0, 0, 0);
    border-left-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  cursor: pointer;
  display: inline-block;
  height: 27px;
  text-align: center;
  vertical-align: middle;
  width: 27px;
}

.e-tile:hover{
    border: 1px solid white;
    box-shadow:2px 2px 7px 2px rgba(0,0,0,.3);
}

.e-selected {
  position: relative;
}

.e-selected {
  border-color: #eee;
}

.e-switch {
  padding-top: 16px;
}
.e-switch {
  padding: 23px 16px 16px;
    padding-top: 23px;
}
.e-switch{
  display: inline-block;
  padding: 5px 16px 6px;
  white-space: nowrap;
  width: 100%;
}
.e-switch {
  float: right;
  text-align: right;
  white-space: nowrap;
  width: 89.913%;
}

.modal-default-button-apply{
  float: right;
  color: #e3165b;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  padding: 6px 12px 4px;
}
.modal-default-button-apply:hover{
  background-color:rgba(227,22,91,.04);
  border-color:rgba(0,0,0,0);
  color:#e3165b
}

.e-controls{
  float: right;
  text-align: right;
  white-space: nowrap;
  width: 89.913%;
}

.modal-default-button-close{
  float: right;
  color: #6d7882;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  padding: 6px 12px 4px;
}
.modal-default-button-close:hover{
  background-color:rgba(227,22,91,.04);
  border-color:rgba(0,0,0,0);
}
</style>
