<template>
  <div class="file-input">

    <div class="file-input__wrp">

      <label class="file-input__upload-btn btn btn--info"
             :for="id">
        <i class="file-input__attachment-icon mdi mdi-paperclip"></i> Select file pdf/image, 5Mb max
      </label>
      <span class="file-input__name" :title="name || fileName">{{ name || fileName }}</span>
      <!--<button class="file-input__view-btn">View</button>-->
      <input class="file-input__upload-input"
             :id="id"
             type="file"
             accept="application/pdf, image/*"
             @change="onFileChange"
      />

    </div>

  </div>
</template>

<script>
  import { FileHelper } from '../../../js/helpers/file.helper'
  import { commonEvents } from '../../../js/events/common_events'
  import { MAX_FILE_MEGABYTES, MAX_FILE_BYTES } from '../../../js/const/const'
  import { EventDispatcher } from '../../../js/events/event_dispatcher'

  export default {
    name: 'file-input',

    props: {
      fileName: '',
      id: {
        type: String,
        default: 'file-select'
      }
    },

    data () {
      return {
        name: ''
      }
    },

    methods: {
      async onFileChange (event) {
        const files = event.target.files || event.dataTransfer.files
        if (!files.length) return
        const file = files[0]
        if (file.size > MAX_FILE_BYTES) {
          EventDispatcher.dispatchShowErrorEvent(`Maximum file size is ${MAX_FILE_MEGABYTES} Mb`)
          return
        }
        this.name = file.name
        this.type = file.type
        const extracted = await FileHelper.readFileAsArrayBuffer(file)
        const mimeType = file.type
        const name = file.name
        this.$emit(commonEvents.inputEvent, { file: extracted, mimeType, name })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';

  .file-input {
    display: inline-block;
  }

  .file-input__wrp {
    position: relative;
    display: flex;
    align-items: center;

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: center;
    }
  }

  .file-input__upload-btn {
    display: block;
    cursor: pointer;
    width: 16.5rem;
    margin-right: 20px;

    @media (max-width: 767px) {
      margin-bottom: 10px;
    }

    &:hover {
      opacity: 0.9;
    }
  }

  .file-input__attachment-icon {
    color: $col-btn-text;
    font-size: $fs-root;

  }
  .file-input__upload-input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .file-input__name {
    font-size: $fs-tip;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .file-input__view-btn {
    color: $col-active;
    text-decoration: underline;
  }

</style>
