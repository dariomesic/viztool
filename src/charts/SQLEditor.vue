<template>
    <div @click="showTree" id="test" class="hover">
        <div title="SQL Assistant" class="scale-on-hover" style="position:absolute;top:15px;right:20px" @click="showPopupModal = true">
          <svg fill="#000000" height="25" width="25" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 222.278 222.278" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <polygon points="74.776,169.752 66.695,169.752 66.695,181.874 54.573,181.874 54.573,189.954 66.695,189.954 66.695,202.076 74.776,202.076 74.776,189.954 86.896,189.954 86.896,181.874 74.776,181.874 "></polygon> <path d="M123.26,72.783c0-4.457,3.626-8.081,8.081-8.081s8.081,3.624,8.081,8.081v4.04h8.081v-4.04 c0-8.912-7.248-16.162-16.162-16.162s-16.162,7.25-16.162,16.162v4.04h8.081V72.783z"></path> <path d="M86.896,56.621c-8.914,0-16.162,7.25-16.162,16.162v4.04h8.081v-4.04c0-4.457,3.626-8.081,8.081-8.081 s8.081,3.624,8.081,8.081v4.04h8.081v-4.04C103.058,63.871,95.81,56.621,86.896,56.621z"></path> <path d="M159.633,149.55h-28.291v-11.107c28.993-8.848,50.15-35.831,50.15-67.681C181.492,31.743,149.748,0,110.729,0 c-39.02,0-70.762,31.743-70.762,70.762c0,32.145,21.563,59.303,50.971,67.892v10.896H62.646 c-20.048,0-36.356,16.312-36.356,36.364v36.364h169.697v-36.364C195.987,165.862,179.68,149.55,159.633,149.55z M110.729,8.081 c22.254,0,41.785,11.691,52.91,29.218c-7.208,4.703-15.516,7.201-24.217,7.201c-16.541,0-31.613-9.097-39.339-23.743 l-2.525-4.782l-3.871,3.776c-8.349,8.144-19.37,12.628-31.033,12.628c-0.509,0-0.957,0.021-1.403,0.042 C72.729,17.644,90.612,8.081,110.729,8.081z M48.047,70.762c0-10.903,2.808-21.157,7.724-30.097 c1.586,0.141,2.893,0.04,4.16-0.065c0.801-0.067,1.665-0.142,2.722-0.142c12.074,0,23.572-4.068,32.868-11.549 c9.667,14.718,26.061,23.67,43.9,23.67c10.071,0,19.706-2.821,28.105-8.163c3.737,8.022,5.884,16.928,5.884,26.345 c0,34.194-27.533,62.036-61.591,62.626h-2.181C75.581,132.799,48.047,104.957,48.047,70.762z M187.907,214.197H34.371v-28.283 c0-15.594,12.685-28.283,28.275-28.283h36.372V141.47h10.62c0.367,0.006,0.722,0.055,1.091,0.055c0.368,0,0.724-0.05,1.09-0.055 h11.441v16.162h36.372c15.589,0,28.275,12.689,28.275,28.283V214.197z"></path> </g> </g> </g> </g></svg>
        </div>

        <div style="margin:10px">
            <div class="tree-view-item-node" @click.stop="toggleOpen()" style="width:fit-content">         	
                <span :class="{opened: open}" style="background:none;padding-left:20px" class="tree-view-item-key tree-view-item-key-with-chevron"><h3>SQL editor</h3></span>
            </div>
            <div class="input-group">
                
                  <textarea type="text" v-model="line1" placeholder="Enter SQL query..." @focus="focusInput()" @blur="blurInput()" class="sqlkucica"/>


                  <ul v-if="showHistory" tabindex="0" class="ui-menu ui-widget ui-widget-content ui-autocomplete ui-front">
                    <li class="ui-menu-item" v-for="hist in history" :key="hist.id">
                      <div id="history" @mousedown="historyClick(hist)" tabindex="-1" class="ui-menu-item-wrapper">{{hist}}</div>
                    </li>
                  </ul>



                <span class="input-group-btn">
                    <button @click="sendRequest()" type="button" class="go scale-on-hover">Go!</button>
                </span>
            </div>
            <div v-show="open">
                <div v-if="special">
                  <h3 style="margin-top:20px">Parameters:</h3>
                  <div class="treeview hover" style="resize:none;height:auto;min-height:150px">
                      <Paramaterized :data="parameterized_data" :columns="parameterized_objects" :sql_table="sql_table" :sql_columns="sql_columns" @changed="changed"/>
                      <button type="button" class="go" @click="generate()" style="background: #1a6e4d; width: 100%; margin-top: 15px;height:35px;color:white">Generate preview</button>
                  </div>
                </div>
                <div v-if="request">
                    <h3 style="margin-top:20px">Query result preview:</h3>
                    <div class="treeview hover" style="resize:none;height:auto;min-height:150px">
                      <div style="overflow-x:scroll">
                        <Paramaterized :data="data" :columns="objects" @changed="changed"/>
                      </div>
                      <h3>Short data name</h3>
                      <textarea v-model="name" id="Name" placeholder="Insert data name here..." class="sqlkucica"></textarea>
                      <h3>Data description</h3>
                      <textarea v-model="description" id="Description" placeholder="Insert data description here..." class="sqlkucica"></textarea>
                      <button @click="addToDataBucket" :disabled='isDisabled' type="button" class="go" style="width: 100%; margin-top: 15px;height:35px; color: white;">Add</button>
                    </div>
                </div>
            </div>
        </div>
        <Teleport to="body">
            <!-- use the modal component, pass in the prop -->
            <modal :show="showModal" :type="type" :msg="msg" @close="showModal = false"/>
            <loading v-if="loading"/>
            <PopupSQL :showPopupModal="showPopupModal" @close="showPopupModal = false" @sql="(sql) => {line1 = sql; showPopupModal = false; sendRequest()}"/>
        </Teleport>
    </div>
    <h2 class="plus-separator"><button @click="$emit('addCell', 0)" class="line-center">+</button></h2>
