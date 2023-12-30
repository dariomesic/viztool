<template>
  <div id="tijelo1">
   <div class="login-page">
      <div class="wallpaper-login"></div>

      <div class="login-container">
         <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-8 mx-auto">
               <div class="card login">
                  <h1 style="font-weight: 500;color:white;font-size:34px">Sign In</h1>
                  <form class="form-group" v-on:keyup.enter="handleLogin">
                     <div class="floating" style="margin-bottom: 20px;">
                        <input id="input__username" class="floating__input" name="username" type="text" placeholder="USERNAME" v-model="username" required/>
                        <label for="input__username" class="floating__label" data-content="USERNAME"></label>
                     </div>
                     <div class="floating" style="margin-bottom: 20px;">
                        <span @mousedown="toggleShow" @mouseup="leaveShow" class="color"><i>&#128065;</i></span>
                        <input id="input__password" class="floating__input" v-if="showPassword" type="text" placeholder="PASSWORD" v-model="password" required/>
                        <input id="input__password" class="floating__input" v-else type="password" placeholder="PASSWORD" v-model="password" required>
                        <label for="input__password" class="floating__label" data-content="PASSWORD"></label>
                     </div>
                  </form>
                  <button class="scale-on-hover" style="padding:12px 5px" @click="handleLogin">Log in</button>
               </div>

            </div>
         </div>
      </div>
   </div>
  </div>
   <modal :show="showModal" @close="showModal = false" :type="type" msg="Wrong username or password"/>
</template>
<script>
//import DataService from '../services/data.services'
import { useAuthUserStore } from '../store/index'
  export default {
      name: 'Login',
      data(){
         return{
            username: '',
            password:'',
            showModal: false,
            showPassword: false,
            type: 0,
            store: useAuthUserStore(),
         }
      },
      created(){
         this.store.logout();
      },
      methods: {
         toggleShow() {
            this.showPassword = true;
         },
         leaveShow() {
            this.showPassword = false;
         },
         async handleLogin(){
            if(this.username == "viewer" && this.password == "viewer"){
                  this.store.login({
                     role : 'viewer',
                     user : this.username,
                     editMode : 'false',
                  });
                  this.$router.push('/Manager')
            }
            else if(this.username == "admin" && this.password == "admin"){
                  this.store.login({
                     role : 'admin',
                     user : this.username,
                     editMode : 'true',
                  });
                  this.$router.push({
                     name: 'Home', 
                     //params: { popup: 'true' }   IT LOOKS LIKE THIS IS NOT NEEDED AND CAUSES ERROR
                  });
            }
            else{
               this.store.isLoggedin = false
               this.type = 3
               this.showModal = true
            }
         }
      },
   }
</script>

<style scoped>

p {
   line-height: 1rem;
}

.login-page {
   align-items: center;
   display: flex;
   height: 100vh;
}
.wallpaper-login {
   background: url("../assets/bg_image_greenish.jpg");
   background-size: cover;
	background-attachment:fixed;
   background-size: cover;
   height: 100%;
   position: absolute;
   width: 100%;
}

button {
   cursor: pointer;
	border-radius: 20px;
   background:#030303b8;;;
	color: white;
	font-size: 12px;
	font-weight: bold;
	padding: 12px 45px;
	letter-spacing: 1px;
	text-transform: uppercase;
   width: 50%;
	transition: transform 80ms ease-in;
   margin-bottom: 0.5rem;
}
.login-container{
    max-width: 720px;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
}
.row{
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
}
.ml-auto, .mx-auto {
  margin-left: auto !important;
}
.mr-auto, .mx-auto {
  margin-right: auto !important;
}
.col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
}
.col-lg-4, .col-md-6, .sm-8{
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
}
.login {
   text-align:left; 
   border-radius: 15px;
   box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
   background: rgba(87, 102, 86, 0.60);
   border: 1px solid rgba(0, 0, 0, 0.125);
   padding: 28px;
   margin: 0;
}

.color{
   right:20px;
   top:12px;
   font-size:30px;
   color:grey;
   left: unset;
   user-select: none;
}

*, ::before, ::after {
  box-sizing: border-box;
}
</style>


