<template>
    <div style="display:flex;">
        <button class="menu-file scale-on-hover" @click="file = !file;fileFocus()">File</button>
            <div id="filemodal" class="popup-style"  @focusout="fileHandle(index)" v-if="file" tabindex="0">
                <div style="display:table;width:inherit;padding: 16px 0;">
                    <a class="menuicon-button" style="color: black" @click="newReport()">
                        <div class="menuicon" >&#x1F440;</div>
                        <p style="margin-left:5px">{{this.store.role === 'viewer' ? 'Open Report' : 'New/Open Report'}}</p>
                    </a>
                    <a class="menuicon-button" style="color: black" @click="save()">
                        <div class="menuicon" style="font-size:20px">&#x270e;</div>
                        <p style="margin-left:5px">Save as</p>
                    </a>
                    <a class="menuicon-button" style="color: black" @click="deleteReport()">
                        <img :src="require(`@/assets/garbage.png`)" style="width:25px;height:25px" class="menuicon">
                        <p style="margin-left:5px">Delete</p>
                    </a>
                    <a class="menuicon-button" style="color: black"  @click="exportToPdf">
                        <img :src="require(`@/assets/pdf_export.png`)" style="width:25px;height:25px" class="menuicon">
                        <p style="margin-left:5px">Export to PDF</p>
                    </a>
                    <a class="menuicon-button" style="color: black" @click="exportToExcel">
                        <img :src="require(`@/assets/excel_export.png`)" style="width:25px;height:25px" class="menuicon cursor">
                        <p style="margin-left:5px">Export to Excel</p>
                    </a>
                </div>
            </div>

        <button @click="website = !website;websiteFocus()" class="menu-file scale-on-hover">WebSite</button>
            <div id="websitemodal" class="popup-style" style="left:70px" @focusout="websiteHandle(index)" v-if="website" tabindex="0">
                <div style="display:table;width:inherit;padding: 16px 0;">
                    <a class="menuicon-button" style="color: black" @click="generate();">
                        <div class="menuicon">&#x1F440;</div>
                        <p style="margin-left:5px">Generate WebSite</p>
                    </a>
                </div>
            </div>
            <div id="websitePopupModal" class="dropdown-menu" style="right:0;width: 300px;left:50px;top:55px" @focusout="websitePopupHandle($event)" v-if="websitePopup" tabindex="0">
                <div style="margin:10px">
                    <h2 style="color: black" > WebSite </h2>
                    <div style="display:table">
                        <input id="input-value" class="input-website" :value="msg"/>
                        <div style="width: 1%;vertical-align: middle;display: table-cell;cursor:pointer" @click="copyToClibBoard()">
                            <div class="tooltip">
                                <button @mouseout="outFunc()" id="button-copy" class="button-website">
                                    <span class="tooltiptext" id="myTooltip">Copy to clipboard</span>
                                    <div style="font-size:23px;">&#x2398;</div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div @click="websitePopup = !websitePopup" style="position:absolute;top:10px;right:0">
                         <a class="close"/>
                    </div>
                </div>
            </div>
        <button v-if="store.role === 'viewer'" @click="timer = !timer;timerFocus()" class="menu-file scale-on-hover">Timer</button>
            <div id="timermodal" class="popup-style" style="left:70px" @focusout="timerHandle(index)" v-if="timer" tabindex="0">
                <div style="display:table;width:inherit;padding: 16px 0;">
                    <a class="menuicon-button" style="color: black" @click="showModalTimer = !showModalTimer; timer = !timer">
                        <div class="menuicon"><img :src="require(`@/assets/timer.png`)" style="width:25px;height:25px" alt=""></div>
                        <p style="margin-left:5px">Set Timer</p>
                    </a>
                </div>
            </div>
        <button class="menu-file scale-on-hover" @click="help = !help;helpFocus()">Help</button>
            <div id="helpmodal" class="popup-style" style="left:100px" v-if="help" @focusout="helpHandle(index)" tabindex="0">
                <div style="display:table;width:inherit;padding: 16px 0;">
                    <a class="menuicon-button" style="color: black" >
                        <div class="menuicon">&#x1F440;</div>
                        <p style="margin-left:5px">Help</p>
                    </a>
                    <a class="menuicon-button" style="color: black" >
                        <div class="menuicon" style="font-size:20px">&#x270e;</div>
                        <p style="margin-left:5px">License</p>
                    </a>
                </div>
            </div>
        <Teleport to="body">
            <!-- use the modal component, pass in the prop -->
            <popup-timer :show="showModalTimer" @close="showModalTimer = false"/>
            <popup :show="showModal" @close="showModal = false" :saveAs="true"/>
            <loading v-if="loading"/>
        </Teleport>
    </div>
