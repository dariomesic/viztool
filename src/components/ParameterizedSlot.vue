<template>
    <section v-if="this.store.role === 'admin'" style="display:flex;overflow:auto"> 
        <section v-for="(string,index) in column.parameters" :key="string.id" style="margin-left:15px;margin-bottom: 10px;border: 1px solid #868686;border-radius: 5px;">
            <section class="wrapper" id="par-wrapper" >
                <section style="font-size: 14px;padding: 1.0rem 0.9rem 0.2rem;color: #6d7882;">{{string.Name}}</section>
                <section style="font-size: 16px;padding: 0.5em 2em 0.5em 0.5em;color: #6d7882;display:flex">

                    <div class="input-name">
                        <input type="text" v-model="string.Label" @change="labelChanged(index, $event.target)" placeholder="Label:" style="margin-left:0px;width:120px;background:inherit;border:none;border-bottom: 2px solid lightgray;">
                        <span class="underline-animation"></span>
                    </div>

                    <select @change="modelChanged(index, $event.target)" class="parameterized_border" v-if="string.InputType === 'Checkbox'"> 
                        <option v-if="string.DefaultValue === true" enabled>True</option>
                        <option v-else>False</option>

                        <option v-if="string.DefaultValue === false" enabled>False</option>
                        <option v-else>True</option>
                    </select>

                    <select @change="modelChanged(index, $event.target)" class="format_select" v-else-if="string.InputType === 'Drop down menu'">
                        <option v-for="option in string.Options" :selected="string.DefaultValue[0] == option ? true : false" :key="option">{{option}}</option>
                    </select>

                    <div class="input-name" v-else-if="string.InputType === 'Free num entry'" style="margin-left:15px">
                        <input type="text" v-model="string.DefaultValue" @change="modelChanged(index, $event.target)" style="border:none;border-bottom: 2px solid lightgray;">
                        <span class="underline-animation"></span>
                    </div>
                    
                    <section v-else-if="string.InputType === 'Calendar'">
                        <input type="date"
                            @change="handleDate(index, $event.target)"
                            placeholder="MM/DD/YYYY"
                        >
                    </section>
                </section> 
            </section>
        </section>
    </section>    
</template>
<script>
import DataService from '../services/data.services'
import { useAuthUserStore } from '../store/index'

export default {
    props: ['Column'],
    emits: ['modelChanged', 'setParameters'],
    data(){
        return{
            column: this.Column,
            store: useAuthUserStore(),
        }
    },
    methods:{
        labelChanged(index, target){
            this.editField = '';
            let parameters = this.column.parameters[index]
            parameters.Label = target.value
            this.$emit('setParameters', this.column.parameters)
        },
        async modelChanged(id,target){
            let lista = []
            lista.push(target.value)
            let parameters = this.column.parameters
            parameters[id].DefaultValue = lista
            console.log(parameters)
            let sql = {
                "SqlStatement": this.column.sql,
                "ListParameters": JSON.stringify(parameters),     
            }
            await DataService.postSQL(sql).then(
            (res) => {
                this.$emit('modelChanged',{type : 'data', objects : res.dataTable})
            },
            error => {
                console.log(error);
            }
            );
        },
    }
}
</script>