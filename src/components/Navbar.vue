<template>
    <div class="navbar-main">
        
            <div v-if="route === 'Home'">
                <h1 style="font-size:10px;font-weight:800;margin-left:15px">Report Library > {{report_path}} > {{report_name}}</h1>
                <Items/>
            </div>


            <router-link class="logo" to="/Home">
                <a>Viz</a>
                <a style="font-weight:normal">Tool</a>
            </router-link>



            <label v-if="this.store.role === 'admin' && route === 'Home'" class="switch">
                <input type="checkbox" class="checkbox">
                <span class="toggle-thumb" @click="changeMode()">

                    <div id="toggle-thumb" style="margin-left:7pxfont-size:15px">&#x1F440;</div>

                    <div id="toggle-thumb" style="font-size: 20px;margin-right:3px;">&#x270e;</div>

                </span>
            </label>

            <div style="position:fixed;right:0">
                <div v-on:click.prevent="showDropDown=!showDropDown" class="navbar-separator">
                    <div style="margin-right:10px">
                        <p style="margin-top:18px;font-size:15px">{{store.role}}</p>
                    </div>
                    <img :src="require(`@/assets/profile.png`)" style="width:30px;height:30px" class="menuicon cursor">
                    <transition name="slide-fade" class="dropdown-menu">
                        <div v-if="showDropDown">
                            <ul class="menu list pl0 pa0 ma0">
                            <li style="list-style:none">
                                <a class="dd-link">
                                <router-link style="text-decoration: none;color: #9e9e9e;" to="/Manager">
                                    Manager
                                </router-link>
                                </a>
                                <a @click="logout" class="dd-link">Logout</a>
                            </li>
                            </ul>
                        </div>
                    </transition>
                </div>
            </div>

    </div>
</template>
<script>
import Items from './Items.vue'
import { useAuthUserStore } from '../store/index'
export default {
    components: {
		Items
	},
    data(){
        return{
            showDropDown: false,
            report_name: '',
            report_path: '',
            route: this.$route.name,
            store: useAuthUserStore(),
        }
    },
    watch: {
        "store.report_name": {
            handler: function(nv) {
                this.report_name = nv
                this.cells = this.store.report_content
                //console.log(this.store.report_content)
            },
            immediate: true // provides initial (not changed yet) state
        },
        "store.report_path": {
            handler: function(nv) {
                this.report_path = nv
            },
            immediate: true // provides initial (not changed yet) state
        },
    },
    methods:{
        changeMode(){
            this.store.set_editMode(!this.store.admin_viewer);
        },
        logout(){
            this.store.logout();
            this.$router.push('/')
        },

    }
}
</script>
<style scoped>
.navbar-main{
    height:60px;
    display:flex;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.37);
    padding-bottom: 3px;
    margin-bottom: 50px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 2;
    background: #1a6e4d; 
    color: white
}
.dropdown-menu{
  position: absolute;
  top: 50px;
  z-index: 2;
  float: left;
  min-width: 160px;
  padding: 5px 0;
  list-style: none;
  font-size: 14px;
  text-align: left;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  background-clip: padding-box;
  left:-75px;
  margin: 2px 0 0
}
.dd-link{
  display: block;
  text-decoration: none;
  color: #9e9e9e;
  padding: 10px 20px;
}


/* TOGGLE COMPONENT */
.switch {
    position:fixed;
    right:120px;
    width: 60px;
    height: 34px;
}

.toggle-thumb {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    border-radius: 40px;
    cursor: pointer;
    overflow: hidden;
}
 .toggle-thumb:before {
    content: "";
    height: 26px;
    width: 26px;
    position: absolute;
    left: 4px;
    bottom: 4px;
    border-radius: 50%;
    background-color: #1a6e4d;
    transition: .4s all ease;
}
.checkbox {
    opacity: 0;
    width: 0;
    height: 0;
}
.checkbox:checked + .toggle-thumb:before {
    transform: translateX(26px);
}

#toggle-thumb:nth-child(1) {
  position: relative;
  left: -22px;    
}
#toggle-thumb {
  width : 36px;
  height : 36px; 
  line-height:34px;
  color: #1a6e4d;
  transition: .4s all ease;
  margin-left: 3px;
}
.checkbox:checked + .toggle-thumb > #toggle-thumb {
  transform: translateX(26px);
}


.logo{
    width: fit-content;
    text-decoration: none;
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
}

.logo a{
    color: #fff;
    font-size: 30px;
    font-weight: 600;
    text-decoration: none;
  }

.navbar-separator{
    display:flex;
    align-items: center;
    cursor:pointer;
    border-left: 1px solid white;
    padding-left: 15px;
}

</style>