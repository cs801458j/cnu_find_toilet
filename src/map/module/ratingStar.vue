<template>
  <div class="rating">
    <id class="list">
      <div @click="rate(star)" v-for="star in maxStars" :class="{ 'active': star <= stars }" :key="star.stars" class="star">
      <div :class="star <= stars ? 'fas fa-star' : 'far fa-star'"></div> 
      </div>
    </id>
    <div v-if="hasCounter" class="info counter">
      <span class="score-rating">{{ stars }}</span>
      <span class="divider">/</span>
      <span class="score-max">{{ maxStars }}</span>
    </div>
  </div>
</template>
<script>

export default {
  
  name: 'Rating',
  props: ['grade', 'maxStars', 'hasCounter', 'targetLat', 'targetLng', 'targetNM'],
  data() {
    return {
      stars: this.grade, 
    }
  },
  methods: {
    rate(star) {
      alert(this.targetLat + " " + this.targetLng + " " + this.targetNM);
      if (typeof star === 'number' && star <= this.maxStars && star >= 0) {
        this.stars = this.stars === star ? star - 1 : star
      }
      alert(this.stars);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '../styles/rating.scss';
</style>