<template>
    <div class="sidebar">
        <transition name="slide">
            <div v-if="isBurgerActive" class="sidebar-panel">
              <a @click="zatvori" class="close"/>
                <li class="style-name">
                  <img :src="require(`@/assets/icon-image.png`)" style="width:25px;height:25px;margin-right:5px">
                  <h3 style="font-weight: bold;color: black;font-size:17px">Image Settings</h3>
                </li>

                <div style="margin-top:50px; margin-left: 10%;">
                  <ul style="display:flex;list-style:none">
                    <li class="align" @click="$emit('setObject',{type : 'imagePosition', objects : 'left'})" :class="{ 'grey': (column.imagePosition === 'left')}">
                      <img :src="require(`@/assets/left_align.png`)" style="width:25px;height:25px;">
                    </li>
                    <li class="align"  @click="$emit('setObject',{type : 'imagePosition', objects : 'center'})" :class="{ 'grey': (column.imagePosition === 'center' || !column.imagePosition)}">
                      <img :src="require(`@/assets/center.png`)" style="width:25px;height:25px;">
                    </li>
                    <li class="align" @click="$emit('setObject',{type : 'imagePosition', objects : 'end'})" :class="{ 'grey': (column.imagePosition === 'end')}">
                      <img :src="require(`@/assets/right_align.png`)" style="width:25px;height:25px;">
                    </li>
                  </ul>
                </div>


                <input style="display:none" type="file" accept="image/*" @change="uploadImage($event)" ref="fileInput">
                <button class="bucket_gumb scale-on-hover" @click="$refs.fileInput.click()">Local Image Upload</button>
                <p>OR</p>
                <div class="input-group" style="margin-top: 15px; width: auto;justify-content:center;display:flex">
                
                  <input type="text" v-model="url" placeholder="Enter WEB url image..." class="sqlkucica"/>

                  <span class="input-group-btn">
                      <button @click="loadImage()" type="button" class="go scale-on-hover">Enter</button>
                  </span>

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
      url: '',
      selected: '',
    }
  },
  watch:{
    column: {
        handler(val){
          this.Column = val
          //this.color = val.backgroundColor.slice(0,18)
        },
        deep: true
    },
  },
  methods:{
    zatvori(){
      this.isBurgerActive = false
    },
    uploadImage(e){
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e =>{
          let previewImage = e.target.result;
          this.$emit('setObject',{type : 'data', objects : previewImage})
      };
    },
    async loadImage(){
      var res = await fetch(this.url);
      var blob = await res.blob();
      var uri = await this.parseURI(blob);
      this.$emit('setObject',{type : 'data', objects : uri})
    },
    async parseURI(d){
      var reader = new FileReader();    
      reader.readAsDataURL(d);          
      return new Promise((res)=> {  
        reader.onload = (e) => {        
          res(e.target.result)
        }
      })
    } 
  }
}
</script>
<style scoped>
.grey{
  background: #b3b3b3;;
}
</style>