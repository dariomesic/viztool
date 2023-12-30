<template>
  <Navbar/>
  <div class="manager-container">
      <div class="row flex">
          <div class="first-column">
            <div style="position:relative">
              <h3 style="font-weight: 500;color: black;font-size:17px;border-bottom: 1px solid rgba(0, 0, 0, 0.37);margin-bottom:15px;padding-bottom: 5px;align-items: center;">Report Library</h3>
              <span v-if="this.store.role === 'admin'" @click="newReport = !newReport" class="plus-icon scale-on-hover">+</span>
            </div>
            <ul class="lists-content">
              <li class="list-content" v-for="(folder_1,index) in folders" :key="index" @click="openFolder(index,folder_1)" :style="[((folder_1 === folder) ? {'background' : 'lightgrey'} : '')]">
                <img :src="[((folder_1 === folder) ? require(`@/assets/FolderOpen.png`) : require(`@/assets/folderg.png`))]" class="icon-file">
                <p style="font-size:15px">{{folder_1.name}}</p>
              </li>
              <li class="list-content" v-if="newReport">
                <img :src="require(`@/assets/folderg.png`)" class="icon-file">
                <div class="field" style="display:flex;justify-content:center">
                  <input v-on:keyup.enter="blurFolder($event)" placeholder="Report name:" id="user-name" type="text" class="field-value form-control" @blur="blurFolder($event)">
              </div>
              </li>
            </ul>
          </div>
          <div class="main" v-if="first_show" :class="{ 'constricted': (show)}">
              <li class="list-content">
                <img :src="require(`@/assets/folderg.png`)" class="icon-file" style="width:15px">
                <div v-if="!reportChange">
                  <p style="font-size:17px;font-weight: 500;color: black;">{{folder.name}}</p>
                </div>
                <div v-else>
                  <div class="field" style="display:flex;justify-content:center">
                    <input v-on:keyup.enter="blurReport($event)" :value="folder.name" placeholder="Report name:" id="user-name" type="text" class="field-value form-control" @blur="blurReport($event)">
                  </div>
                </div>
                <span v-if="this.store.role === 'admin'" @click="reportChange = !reportChange" class="plus-icon main-icons scale-on-hover" style="margin-left:20px">&#x270e;</span>
                <img @click="removeFolder()" :src="require(`@/assets/garbage_white.png`)" class="plus-icon main-icons scale-on-hover" style="margin-left:10px">
              </li>
              <table class="table">
                  <thead>
                      <tr>
                          <th v-for="object in objects" :key="object.id">{{object.toUpperCase()}}</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(line,index1) in data.slice().reverse()" :key="index1" class="row-hoverable" @click="oneClick($event,line)">
                          <td class="tableobject" v-for="(object,index) in objects" :key="index">
                            <div v-if="object === 'name'">
                              <div v-if="reportCurrentChange[index1]" class="field" id="changer">
                                <input v-on:keyup.enter="blurCurrentReport($event,index1,line)" :value="line[objects[index]]" placeholder="Report name:" id="user-name" type="text" class="field-value form-control" @blur="blurCurrentReport($event,index1,line)">
                              </div>
                             <div v-else>{{line[objects[index]]}}</div>
                            </div>
                            <div v-else>{{line[objects[index]]}}</div>
                          </td>
                          <span id="dots" @click="showOptions(index1)">&#8942;</span>
                          <div id="modal" class="popup-style" style="z-index:1;" v-if="options[index1]" @focusout="handleFocusOut(index1)" tabindex="0">
                            <div style="display:table;width:inherit;padding: 16px 0;">
                              <a @click="call(line)" class="menuicon-button">
                                <div class="menuicon">&#x1F440;</div>
                                <p style="margin-left:5px">Open</p>
                              </a>
                              <a @click="reportCurrentChange[index1] = !reportCurrentChange[index1]" class="menuicon-button">
                                <div class="menuicon" style="font-size:20px">&#x270e;</div>
                                <p style="margin-left:5px">Rename</p>
                              </a>
                              <a class="menuicon-button">
                                <img :src="require(`@/assets/copy.png`)" style="width:25px;height:25px" class="menuicon">
                                <p style="margin-left:5px">Copy</p>
                              </a>
                              <a class="menuicon-button">
                                <img :src="require(`@/assets/garbage.png`)" style="width:25px;height:25px" class="menuicon">
                                <p style="margin-left:5px" @click="deleteReport(line)">Delete</p>
                              </a>
                            </div>
                          </div>
                      </tr>
                  </tbody>
              </table>
          </div>
          <div v-else>
              <h3 style="position:absolute;top:50%;left:50%">Click on Folder to view Data</h3>
          </div>
          <RightSidebar :show="show" @showSidebar="showSidebar" :path="path" :report="report" :report_id="report_id"/>
      </div>
  </div>
   <modal :show="showModal" @close="showModal = false" :type="type" :msg="msg"/>
