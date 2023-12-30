<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
*{
  font-family: Arial, Helvetica, sans-serif;
}

html, body {
    height:100vh;
    margin:0;
}

#app {
  margin: 0;
  height: 100%;
  color: #6d7882;
  font-family: Roboto,Arial,Helvetica,Verdana,sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1;
  text-transform: none;
}

textarea[type=text]:focus {
  border: 3px solid #555;
  outline: none;
}
</style>
