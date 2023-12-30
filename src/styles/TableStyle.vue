<template>
    <div class="sidebar">
        <transition name="slide">
            <div v-if="isBurgerActive" class="sidebar-panel">
              <a @click="zatvori" class="close"/>
                <!--<slot></slot> JAKO KORISNA STVAR-->
                <li class="style-name">
                  <img :src="require(`@/assets/icon-table.png`)" style="width:25px;height:25px;margin-right:5px">
                  <h3>Table Settings</h3>
                </li>

                <div style="margin-top : 50px">
                  <div class="floating">
                    <input id="input__title" class="floating__input" name="title" type="text" placeholder="TITLE" v-model="title"/>
                    <label for="input__title" class="floating__label" data-content="TITLE"></label>
                  </div>
                  <div v-for="(conditional,index) in conditionals" :key="index" style="background:white;border:1px solid #bdbdbd;border-radius:10px;position:relative;margin-bottom:20px">
                    <h2 style="margin-left:10px">{{index + 1}}°</h2>
                    <span class="plus-icon scale-on-hover" style="font-size:17px;right:35px;top:5px" @click="showEditModal = true, id = index, data = conditional">&#x270e;</span>
                    <img :src="require(`@/assets/garbage_white.png`)" class="plus-icon scale-on-hover" style="top:5px;right:3px" @click="deleteCF(index)">
                    <table style="justify-content: center;display: grid;margin:10px;">
                      <tr>
                        <td style="padding-bottom: 14px;padding-right: 18px;font-weight:bold">
                          Conditional:
                        </td>
                        <td style="padding-bottom: 14px;padding-right: 18px;">
                          {{conditional.header}} {{conditional.sign.toLowerCase()}} {{conditional.value  === '' ? conditional.between[0] + ' & ' + conditional.between[1] : conditional.value}}
                          <!-- mrid less then 0.5 -->
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 14px;padding-right: 18px;font-weight:bold">
                          Font-style:
                        </td>
                        <td style="padding-bottom: 14px;padding-right: 18px;">
                          {{conditional.format}}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 14px;padding-right: 18px;font-weight:bold">
                          Font-weight:
                        </td>
                        <td style="padding-bottom: 14px;padding-right: 18px;">
                          {{conditional.bold ? 'bold' : ''}} {{conditional.italic ? 'italic' : ''}} {{conditional.underline ? 'underline' : ''}} 
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 14px;padding-right: 18px;font-weight:bold">
                          Font-size:
                        </td>
                        <td style="padding-bottom: 14px;padding-right: 18px;">
                          {{conditional.fontSize}}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 14px;padding-right: 18px;font-weight:bold">
                          Colors:
                        </td>
                        <td style="padding-bottom: 14px;padding-right: 18px;font-weight:bold">
                            <img :src="require(`@/assets/choose-color.png`)" style="width:25px;height:25px">
                            <div :style="['border: 2px solid black;height: 4px;',(conditional.colorCell === '') ? {'background': 'black'} : {'background': conditional.colorCell}]"/>
                        </td>
                        <td style="padding-bottom: 14px;padding-right: 18px;font-weight:bold">
                          <div>
                            <img :src="require(`@/assets/text-color.png`)" style="width:25px;height:25px">
                            <div :style="['border: 2px solid black;height: 4px;',(conditional.colorText === '') ? {'background': 'white'} : {'background': conditional.colorText}]"/>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <button type="button" class="bucket_gumb scale-on-hover" @click="showModal = true">+ ADD NEW RULE</button>
                </div>
            </div>
        </transition>
    </div>
    <popup 
      :show="showModal" 
      @close="showModal = false" 
      :column="column" 
      @setData="setData" 
      />
    <edit-popup
      :show="showEditModal" 
      @close="showEditModal = false"
      :column="column"
      :data="data"
      :id="id"
      @changeData="changeData"
    />
</template>
<script>
import Popup from '../popups/PopupCF.vue'
import EditPopup from '../popups/EditCF.vue'

export default{
  props:['styleMode','column'],
  components:{Popup, EditPopup},
  data(){
    return{
      isBurgerActive: true,
      Column: this.column,
      showModal: false,
      showEditModal: false,
      conditionals: this.column.conditionals ? this.column.conditionals : [],
      title: this.column.title,
      edit: false,
      data: [],
      id: '',
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
    setData(object){
      this.conditionals.push(object)
      this.$emit('setObject',{type : 'conditionals', objects : this.conditionals})
    },
    deleteCF(index){
      this.conditionals.splice(index, 1);
      this.$emit('setObject',{type : 'conditionals', objects : this.conditionals})
    },
    changeData({data, index}){
      this.conditionals[index] = data
    }
  }

}
</script>