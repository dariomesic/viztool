<template>
  <p v-if="Column.title" style="text-align:center;color: #232323;white-space: pre;font-size: 28px;font-family: Segoe UI Light, Helvetica Neue Light, Segoe UI, Helvetica Neue, Trebuchet MS, Verdana, sans-serif;font-weight: 200;fill: rgb(35, 35, 35);cursor: default;"> {{Column.title}} </p>
  <ParaterizedSlot :Column="Column" @modelChanged="$emit('setObject', $event)"/>
  <div style="min-height:200px;border: none" class="treeview">
    <table :id="widgetID" class="table table-striped table-bordered">
        <thead>
            <tr>
                <th v-for="object in Column.items" :key="object.id">{{object.title}} <span @click="sortBy(object.title)" style="cursor:pointer">&#x21D5;</span></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="line in Column.data" :key="line.id">
                <td class="tableobject" :style="styleObject(Column.items[index].title,line[object.title])" v-for="(object,index) in Column.items" :key="index">{{line[object.title]}}</td>
            </tr>
        </tbody>
    </table>
  </div>
    <modal :show="showModal" :type="type" :msg="msg" @close="showModal = false"/>
</template>

<script>
import ParaterizedSlot from '../components/ParameterizedSlot.vue'

import { useAuthUserStore } from '../store/index'
export default {
    props:['column','cellId', 'data'],
    emits:['setParameters','setObjects','setData', 'setSql'],
    components:{ParaterizedSlot},
    data(){
        return{
            Column: this.column,
            widgetID: 'myTable'+this.column.id+this.cellId,
            editField : '',
            msg: '',
            showModal: false,
            showIndicator: true,
            conditionalFormat: this.column.conditionals,
            store: useAuthUserStore(),
            type: 0
        }
    },
    watch:{
      column:{
        handler(val){
          switch(val.table_type){
            case "Striped":
              document.getElementById("myTable").classList.add('table-striped');
              break;
            case "Bordered":
              document.getElementById("myTable").classList.add('table-bordered');
                break;
            case "Border less":
              document.getElementById("myTable").classList.remove('table-striped');
              document.getElementById("myTable").classList.remove('table-bordered');
              break;
            case "Hoverable rows":
              break;
            
          }
          this.Column = val
          this.conditionalFormat = val.conditionals
        },
        deep:true,
      },
      "store.admin_viewer": {
        handler: function(nv) {
            if(!nv && (this.store.role === 'admin')){
              document.getElementById(this.widgetID).style.border = ""
            }
        },
        immediate: true // provides initial (not changed yet) state
      },
    },
    methods:{
      sortBy(object){
        let byDate = this.Column.data.slice(0);
        byDate.sort(function(a,b) {
          if(typeof a[object] === 'string'){
            let x = a[object].toLowerCase();
            let y = b[object].toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
          }
          else{
            return a[object] - b[object];
          }
        });
        this.$emit('setObject',{type : 'data', objects : byDate})
      },
      styleObject(name,value) {
        if(this.conditionalFormat){
         for(let i = 0 ; i < this.conditionalFormat.length ; i++){
           if(this.conditionalFormat[i].header === name || this.conditionalFormat[i].header === 'All Values'){
               switch (this.conditionalFormat[i].sign){
                 case 'Less Than':
                   if(this.conditionalFormat[i].value > value && !isNaN(value)){
                     return{background : this.conditionalFormat[i].colorCell, color: this.conditionalFormat[i].colorText, fontFamily: this.conditionalFormat[i].format, fontSize: this.conditionalFormat[i].fontSize, fontStyle: (this.conditionalFormat[i].italic ? 'italic' : 'none'), fontWeight: (this.conditionalFormat[i].bold ? 'bold' : 'none'), textDecoration: (this.conditionalFormat[i].underline ? 'underline' : 'none'), textUnderlinePosition: 'under'}
                   }
                   break
                 case 'Equals':
                   if(this.conditionalFormat[i].value == value){
                     return{background : this.conditionalFormat[i].colorCell, color: this.conditionalFormat[i].colorText, fontFamily: this.conditionalFormat[i].format, fontSize: this.conditionalFormat[i].fontSize, fontStyle: (this.conditionalFormat[i].italic ? 'italic' : 'none'), fontWeight: (this.conditionalFormat[i].bold ? 'bold' : 'none'), textDecoration: (this.conditionalFormat[i].underline ? 'underline' : 'none'), textUnderlinePosition: 'under'}
                   }
                   break
                 case 'More Than':
                   if(this.conditionalFormat[i].value < value && !isNaN(value)){
                     return{background : this.conditionalFormat[i].colorCell, color: this.conditionalFormat[i].colorText, fontFamily: this.conditionalFormat[i].format, fontSize: this.conditionalFormat[i].fontSize, fontStyle: (this.conditionalFormat[i].italic ? 'italic' : 'none'), fontWeight: (this.conditionalFormat[i].bold ? 'bold' : 'none'), textDecoration: (this.conditionalFormat[i].underline ? 'underline' : 'none'), textUnderlinePosition: 'under'}
                   }
                   break
                 case 'Between':
                   if(this.conditionalFormat[i].between[1] > value && this.conditionalFormat[i].between[0] < value && !isNaN(value)){
                     return{background : this.conditionalFormat[i].colorCell, color: this.conditionalFormat[i].colorText, fontFamily: this.conditionalFormat[i].format, fontSize: this.conditionalFormat[i].fontSize, fontStyle: (this.conditionalFormat[i].italic ? 'italic' : 'none'), fontWeight: (this.conditionalFormat[i].bold ? 'bold' : 'none'), textDecoration: (this.conditionalFormat[i].underline ? 'underline' : 'none'), textUnderlinePosition: 'under'}
                   }
                   break
               }
             }
         }
        }
        return ''
      },

    }
}
</script>