</template>
<script>
import DataService from '../services/data.services'
import { useAuthUserStore } from '../store/index'
import Paramaterized from '../charts/Parameterized.vue'
import PopupSQL from '../popups/PopupSQL.vue'
export default {
    emits:["addCell"],
    components:{Paramaterized, PopupSQL},
    data(){
        return{
            line1: "",
            open: false,
            objects: [],
            data: [{}],
            history: [],
            enabled: false, 
            name: "",
            description: "",
            request: false,
            showModal: false,
            msg: '',
            type: 0,
            showHistory: false,
            loading: false,
            store: useAuthUserStore(),
            special: false,
            parameterized_objects : ['Parameter_name','Input_type','Default_value'],
            parameterized_data: [],
            sql_table: '',
            sql_columns: [],
            showPopupModal: false,
        }
    },
    created(){
      document.addEventListener('mouseup', function (e) {
          let container = document.getElementById('test');
          let treeView = document.getElementById('tree')
          if(container!==null){
            if (!container.contains(e.target) && !treeView.contains(e.target) && this.enabled == true && !e.target.className.toString().includes('dp')) {
                document.getElementById('widgets').style.display=""
                document.getElementById('tree').style.display = "none"
                document.getElementById('test').style.border = "1px solid #333"
                this.enabled = false
                this.open = false;
            }
          }
      }.bind(this));

      this.history = [],
      DataService.getHistory().then(
            (res) => {
              for(let i = 0; i < 5; i++){
                this.history.push(res[i].statement);
              }
            },
            error => {
              console.log(error);
            }
          );

    },
    computed:{
      isDisabled: function () {
        return (this.name === "")
      }
    },
    methods:{
      focusInput(){
        this.showHistory = true
      },
      blurInput(){
        this.showHistory = false 
      },
      showTree(){
        this.enabled = true;
        document.getElementById('widgets').style.display="none"
        document.getElementById('tree').style.display = ""
        document.getElementById('test').style.border = "2px solid #1a6e4d"
      }, 
      async toggleOpen(){
          this.open = !this.open
          this.showTree()
      },
      historyClick(object){
        this.line1 = object
      },
      async sendRequest(){
        this.open = true;
        if(this.line1.includes('?p')){
          this.special = true;
          this.request = false;
          let and_list = (this.line1.split('where ')[1]).toLowerCase().split('and ')
          this.sql_table = this.line1.split('where ')[0].split(" ")
          this.sql_table = this.sql_table[this.sql_table.length - 2] //table name
          let list = []
          for(let i = 0 ; i < and_list.length; i++){
            let or_list = []
            or_list.push(and_list[i].split('or '))
            this.sql_columns = []
            for(let j = 0 ; j < or_list.length; j++){
              list.push(or_list[j][0])
            }
          }
          let br = 0
          this.parameterized_data = []
          for(let j = 0 ; j < list.length ; j++){
            if(list[j].includes('?p')){
              this.sql_columns.push(list[j].split(" ")[0]) //table columns
              this.parameterized_data.push({ Parameter_name : '?p' + (br + 1), Input_type : '' , Default_value : ''})
              br++
            }
          }
        }
        else{
          this.special = false
          this.objects = [];
          let sql = {
              "SqlStatement": this.line1,
              "ListParameters": "",
          }
          await DataService.postSQL(sql).then(
            (res) => {
              if(res.dataTable.length === 0){
                this.request = false
                this.msg = 'No resources found. Please try again'
                this.type = 2
                this.showModal = true
                return
              }
              this.request = true
              this.data =  res.dataTable
              for(const key in this.data[0]){
                  this.objects.push(key)
              }
            },
            error => {
              this.msg = 'No resources found. Please try again'
              this.type = 2
              this.showModal = true
              error
            },
          );
        }
      },
      changed(data){
        this.parametrizirani_podaci = data
      },
      async generate(){
        const parsed = JSON.parse(JSON.stringify(this.parametrizirani_podaci));
        for(let i=0 ; i < parsed.length ; i++){
          parsed[i].Name = parsed[i].Parameter_name
          delete parsed[i].Parameter_name
          parsed[i].DefaultValue = parsed[i].Default_value
          delete parsed[i].Default_value
          parsed[i].InputType = parsed[i].Input_type
          delete parsed[i].Input_type
        }
        this.request = true
        this.loading = true
        let sql = {
            "SqlStatement": this.line1,
            "ListParameters": JSON.stringify(parsed),
        }
        this.objects = []
        this.data = []
        await DataService.postSQL(sql).then(
        (res) => {
          if(res.dataTable.length === 0){
            this.request = false
            this.msg = 'No resources found. Please try again'
            this.type = 2
            this.showModal = true
            return
          }
          this.request = true
          this.data =  res.dataTable
          this.id = res.id
          for(const key in this.data[0]){
              this.objects.push(key)
          }
        },
        error => {
          error
          this.request = false
          this.msg = 'No resources found. Please try again'
          this.type = 2
          this.showModal = true
        }
        );
        this.loading = false
      },
      async addToDataBucket(){
        let bucket = {
          "Name": this.name,
          "Description": this.description,
          "Queries_id":this.id,
          "Reports_id":1,
          "Users_id":1

      }
        await DataService.postBucket(bucket).then(
          (res) => {
            this.data = res.dataTable
            for(const key in this.data[0]){
                this.objects.push(key)
            }
          },
          error => {
            console.log(error);
            return
          }
          );
          this.msg = "Added item successfuly"
          this.type = 1
          this.showModal = true
          this.store.set_newBucketItem(!this.store.newBucketItem);
      },
    },
    watch:{
      "store.line": {
            handler: function(nv) {
                this.line1 = nv
            },
            immediate: true // provides initial (not changed yet) state
        },
    },
}
</script>
<style scoped>
.hover{
  min-height: unset;
}
.sqlkucica{
    background-color: #fff;
    width: 90%;
    resize:vertical;
}

h3 {
  padding-left: 10px;
}

h2 {
  text-align: center;
  position: relative;
  z-index: 1;
}

.ui-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: block;
  outline: 0;
  position: absolute; 
  top: 100%;
  width: 100%;
  margin:5px;
  padding: 5px 10px;
}

.ui-front {
  z-index: 100;
}

.ui-menu .ui-menu-item {
  margin: 0;
  cursor: pointer;
}

.ui-menu .ui-menu-item-wrapper {
  position: relative;
  padding: 3px 1em 3px .4em;
}


.ui-widget.ui-widget-content {
  border: 1px solid #c5c5c5;
}
.ui-widget-content {
  border: 1px solid #dddddd;
  background: #ffffff;
  color: #333333;
}



.input-group{
  margin-top: 15px;
  width: auto;
  justify-content: center;
  position: relative;
  display: flex;
  align-items: stretch;
}

</style>
    