<template>
    <div class="hover" :class="{ 'borderless stylePDF': (!(this.store.admin_viewer) || (this.store.role === 'viewer'))}">
      <span class="columns" style="display:flex">
        <keep-alive>
          <Column
            v-for="column in columns"
            :key="column.id"
            :column="column"
            :duljina="columns.length"
            @removeColumn="removeColumn"
            @drop="onDrop($event, column.id)"
            @dragover.prevent
            @dragenter.prevent
            :cellId="cell.id"
            @addColumn="addColumn"
            @leftColumn="leftColumn"
            @rightColumn="rightColumn"
            @paste="paste"
            @setObject="setObject"
          />
        </keep-alive>
      </span>

      <div class="topright" v-if="this.store.role === 'admin' && this.store.admin_viewer">
        <nav>
          <div @click="$emit('upCell', cell.id)" class="menuicon-button">
              <div class="tooltip">
                  <button style="border:none;background:none;cursor:pointer" class="scale-on-hover">
                      <span class="tooltiptext" id="myTooltip">Move column up</span>
                      <div style="font-size:25px;margin-top: -10px;">&uarr;</div>
                  </button>
              </div>
          </div>
          <div @click="$emit('downCell', cell.id)" class="menuicon-button">
              <div class="tooltip">
                  <button style="border:none;background:none;cursor:pointer" class="scale-on-hover">
                      <span class="tooltiptext" id="myTooltip">Move column down</span>
                      <div style="font-size:25px;margin-top: -10px;">&darr;</div>
                  </button>
              </div>
          </div>
          <div class="menuicon-button" @click="copyToClibBoard()">
              <div class="tooltip">
                  <button style="border:none;background:none;cursor:pointer" @mouseout="outFunc()" id="button-copy" class="scale-on-hover">
                      <span class="tooltiptext" :id="'myTooltip' + cellId">Copy to clipboard</span>
                      <div style="font-size:30px;margin-top: -10px;">&#x2398;</div>
                  </button>
              </div>
          </div>
          <div @click="pasteCell()" class="menuicon-button">
              <div class="tooltip">
                  <button style="border:none;background:none;cursor:pointer" class="scale-on-hover">
                      <span class="tooltiptext">Paste</span>
                      <img :src="require(`@/assets/drop.png`)" style="width:25px;height:25px">
                  </button>
              </div>
          </div>
          <div @click="$emit('removeCell', cell.id)" class="menuicon-button">
              <div class="tooltip">
                  <button style="border:none;background:none;cursor:pointer" class="scale-on-hover">
                      <span class="tooltiptext" id="myTooltip">Remove</span>
                      <img :src="require(`@/assets/garbage.png`)" style="width:25px;height:25px">
                  </button>
              </div>
          </div>

        </nav>
    
      </div>

    </div>
    <h2 class="plus-separator" v-if="this.store.role === 'admin' && this.store.admin_viewer"><button @click="$emit('addCell', cell.id + 1)" class="line-center">+</button></h2>
</template>

