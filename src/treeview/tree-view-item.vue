<template>
    <div>
        <div class="tree-view-item">
            <div v-if="isObject(data)" class="tree-view-item-leaf">
                <div class="tree-view-item-node" @click.stop="toggleOpen()">         	
                    <span :class="{opened: isOpen()}" v-if="!isRootObject(data)" class="tree-view-item-key tree-view-item-key-with-chevron">{{getKey(data)}}</span>
                    <span class="tree-view-item-hint" v-show="!isOpen() && data.children.length === 1">{{data.children.length}} property</span>
                    <span class="tree-view-item-hint" v-show="!isOpen() && data.children.length !== 1">{{data.children.length}} properties</span>
                </div>
                <div style="padding:5px"></div>
                <tree-view-item @sql="pokusaj" @clickedData="pokusaj2" :max-depth="maxDepth" :current-depth="currentDepth+1" v-show="isOpen()" v-for="child in data.children" :data="child" :key="child.key"></tree-view-item>
            </div>
            <div v-if="isArray(data)" class="tree-view-item-leaf">
                <div class="tree-view-item-node" @click.stop="toggleOpen()">
                    <span :class="{opened: isOpen()}" v-if="!isRootObject(data)" class="tree-view-item-key tree-view-item-key-with-chevron">{{getKey(data)}}</span>
                    <span class="tree-view-item-hint" v-show="!isOpen() && data.children.length === 1">{{data.children.length}} item</span>
                    <span class="tree-view-item-hint" v-show="!isOpen() && data.children.length !== 1">{{data.children.length}} items</span>
                </div>
                    <tree-view-item @sql="pokusaj" @clickedData="pokusaj2" :max-depth="maxDepth" :current-depth="currentDepth+1" v-show="isOpen()" v-for="child in data.children" :data="child" :key="child.key"></tree-view-item>
            </div>
            <div :id="data.parent" class="tree-view-item-leaf" v-if="isValue(data)">
                <!--<span class="tree-view-item-key">{{getKey(data)}}</span>-->       
                <span v-if="depth()" :id="data.value" @click="oneClick($event)" :title="getKey(data)" style="font-weight: bold;border:none" class="tree-view-item-value">{{getValue(data)}}</span>
                <span v-else style="border-radius: 5px;padding: 5px;margin: 5px;" :id="data.value" @click="oneClick($event)" :title="getKey(data)" class="tree-view-item-value">+ {{getValue(data)}}</span>
                <!-- draggable="true" @dragstart="startDrag($event, data.value)"-->          
            </div>
        </div>
    </div>
</template>
<script>
import { useAuthUserStore } from '../store/index'
export default {
    props: ["data", "max-depth", "current-depth"],
    name:"tree-view-item",
    data: function(){
        return {
            open: this.currentDepth < this.maxDepth,
            delay: 700,
            clicks: 0,
            timer: null,
            store: useAuthUserStore(),
        }
    },
    methods: {
        pokusaj(e){
            this.$emit('sql', e)
        },
        pokusaj2({kolona,parent}){
            this.$emit('clickedData', {kolona: kolona,parent: parent})
        },
        isOpen: function(){
            return this.isRootObject(this.data) || this.open;
        },
        toggleOpen:function(){
            this.open = !this.open;
        },    
        isObject: function(value){
            return value.type === 'object';
        },
        isArray: function(value){
            return value.type === 'array';
        },
        isValue: function(value){
            return value.type === 'value';
        },
        getKey: function(value){
            if (Number.isInteger(value.key)) {
                return value.key+":";
            } 
            else {
                return value.key + ":";	
            }
        },    
        getValue: function(value){
            return value.value == null ? 'null' : value.value;
        },
        isRootObject: function(value){
            return value.isRoot;
        },
        startDrag (evt) {
            const target = evt.target
            console.log(target)
            //console.log(evt)
            //console.log(item)
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('itemID', target.innerText)
          },
        oneClick: function(event){
          this.clicks++ 
          if(this.clicks === 1) {
            let self = this
            this.timer = setTimeout(function() {
              self.clicks = 0
            }, this.delay);
          } else{
             clearTimeout(this.timer);
             let line  
             if(this.store.parametrized){
                 this.$emit('clickedData',{kolona: event.target.id,parent: event.target.parentElement.id})
             }
             else{
                if(event.target.title == "TableName:"){
                    line = "select *" + " from " + event.target.id;
                }
                else{
                    line = "select " + event.target.id + " from " + event.target.parentElement.id;
                }

                this.store.set_sqlLine(line);
             }
             this.clicks = 0;
          }        	
        },
        depth(){
            return this.currentDepth == 1
        }   
    },
}
</script>
<style>
    
</style>