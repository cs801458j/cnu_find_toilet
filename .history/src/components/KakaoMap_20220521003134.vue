<template>
  

    <div id="kakaoMap">
      <div>
        <div class="menu">
         <a v-for="(a,i) in menus" :key="i">{{a}}</a>
        </div>
      <div class="searchbox">
        <div id="temp">
           <input id="searchBoxInput" type="text" value="">
           <button id="enter" v-on:click="searchPlace()"> 검색 </button>
        </div>
        <div class="results">
             <div class="place" v-for="rs in search.results" :key="rs.id" @click="showPlace(rs)">
             <h4>{{rs.place_name }}</h4>
        <div class="addr"> {{ rs.road_address_name }}</div>
        </div>
      </div>
      
    </div>
    <div class ="setCenter">
      <button @click="gps()"><img src="./layout/Gps.png"></button>
    </div>
    </div>

    

    
    
</div>
</template>

<style scoped>
#kakaoMap {
  top :0;
  width: auto;
  height: 600px;
  margin: 0;
  border:0;
  position: relative;
  
}
#temp{
  display:flex;
  margin:auto;
}
#enter{
  width: 60px;
}
</style>

<style lang = "scss">
.menu{
  background: darkorchid;
  padding: 20px;
  border-radius: 5px;
  margin:0;
  position: relative;
  bottom: 0;
  z-index: 10000;
  
}
.menu a{
  left :10px;
  color: white;
 
  padding:20px;
}
  .searchbox{
    position:absolute;top:50;right: 200;left:300;bottom:10;width:210px;margin:10px 100px 30px 10px;padding:5px;background:rgba(255, 255, 255, 0.7);overflow-y:auto;z-index: 10;font-size:10px;border-radius: 1px;}
.bg_white {background:white;}
    .results{
      flex: 1 1 auto;
      overflow-y: 50;
      .place{
        padding: 8px;
        cursor: pointer;
        &:hover{
          background-color: rgb(184, 184, 184);
        }
        h4{
          margin : 0;
        }
      }
    }
  .setCenter{
    padding:0;
    float:right;
    display: flex;
    object-fit: none;
    
  
    right: 50px;
    border-radius:50%;
    top:400px;
    position: relative;
    z-index: 10000;
    overflow-y: auto;
  }
</style>

