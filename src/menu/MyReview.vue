<template>
    <div class="MyReview">
        <header>
          <div class="menu">
            <router-view>
              <div class="gnb">
                <router-link to = '/kakaoMap' v-on:click="showMap"> 지도 </router-link>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <router-link to = '/notice' v-on:click="noMap"> 공지 </router-link>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <router-link to = '/contact' v-on:click="noMap"> 문의 </router-link>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <router-link to = '/review' v-on:click="noMap"> 리뷰 </router-link>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <router-link to = '/setting' v-on:click="noMap"> 설정 </router-link>
              </div>
            </router-view>
          </div>
        </header>
        <h1>리뷰</h1>
        <p>리뷰가 없습니다.</p>
    </div>
</template>

<script>
export default({

})
</script>

<style scoped>

</style>

<style lang = "scss">
    @import url(//fonts.googleapis.com/earlyaccess/hanna.css);
    .MyReview{
        font-family: 'Hanna';
        font-size: 100%;
        color: black;
        margin-bottom: 10px;
        padding: 20px;
        z-index: 10000;
    }
    header{
    height:75px; 
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
  .menu{
    background: rgb(255, 98, 124);
    padding: 30px;
    margin:0 auto;
    position: relative;
    bottom: 0;
    font-family: 'Hanna';
    font-size: 130%;
    a:hover{color: aquamarine;}
    z-index: -10000;
  }
  .menu a{
    left: 10px;
    color: rgb(40, 27, 27);
    text-decoration: none;
    position: relative;
    padding-bottom: 15px;
  }
  .gnb a:before{
    content: '';
    position: absolute;
    background-color: aquamarine;
    height: 5px;
    width: 0;
    bottom: 0;
    transition: 0.7s;
  }
  .gnb a:hover:before{
    width: 100%;
  }
</style>