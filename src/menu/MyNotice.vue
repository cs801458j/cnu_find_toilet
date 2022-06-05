<template>
    <div class="MyNotice">
        <header>
          <div class="menu">
            <router-view>
            <div class="gnb">
              <router-link to = '/kakaoMap'> 지도 </router-link>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <router-link to = '/notice'> 공지 </router-link>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <router-link to = '/contact'> 문의 </router-link>
            </div>
          </router-view>
          </div>
        </header>
        <h1>공지사항</h1>
    </div>
        <input type="checkbox" id="notice01">
        <label for="notice01">5/29(일) 업데이트 공지</label>
        <div align="left"><p>안녕하세요. ?? 운영팀입니다. 5월 개선 내용 및 이벤트를 공지드립니다.<br>
                <b>[5월 29일 업데이트 내용]</b><br><br>
                1. 신규 화장실 리스트(+10000)가 추가로 등록되었습니다.<br>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>이제 더 많은 개방 화장실을 지도에서 만나보실 수 있습니다.<br><br>
                2. 최적화 업데이트가 진행되었습니다.<br><br>
                3. 평점 등록 이벤트가 진행 중입니다.<br>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>자세한 내용은 아래 링크에서 확인하실 수 있습니다.<br>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span><b>(https://wherepoop.com/events/2022)</b>
                </p></div>
        <input type="checkbox" id="notice02">
        <label for="notice02">4/29 업데이트 공지</label>
        <div><p>공지에용</p></div>
        <input type="checkbox" id="notice03">
        <label for="notice03">3/29 업데이트 공지</label>
        <div><p>공지에요</p></div>
        <input type="checkbox" id="notice04">
        <label for="notice04">2/29 업데이트 공지</label>
        <div><p>공지에용</p></div>
</template>

<script>
export default({

})
</script>

<style scoped>
    input[id*="notice"]{
        display:none;
    }
    input[id*="notice"] + label{
        display:block;
        padding:20px;
        border:5px solid #ffffff;
        border-bottom: 0;
        color:#fff;
        font-size: 20px;
        font-weight: 900;
        background:#2b2828;
        cursor:pointer;
        position: relative;
    }
    input[id*="notice"] + label + div{
        max-height: 0;
        transition: all .35s;
        overflow:hidden;
        background:#ffffff;
        margin: 10px;
        font-size:11px;
    }
    input[id*="notice"] + label + div p{
        display:inline-block;
        font-size: 15px;
        vertical-align: middle;
        padding:20px
    }
    input[id*="notice"]:checked + label + div {max-height:300px;}
</style>

<style lang = "scss">
    @import url(//fonts.googleapis.com/earlyaccess/hanna.css);
    .MyNotice{
        font-family: 'Hanna';
        font-size: 100%;
        color: black;
        margin-bottom: 10px;
        padding: 20px;
        z-index: 10000;
    }
</style>