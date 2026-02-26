<template>
  <div :class="['card-map']">
    <img :src="imgSrc" />
  </div>
</template>

<script>
import { points as turfPoints, center as turfCenter } from "@turf/turf";

export default {
  props: {
    payload: {},
  },

  computed: {
    imgSrc: function () {
      let coords = this.payload.coords || [];

      if (!coords || coords.length === 0) {
        if (this.payload.lat && this.payload.lng) {
          coords = [[this.payload.lat, this.payload.lng]];
        } else {
          return;
        }
      }

      if (coords.length === 0) {
        return;
      }

      let src = this.staticMap(coords);

      return src;
    },
  },

  methods: {
    staticMap: function (coords) {
      // Replace with your Google API key
      const apiKey = "AIzaSyBJyXeUG9HIvZYKnyfURODGyZ2Mw0rfp2I";

      const zoom = 10;

      let marker = {
        lat: coords[0][0],
        lng: coords[0][1],
      };

      coords = coords.map((arr) => {
        return `${arr[0]},${arr[1]}`;
      });

      coords = coords.join("|");

      // Define the styles for dark mode
      const styles =
        "element%3Ageometry%7Ccolor%3A0x242f3e&style=element%3Alabels.text.stroke%7Ccolor%3A0x242f3e&style=element%3Alabels.text.fill%7Ccolor%3A0x746855&style=feature%3Aadministrative.locality%7Celement%3Alabels.text.fill%7Ccolor%3A0xd59563&style=feature%3Apoi%7Celement%3Alabels.text.fill%7Ccolor%3A0xd59563&style=feature%3Apoi.park%7Celement%3Ageometry%7Ccolor%3A0x263c3f&style=feature%3Apoi.park%7Celement%3Alabels.text.fill%7Ccolor%3A0x6b9a76&style=feature%3Aroad%7Celement%3Ageometry%7Ccolor%3A0x38414e&style=feature%3Aroad%7Celement%3Ageometry.stroke%7Ccolor%3A0x212a37&style=feature%3Aroad%7Celement%3Alabels.text.fill%7Ccolor%3A0x9ca5b3&style=feature%3Aroad.highway%7Celement%3Ageometry%7Ccolor%3A0x746855&style=feature%3Aroad.highway%7Celement%3Ageometry.stroke%7Ccolor%3A0x1f2835&style=feature%3Aroad.highway%7Celement%3Alabels.text.fill%7Ccolor%3A0xf3d19c&style=feature%3Atransit%7Celement%3Ageometry%7Ccolor%3A0x2f3948&style=feature%3Atransit.station%7Celement%3Alabels.text.fill%7Ccolor%3A0xd59563&style=feature%3Awater%7Celement%3Ageometry%7Ccolor%3A0x17263c&style=feature%3Awater%7Celement%3Alabels.text.fill%7Ccolor%3A0x515c6d&style=feature%3Awater%7Celement%3Alabels.text.stroke%7Ccolor%3A0x17263";

      // Construct the URL for the Google Static Map
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?markers=color:red%7Clabel:C%7C${marker.lat},${marker.lng}&style=${styles}&zoom=${zoom}&size=400x400&path=color:0xff0000ff|weight:2|${coords}&key=${apiKey}`;

      return mapUrl;
    },
  },
};
</script>

<style lang="scss">
.card-map {
  img {
    border-radius: 5px;
  }
}
</style>
