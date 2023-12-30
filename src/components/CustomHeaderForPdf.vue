<template>
  <div id="customHeaderForPdf" class="navbar">
    <div class="content">
      <ul class="menu-list">
        <li style="top:0">
          <p>
            <span style="font-size:100px;font-weight:bold">Viz</span>
            <span style="font-size:100px;">Tool</span>
          </p>
        </li>
        <li style="font-size:24px;font-weight:700;bottom:0">{{report_name}}</li>
      </ul>
      <div style="position:absolute;right:1px;top:0px">
        <img :src="require(`@/assets/ai_logo.png`)" style="height:75px">
    </div>
    </div>
  </div>
</template>

<script>
import { useAuthUserStore } from '../store/index'
export default {
  name: 'CustomHeaderForPdf',
  data(){
    return{
      report_name: '',
      store: useAuthUserStore(),
    }
  },
  watch:{
    "store.report_name": {
        handler: function(nv) {
            this.report_name = nv
        },
        immediate: true // provides initial (not changed yet) state
    },
  },
  computed:{
    date: function () {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content{
  padding: 0px;
  position: relative;
  height: inherit;
  display: flex;
}
.navbar{
  width: auto;
  background: #1a6e4d;
  z-index: 2;
  padding: 15px 0;
  transition: all 0.3s ease;
  top:0;
  height:200px;
  display: none;
}
.navbar.sticky{
  background: #1b1b1b;
  padding: 10px 0;
  box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.1);
}
.navbar .logo a{
  color: #fff;
  font-size: 30px;
  font-weight: 600;
  text-decoration: none;
}
.menu-list li{
    color:white;
    list-style: none;
    position: absolute;
}
.menu-list li a{
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  margin-left: 25px;
  text-decoration: none;
  transition: all 0.3s ease;
}
.menu-list li a:hover{
  color: #007bff;
}

@media (max-width: 868px) {
  body.disabled{
    overflow: hidden;
  }
  .icon{
    display: block;
  }
  .icon.hide{
    display: none;
  }
  .navbar .menu-list{
    position: fixed;
    height: 100vh;
    width: 100%;
    max-width: 400px;
    left: -100%;
    top: 0px;
    display: block;
    padding: 40px 0;
    text-align: center;
    background: #222;
    transition: all 0.3s ease;
  }
  .navbar.show .menu-list{
    left: 0%;
  }
  .navbar .menu-list li{
    margin-top: 45px;
  }
  .navbar .menu-list li a{
    font-size: 23px;
    margin-left: -100%;
    transition: 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  .navbar.show .menu-list li a{
    margin-left: 0px;
  }
}
@media (max-width: 380px) {
  .navbar .logo a{
    font-size: 27px;
  }
}

</style>