<template>
  <div class='custom-map' :style="[getStyle(config.style)]">
    <map class="map"
      :latitude="Number(config.latitude)"
      :longitude="Number(config.longitude)"
      :markers="markers"
      @markertap="handleMarkerTap"
    />
  </div>
</template>

<script>
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import  CustomComponent from '@/mixins/custom-component';

  @Component
  export default class CustomMap extends Mixins(CustomComponent) {
    @Prop(Object) config

    get markers() {
      const { address, longitude, latitude } = this.config;
      return [{
        id: 1,
        label: {
          content: address,
          color: '#FF0202',
          borderRadius: 3,
          borderWidth: 1,
          borderColor: '#FF0202',
          bgColor: '#ffffff',
          padding: 5,
          textAlign: 'center'
        },
        callout: {
          content: address,
          color: '#FF0202',
          borderRadius: 3,
          borderWidth: 1,
          borderColor: '#FF0202',
          bgColor: '#ffffff',
          padding: 5,
          textAlign: 'center'
        },
        longitude,
        latitude
      }];
    }

    handleMarkerTap() {
      const { longitude, latitude, address } = this.config;
      uni.openLocation({
        longitude: +longitude,
        latitude: +latitude,
        name: address
      });
    }
  }
</script>

<style lang='scss' scoped>
  .map {
    width: 100%;
    height: 100%;
  }
</style>
