<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" style="margin:0px">
      <div class="modal-wrapper">
        <div class="modal-container" style="width:550px">
            <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin: 0 -5px;padding: 0 5px;font-size:15px">
                <h2 style="margin:15px;">Data Item Details</h2>
            </div>
            <div class="format_adder">
              <div class="format_content">
                <div class="details">
                    <div class="item-details">
                        <p class = "header-wrap">Item name:</p>
                        <p class = "field-wrap">{{item.name}}</p>
                    </div>
                    <div class="item-details">
                        <p class = "header-wrap">Item description:</p>
                        <p class = "field-wrap">{{item.description}}</p>
                    </div>
                    <div class="item-details">
                        <p class= "header-wrap">Item SQL:</p>
                        <p class = "field-wrap">{{item.statement}}</p>
                    </div>
                </div>
              </div>
            </div>

          <div class="modal-content">
            <div class="modal-footer" style="padding:0px">
              <div>
                <slot name="footer">
                  <button
                    class="button-original scale-on-hover"
                    @click="$emit('close')"
                  >CLOSE</button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>


<script>
export default {
  props: {
    show: Boolean,
    item: Object,
  },
  data(){
    return{
    }
  },
}
</script>