<template>
  <div class="documents-tab">
    <template v-if="isMy">
      <p class="documents-tab__explain" >{{i18n.sale_doc_tab_title_is_my()}}</p>
      <div class="documents-tab__file-input">
        <file-field v-model="upload"
                label="Select File(s)"
                id="documents-tab__file-field"/>
      </div>
      <md-button class="documents-tab__file-submit"
                v-if="upload.file"
                @click="submit"
                :disabled="isPending">
        {{ i18n.lbl_submit() }}
      </md-button>
    </template>

    <template v-else-if="!documents.length && !isMy">
      <div class="no-data-msg__wrapper">
        <i class="no-data-msg__icon material-icons">search</i>
        <h2>{{ i18n.sale_doc_tab_docs_is_my() }}</h2>
      </div>
    </template>

    <div class="documents-tab__docs-list" v-if="documents.length">
      <template v-for="(document, d) in documents">
        <div :key="`sales-docuemnts-tab-${d}`" class="documents-tab__file-download-wrp">
          <h3 class="file-download__file-name" :title="document.name">{{ document.name }}</h3>
          <a :href="getUrl(document)" class="file-view__link" target="_blank" rel="noopener">
            <span>{{ i18n.fi_view_file() }}</span>
          </a>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import SubmitterMixin from '@/vue/common/mixins/submitter.mixin'
  import FileField from '@/vue/common/fields/FileField'
  import { i18n } from '@/js/i18n'

  import { ErrorHandler } from '@/js/errors/error_handler'
  import { EventDispatcher } from '@/js/events/event_dispatcher'
  import { confirmAction } from '@/js/modals/confirmation_message'
  import { blobTypes, blobFilters } from '@/js/const/const'
  import { fileService } from '@/js/services/file.service'
  import { usersService } from '@/js/services/users.service'
  import { DocumentContainer } from '@/js/helpers/DocumentContainer'
  import _get from 'lodash/get'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '@/vuex/types'

  export default {
    name: 'documents-tab',

    components: {
      FileField
    },
    props: ['sale'],

    mixins: [SubmitterMixin],

    data: _ => ({
      i18n,
      documents: [],
      upload: {
        mimeType: '',
        file: '',
        name: ''
      }
    }),

    computed: {
      ...mapGetters([
        vuexTypes.accountId
      ]),
      isMy () {
        return this.sale.owner === this.accountId
      }
    },

    methods: {
      async submit () {
        if (!await confirmAction({
          title: i18n.sale_confirm_upload_ttl(),
          message: i18n.sale_confirm_upload()
        })) return
        const tokenCode = this.sale.baseAsset
        this.disable()
        try {
          const fileKey = await fileService.uploadFile({ ...this.upload, type: blobTypes.fundDocument.str })
          await usersService.blobsOf(this.sale.owner).create(
            blobTypes.fundDocument.str,
            {
              type: this.upload.mimeType,
              name: this.upload.name,
              key: fileKey
            },
            { [blobFilters.tokenCode]: tokenCode }
          )
          EventDispatcher.dispatchShowSuccessEvent(i18n.sale_upload_success())
          await this.getDocuments()
          this.reset()
        } catch (error) {
          console.error(error)
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      },
      async getDocuments () {
        if (!_get(this.sale, 'baseAsset')) return
        this.documents = (await usersService
          .blobsOf(this.sale.owner)
          .getAll({
            [blobFilters.tokenCode]: this.sale.baseAsset,
            [blobFilters.type]: blobTypes.fundDocument.num
          }))
          .map(doc => new DocumentContainer(doc))
      },
      reset () {
        this.upload.file = ''
        this.upload.mimeType = ''
      },
      getUrl (file) {
        return file.publicUrl
      }
    },
    watch: {
      sale: {
        handler: 'getDocuments',
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  .documents-tab {
    padding-top: 1rem;
  }

  .documents-tab__no-docs-message {
    text-align: center;

    i {
      font-size: $material-icon-xx-super-big;
    }
  }

  .documents-tab__file-input {
    margin-top: 30px;
    text-align: center;
  }

  .documents-tab__explain {
    color: $col-info;
    font-size: $fs-tip;
    text-align: center;
  }

  .documents-tab__docs-list {
    margin: 40px auto;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .documents-tab__file-download-wrp {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
    width: 50%;
  }

  .file-download {
    display: flex;
    flex-direction: column;
  }

  .file-view__link {
    color: $col-active;
    cursor: pointer;
    display: flex;
    font-size: $fs-tip;
    text-decoration: underline;

    i {
      font-size: $fs-tip;
      color: $col-active;
      margin-left: 5px;
    }
  }

  .file-download__file-name {
    max-width: 180px;
    overflow: hidden;
    margin-right: 0.5rem;
    text-overflow: ellipsis;
  }

  .no-data-msg__wrapper {
    display: flex;
    flex-direction: column;
    text-align: center;
    color: $col-text-secondary;
  }

  .no-data-msg__icon {
    font-size: $material-icon-xx-super-big;
    color: $col-background;
  }
</style>
