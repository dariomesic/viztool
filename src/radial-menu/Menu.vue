<template>
  <div>
    <nav id="menu-screen" class="c-circle-menu js-menu">
      <button id="menu-button" class="c-circle-menu__toggle js-menu-toggle" @click="toggle">
        <span>Toggle</span>
      </button>
      <ul class="c-circle-menu__items">
        <li class="c-circle-menu__item">
          <a class="c-circle-menu__link cursor" data-hover="Home">
            <img :src="require(`@/assets/home.png`)">
          </a>
        </li>
        <li class="c-circle-menu__item">
          <a class="c-circle-menu__link cursor" data-hover="Info">
            <span style="cursor:pointer;font-size:35px;color:white">&#x1F6C8;</span>
          </a>
        </li>
        <li class="c-circle-menu__item" @click="newReport()">
          <a class="c-circle-menu__link cursor" data-hover="New Report">
            <img :src="require(`@/assets/plus.png`)">
          </a>
        </li>
        <li class="c-circle-menu__item">
          <a class="c-circle-menu__link cursor" data-hover="Library">
            <router-link style="text-decoration: none;color: gray;" to="/Manager">
              <img :src="require(`@/assets/library.png`)" style="height:30px">
            </router-link>
          </a>
        </li>
        <li v-if="this.store.role === 'admin'" class="c-circle-menu__item" @click="toggle;save()">
          <a class="c-circle-menu__link cursor" data-hover="Save As">
            <img :src="require(`@/assets/save_as.png`)" style="height:35px">
          </a>
        </li>
        <li v-else class="c-circle-menu__item" @click="funkcija()">
          <a class="c-circle-menu__link cursor" data-hover="Set timer">
            <img :src="require(`@/assets/timer.png`)">
          </a>
        </li>
      </ul>
      <div id="menu-mask" class="c-circle-menu__mask js-menu-mask"></div>
    </nav>
    <Teleport to="body">
      <!-- use the modal component, pass in the prop -->
      <popup :show="showModal" @close="showModal = false" :saveAs="true"/>
      <popup-timer :show="showModalTimer" @close="showModalTimer = false"/>
    </Teleport>
  </div>
     
</template>

