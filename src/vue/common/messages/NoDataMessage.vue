<template >
  <div class="no-data-message">
    <md-icon v-if="iconName" class="md-size-4x">{{ iconName }}</md-icon>
    <h2>{{ msgTitle }}</h2>
    <p v-if="msgMessage">{{ msgMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'no-data-message',
  props: {
    iconName: { type: String, default: '' },
    msgTitle: { type: String, required: true },
    msgMessage: { type: String, default: '' }
  }
}
</script>

<style lang="scss">
@import "~@scss/variables";

.no-data-message {
  text-align: center;
  max-width: 520px;
  margin: 0 auto;
  padding: 0 8px;

  h2 {
    margin-bottom: 8px;
    color: $col-md-primary;
  }

  p {
    color: $col-md-primary-inactive;
  }

  .md-icon {
    color: $col-md-primary-secondary-inactive !important;
  }
}
</style>