</template>
<script>
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import Popup from '../popups/PopupCreate.vue'
import DataService from '../services/data.services'
import PopupTimer from '../popups/PopupTimer.vue'
import TableToExcel from "@linways/table-to-excel"
import { useAuthUserStore } from '../store/index'
export default {
    components:{Popup,PopupTimer},
    data(){
        return{
            file: false,
            edit: false,
            view: false,
            timer: false,
            website: false,
            websitePopup: false,
            help: false,
            selected: '',
            loading: false,
            showModal: false,
            showModalTimer: false,
            msg: '',
            store: useAuthUserStore(),
        }
    },
    methods:{
        fileFocus(){
            this.$nextTick(() => {
                document.getElementById("filemodal").focus()
            })
        },
        fileHandle(){
            this.file = false
        },

        timerFocus(){
            this.$nextTick(() => {
                document.getElementById("timermodal").focus()
            })
        },
        timerHandle(){
            this.timer = false
        },
        websiteFocus(){
            this.$nextTick(() => {
                document.getElementById("websitemodal").focus()
            })
        },
        websiteHandle(){
            this.website = false
        },
        helpFocus(){
            this.$nextTick(() => {
                document.getElementById("helpmodal").focus()
            })
        },
        helpHandle(){
            this.help = false
        },

        newReport(){
            if(this.store.role === 'viewer'){
                this.$router.push('/Manager')
                return
            }
            this.store.set_reportName('');
            this.store.set_reportContent([]);
        },

        save(){
            this.showModal = true
        },

        generate(){
            this.website = false
            this.websitePopup = true;
            this.$nextTick(() => {
                document.getElementById("websitePopupModal").focus()
            })
            DataService.getReport(this.store.report_id).then(  //UPDATE REPORTA
                (res) => {
                    this.msg = "http://localhost:8080/reports/?report=" + res[0].hash
                },
                error => {
                console.log(error);
                }
            );

        },

        //PRETTY DUMB SOLUTION FOR FOCUS OUT HANDLE BUT COULDN T FIND BETTER
        websitePopupHandle(event){
            if(event.explicitOriginalTarget.className !== 'dropdown-menu' && event.explicitOriginalTarget.nodeName !== '#text' && event.explicitOriginalTarget.className !== 'button-website' && event.explicitOriginalTarget.innerHTML !== ' WebSite ' && event.explicitOriginalTarget.textContent !== ' WebSite Copy to clipboard ⎘ '){
                this.websitePopup = false
            }
        },


        exportToPdf(){
            this.loading = true
            let stateValue = this.store.admin_viewer
            this.store.set_editMode(false);

            this.$nextTick(() => {
                document.getElementById("customHeaderForPdf").style.display = "block"
                html2canvas(document.getElementById('forPDF'), {
                      width: document.getElementById('forPDF').clientWidth,
                      height: document.getElementById('forPDF').clientHeight
                    }).then((canvas) => {
                        const imgWidth = 210;
                        const pageHeight = 295;
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        let heightLeft = imgHeight;
                        let position = 0;
                        heightLeft -= pageHeight;
                        var doc = new jsPDF('p', 'mm');
                        doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                        while (heightLeft >= 0) {
                            position = heightLeft - imgHeight;
                            doc.addPage();
                            doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
                            heightLeft -= pageHeight;
                        }
                        doc.save('Downld.pdf');

                        if(stateValue){
                            this.store.set_editMode(!this.store.admin_viewer);
                        }
                        document.getElementById("customHeaderForPdf").style.display = "none"
                        this.loading = false
                })
            })
        },

        
        async exportToExcel(){
             let celije = this.store.report_content
             let br = 0
             let book = '';
             let table = ''
             if(celije){
                 celije.forEach((element, index) => {
                 for(let i = 0 ; i < element.columns.length ; i++){
                     if(element.columns[i].text === "Table"){
                         if(br == 0){
                            br++
                            table = document.getElementById("myTable" + i + index);
                            book = TableToExcel.tableToBook(table, {sheet:{name:"sheet" + (br)}});
                         }
                         else{
                            br++
                            table = document.getElementById("myTable" + i + index);
                            TableToExcel.tableToSheet(book, table, {sheet:{name:"sheet" + (br)}});
                         }
                     }
                     else if(element.columns[i].text === "PivotGrid"){
                        if(br == 0){
                            br++
                            table = document.getElementById("pivot-table-" + i + index);
                            book = TableToExcel.tableToBook(table, {sheet:{name:"sheet" + (br)}});
                         }
                         else{
                            br++
                            table = document.getElementById("pivot-table-" + i + index);
                            TableToExcel.tableToSheet(book, table, {sheet:{name:"sheet" + (br)}});
                         }
                     }
                 }
                 })
                 TableToExcel.save(book, "viztool.xlsx")
            }
    
        },


        getHeader(data){
            const obj = {
                column: [],
                area: [],
                data: [],
            }
            let list_column = []
            let list_area = []
            let list_data = []
            data[0].forEach(item => {
                if(item.area === 'column'){
                    list_column.push(item.caption)
                }
                else if(item.area === 'data'){
                    list_data.push(item.caption)
                }
                else if(item.area === 'row'){
                    list_area.push(item.caption)
                }
            })
            obj.column = list_column
            obj.area = list_area
            obj.data = list_data
            return obj
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

        deleteReport(){
            DataService.deleteReport(this.store.report_id).then(
                () => {
                    this.store.set_reportName('');
                    this.store.set_reportContent([]);
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
.dropdown-menu{
  position: absolute;
  left:-73px;
  top: 50px;
  z-index: 2;
  float: left;
  min-width: 160px;
  padding: 5px 0;
  margin: 2px 0 0;
  list-style: none;
  font-size: 14px;
  text-align: left;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  background-clip: padding-box;
}

.menu-file{
    margin-left: 10px;
    border: none;
    background: none;
    color: white;
    position: relative;
}

/*SIDE POPUP*/
.popup-style{
  top:55px;
}

.menuicon{
  margin-left: 5px;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 16px;
}

</style>