<script>
import axios from 'axios'
export default  {
  data() {
    return {
      menus : ['화장실지도','공지','문의','리뷰','설정'],
      map: null,
      mapOption:{
        center:{
          lat:null,
          lng:null,
        },
        level:3,
      },
      search: {
        keyword: null,
        pgn : null,
        results : [],
      },
      toilet:{
          toilet_nm:[],  
      },
      posts: [],
      numOfRows: '',
      pageNo: ''

      
    };
  },
  //  methods <- 일반적으로 템플릿 내부에서 이벤트 리스너로 사용됨
  methods: {
    searchToilet: function(){
            const BASE_URL = "http://apis.data.go.kr/3660000/PublicToiletListService/getPublicToiletList?serviceKey="+process.env.VUE_APP_TOILET_KEY
                             + "&numOfRows=" + this.numOfRows + "&pageNo=" + this.pageNo;
            axios.get(BASE_URL)
            .then((result) => {
               for(var i=0; i<result.data.resultlist.length; i++){
                this.addressTogeo((result.data.resultlist[i].locplc_lnm).toString())
              }
            }) },

    //초기 맵 생성
    initMap() {
      const container = document.getElementById("kakaoMap");
      const options = {
        center: new kakao.maps.LatLng(36.36662192460574, 127.34445497915917),
        level: 3
      };
      //kakao.maps.disabledHD();
      this.map = new kakao.maps.Map(container, options);//지도 생성
      this.numOfRows = '200'
      this.pageNo = '1'
      this.searchToilet();
      
    },

    //gps 위치로 이동
    gps(){
      //const container = document.getElementById("kakaoMap");
      //const options = {
       // center: new kakao.maps.LatLng(36.36662192460574, 127.34445497915917),
      //  level: 3
      //};
      if(navigator.geolocation){//gps 사용
        //GeoLoaction접속
        navigator.geolocation.getCurrentPosition(function(position){
          var lat = position.coords.latitude,
              lon = position.coords.longitude;
          var locPosition = new kakao.maps.LatLng(lat, lon),
              message = '<div style="padding:5px;">현재 위치</div>';
          displayMarker(locPosition, message);
        });
      }else{//gps 사용불가
        var locPosition = new kakao.maps.LatLng(36.36662192460574, 127.34445497915917),
            message = '위치 정보를 불러올 수 없습니다.'
            displayMarker(locPosition, message);
      }
      //마커 표시, locPosistion:좌표, message:메세지
      function displayMarker(locPosition, message){
        var self =this;
        var map = self.map;
        var marker = new kakao.maps.Marker({
          map : map,
          position: locPosition
        });
        var iwContent = message,
            iwRemoveable = true;
        var infowindow = new kakao.maps.InfoWindow({
            content : iwContent,
            removable : iwRemoveable
        });
        map.setCenter(locPosition);
        infowindow.open(map, marker);
      }
    },
    addressTogeo(address){
      //const container = document.getElementById("kakaoMap");
      //const options = {
      //  center: new kakao.maps.LatLng(36.36662192460574, 127.34445497915917),
      //  level: 3
      //};
      var self = this;
      var map = self.map;
      var geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(""+address, function(result, status){
        if (status === kakao.maps.services.Status.OK) {

        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:6px 0;">화장실</div>'
        });
        infowindow.open(map, marker);

        
       }
      })
    },

    //키워드 검색
    searchPlace(){
      //const keyword = e.target.value.trim();
      const keyword = document.getElementById('searchBoxInput').value;
      if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
      }
      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(keyword, (data, status, pgn) => {
       this.search.keyword = keyword;
       this.search.pgn = pgn;
       this.search.results = data;
      });
    },

    //키워드 검색 결과 클릭시 해당 위치로 화면 이동
    showPlace(place){
      console.log(place);
      var locPosition = new kakao.maps.LatLng(place.y, place.x),
      message = '<div style="padding:5px;">검색 위치</div>';
      const container = document.getElementById("kakaoMap");
      const options = {
        center: new kakao.maps.LatLng(36.36662192460574, 127.34445497915917),
        level: 3
      };
      /*
      gps()의 마커 표시와 동일합니다.
      gps()메소드에서 displayMarker()함수를 호출하는데 오류가 생겨서 동일한 내용을 작성했습니다.
      */
      function displayMarker(locPosition, message){
        var map = new kakao.maps.Map(container, options);
        var marker = new kakao.maps.Marker({
          map : map,
          position: locPosition
        });
        var iwContent = message,
            iwRemoveable = true;
        var infowindow = new kakao.maps.InfoWindow({
            content : iwContent,
            removable : iwRemoveable
        });
        map.setCenter(locPosition);
        infowindow.open(map, marker);
      }
      displayMarker(locPosition, message);
    }
  },
  mounted() {
    

    if (!window.kakao || !window.kakao.maps) {
      // script 태그 객체 생성
      const script = document.createElement('script');
      /* global */
      document.cookie = "safeCookie1=foo; SameSite=Lax"; 
      document.cookie = "safeCookie2=foo";  
      document.cookie = "crossCookie=bar; SameSite=None; Secure";
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey="+process.env.VUE_APP_KAKAOMAP_KEY;
      document.head.appendChild(script);
      
      
      
    } else {
      this.initMap();
      
    }

    // let maps = [
    //     {
    //       id: 1,
    //       store: '학생문화관점',
    //       location: '학생문화관 지하1층 로비',
    //       time: '학기 중: 월~금 08:30~19:00 | 토 09:00~14:00',
    //       vacation: '방학 중: 월~금 08:30~18:00 | 토 09:00~14:00',
    //       tel: '02-3277-3707',
    //       latlng: new kakao.maps.LatLng(36.36662192460574, 127.34445497915917),
    //     },
    //     {
    //       id: 2,
    //       store: '학생문화관점',
    //       location: '학생문화관 지하1층 로비',
    //       time: '학기 중: 월~금 08:30~19:00 | 토 09:00~14:00',
    //       vacation: '방학 중: 월~금 08:30~18:00 | 토 09:00~14:00',
    //       tel: '02-3277-3707',
    //       latlng: new kakao.maps.LatLng(36.36662192460574, 127.34445497912),
    //     }
    //   ]

    //   let imageSrc = require('@/assets/logo.png'), // 마커이미지의 주소입니다
    //   imageSize = new kakao.maps.Size(24, 35), // 마커이미지의 크기입니다
    //   imageOption = { offset: new kakao.maps.Point(20, 35) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
    //   let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    //   maps.forEach(function(pos) {
    //     let marker = new kakao.maps.Marker({
    //       map: kakaoMap, // 마커를 표시할 지도
    //       position: pos.latlng, // 마커의 위치
    //       image: markerImage,
    //     });
    //   });

    //   var customOverlay = new kakao.maps.CustomOverlay({
    //     position: pos.latlng,
    //     xAnchor: 0.5,
    //     yAnchor: 1.05,
    //   });
  }
  
}
</script>