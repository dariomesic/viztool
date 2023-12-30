<template>
    <div id="panel">
        <div id="categories">
            <div id="basic" class="category" style="height:fit-content">
                <div id="widgets">
                  <div class="tree-view-item-node" @click.stop="toggleDynamics()">         	
                    <span :class="{opened: openDynamics}" class="tree-view-item-key tree-view-item-key-with-chevron-1"><h3 class="text-bold-main">Dynamic elements</h3></span>
                  </div>
                  <div v-show="openDynamics" class="widget-items-position">
                    <Widget
                        v-for="widget in dynamic"
                        :key="widget.id"
                        :widget="widget"
                    />
                  </div>
                  <div class="tree-view-item-node" @click.stop="toggleStatics()">         	
                    <span :class="{opened: openStatics}" class="tree-view-item-key tree-view-item-key-with-chevron-1"><h3 class="text-bold-main">Static elements</h3></span>
                  </div>                  
                  <div v-show="openStatics" class="widget-items-position">
                    <Widget
                        v-for="widget in statics"
                        :key="widget.id"
                        :widget="widget"
                    />
                  </div>
                </div>
                <div style="display:none" id="tree">
                  <div class="tree-view-item-node" @click.stop="toggleTree()">         	
                    <span :class="{opened: opentree}" class="tree-view-item-key tree-view-item-key-with-chevron-1"><h3 class="text-bold-main">Tree view</h3></span>
                  </div> 
                  <div v-show="opentree" class="treeview" style="height:400px;width:280px">
                      <a @click="zatvori" class="close"/>
                      <treeView :data="myData" max-depth="1"></treeView>
                  </div>
                </div>
            </div>
            <div class="tree-view-item-node" @click.stop="toggleData()">         	
              <span :class="{opened: openData}" class="tree-view-item-key tree-view-item-key-with-chevron-1"><h3 class="text-bold-main">Data Bucket</h3></span>
            </div>   
            <div v-show="openData">
              <div class="bucket" style="overflow-x: hidden;resize:vertical">
                <div class="card" :title="object.description" v-for="object in dataBucket.slice().reverse()" :key="object.id" draggable="true" @dragstart="startDrag($event, object)" @click="itemDetails(object,$event)">
                  {{object.name}}
                  <img :src="require(`@/assets/parameterized.png`)" class="parameterized" v-if="object.parametriziran === '1' && !editMode" title="Parameterized">
                  <span id="deletion" v-if="editMode" @click="removeObject(object)" style="font-weight:bold" class="parameterized">X</span>
                </div>
              </div>
              <div style="display:flex;margin-right: 14px;padding-bottom: 5px;" v-if="!editMode">
                <button @click="setEditMode()" type="button" class="bucket_gumb scale-on-hover">EDIT BUCKET</button>
                <label for="file-upload" class="bucket_gumb scale-on-hover" style="display: flex;justify-content: center;align-items: center">
                  ADD NEW ITEM
                </label>
                <input id="file-upload" type="file" accept=".csv, text/xml, .json" style="display:none" @change="uploadFile($event)"/>
              </div>
              <button @click="setEditMode()" v-if="editMode" type="button" class="bucket_gumb scale-on-hover">SAVE BUCKET</button>
            </div>

        </div>
    </div>
    <modal :show="showModal" :type="type" :msg="msg" @close="showModal = false"/>
    <popup-item :show="showItemModal" @close="showItemModal = false" :item="dataItem"/>
</template>

<script>
import DataService from '../services/data.services'
import Widget from './Widget.vue'
import treeView from '../treeview/tree-view.vue'
import PopupItem from '../popups/PopupDataBucketItem.vue'
import { useAuthUserStore } from '../store/index'
import X2js from 'x2js'
let nextWidgetId = 1

