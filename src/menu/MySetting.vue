<template>
    <div class="MySetting">
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
        <h1>설정</h1>
    </div>
    <table class="setting">
        <tr><td><b><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>알림</b>
        <div class="wrapper">
            <input type="checkbox" id="switch">
            <label for="switch" class="switch_label">
            <span class="onf_btn"></span>
            </label>
        </div></td></tr>
        <div class="a">
            <tr><td><b><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>디스플레이</b></td></tr>
            <tr><td><b><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>개인정보처리방침</b></td></tr>
            <tr><td><b><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>이용약관</b></td></tr>
            <tr><td><b><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>언어</b></td></tr>
        </div>
    </table>
</template>

<script>
export default({

})
</script>

<style scoped>
.setting {
  border-collapse: collapse;
  border-top: 3px solid #168;
  width: 100%;
  text-align: left;
  font-size: 20px;
}
.setting td {
  padding: 10px;
  height: 50px;
  border: 1px solid #ddd;
}
.setting td:first-child {
  border-left: 0;
}
.setting td:last-child {
  border-right: 0;
}
.wrapper {
  width: 50px;
  float: right;
  margin-right: 30px;
}
#switch {
  position: absolute;
  /* hidden */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.switch_label {
  position: relative;
  cursor: pointer;
  display: inline-block;
  width: 58px;
  height: 28px;
  background: #fff;
  border: 2px solid rgb(241, 155, 155);
  border-radius: 20px;
  transition: 0.2s;
}
.switch_label:hover {
  background: #efefef;
}
.onf_btn {
  position: absolute;
  top: 4px;
  left: 3px;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background: #daa;
  transition: 0.2s;
}

/* checking style */
#switch:checked+.switch_label {
  background: rgb(222, 100, 100);
  border: 2px solid rgb(230, 100, 100);
}

#switch:checked+.switch_label:hover {
  background: rgb(231, 108, 108);
}

/* move */
#switch:checked+.switch_label .onf_btn {
  left: 34px;
  background: #fff;
  box-shadow: 1px 2px 3px #00000020;
}
</style>

<style lang = "scss">
    @import url(//fonts.googleapis.com/earlyaccess/hanna.css);
    .MySetting{
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