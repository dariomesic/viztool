<template>
    <table class="table table-striped table-bordered">
    <thead>
        <tr>
          <th v-for="key in Columns" :key="key.id">
            {{Columns.includes("Input_type") ? key.replace("_", " ") : key}}
          </th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(entry,index) in data_tmp" :key="index">
        <td class="tableobject" style="width:33%" v-for="(key,index1) in Columns" :key="index1">

            <select class="paramterized-border" @change="changed($event,index)" v-if="Columns[index1] === 'Input_type'"> 
              <option v-if="data_tmp[index].Input_type === '' " selected>--</option>
              <option>Checkbox</option>
              <option>Drop down menu</option>
              <option>Text</option>
              <option>Free num entry</option>
              <option>Calendar</option>
            </select>

            <div style="text-align:left;background-image:none" v-else-if="Columns[index1] === 'Default_value'">
              <div v-if="option(index) === 'Checkbox'">
                <select @change="changedBool($event,index)" class="paramterized-border"> 
                  <option selected>--</option>
                  <option>True</option>
                  <option>False</option>
                </select>
              </div>

              <div v-else-if="option(index) === 'Free num entry'">
                <textarea @change="changedText(index,$event.target.value)" :value="model(index)" class="sqlkucica" style="width:-moz-available"></textarea>
              </div>

              <div v-else-if="option(index) === 'Drop down menu'" style="display:flex;justify-content:center;flex-wrap:wrap">
                <div class="data-widgets-icon" style="display:flex;margin-left:10px;margin-bottom: 15px;" v-for="(item, index1) in items[index]" :key="index1">
                  <span class="color checkbox" style="margin:0">
                    <input type="checkbox" :id="item + ' ' + index" @change="changedSelect($event, index)">
                    <label :for="item + ' ' + index"></label>
                  </span>
                  <span style="display:flex;align-items: center;">{{item}}</span>
                </div>
              </div>

              <div v-else-if="option(index) === 'Text'">
                <textarea @blur="blurText(index,$event.target.value)" class="sqlkucica" style="width:-moz-available"></textarea>
              </div>

              <div v-else-if="option(index) === 'Calendar'">
                 <input type="date"
                  class="sqlkucica"
                  @change="handleDate(index, $event.target)"
                  placeholder="MM/DD/YYYY"
              >  
              </div>
            </div>

            <div style="font-size:16px;" v-else> {{entry[key]}} </div>
        </td>
        </tr>
    </tbody>
    </table>
</template>

<script>
import DataService from '../services/data.services'

export default {
  name: 'grid',
  props: {
    data: Array,
    columns: Array,
    sql_table: String,
    sql_columns: Array
  },
  emits:['changed','opening'],
  data(){
    return{
      data_tmp : this.data,
      Columns: this.columns,
      show: false,
      items: [],
    }
  },
  watch:{
    data: {
        handler(val){
            this.data_tmp = val
        },
        deep: true
    },
    columns: {
        handler(val){
            this.Columns = val
        },
        deep: true
    },
    sql_columns: {
        handler(val){
            this.items = [];
            for(let i = 0 ; i < val.length ; i++){
              this.getDropData(val[i], i)
            }
        },
        deep: true
    },
  },
  mounted(){
    if(this.sql_columns){
      this.items = [];
      for(let i = 0 ; i < this.sql_columns.length ; i++){
        this.getDropData(this.sql_columns[i], i)
      }
    }
  },
  methods:{
    blurText(index1, event){
      let list = []
      list.push(event)
      this.data_tmp[index1].Default_value = list
      this.$emit('changed',this.data_tmp)
    },
    model(index1){
      return this.data_tmp[index1].Default_value
    },
    option(index){
        return this.data[index].Input_type
    },
    async getDropData(value, index){
      let list = []
      await DataService.getDropDownData({kolona:value,parent:this.sql_table}).then(
          (res) => {
              for (let i = 0; i < res.length; i++) { 
                list.push(res[i][value])
              }
          },
          error => {
            console.log(error);
          }
      );
      this.items[index] = list
    },
    changed(event,index1){
      this.data_tmp[index1].Input_type = event.target.value
      this.$emit('changed',this.data_tmp)
    },
    changedBool(event,index1){
      let list = []
      list.push(event.target.value)
      this.data_tmp[index1].Default_value = list
      this.$emit('changed',this.data_tmp)
    },
    changedSelect(event, index1){
      let tmp = this.data_tmp[index1].Default_value ? this.data_tmp[index1].Default_value : []
      tmp.push(event.target.id.split(" ")[0])
      this.data_tmp[index1].Default_value = tmp
      this.$emit('changed',this.data_tmp)
    },
    changedText(index1,value){
      let list = []
      list.push(Number(value))
      this.data_tmp[index1].Default_value = list
      this.$emit('changed',this.data_tmp)
    },
    handleDate(index1, target){
      let list = []
      list.push(target.value)
      this.data_tmp[index1].Default_value = list
      this.$emit('changed',this.data_tmp)
    }
  }
}
</script>

<style scoped>
.paramterized-border{
  text-align: center;
  border: 1.5px solid #1a6e4d;
  padding: 0.5em 2em 0.5em 0.5em;
}
</style>