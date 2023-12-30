<template>
    <div @click="showTree" id="test" class="hover">
        <div style="margin:10px">
            <div class="tree-view-item-node" @click.stop="toggleOpen()">         	
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
        </Teleport>
    </div>
    <h2 class="plus-separator"><button @click="$emit('addCell', 0)" class="line-center">+</button></h2>
</template>
<script>
import DataService from '../services/data.services'
import { useAuthUserStore } from '../store/index'
import Paramaterized from '../charts/Parameterized.vue'
export default {
    emits:["addCell"],
    components:{Paramaterized},
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
    