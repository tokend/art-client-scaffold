<template>
  <div class="sale-banner">
    <template v-if="sale.youTubeVideoId">
      <iframe class="sale-banner__video"
              :src="embedVideoUrl"
              allowfullscreen>
      </iframe>
    </template>
    <template v-else>
      <img class="sale-banner__image"
           :src="sale.image">
    </template>
  </div>
</template>

<script>
  export default {
    name: 'sale-banner',
    props: ['sale'],
    computed: {
      embedVideoUrl () {
        const query = 'watch?v='
        const youTubeVideoId = this.sale.youTubeVideoId
        if (youTubeVideoId.includes(query)) {
          return youTubeVideoId.replace(query, 'embed/')
        }
        return `https://www.youtube.com/embed/${youTubeVideoId}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../scss/variables';
  @import '../../../../../scss/mixins';

  .sale-banner {
    position: relative;
    height: 100%;
    width: 100%;
    padding-top: 56.25%;
    @include respond-to-custom(991px) {
      margin: 0 auto 2rem;
    }
  }

  .sale-banner__video,
  .sale-banner__image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
  }
</style>