export default {
    name: 'Panel',
    props: {
        send: Boolean
    },
    components: {
		Widget,treeView, PopupItem
	},
    data () {
        return {
            dataBucket:[],
            myData:[],
            openDynamics: true,
            openStatics: true,
            openData: true,
            opentree: true,
            editMode: false,
            showModal: false,
            showItemModal: false,
            store: useAuthUserStore(),
            dataItem: [],
            msg: '',
            type: 0,
            dynamic: [
              {
                id: nextWidgetId++,
                text: 'Table',
                src: 'table.png'
              },
              {
                id: nextWidgetId++,
                text: 'AreaChart',
                src: 'areachart.png'
              },
                      {
                id: nextWidgetId++,
                text: 'LineChart',
                src: 'lineChart.png'
              },
                      {
                id: nextWidgetId++,
                text: 'PieChart',
                src: 'piechart.png'
              },
                      {
                id: nextWidgetId++,
                text: 'BarChart',
                src: 'barchart.png'
              },
              {
                id: nextWidgetId++,
                text: 'RadarChart',
                src: 'RadarChart.png'
              },
                      {
                id: nextWidgetId++,
                text: 'ListView',
                src: 'ListIcon.png'
              },
              {
                id: nextWidgetId++,
                text: 'PivotGrid',
                src: 'PivotTable.png'
              },
              {
                id: nextWidgetId++,
                text: 'ScatterPlot',
                src: 'scatterPlot.png'
              },
            ],
            statics: [
              {
                id: nextWidgetId++,
                text: 'Text',
                src: "Text.png"
              },
              {
                id: nextWidgetId++,
                text: 'Image',
                src: "image.png"
              },
              {
                id: nextWidgetId++,
                text: 'GeoMap',
                src: 'geoMap.png'
              },
            ]
        }
    },
    created(){
      this.addToBucket()
      this.getData()
    },
    methods:{
        uploadFile(e){
          return new Promise((resolve) => {
            var file = e.target.files[0];
            var reader = new FileReader();
            switch(e.target.files[0].type){
              case "application/vnd.ms-excel":
                reader.readAsBinaryString(file);
                  reader.onload = (res) => {
                    resolve(this.convertCSVToJson(res.target.result, e.target.files[0].name));
                  };
                  reader.onerror = (err) => console.log(err);
                break;
              case "text/xml":
                reader.readAsText(file);
                  reader.onload = (res) => {
                    console.log(res)
                    let x2js = new X2js()
                    let json = x2js.xml2js(res.target.result)
                    var firstKey = Object.keys(json)[0]
                    if(firstKey === "0"){
                        this.dataBucket.push({"name": e.target.files[0].name, "id": res.target.result, "parametriziran": 'false', "description" : '', "statement" : ''});
                    }
                    else{
                        while(firstKey !== "0"){
                          json = json[firstKey]
                          firstKey = Object.keys(json)[0]
                        }
                        this.dataBucket.push({"name": e.target.files[0].name, "id": JSON.stringify(json), "parametriziran": 'false', "description" : '', "statement" : ''});
                    }
                  };
                  reader.onerror = (err) => console.log(err);
                break;
               case "application/json":
                 reader.readAsText(file);
                   reader.onload = (res) => {
                     var parsed = JSON.parse(res.target.result)
                     var firstKey = Object.keys(parsed)[0]
                      if(firstKey === "0"){
                         this.dataBucket.push({"name": e.target.files[0].name, "id": res.target.result, "parametriziran": 'false', "description" : '', "statement" : ''});
                      }
                      else{
                         while(firstKey !== "0"){
                           parsed = parsed[firstKey]
                           firstKey = Object.keys(parsed)[0]
                         }
                         this.dataBucket.push({"name": e.target.files[0].name, "id": JSON.stringify(parsed), "parametriziran": 'false', "description" : '', "statement" : ''});
                      }
                   };
                   reader.onerror = (err) => console.log(err);
                 break;
            }
          })
        },

        convertCSVToJson(csv, csvName) {
            let lines=csv.split("\n");
            let result = [];
            let headers=lines[0].split(",");
            for(let i=1;i<lines.length;i++){
              let obj = {};
              let currentline=lines[i].split(",");
              for(let j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j];
              }
              result.push(obj);
            }
            
            //return result; //JavaScript object
            result = JSON.stringify(result); //JSON
            this.dataBucket.push({"name": csvName, "id": result, "parametriziran": 'false', "description" : '', "statement" : ''});
        },
    


        setEditMode(){
          this.editMode = !this.editMode
        },
        removeObject(object){
          DataService.removeBucketData(object.id).then(
                () => {
                  this.msg = "Deleted item successfuly"
                  this.type = 1
                  this.showModal = true
                  this.addToBucket();
                },
                error => {
                  console.log(error);
                }
            );
        },
        async toggleDynamics(){
            this.openDynamics = !this.openDynamics
        },
        async toggleStatics(){
            this.openStatics = !this.openStatics
        },
        async toggleData(){
            this.openData = !this.openData
        },
        async toggleTree(){
            this.opentree = !this.opentree
        },
        async getData(){
          DataService.getData().then(
                (res) => {
                  this.myData = res;
                },
                error => {
                  console.log(error);
                }
            );
        },
        zatvori(){
            document.getElementById('widgets').style.display=""
            document.getElementById('tree').style.display = "none"
        },
        startDrag (evt, item) {
            evt.dataTransfer.setData('buckettype', item.id)
        },
        addToBucket(){
          this.dataBucket = [],
          DataService.getBucketData().then(
                (res) => {
                  for(let i = 0; i < res.length; i++){
                    this.dataBucket.push({"name": res[i].name, "id": res[i].id, "parametriziran": res[i].parametrized, "description" : res[i].description, "statement" : res[i].statement});
                  }
                },
                error => {
                  console.log(error);
                }
            );
        },
        itemDetails(item, event){
          if(event.target.id !== 'deletion'){
            this.dataItem = item
            this.showItemModal = true
          }

        }

    },
    watch:{
      "store.newBucketItem": {
          handler: function() {
              this.addToBucket()
          },
          immediate: true // provides initial (not changed yet) state
      },
    }

}
</script>