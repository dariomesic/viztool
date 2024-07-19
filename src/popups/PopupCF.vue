<template>
  <Transition name="fade" appear>
    <div v-if="show" class="modal-mask" style="margin:0px">
      <div class="modal-wrapper">
        <div class="modal-container" style="width:550px">
            <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin: 0 -5px;padding: 0 5px;font-size:15px">
                <h2 style="margin:15px;">Conditional Formatting</h2>
            </div>
            <div class="format_adder">
              <div class="format_content">
                <table class="formats">
                  <tr>
                    <td style="padding-bottom:4px">
                      <span class="format_header">Value</span>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 14px;padding-right: 18px;">
                      <div style="border-width: 0 0 1px 0;;border-color: rgba(0,0,0,.42);">
                        <select class="format_select" @change="header = $event.target.value">
                          <option>All Values</option>
                          <option 
                            v-for ="option in column.items"
                            :value="option.title"
                            :key ="option.id" >
                            {{option.title}}
                        </option>  
                          <!-- <option>All Values</option>
                          <option>mrid</option>
                          <option>basin_key</option>
                          <option>name</option> -->
                        </select>
                      </div>
                    </td>
                    <td style="padding-bottom: 14px;padding-right: 18px;">
                      <div style="border-width: 0 0 1px 0;;border-color: rgba(0,0,0,.42);">
                        <select class="format_select" @change="sign = $event.target.value">
                          <option>Sign</option>
                          <option>Less Than</option>
                          <option>More Than</option>
                          <option>Equals</option>
                          <option>Between</option>
                        </select>
                      </div>
                    </td>
                    <td style="padding-bottom: 14px;padding-right: 18px;white-space: nowrap;">
                      <div v-if="sign === 'Between'" style="border-width: 0 0 1px 0;;border-color: rgba(0,0,0,.42);">
                        <div class="input-name" style="width:45px;margin-right: 10px;;margin-bottom: 7px;border-width: 0 0 1px 0;">
                            <input type="text" placeholder="0" style="margin-left:0px;width:120px" v-model="value1">
                            <span class="underline-animation"></span>
                        </div>
                        <p style="display: inline-block;width: 10px;margin-right: 10px;vertical-align: bottom;white-space: nowrap;">&#x26;</p>
                        <div class="input-name" style="width:45px;box-sizing: content-box;margin-right: 10px;padding-left: 0;;margin-bottom: 7px;border-width: 0 0 1px 0;">
                            <input type="text" placeholder="0" style="margin-left:0px;width:120px" v-model="value2">
                            <span class="underline-animation"></span>
                        </div>
                      </div>
                      <div v-else style="border-width: 0 0 1px 0;;border-color: rgba(0,0,0,.42);">
                        <div class="input-name">
                            <input type="text" placeholder="0" style="margin-left:0px;width:120px" v-model="value">
                            <span class="underline-animation"></span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom:4px">
                      <span class="format_header">Format</span>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 14px;padding-right: 18px;">
                      <div style="border-width: 0 0 1px 0;;border-color: rgba(0,0,0,.42);">
                        <select class="format_select" @change="format = $event.target.value">
                          <option>Roboto</option>
                          <option>Arial</option>
                          <option>Times New Roman</option>
                          <option>Calibri</option>
                        </select>
                      </div>
                    </td>
                    <td style="padding-bottom: 14px;padding-right: 18px;">
                      <div style="border-width: 0 0 1px 0;;border-color: rgba(0,0,0,.42);display:inline-flex">
                        <select class="format_select" @change="fontSize = $event.target.value">
                          <option>9px</option>
                          <option>10px</option>
                          <option>11px</option>
                          <option>12px</option>
                          <option selected>13px</option>
                          <option>14px</option>
                          <option>15px</option>
                        </select>
                      </div>
                    </td>
                    <td style="padding-bottom: 14px;">
                      <div style="border-width: 0 0 1px 0;;border-color: rgba(0,0,0,.42);display: flex;">
                        <div style="display:inline-flex;margin-left:15px">
                          <div>
                            <img :src="require(`@/assets/choose-color.png`)" style="width:25px;height:25px">
                            <div :style="['border: 2px solid black;height: 4px;',(colorCell === '') ? {'background': 'white'} : {'background': colorCell}]"/>
                          </div>
                          <div class="tree-view-item-node" @click="openCellPalette = !openCellPalette">         	
                            <span style="background:none;padding-left:10px" class="tree-view-item-key tree-view-item-key-with-chevron-1 opened"></span>
                          </div>
                        </div>
                        <palette 
                          style="margin-top:50px" 
                          v-if="openCellPalette"
                          :selected="colorCell ? colorCell : 'rgb(255, 255, 255, 0.99)'" 
                          @close="openCellPalette = false"
                          @setColor="setColorCell"/>
                        <div style="display:inline-flex;padding-left:30px">
                          <div>
                            <img :src="require(`@/assets/text-color.png`)" style="width:25px;height:25px">
                            <div :style="['border: 2px solid black;height: 4px;',(colorText === '') ? {'background': 'black'} : {'background': colorText}]"/>
                          </div>
                          <div class="tree-view-item-node" @click="openTextPalette = !openTextPalette">         	
                            <span style="background:none;padding-left:10px" class="tree-view-item-key tree-view-item-key-with-chevron-1 opened"></span>
                          </div> 
                        </div>
                        <palette
                          style="margin-top:50px;margin-left:50px"
                          v-if="openTextPalette" 
                          :selected="colorText ? colorText : 'rgb(0, 0, 0, 0.99)'" 
                          @close="openTextPalette = false" 
                          @setColor="setColorText"
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom:4px">
                      <span class="format_header">Font weight</span>
                    </td>
                  </tr>

                  <tr style="display:flex;margin-top:-10px">
                     <td>
                        <div class="checkbox" @click="bold = !bold">
                          <img class="checkbox-icon" :src="require(`@/assets/bold_icon.png`)" :class="{ 'hovered': (bold || conditional.bold)}" style="width:25px;height:25px">
                        </div>
                     </td>
                     <td>
                        <div class="checkbox" @click="italic = !italic" style="margin-left:15px">
                          <img class="checkbox-icon" :src="require(`@/assets/italic_icon.png`)" :class="{ 'hovered': (italic || conditional.italic)}" style="width:25px;height:25px;">
                        </div>
                     </td>
                     <td>
                        <div class="checkbox" @click="underline = !underline" style="margin-left:15px">
                          <img class="checkbox-icon" :src="require(`@/assets/underline_icon.png`)" :class="{ 'hovered': (underline || conditional.underline)}" style="width:25px;height:25px;">
                        </div>
                     </td>
              
                  </tr>
                </table>
              </div>
            </div>

          <div class="modal-content">
            <div style="display:flex;float:right">
              <slot name="footer">
                <button
                  class="modal-default-button-apply"
                  @click="setData()"
                >APPLY</button>
                <button
                  class="modal-default-button-close"
                  @click="deleteData()"
                >CLOSE</button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>


