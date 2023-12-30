<template>
    <div class="tree-view-wrapper">
      <div v-for="data in parsedData" :key="data.key">
        <TreeViewItem @sql="changesql" @clickedData="clickedData" class="tree-view-item-root" :data="data" :max-depth="maxDepth" :currentDepth="0"></TreeViewItem>
      </div>
    </div>
</template>
<script>
import TreeViewItem from './tree-view-item.vue'
export default {
    name: "tree-view",
    props: ["data", "max-depth"],
    emits: ['sql'],
    components:{TreeViewItem},
    data(){
      return{
        parent: "",
      }
    },
    methods: {
      changesql(e){
          this.$emit('sql', e)
      },
      clickedData({kolona,parent}){
        this.$emit('clickedData', {kolona: kolona,parent: parent})
      },
      // Transformer for the non-Collection types, 
    // like String, Integer of Float
    transformValue: function(valueToTransform, keyForValue){
      if(keyForValue == "TableName"){
        this.parent = valueToTransform
      }
      return {
            key: keyForValue,
            type: "value",
            value: valueToTransform,
            parent: this.parent
        }
    },
  
      // Since we use lodash, the _.map method will work on
    // both Objects and Arrays, returning either the Key as
    // a string or the Index as an integer
      generateChildrenFromCollection: function(collection){
            return Object.entries(collection).map(([k, v]) => {
                if (this.isObject(v)) {
                    return this.transformObject(v, k);
                }
                if (this.isArray(v)) {
                    return this.transformArray(v, k);
                }
                if (this.isValue(v)) {
                    return this.transformValue(v, k);
                }
            }) ;   
    },
  
      // Transformer for the Array type
    transformArray: function(arrayToTransform, keyForArray){
      let array = []
      let i = 0;
      for(i ; i < arrayToTransform.length; i++){
        array.push(arrayToTransform[i].ColumnName)
      }
        return {
          key: keyForArray,
          type: "array",
          children: this.generateChildrenFromCollection(array)
      }
    },
    
    // Transformer for the Object type
      transformObject: function(objectToTransform, keyForObject, isRootObject = false){
          return {
              key: keyForObject,
              type: "object",
              isRoot: isRootObject,
              children: this.generateChildrenFromCollection(objectToTransform)
          }
      },
    
    // Helper Methods for value type detection
    isObject: function(value){
        return Object.prototype.toString.call(value) === '[object Object]';
    },
    
    isArray: function(value){
        return Array.isArray(value);
    },
    
    isValue: function(value){
        return !this.isObject(value) && !this.isArray(value);
    }
  },
  computed: {
      parsedData: function(){
        // Take the JSON data and transform
      // it into the Tree View DSL
      let objects = []
      for(let i = 0; i < this.data.length ; i++){
        objects.push(this.transformObject(this.data[i], "root" , true))
      }
      return objects
    }
  },
}
</script>
<style>
    
</style>