<script>
import PopupTimer from '../popups/PopupTimer.vue'
import Popup from '../popups/PopupCreate.vue'
import { useAuthUserStore } from '../store/index'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components:{Popup,PopupTimer},
  data(){
    return{
      showModal: false,
      showModalTimer: false,
      timer: false,
      store: useAuthUserStore(),
    }
  },
  methods:{
    funkcija(){
      this.showModalTimer = true
      this.toggle()
    },
    toggle(){
      let menu = document.getElementById('menu-mask');
      let screen = document.getElementById('menu-screen')
      let button = document.getElementById('menu-button')
      if(menu.classList.contains("is-active")){
        menu.classList.remove("is-active");
        screen.classList.remove("is-active");
        button.classList.remove("is-active");
      }
      else{
        menu.classList.add("is-active");
        screen.classList.add("is-active");
        button.classList.add("is-active");
      }
    },

    newReport(){
        this.store.set_reportName('');
        this.store.set_reportContent([]);
        this.toggle()
    },

    save(){
      this.showModal = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.c-circle-menu {
  position: fixed;
  bottom: 12px;
  right: 12px;
  z-index: 1000;
  width: 48px;
  height: 48px;
  border-radius: 24px;
}



.c-circle-menu__items {
  display: block;
  list-style: none;
  position: absolute;
  z-index: 2;
  margin: 0;
  padding: 0;
}

.c-circle-menu__item {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  opacity: 0;
  -webkit-transition: opacity, -webkit-transform;
  transition: opacity, -webkit-transform;
  transition: transform, opacity;
  transition: transform, opacity, -webkit-transform;
  -webkit-transition-duration: 0.3s, 0.3s;
          transition-duration: 0.3s, 0.3s;
  -webkit-transition-timing-function: cubic-bezier(0.35, -0.59, 0.47, 0.97);
          transition-timing-function: cubic-bezier(0.35, -0.59, 0.47, 0.97);
}


/**
 * Transisition delays at the default state.
 */
.c-circle-menu__item:nth-child(1) {
  -webkit-transition-delay: 0.4s;
          transition-delay: 0.4s;
}

.c-circle-menu__item:nth-child(2) {
  -webkit-transition-delay: 0.3s;
          transition-delay: 0.3s;
}

.c-circle-menu__item:nth-child(3) {
  -webkit-transition-delay: 0.2s;
          transition-delay: 0.2s;
}

.c-circle-menu__item:nth-child(4) {
  -webkit-transition-delay: 0.1s;
          transition-delay: 0.1s;
}

.c-circle-menu__item:nth-child(5) {
  -webkit-transition-delay: 0s;
          transition-delay: 0s;
}

/**
 * We're using the .is-active class, which is added to the menu via JavaScript.
 * Once the menu is active, the items inherit the properties below. We will
 * manually write out the transform properties for first and last items, as we
 * already know their position. For all items in between though, we'll use some
 * polar-to-cartesian math and some Sass functions to get the positioning.
 */
.c-circle-menu.is-active .c-circle-menu__item {
  -webkit-transition-timing-function: cubic-bezier(0.35, 0.03, 0.47, 1.59);
          transition-timing-function: cubic-bezier(0.35, 0.03, 0.47, 1.59);
}

.c-circle-menu.is-active .c-circle-menu__item:nth-child(1) {
  -webkit-transition-delay: 0s;
          transition-delay: 0s;
  -webkit-transform: translate(-144px, 0);
          transform: translate(-144px, 0);
}

.c-circle-menu.is-active .c-circle-menu__item:nth-child(2) {
  -webkit-transition-delay: 0.1s;
          transition-delay: 0.1s;
  -webkit-transform: translate(-134px, -56px);
          transform: translate(-134px, -56px);
}


.c-circle-menu.is-active .c-circle-menu__item:nth-child(3) {
  -webkit-transition-delay: 0.2s;
          transition-delay: 0.2s;
  -webkit-transform: translate(-102px, -102px);
          transform: translate(-102px, -102px);
}


.c-circle-menu.is-active .c-circle-menu__item:nth-child(4) {
  -webkit-transition-delay: 0.3s;
          transition-delay: 0.3s;
  -webkit-transform: translate(-56px, -134px);
          transform: translate(-56px, -134px);
}


.c-circle-menu.is-active .c-circle-menu__item:nth-child(5) {
  -webkit-transition-delay: 0.4s;
          transition-delay: 0.4s;
  -webkit-transform: translate(0, -144px);
          transform: translate(0, -144px);
}

/**
 * Apart from the transform properties, we'll also make sure the items get
 * the correct opacity.
 */
.c-circle-menu.is-active .c-circle-menu__item {
  opacity: 1;
}

/**
 * Let's style the links now. This is just boilerplate stuff, and of course,
 * you'll probably want to change up the icons to match your needs. In any case,
 * we'll do it here for the sake of completion.
 */
.c-circle-menu__link {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  box-shadow: inset 0 0 0 2px #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.c-circle-menu__link img {
  max-width: 100%;
  height: auto;
}

.c-circle-menu__link:hover {
  box-shadow: inset 0 0 0 2px rgb(26, 110, 77) none repeat scroll 0% 0%;;
}

/* -----------------------------------------------------------------------------

  The Toggle Component

----------------------------------------------------------------------------- */
/**
 * The toggle is a button element, and as such requires some resets that are
 * unique to buttons. This button also inherits some funky stuff from my
 * CSS animating hamburger menu icons demo, which can be found at this url:
 * https://github.com/callmenick/Animating-Hamburger-Icons
 */
.c-circle-menu__toggle {
  display: block;
  position: absolute;
  z-index: 100;
  margin: 0;
  padding: 0;
  width: 48px;
  height: 48px;
  background: rgb(26, 110, 77) none repeat scroll 0% 0%;;
  font: inherit;
  font-size: 0;
  text-indent: -9999px;
  border-radius: 24px;
  -webkit-transition: background 0.3s;
  transition: background 0.3s;
  /* reset some browser defaults */
  cursor: pointer;
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  box-shadow: none;
}


.c-circle-menu__toggle:hover,
.c-circle-menu__toggle:focus,
.c-circle-menu__toggle.is-active {
  outline: none;
  background: rgb(26, 110, 77) none repeat scroll 0% 0%;;
}

.c-circle-menu__toggle span,
.c-circle-menu__toggle span::before,
.c-circle-menu__toggle span::after {
  display: block;
  position: absolute;
  height: 4px;
  background: #fff;
  border-radius: 1px;
}



.c-circle-menu__toggle span {
  top: 22px;
  left: 10px;
  right: 10px;
  -webkit-transition: background 0.3s;
  transition: background 0.3s;
}


.c-circle-menu__toggle span::before,
.c-circle-menu__toggle span::after {
  left: 0;
  width: 100%;
  content: "";
  -webkit-transition-duration: 0.3s, 0.3s;
          transition-duration: 0.3s, 0.3s;
  -webkit-transition-delay: 0.3s, 0s;
          transition-delay: 0.3s, 0s;
}

.c-circle-menu__toggle span::before {
  top: -8px;
  -webkit-transition-property: top, -webkit-transform;
  transition-property: top, -webkit-transform;
  transition-property: top, transform;
  transition-property: top, transform, -webkit-transform;
}

.c-circle-menu__toggle span::after {
  bottom: -8px;
  -webkit-transition-property: bottom, -webkit-transform;
  transition-property: bottom, -webkit-transform;
  transition-property: bottom, transform;
  transition-property: bottom, transform, -webkit-transform;
}


/* button active state */
.c-circle-menu__toggle.is-active span {
  background: none;
}

.c-circle-menu__toggle.is-active span::before {
  top: 0;
  -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
  -webkit-transition-delay: 0s, 0.3s;
          transition-delay: 0s, 0.3s;
}

.c-circle-menu__toggle.is-active span::after {
  bottom: 0;
  -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
  -webkit-transition-delay: 0s, 0.3s;
          transition-delay: 0s, 0.3s;
}

/* -----------------------------------------------------------------------------

  The Mask Component

----------------------------------------------------------------------------- */
/**
 * Here's the mask component, which actually gets created and inserted to the
 * DOM via JavaScript. It simply acts as an overlay to draw attention to the
 * menu when it is active. It also uses the .is-acvite state class.
 */
.c-circle-menu__mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  visibility: hidden;
  opacity: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  -webkit-transition: opacity 0.3s, visibility 0.3s;
  transition: opacity 0.3s, visibility 0.3s;
}

.c-circle-menu__mask.is-active {
  opacity: 1;
  visibility: visible;
}


.cursor:before{
  content: attr(data-hover);
  visibility: hidden;
  width: 100px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  margin-left: -100px;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  font-size: 13px;
}
.cursor:hover:before {
  opacity: 1;
  visibility: visible;
}
.cursor{
  cursor: pointer;
}


</style>
