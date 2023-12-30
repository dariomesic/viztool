<template>
    <div class="sidebar">
        <transition name="slide">
            <div v-if="isBurgerActive" class="sidebar-panel">
              <a @click="zatvori" class="close"/>
                <!--<slot></slot> JAKO KORISNA STVAR-->
                <li class="style-name">
                  <img :src="require(`@/assets/icon-image.png`)" style="width:25px;height:25px;margin-right:5px">
                  <h3 style="font-weight: bold;color: black;font-size:17px">ListView Settings</h3>
                </li>

                <div class="floating" style="margin-top:35px">
                      <span class="color checkbox">
                        <input type="checkbox" id="checkbox1" :checked="(!Column.hasOwnProperty('allowDeletion') || Column.allowDeletion === false) ? false : true" style="margin-left:0px;top:-15px;" @change="$emit('allowDeletion', $event.target.checked)">
                        <label for="checkbox1" style="top: -20px;right: 5px;"></label>
                      </span>
                      <input id="input__color" class="floating__input" name="title" type="text" placeholder="Allow Deletion" readonly/>
                      <label for="fixed-layout" class="floating__label" data-content="ALLOW DELETION"></label>
                  </div>


                <div class="floating">
                  <select class="floating__input" id="input__password" name="delete" @change="$emit('deleteMode',$event.target.value)">
                    <option value="static">static</option>
                    <option value="toggle">toggle</option>
                    <option value="slideButton">slideButton</option>
                    <option value="slideItem">slideItem</option>
                    <option value="swipe">swipe</option>
                    <option value="context">context</option>                       
                  </select>
                  <label for="input__password" class="floating__label" data-content="DELETE TYPE"></label>
                </div>

            </div>
        </transition>
    </div>
</template>
<script>
export default{
  props:['styleMode','column'],
  data(){
    return{
      isBurgerActive: true,
      Column: this.column,
    }
  },
  watch:{
    column: {
        handler(val){
          this.Column = val
        },
        deep: true
    },
  },
  methods:{
    zatvori(){
      this.isBurgerActive = false
    },
  }
}
</script>