<script>
import Column from './Column.vue'
import { useAuthUserStore } from '../store/index'
export default {
  data(){
    return{
      store: useAuthUserStore(),
    }
  },
  props: {
    cell: {
      type: Object,
      required: true
    },
  },
  emits:["addCell","removeCell","addColumn","lowerID","upCell","downCell",'setAllowDeletion', 'removeColumn'],
  components: {
    Column
	},
  computed: {
    columns: function () {
      console.log(this.cell)
      return this.cell.columns
    }
  },
	methods: {
    onDrop (evt, id) {
      if(evt.dataTransfer.getData('buckettype') || evt.dataTransfer.getData("axis")){
        return
      }
      else{
        const widgetType = evt.dataTransfer.getData('widgetType');
        const dropzone = this.columns.filter(column => {
          return column.id == id
        })[0];
        dropzone.text = widgetType;
        if(widgetType === 'PivotGrid' || widgetType === 'Text'){
          dropzone.x_data = []
          dropzone.data = ''
        }
      }
    },

    pasteCell(){
      if(window.localStorage.getItem('copyCell')){
        this.$parent.cells[this.cell.id] = JSON.parse(window.localStorage.getItem('copyCell'))
        this.$parent.cells[this.cell.id].id = this.cell.id
        //this.$emit('paste',{content: JSON.parse(window.localStorage.getItem('copy')),id_cell: this.cellId, id_column: this.column.id})
      }
    },

    copyToClibBoard(){
        window.localStorage.setItem('copyCell',JSON.stringify(this.cell))
    
        var tooltip = document.getElementById("myTooltip" + this.cellId);
        tooltip.innerHTML = "Copied"
    },

    outFunc() {
        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "Copy to clipboard";
    },

    addColumn({cellId,columnId}){
      this.$emit('addColumn',{cellId: cellId, columnId: columnId})
    },
    removeColumn (idColumnToRemove) {
      let idCellToRemove = this.cell.id
      this.$parent.cells[idCellToRemove].columns =
        this.$parent.cells[idCellToRemove].columns.filter(
          column => 
          {return column.id !== idColumnToRemove}
        )
      for(let i = idColumnToRemove ; i < this.$parent.cells[idCellToRemove].columns.length; i++){
        this.$parent.cells[idCellToRemove].columns[i].id -= 1
      }
      if(this.cell.columns.length === 0){
        this.$emit('removeCell', idCellToRemove)
      }
    },
    leftColumn (idColumn) {
      if(idColumn != 0){
        let idCellToMove = this.cell.id
        let tmp = this.$parent.cells[idCellToMove].columns[idColumn - 1];
        let tmp_id = this.$parent.cells[idCellToMove].columns[idColumn - 1].id
        this.$parent.cells[idCellToMove].columns[idColumn - 1].id = this.$parent.cells[idCellToMove].columns[idColumn].id
        this.$parent.cells[idCellToMove].columns[idColumn - 1] = this.$parent.cells[idCellToMove].columns[idColumn]
        this.$parent.cells[idCellToMove].columns[idColumn].id = tmp_id
        this.$parent.cells[idCellToMove].columns[idColumn] = tmp
      }
    },
    rightColumn (idColumn) {
      let idCellToMove = this.cell.id
      if(idColumn + 1 != this.$parent.cells[idCellToMove].columns.length){
        let tmp = this.$parent.cells[idCellToMove].columns[idColumn + 1];
        let tmp_id = this.$parent.cells[idCellToMove].columns[idColumn + 1].id
        this.$parent.cells[idCellToMove].columns[idColumn + 1].id = this.$parent.cells[idCellToMove].columns[idColumn].id
        this.$parent.cells[idCellToMove].columns[idColumn + 1] = this.$parent.cells[idCellToMove].columns[idColumn]
        this.$parent.cells[idCellToMove].columns[idColumn].id = tmp_id
        this.$parent.cells[idCellToMove].columns[idColumn] = tmp
      }
    },
    paste({content,id_cell,id_column}){
      let tmp_id = this.$parent.cells[id_cell].columns[id_column].id
      this.$parent.cells[id_cell].columns[id_column] = content
      this.$parent.cells[id_cell].columns[id_column].id = tmp_id
    },
    setObject({type, objects, id_cell,id_column}){ //MOZDA NE TREBA PRENOSITI ID_CELL !!!!!!!!!!!!!!!!!!!!!! PROVJERITI
      this.$parent.cells[id_cell].columns[id_column][type] = objects
    },
	},
}
</script>

<style scoped>

.hover:hover > .topright {
  display: flex;
}

.topright {
  display: none;
  position: absolute;
  top: -30px;
  right: 16px;
  font-size: 26px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.15),0 2px 2px rgba(0,0,0,0.15),0 4px 4px rgba(0,0,0,0.15),0 8px 8px rgba(0,0,0,0.15);
  background: #FFF;
}

.menuicon-button {
  display: inline-block;
  position: relative;
  padding: 0.5rem 0.4rem;
  transition: 0.25s;
  user-select: none;
  opacity: .8;
}

h2 {
  text-align: center;
  position: relative;
  z-index: 1;
}


</style>