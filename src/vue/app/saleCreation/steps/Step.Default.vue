<template>
  <form class="step"
        novalidate
        @submit.prevent="submit">
    <template v-for="(row, r) in schema.rows">
      <div class="app__form-row" :key="`sale-creation-step-${r}`">
        <div class="app__form-field" v-for="(item, i) in row" :key="i">

          <input-field-unchained v-if="item.field === 'text'"

                       v-model="form[item.model]"
                       v-validate="item.validate"
                       :name="item.name"
                       :id="item.id"
                       :required="item.required"
                       :label="item.label"
                       :type="item.type"
                       :key='item.id'
                       :errorMessage="errorMessage(item.name)"
          />
          <textarea-field v-if="item.field === 'textarea'"
                          v-model="form[item.model]"
                          v-validate="item.validate"
                          :name="item.name"
                          :id="item.id"
                          :required="item.required"
                          :label="item.label"
                          :type="item.type"
                          :key='item.id'
                          :maxlength="item.maxlength"
                          :errorMessage="errorMessage(item.name)"
          />
          <file-field v-if="item.field === 'file'"
                      v-model="documents[item.type]"
                      class="step__file-field"
                      :fileType="item.fileType"
                      :private="item.private"
                      :label="item.label"
                      :type="item.type"
                      :id="item.id"
                      :key='item.id'
          />

          <select-field-unchained
            v-if="item.field === 'select'"
            :name="item.name"
            :id="item.id"
            v-model="form[item.model]"
            :key='item.id'
            :label="item.label"/>

          <select-field-unchained v-if="item.field === 'select'"
                      :name="item.name"
                      :id="item.id"
                      :label="item.label"
                      v-model="form[item.model]"
                      :key='item.id'/>

          <date-field-flatpickr
            v-if="item.field === 'date'"
            v-model="form[item.model]"
            v-validate="'required'"
            :name="item.name"
            :id="item.id"
            :required="item.required"
            :label="item.label"
            :disableBefore="item.disableBefore"
            :key='item.id'
            :errorMessage="errorMessage(item.name)"/>
        </div>
      </div>
    </template>

    <div class="app__form-actions">
      <button v-ripple
              type="submit"
              class="app__form-submit-btn"
              :disabled="isPending">
        {{ i18n.sale_next_step() }}
      </button>
    </div>
  </form>
</template>

<script>
  import StepMixin from './step.mixin'
  import _pick from 'lodash/pick'
  import { ErrorHandler } from '../../../../js/errors/error_handler'
  import { commonEvents } from '../../../../js/events/common_events'
  import { documentTypes } from '../../../../js/const/documents.const'
  export default {
    name: 'Step-default',
    mixins: [ StepMixin ],
    props: ['schema'],
    created () {
      if (this.schema) {
        this.form = _pick(this.sale, Object.keys(this.schema.form))
        delete this.form.docs
        // this.documents = _pick(this.sale, Object.keys(this.schema.form.docs || {}))
        this.documents = {
          [documentTypes.fundLogo]: this.sale.logo
        }
      }
    },
    methods: {
      async submit () {
        if (!await this.isValid()) return
        this.disable()
        try {
          await this.uploadDocuments()
          this.$emit(commonEvents.saleUpdateEvent, {
            form: this.form,
            documents: this.documents
          })
        } catch (error) {
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      }
    }
  }
</script>

<style scoped>
  @import './step.scss';
</style>
