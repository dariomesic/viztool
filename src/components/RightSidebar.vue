<template>
    <!-- <div class="sidebar" style="display:contents"> -->
        <transition name="slide">
            <div v-if="isBurgerActive" class="sidebar-panel">
                <div class="content">
                    <div class="row" v-if="data[0]">
                        <a @click="zatvori" class="close"/>
                        <li class="style-name">
                            <img :src="require(`@/assets/icon-line-chart.png`)" style="width:25px;height:25px;margin-right:5px">
                            <h3 style="color:#686868;font-size:17px">{{data[0].name}}</h3>
                        </li>
                        <div class="details">
                            <div style="display:flex;justify-content: space-between;">
                                <p style="font-weight: bold">Owner</p>
                                <p>{{data[0].createdBy}}</p>
                            </div>
                            <div style="display:flex;justify-content: space-between;">
                                <p style="font-weight: bold">Created Date</p>
                                <p>{{data[0].created}}</p>
                            </div>
                            <div style="display:flex;margin-top:10px;justify-content: space-between;">
                                <p style="font-weight: bold">Last Modified By</p>
                                <p>{{data[0].lastEditedBy}}</p>
                            </div>
                            <div style="display:flex;justify-content: space-between;">
                                <p style="font-weight: bold">Modified Date</p>
                                <p>{{data[0].last_edited}}</p>
                            </div>
                        </div>
                    </div>

                    <div class="formula-block centered">
                        <div class="buttons">
                            <button @click="openReport" class="go scale-on-hover" style="margin:10px">Open</button>
                            <button v-if="this.store.role === 'admin'" class="go scale-on-hover" style="margin:10px;background:red" @click="deleteReport">Delete</button>
                        </div>
                    </div>

                </div>
            </div>
        </transition>
    <!-- </div> -->
    <modal :show="showModal" @close="showModal = false" :type="type" :msg="msg"/>
</template>
<script>
import DataService from '../services/data.services'
import { useAuthUserStore } from '../store/index'
export default{
  emits: ['showSidebar'],
  props:['show','report','report_id', 'path'],
  data(){
    return{
      isBurgerActive: false,
      data: [],
      showModal: false,
      msg: '',
      store: useAuthUserStore(),
      type: 0
    }
  },
  watch:{
      show(){
          this.isBurgerActive = this.show
      },
      report: {
        handler(val){
          this.data = val
        },
        deep: true
    },
  },
  methods:{
    zatvori(){
      this.isBurgerActive = false
      this.$emit('showSidebar',false)
    },
    deleteReport(){
        DataService.deleteReport(this.report_id).then(
            (res) => {
              res
              this.msg = "Deleted report successfuly"
              this.type = 1
              this.showModal = true
              this.$emit('showSidebar',false)
            },
            error => {
              console.log(error);
            }
          );
    },
    openReport(){
      DataService.getReport(this.report_id).then(
          (res) => {
            this.store.set_reportId(this.report_id);
            this.store.set_reportName(res[0].name);
            if(JSON.parse(res[0].content) === ''){
              this.store.set_reportContent([]);
            }
            else{
              this.store.set_reportContent(JSON.parse(res[0].content));
            }
            this.store.set_reportPath(this.path);
            this.$router.push('Home');
          },
          error => {
            console.log(error);
          }
        );
    }
  }
}
</script>
<style scoped>

.slide-enter-active,
.slide-leave-active
{
    transition: transform 0.3s ease;
}

.slide-enter,
.slide-leave-to {
    transform: translateX(100%);
    transition: all 150ms ease-in 0s
}

.sidebar-panel {
  overflow: scroll;
  box-sizing: border-box;
  position: relative;
  background-color: #f5f5f5;
  padding: 3rem 20px 2rem 20px;
  text-transform: none;
  order: 2;
  width: 100%;
  z-index: 1;
}


@media (min-width: 768px){
    .sidebar-panel {
        max-width: 100%;
        position: relative;
        width: 100%;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
    }
}

@media (min-width: 1200px){
    .sidebar-panel {
        max-width: 16.666667%;
    }
}



.details{
    margin:10px;
}


.content{
    flex-direction: column;
    height: 100%;
    display: flex;
}
.row{
    flex-grow: 1;
    flex-direction: column;
    display: flex;
}

.formula-block {
  width: 100%;
  margin-bottom: 1.5em;
  margin-right: 1.5em;
  position: relative;
}


p {
  padding: 0px 5px 0px 5px;
}

.buttons {
  justify-content: space-between;
  position: absolute;
  bottom: 0.5em;
  left: 0; 
  right: 0;
  text-align: center;
}

</style>