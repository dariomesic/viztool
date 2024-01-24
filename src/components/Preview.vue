<template>
    <div id="preview">
        <span v-if="this.store.role === 'viewer'" style="position:fixed;right:10px;top:10px;z-index:1;cursor:pointer;padding-top:60px" @click="showModalTimer = true">
            <a class="cursor-website" data-hover="Set timer">
                <img :src="require(`@/assets/timer.png`)" style="height: 50px;width: 50px;">
            </a>
            <p style="color:black;text-align:center">{{time ? millisToMinutesAndSeconds(time * 60 * 1000) : 'OFF'}}</p>
        </span>
        <div style="margin:50px;margin-top:100px">
            <SQLEditor v-if="this.store.role === 'admin' && this.store.admin_viewer" @addCell="addCell"/>
                <div id="forPDF">
                    <custom-header-for-pdf/>
                    <Cell
                        v-for="cell in cells"
                        :key="cell.id"
                        :cell="cell"
                        @addCell="addCell"
                        @removeCell="removeCell"
                        @addColumn="addColumn"
                        @upCell="upCell"
                        @downCell="downCell"
                    />
                </div>
        </div>
        <Menu/>
        <Teleport to="body">
            <popup-timer :show="showModalTimer" @close="showModalTimer = false"/>
        </Teleport>
    </div>
</template>

<script>
import CustomHeaderForPdf from './CustomHeaderForPdf.vue'
import Menu from '../radial-menu/Menu.vue'
import Cell from './Cell.vue'
import SQLEditor from '../charts/SQLEditor.vue'
import DataService from '../services/data.services'
import PopupTimer from '../popups/PopupTimer.vue'
import { useAuthUserStore } from '../store/index'
let nextCellId = 0
//let nextColumnId = 0
export default {
    name: 'Preview',
    emits:["addCell","removeCell","addColumn",],
    components: {
		Cell, SQLEditor, Menu, CustomHeaderForPdf, PopupTimer
	},
    data () {
        return {
			cells: [],
            report_name: '',
            report_path: '',
            msg: '',
            showDropDown: false,
            website: false,
            showModalTimer: false,
            time: 0,
            store: useAuthUserStore(),
        }
    },
    mounted() {
        if(this.store.role === 'viewer'){
            document.getElementById('preview').style.left = 0
        }
    },
    watch: {
        cells: {
            handler(val){
                //this.$emit('changeCells',val)   // TU IDE API
                //console.log(JSON.stringify(val).toString().replaceAll('"','\\"'))
                if(this.cells.length){
                    this.store.set_reportContent(val);
                    let info = 
                    {
                        "id": this.store.report_id,
                        "content": JSON.stringify(val).toString().replaceAll('"','\\"'),
                        "name" : this.store.report_name
                    }
                    DataService.updateReport(info).then(  //UPDATE REPORTA
                        (res) => {
                            res
                        },
                        error => {
                        console.log(error);
                        }
                    );
                }
            },
            deep: true
        },
        "store.report_name": {
            handler: function(nv) {
                this.report_name = nv
                this.cells = this.store.report_content
                //console.log(this.store.report_content)
            },
            immediate: true // provides initial (not changed yet) state
        },
        "store.report_path": {
            handler: function(nv) {
                this.report_path = nv
            },
            immediate: true // provides initial (not changed yet) state
        },
        "store.report_content": {
            handler: function(nv) {
                this.cells = nv
            },
            immediate: true // provides initial (not changed yet) state
        },
         "store.viewer_timer": {
           handler: function(nv) {
               this.time = nv
           },
           immediate: true  //provides initial (not changed yet) state
       },
    },
	methods: {
		addCell (idToAdd) {
            for(let i = idToAdd ; i < this.cells.length; i++){
                this.cells[i].id += 1
            }
            this.cells.push({
				id: idToAdd,
                columns: [
                    {
                        id: nextCellId,
                        text: '',
                    }
                ]
			})
            let byId = this.cells.slice(0);
            byId.sort(function(a,b) {
                return a.id - b.id;
            });
            this.cells = byId
		},
		removeCell (idToRemove) {
			this.cells = this.cells.filter(cell => {
				return cell.id !== idToRemove
			})
            for(let i = idToRemove ; i < this.cells.length; i++){
                this.cells[i].id -= 1
            }
		},
		addColumn ({cellId,columnId}) {
            this.cells[cellId].columns.push({
				id: columnId+1,
				text: '',
			})
            if(columnId + 1 < this.cells[cellId].columns.length - 1){
                for(let i = columnId + 1 ; i < this.cells[cellId].columns.length - 1; i++){
                    this.cells[cellId].columns[i].id += 1
                }
            }
            let byId = this.cells[cellId].columns.slice(0);
            byId.sort(function(a,b) {
                return a.id - b.id;
            });
            this.cells[cellId].columns = byId
		},
        sendAgain(v){
            this.$emit('sendAgain',v)
        },
        upCell (idCell) {
            if(idCell != 0){
                let tmp = this.cells[idCell - 1]
                let tmp_id = this.cells[idCell - 1].id
                this.cells[idCell - 1].id = this.cells[idCell].id
                this.cells[idCell - 1] = this.cells[idCell]
                this.cells[idCell].id = tmp_id
                this.cells[idCell] = tmp
            }
            },
        downCell (idCell) {
            if(idCell + 1 != this.cells.length){
                let tmp = this.cells[idCell + 1];
                let tmp_id = this.cells[idCell + 1].id
                this.cells[idCell + 1].id = this.cells[idCell].id
                this.cells[idCell + 1] = this.cells[idCell]
                this.cells[idCell].id = tmp_id
                this.cells[idCell] = tmp
            }
        },

        // newReport(){
        //     this.store(set_reportName', '');
        // },
        
        generate(){
            this.website = true;
            DataService.getReport(this.store.report_id).then(  //UPDATE REPORTA
                (res) => {
                    this.msg = window.location.href.split("/Home")[0] + "/api/reporthash?id=" + res[0].hash
                },
                error => {
                console.log(error);
                }
            );
            this.$nextTick(() => {
                document.getElementById("websitePopupModal").focus()
            })
        },


        copyToClibBoard(){
            /* Save value of myText to input variable */
            let input = document.getElementById("input-value").value;
            /* Copy the text inside the text field */
            navigator.clipboard.writeText(input);

            var tooltip = document.getElementById("myTooltip");
            tooltip.innerHTML = "Copied"
        },

        outFunc() {
            var tooltip = document.getElementById("myTooltip");
            tooltip.innerHTML = "Copy to clipboard";
        },
        millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + "min :" + (seconds < 10 ? '0' : '') + seconds + 's';
        }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#preview{
    flex: 1 1 auto;
    overflow: auto;
    position: relative;
    color: #6d7882;
    font-size: 13px;
    line-height: 1;
    text-transform: none;
    background-color: #fff;
}



</style>