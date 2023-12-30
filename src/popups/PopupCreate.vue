<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" style="margin:0px">
      <div class="modal-wrapper">
        <div class="modal-container-create">
          <div class="modal-up">
            <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin: 0 -5px;padding: 0 5px;font-size:15px">
                <h2 style="margin:15px">Create new or open existing report</h2>
            </div>
            <a v-if="saveAs" class="close" style="top:20px" @click="$emit('close')"/>
          </div>
          <div>
              <div v-if="recent && !saveAs">

                    <div style="border-bottom: 1px solid #0000005e;padding-bottom: 5px; padding-top: 20px; margin:10px" v-if="this.store.role === 'admin'">
                        <div class="tree-view-item-node" @click.stop="openData = !openData">         	
                            <span :class="{opened: openData}" style="background:none;padding-left:20px" class="tree-view-item-key tree-view-item-key-with-chevron-1"><h3 style="margin:15px;">New</h3></span>
                        </div> 
                        <div v-show="openData" style="margin:15px;text-align:center;width:fit-content;">
                            <div style="border:1px solid #bdbdbd;width:150px;height:150px;box-shadow: 1px 2px 22px 0px rgba(89, 87, 87, 0.85);cursor:pointer" @click="openNewReport()">
                                <span style="display: flex;justify-content: center;top: 45%;position: relative;font-size:20px">+</span>
                            </div>
                            <p>Blank report</p>
                        </div>
                    </div>



                    <div>
                        <div style="margin:10px; padding-top: 50px;">
                            <div class="tree-view-item-node" @click.stop="openFolders = !openFolders">         	
                                <span :class="{opened: openFolders}" style="background:none;padding-left:20px" class="tree-view-item-key tree-view-item-key-with-chevron-1"><h3 style="margin:15px;">Recent</h3></span>
                            </div> 
                            <div v-show="openFolders" style="margin:15px;text-align:center;height: auto;overflow: auto;">
                              <div style="margin-bottom: 11px;border-bottom: 1px solid #dcdcdc;" v-for="(folder,index) in folders" :key="index">
                                <!-- zaglavlje -->
                                  <div style="display:table;width: 100%;cursor: pointer;overflow: auto;" @click="openFolder(index)">
                                    <div style="width: 25px;vertical-align: middle;display: table-cell;">

                                      <div style="margin-right: 10px;width: 16px;height: 16px;position: relative;display: inline-block;">
                                        <div v-show="!report_show[index]" style="height: 100%;width: 2px;top: 0;left: 7px;-webkit-transition: all ease-in-out 100ms 0s;-moz-transition: all ease-in-out 100ms 0s;-o-transition: all ease-in-out 100ms 0s;-ms-transition: all ease-in-out 100ms 0s;transition: all ease-in-out 100ms 0s;position: absolute;background-color: #6d6d6d;-webkit-border-radius: 1px;-moz-border-radius: 1px;border-radius: 1px;"></div>
                                        <div style="position: absolute;width: 100%;height: 2px;background-color: #6d6d6d;left: 0;top: 7px;"></div>
                                      </div>
                                    </div>
                                    
                                    <div style="display: table-cell;position: relative;text-align:initial">
                                      <div style="font-size: 16px;color: #1c1c1c;display: inline-block;margin-right: 10px;">{{folder.name}}</div>
                                    </div>
                                  </div>
                                  <div style="margin-top:15px;overflow:auto">
                                    <div v-show="report_show[index]">

                                      <table class="table">
                                        <thead>
                                          <tr style="border-top-style:hidden">
                                              <th v-for="object in objects" :key="object.id">
                                                <div v-if="object === 'id'"><img :src="require(`@/assets/folderg.png`)" style="width:20px;height:20px" class="menuicon cursor"></div>
                                                <div v-else>{{object.toUpperCase()}}</div>
                                              </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr v-for="(line,index1) in reports.slice().reverse()" :key="index1" class="row-hoverable" @click="openReport(line,folder)">
                                              <td class="tableobject" v-for="(object,index) in objects" :key="index" style="text-align: center; vertical-align: middle;padding:0.25rem">
                                                <div v-if="object === 'id'"><img :src="require(`@/assets/logo_pravi.png`)" style="width:30px;height:30px" class="menuicon cursor"></div>
                                                <div v-else>{{line[objects[index]]}}</div>
                                              </td>
                                          </tr>
                                        </tbody>
                                      </table>

                                    </div>
                                  </div>
                              </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div v-else style="position:relative; padding: 20px; margin: 10px">

                    <div style="margin:15px;">
                        <div class="name_report">Enter report name:</div>

                        <div class="input-name">
                            <input type="text" placeholder="Report name" class="sqlkucica" style="margin-left:0px" v-model="name">
                            <span class="underline-animation"></span>
                        </div>

                        <div style="position:relative">

                          <div class="name_report" style="margin-top:20px">Select folder to store the report</div>
                          <span @click="newReport = !newReport" class="plus-icon scale-on-hover">+</span>
                        </div>

                        <div class="bucket" style="height: auto;overflow: auto; border-width: 0px;">
                            <li class="list-content" v-for="(folder,index) in folders" :key="index">
                              <img :src="require(`@/assets/folderg.png`)" class="icon-file">
                              <p
                              class="custom-link-outline" :class="{ active: isActive(index) }" style="font-size:15px" @click="clickFolder(index,folder)">{{folder.name}}
                              </p>
                            </li>
                            <li class="list-content" v-if="newReport">
                                <img :src="require(`@/assets/folderg.png`)" class="icon-file">
                                <div class="field" style="display:flex;justify-content:center">
                                  <input v-on:keyup.enter="blurFolder($event)" placeholder="Report name:" id="user-name" type="text" class="field-value form-control" @blur="blurFolder($event)">
                              </div>
                            </li>
                        </div>

                        <div name="footer" style="padding-top: 20px;">
                          <button v-if="!saveAs" @click="recent = !recent" class="go scale-on-hover" style="float:left">Back</button>
                          <button @click="createReport()" :disabled='isDisabled' class="go scale-on-hover" style="float:right">Create report</button>
                            <!--<button
                            :disabled='isDisabled'
                            class="modal-default-button"
                            @click="createReport()"
                            >OK</button>-->
                          
                        </div>

                    </div>

                    <div class="modal-footer" style="padding:15px">
                    
                    </div>
                </div>

          </div>


        </div>
      </div>
    </div>
  </Transition>
