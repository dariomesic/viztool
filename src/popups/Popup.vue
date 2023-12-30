<template>
  <transition name="bounce">
    <span v-if="show" class="notification">
        <span v-if="type == 0" class="msg info">
            <i style="margin-right:10px">&#128712;</i>
            <span style="margin-right:80px">{{msg}}</span>
            <span @click="$emit('close')" class="closed">&times;</span>
        </span>

        <span v-if="type == 1" class="msg success">
            <i style="margin-right:10px">&#x2713;</i>
            <span style="margin-right:80px">{{msg}}</span>
            <span @click="$emit('close')" class="closed">&times;</span>
        </span>

        <span v-if="type == 2" class="msg warning">
            <i style="margin-right:10px">&#x26A0;</i>
            <span style="margin-right:80px">{{msg}}</span>
            <span @click="$emit('close')" class="closed">&times;</span>
        </span>

        <span v-if="type == 3" class="msg error">
            <i style="margin-right:10px">&#x26A0;</i>
            <span style="margin-right:80px">{{msg}}</span>
            <span @click="$emit('close')" class="closed">&times;</span>
        </span>
    </span>
  </transition>
</template>

<script>
export default {
    props: {
      show: Boolean,
      type: Number,
      msg: String,
    },
      watch:{
        show(){
            if(this.show){
              this.myTimeout = setTimeout(() => {
                this.$emit('close')
              }, 4000);
            }
        },
      }
}
</script>