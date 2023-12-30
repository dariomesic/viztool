<template>
  <div id="chart-demo-pie">
    <div v-if="editMod" id="axis"  class="drop-zone border-chart" @drop="onDrop($event,0)">
      <div id="axis" >
        <td class="data-widgets" v-for="item in mainAxis" :key="item.id">
          <div class="data-widgets-icon" :draggable="true" @dragstart="drag($event, item)">{{item.title}}</div>
        </td>
      </div>
    </div>
    <div style="overflow:hidden">
      <div style="float:left;display:flex">
        <div v-if="editMode" id="y-axis" @drop="onDrop($event,1)">
          <td class="data-widgets" v-for="item in infoAxis" :key="item.id">
            <div :draggable="true" @dragstart="drag($event, item)" class="data-widgets-icon">{{item.title}}</div>
          </td>
          <p style="text-align:center;position:relative;top:45%" v-if="!infoAxis.length">Info</p>
        </div>
        <div style="margin-left:5px">
          <div v-if="editMode" id="x-axis" style="height:187px;margin:0px" @drop="onDrop($event,2)">
            <td class="data-widgets" v-for="item in yAxis" :key="item.id">
              <div class="data-widgets-icon"  :draggable="true" @dragstart="drag($event, item)">{{item.title}}</div>
            </td>
            <p style="text-align:center;position:relative;top:45%" v-if="!yAxis.length">Latitude</p>
          </div>
          <div v-if="editMode" id="x-axis" style="height:187px;margin:0px" @drop="onDrop($event,3)">
            <td class="data-widgets" v-for="item in xAxis" :key="item.id">
              <div class="data-widgets-icon"  :draggable="true" @dragstart="drag($event, item)">{{item.title}}</div>
            </td>
            <p style="text-align:center;position:relative;top:45%" v-if="!xAxis.length">Longitude</p>
          </div>
        </div>
      </div>
      <div style="overflow:hidden">
        <div :id="id" style="width: 100%;height: 400px"/>
      </div>
    </div>
  </div>
</template>
<script>
import {toRaw} from 'vue';
/* eslint-disable no-undef */
import { Loader } from '@googlemaps/js-api-loader'
const GOOGLE_MAPS_API_KEY = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;

export default {
  name: 'GoogleMap',
  props: {
    editMode: Boolean,
    column: Object,
    cellId: Number
  },
  data() {
    return {
      id: 'map' + this.column.id + this.cellId,
      editMod: false,
      loader: new Loader({ apiKey: GOOGLE_MAPS_API_KEY }),
      map : '',
      mapOptions : {
        center: {lat: 0, lng: 0},
        zoom: 2,
        mapTypeId: 'roadmap'
      },
      mapStyle : [
      {
          featureType: "all",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
          ]
      },{
          featureType: "road",
          stylers: [
          { visibility: "off" }
          ]
      }
      ],
      items: this.column.items ? this.column.items : [],
      Column: this.column,
      markers: [],
    }
  },
  computed: {
    mainAxis() {
      return this.items.filter((item) => item.list === 0)
    },
    infoAxis() {
      return this.items.filter((item) => item.list === 1)
    },
    yAxis() {
      return this.items.filter((item) => item.list === 2)
    },
    xAxis() {
      return this.items.filter((item) => item.list === 3)
    },
  },
    watch:{
      column: {
        handler(val){
          this.Column = val
          this.items = val.items
        },
        deep: true  //provides initial (not changed yet) state
      },
      editMode: {
          handler(val){
            this.editMod = val
          },
          deep: true
      },

    },
    async mounted(){
        console.log(GOOGLE_MAPS_API_KEY)
        await this.loader.load()
        this.map = new google.maps.Map(document.getElementById(this.id), this.mapOptions)
        this.map.set('styles', this.mapStyle)
        this.addMarker()
    },
    methods:{
        drag(ev, item) {
          ev.dataTransfer.setData("axis", item.id);
        },

        onDrop (evt, list) {
          if(evt.dataTransfer.getData('buckettype')){
            return
          }
          const itemID = evt.dataTransfer.getData('axis')
          const item = this.items.find((item) => item.id == itemID)
          item.list = list
          this.$emit('setObject',{type : 'items', objects : this.items})
          this.addMarker()
        },

        addMarker(){
            this.markers.map((marker) => toRaw(marker).setMap(null))
            //set icon
            let icon = {
              url: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png',
              anchor: new google.maps.Point(16, 16),
              labelOrigin: new google.maps.Point(16, 32)
            }

            //go through data

          if(this.yAxis.length & this.xAxis.length){
            for(i = 0 ; i < this.Column.data.length ; i++){
              let position = new google.maps.LatLng(this.Column.data[i][this.yAxis[0].title], this.Column.data[i][this.xAxis[0].title])
              let marker = new google.maps.Marker({
                position: position,
                map: this.map,
                icon: icon
              });

              //add info data for each marker
              let html = ''
              for(let j = 0 ; j < this.infoAxis.length ; j++){
                html += this.infoAxis[j].title + ': ' + this.Column.data[j][this.infoAxis[j].title] + '<br />'
              }

              //Attach click event handler to the marker.
              google.maps.event.addListener(marker, "click", function (e) {
                var infoWindow = new google.maps.InfoWindow({
                    content: 'Latitude: ' + e.latLng.lat() + '<br />Longitude: ' + e.latLng.lng() + '<br />' + html
                });
                  infoWindow.open(this.map, marker);
              });
              this.markers.push(marker)
            }
          }

        },



    }
}
</script>

<style>
#chart-demo-pie{
  position: relative;
  overflow: auto;
  overflow-x: hidden
}
</style>