</template>


<script>
import DataService from '../services/data.services'
import { useAuthUserStore } from '../store/index'
export default {
  props: {
    show: Boolean,
    msg: String,
    saveAs: Boolean,
  },
  data(){
    return{
      folders:[],
      name: '',
      path: '',
      openData: true,
      openFolders: true,
      folder_show: [],
      report_show: [],
      reports: [],
      id: '',
      objects: ['id', 'name', 'last_edited'],
      data: [{"id":16,"Name":"Danasnji report","DateModified":"2022-05-03T09:50:40"},{"id":17,"Name":"Drugi report","DateModified":"2022-05-03T16:20:32"},{"id":18,"Name":"Novi report","DateModified":"2022-05-11T01:35:15"},{"id":17,"Name":"Drugi report","DateModified":"2022-05-03T16:20:32"},{"id":18,"Name":"Novi report","DateModified":"2022-05-11T01:35:15"},{"id":17,"Name":"Drugi report","DateModified":"2022-05-03T16:20:32"},{"id":18,"Name":"Novi report","DateModified":"2022-05-11T01:35:15"}],
      recent: true,
      newReport: false,
      store: useAuthUserStore(),
    }
  },
  created(){
    this.getFolders()
  },
  computed: {
    isDisabled: function () {
      return (this.name === "" || this.path === "")
    }
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
    },
    openNewReport(){
        this.recent = false;
    },
    openReport(report,folder){
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
              this.store.set_reportPath(folder.name);
              this.$emit('close')
            },
            error => {
              console.log(error);
            }
          );
    },
    createReport(){
        this.$emit('close')
        this.store.set_reportName(this.name);
        this.store.set_reportPath(this.path);
        this.store.set_reportContent(this.store.report_content);
        let data = 
        {
            "name": this.name,
            //"content": '"' + this.store.report_content + '"',
            "content" : JSON.stringify(this.store.report_content).toString().replaceAll('"','\\"'),
            "Folders_id" : this.id
        }
        if(!this.saveAs){
          DataService.postReport(data).then(  //NOVI REPORT UNUTAR FOLDERA
              (res) => {
                this.store.set_reportId(res);
              },
              error => {
              console.log(error);
              }
          );
        }
        else{
          data.content = '[]'
          DataService.postReport(data).then(  //NOVI REPORT UNUTAR FOLDERA
              (res) => {
                this.store.set_reportId(res);
                let info = 
                {
                    "id": res,
                    "content" : JSON.stringify(this.store.report_content).toString().replaceAll('"','\\"'),
                    "name" : this.name,
                }
                DataService.updateReport(info).then(  //UPDATE REPORTA
                    (res) => {
                        res
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
        }
    },
    isActive(index){
      return (this.folder_show[index] === undefined || this.folder_show[index] === false) ? false : true
    },
    clickFolder(index,folder){
      this.folder_show = []
      //console.log(this.folder_show)
      this.folder_show[index] = true
      this.path = folder.name
      this.id = folder.id
    },
    openFolder(index){
      if(this.report_show[index] === true){
        this.report_show = []
        return
      }
      this.report_show = []
      this.report_show[index] = true
      DataService.getReports(this.folders[index].id).then(
        (res) => {
        this.reports = res
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
  }

}
</script>
<style scoped>

    input:focus, textarea:focus, select:focus{
        outline: none;
    }

</style>