</template>
<script>
import Navbar from '../components/Navbar.vue'
import RightSidebar from '../components/RightSidebar.vue'
import DataService from '../services/data.services'
import { useAuthUserStore } from '../store/index'
export default {
  name: 'Manager',
  components: {
    Navbar,
    RightSidebar
  },
  emits: ['showSidebar'],
  data(){
    return{
      objects:['name','id','last_edited'],
      first_show: false,
      show: false,
      options: [],
      data: [],
      //data:[{NAME:'Report 1',OWNER:'Jure K.',LAST_MODIFIED:'22.02.2022.'},{NAME:'Report 2',OWNER:'Duje B.',LAST_MODIFIED:'22.02.2022.'},{NAME:'Report 3',OWNER:'Mato T.',LAST_MODIFIED:'22.02.2022.'},{NAME:'Report 4',OWNER:'Jure K.',LAST_MODIFIED:'22.02.2022.'},{NAME:'Report 5',OWNER:'Franjo T',LAST_MODIFIED:'22.02.2022.'}],
      folders: [],
      reports: [],
      details: [],
      folder: '',
      report: '',
      report_id: '',
      newReport: false,
      reportChange: false,
      reportCurrentChange: [],
      delay: 200,
      clicks: 0,
      timer: null,
      path: '',
      showModal: false,
      msg: '',
      store: useAuthUserStore(),
      type: 0
    }
  },
  created(){
      this.folders = [],
      DataService.getFolders().then(
        (res) => {
          this.folders = res;
        },
        error => {
          console.log(error);
        }
      );

  },
  methods:{
    blurFolder(event){
      this.newReport = false
      DataService.postFolder(event.target.value).then(
          (res) => {
            res
            this.getFolders()
          },
          error => {
            console.log(error);
          }
        );
      //console.log(event.target.value) //IME REPORTA
    },
    blurReport(event){
      this.reportChange = false
      let info = {
        'id' : this.folder.id,
        'name' : event.target.value
      }
      DataService.putFolder(info).then(
          (res) => {
            res
            this.getFolders()
            this.first_show = false
          },
          error => {
            console.log(error);
          }
        );
    },
    blurCurrentReport(event,index,object){
      console.log(event)
      this.reportCurrentChange[index] = false
      DataService.getReport(object.id).then(  //FOR CONTENT
        (res) => {
          let info = {
            'id' : object.id,
            'name' : event.target.value,
            'content': res[0].content
          }
          DataService.updateReport(info).then(  //UPDATE REPORTA
              () => {
                DataService.getReports(this.folder.id).then(
                  (res) => {
                    this.data = res
                  },
                  error => {
                    console.log(error);
                  }
                );
              },
              error => {
              console.log(error);
              }
          );
        },
        error => {
          console.log(error);
        }
      );
    },
    handleFocusOut(index) {
        this.options[index] = false   //UNFOCUS IMPORTANT!!!!!!!!!!
    },
    showOptions(index){
      this.options[index] = true
      this.testni() //FIRST YOU CALL THIS FOR FOCUS
    },
    testni(){
      this.$nextTick(() => {

        // EXTREMELY SMART SOLUTION FOR FOCUSING ELEMENT WITHOUT DOM LISTENERS

        //this one works perfectly
        document.getElementById("modal").focus()
      })
    },
    showMore(event){
      if(!(event.target.id === 'dots')){
        this.show = true
      }
    },
    oneClick: function(event,report){
       if(!(event.target.id === 'dots' || document.getElementById("modal") || document.getElementById('changer'))){ //DISABLE POPUP ON MODAL
        this.show = true
        this.report_id = report.id
        DataService.getReport(report.id).then(
            (res) => {
              this.report = res
            },
            error => {
              console.log(error);
            }
          );
      }
      this.clicks++ 
      if(this.clicks === 1) {
        let self = this
        this.timer = setTimeout(function() {
          self.clicks = 0
        }, this.delay);
      } else{
          clearTimeout(this.timer);
          DataService.getReport(report.id).then(
            (res) => {
              this.store.set_reportId(report.id);
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
          this.clicks = 0;
      }        	
    },
    call(report){
      DataService.getReport(report.id).then(
            (res) => {
              this.store.set_reportId(report.id);
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
    },
    async showSidebar(){
      this.show = false
      await DataService.getReports(this.folder.id).then(
        (res) => {
          this.data = res
        },
        error => {
          console.log(error);
        }
      );
    },
    async getFolders(){
      this.folders = [],
      await DataService.getFolders().then(
        (res) => {
          this.folders = res;
        },
        error => {
          console.log(error);
        }
      );
    },
    async removeFolder(){
      await DataService.removeFolder(this.folder.id).then(
        (res) => {
          res
          this.first_show = false
          this.data = []
          this.folder = []
          this.msg = "Deleted folder successfuly"
          this.type = 1
          this.showModal = true
          this.getFolders()
        },
        error => {
          console.log(error);
        }
      );
    },
    async openFolder(index,folder){
      this.first_show = true
      this.path = folder.name
      await DataService.getReports(this.folders[index].id).then(
        (res) => {
          this.data = res
          this.folder = folder
        },
        error => {
          console.log(error);
        }
      );
    },

    async deleteReport(report){
      DataService.deleteReport(report.id).then(
            (res) => {
              res
              this.msg = "Deleted report successfuly"
              this.type = 1
              this.showModal = true
              this.showSidebar()
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
*, ::after, ::before {
  box-sizing: border-box;
}
.manager-container{
    margin-top: 64px;
    width: 100%;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
}
@media (min-width: 1200px){
    .flex {
        -ms-flex-wrap: nowrap !important;
        flex-wrap: nowrap !important;
    }
}
.row {
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
}

.first-column {
  -ms-flex-order: 0;
  order: 0;
  border-bottom: 1px solid rgba(0,0,0,.1);
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

@media (min-width: 768px){
    .first-column {
        border-right: 1px solid rgba(0,0,0,.1);
    }
}

@media (min-width: 1200px){
    .first-column {
        max-width: 16.666667%;
    }
}



.main {
  margin-top: 15px;
  -ms-flex-order: 1;
  order: 1;
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-left: 15px;
  display: block;
}
  @media (min-width: 768px){
    .main{
        max-width: 100%;
        position: relative;
        width: 100%;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
    }
  }

  @media (min-width: 1200px){
    .main {
       -ms-flex: 0 0 83.333333%;
        flex: 0 0 83.333333%;
        max-width: 83.333333%;
    }

    .constricted{
      -ms-flex: 0 0 66.666667%;
      flex: 0 0 66.666667%;
      max-width: 66.666667%;
    }

  }


.plus-icon{
  width: 20px;
  height: 20px;
}

.main-icons{
  position: relative;
  height: 30px;
  width: 30px;
  padding: 7px;
  font-size: 15px;
}


.table {
  margin-top:50px;
}

.popup-style{
  right: 40px;
}

#dots{
  cursor:pointer;
  margin-left: -20px;
  top: 13px;
  position: relative;
  color:black;
  font-weight:bold;
}

.menuicon{
  margin-left: 5px;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 16px;
}
</style>