<script>
import palette from '../palette/palette.vue';
export default {
  components: { palette },
  props: {
    editMode: Boolean,
    show: Boolean,
    title: String,
    column: Object,
    data: Object,
  },
  data(){
    return{
      openCellPalette: false,
      openTextPalette: false,
      colorText: '',
      colorCell: '',
      header: 'All Values',
      sign: '',
      value: '',
      value1: '',
      value2: '',
      format: 'Roboto',
      fontSize: '13px',
      underline: false,
      bold: false,
      italic: false,
      conditional: []
    }
  },
  methods:{
    setColorText(value){
      console.log(value)
      this.colorText = value
    },
    setColorCell(value){
      this.colorCell = value
    },
    setData(){
      let tmp = []
      tmp.push(this.value1)
      tmp.push(this.value2)
      let object = 
      {
        'header' : this.header,
        'sign' : this.sign,
        'value' : this.value,
        'between' : tmp,
        'format' : this.format,
        'fontSize' : this.fontSize,
        'colorCell' : this.colorCell,
        'colorText' : this.colorText,
        'bold': this.bold,
        'italic' : this.italic,
        'underline' : this.underline
      }
      this.$emit('setData',object)
      this.colorText = ''
      this.colorCell = ''
      this.value = ''
      this.value1 = ''
      this.value2 = ''
      this.bold = false
      this.italic = false
      this.underline = false
      this.$emit('close')
    },
    deleteData(){
      this.value = ''
      this.colorText = ''
      this.colorCell = ''
      this.value1 = ''
      this.value2 = ''
      this.bold = false
      this.italic = false
      this.underline = false
      this.$emit('close')
    },
  }
}
</script>