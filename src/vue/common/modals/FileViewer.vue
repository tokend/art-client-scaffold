<template>
  <div class="file-viewer" v-if="url">

    <md-dialog :md-active.sync="isOpened" @md-closed="close">
      <embed class="file-viewer__embed"
             :src="url"
             title
      />
    </md-dialog>

  </div>
</template>

<script>
  import { commonEvents } from '../../../js/events/common_events'
  import { attachEventHandler } from '../../../js/events/helpers'

  export default {
    name: 'file-viewer',

    data () {
      return {
        url: null,
        isOpened: false
      }
    },

    created () {
      attachEventHandler(commonEvents.openFileViewEvent, this.open)
      attachEventHandler(commonEvents.closeFileViewEvent, this.close)
    },

    methods: {
      open (url) {
        this.url = url
        this.isOpened = true
      },
      close () {
        this.isOpened = false
        this.url = null
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';
  @import '../../../scss/mixins';

  .file-viewer {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: $z-embed-page;


    .file-viewer__embed {
      @include center;

      max-width: 60%;
      position: absolute;
      z-index: $z-embed-page;
    }
  }
</style>
