
<template>
  <div>

    <div id="kakaoMap"></div>

    <div class="searchbox">
      <div id="temp">
        <input id="searchBoxInput" type="text" value="">
        <button id="enter" @click="searchPlace()"> 검색 </button>
      </div>
      <div class="results">
        <div class="place" v-for="rs in search.results" :key="rs.id" @click="showPlace(rs)">
        <h4>{{rs.place_name }}</h4>
        <div class="addr"> {{ rs.road_address_name }}</div>
        </div>
      </div>
    </div>

    <div class ="setCenter">
      <button @click="gps()"> GPS<br>현재 위치 </button>
    </div>
    
</div>
</template>

<style scoped>
#kakaoMap {
  width: auto;
  height: 600px;
  margin: auto;
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
  .searchbox{
    top: 0;
    margin: auto;
    text-align: center;
    position: relative;
    height: 100px;
    width: 200px;
    z-index: 10000;
    background: #ffffffaa;
    //overflow-y: auto;
    display: flex;
    flex-direction: column;
    }
    .results{
      flex: 1 1 auto;
      overflow-y: auto;
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
    margin: auto;
    display: flex;
    text-align: center;
    width: 80px;
    height: 80px;
    top : 0;
    position: relative;
  }
</style>

<script>

export default  {
  data() {
    return {
      map: null,
      search: {
        keyword: null,
        pgn : null,
        results : [],
      }
    };
  },
  //  methods <- 일반적으로 템플릿 내부에서 이벤트 리스너로 사용됨
  methods: {

    //초기 맵 생성
    initMap() {
      const container = document.getElementById("kakaoMap");
      const options = {
        center: new kakao.maps.LatLng(36.36662192460574, 127.34445497915917),
        level: 3
      };
      //kakao.maps.disabledHD();
      this.map = new kakao.maps.Map(container, options);//지도 생성
    },

    //gps 위치로 이동
    gps(){
      const container = document.getElementById("kakaoMap");
      const options = {
        center: new kakao.maps.LatLng(36.36662192460574, 127.34445497915917),
        level: 3
      };
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
      //마커 표시, locPosition:좌표, message:메세지
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
    },

    //키워드 검색
    searchPlace(){
      //const keyword = e.target.value.trim();
      const keyword = document.getElementById('searchBoxInput').value;
      if(keyword.length===0){
        return;
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
      message = '<div style="padding:5px;">현재 위치</div>';
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
      /* global  */
      // script.addEventListener("load", () => {
      //   kakao.maps.load(this.initMap);
      // });
      // document head에 script 추가
      // `https://map.kakao.com/?sName=
      
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
