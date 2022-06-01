<template>
  
    <header>
        <div class="menu">
          <router-view>
            <div class="gnb">
              <router-link to = '/' v-on:click="showMap"> 지도 </router-link>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <router-link to = '/notice' v-on:click="noMap"> 공지 </router-link>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <router-link to = '/contact' v-on:click="noMap"> 문의 </router-link>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <router-link to = '/review' v-on:click="noMap"> 리뷰 </router-link>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <router-link to = '/setting' v-on:click="noMap"> 설정 </router-link>
            </div>
          </router-view>
        </div>
        </header>

    <div id="kakaoMap">
      <div>
      <div class="searchbox">
        <div id="temp">
           <input id="searchBoxInput" type="text" value="">
           <button id="enter" @click="searchPlace()"> 검색 </button>
        </div>
        <div class="results" v-if="searchBoxDisplay">
             <div class="place" v-for="rs in search.results" :key="rs.id" @click="showPlace(rs)">
             <h4>{{rs.place_name }}</h4>
        <div class="addr"> {{ rs.road_address_name }}</div>
      </div>
      </div>
    </div>
    <input type="checkbox" id="toggle" hidden v-on:click="ShowButton"> 
          <label for="toggle" class="toggleSwitch">
            <span class="toggleButton"></span>
          </label>

    <div class ="setCenter">
      <button @click="gps()"><img src="./layout/Gps.png"></button>
    </div>

    <div class="ratingButton">
      <button @click="handle_toggle()" type="button" v-if="!isNear"><img src="./layout/star2.svg"></button>
      <button @click="handle_toggle()" type="button" v-if="isNear"><img src="./layout/star.svg"></button>
    </div>

    </div>
  </div>
    <Teleport to="body">
      <modal :show="showModal" @close="showModal = false, status_change()" >
        <template #header>
          <h3>이용하신 화장실은 어떠셨나요?</h3>
          <Rating :grade="3" :maxStars="5" :hasCounter="true" :targetLat="this.targetPosition.getLat()" 
          :targetLng="this.targetPosition.getLng()" :targetNM="this.targetNumber"/>
        </template>
      </modal>
    </Teleport>
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
.toggleSwitch {
  width: 6rem;
  margin: 2rem;
  height: 3rem;
  float: right;
  right: 0%;
  display: block;
  position: relative;
  border-radius: 2rem;
  background-color: #fff;
  box-shadow: 0 0 1rem 3px rgba(0 0 0 / 15%);
  cursor: pointer;
  z-index: 11;
}

.toggleSwitch .toggleButton {
  width: 2.6rem;
  height: 2.6rem;
  position: absolute;
  top: 50%;
  left: .2rem;
  transform: translateY(-50%);
  border-radius: 50%;
  background: #f03d3d;
}

/* 체크박스가 체크되면 변경 이벤트 */
#toggle:checked ~ .toggleSwitch {
  background: #f03d3d;
}

#toggle:checked ~ .toggleSwitch .toggleButton {
  left: calc(100% - 2.8rem);
  background: #fff;
}

.toggleSwitch, .toggleButton {
  transition: all 0.2s ease-in;
}
</style>

<style lang = "scss">
  @import url(//fonts.googleapis.com/earlyaccess/hanna.css);
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
    z-index: 10000;
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

  .ratingButton{
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
import {db}from '../plugin/firebase.js'
//import {ref} from 'vue'
import Modal from './module/modal.vue'
import Rating from './module/ratingStar.vue'

import toiletyouseong from '../assets/toiletyouseong.json'
import toiletseogu from '../assets/toiletaddress.json'

import {collection,addDoc,getDocs//, QueryDocumentSnapshot,query,DocumentData
} from 'firebase/firestore'
export default  {
  components:{
    Modal,
    Rating,

  },
  data() {
    return {
      markers:[],
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
      toilet2:{
          toilet_name:[],  
      },
      posts: [],
      numOfRows: '',
      pageNo: '',
      marker_count:0,
      isShow: false,
      isNear: false,
      showModal: false,
      targetPosition: null,
      targetNumber: null,
      newID: null,
      gpsMarker: null,
      searchBoxDisplay: false,
    };
  },
  
  //  methods <- 일반적으로 템플릿 내부에서 이벤트 리스너로 사용됨
  methods: {
    showMap: function(){
      document.getElementById("kakaoMap").style.display="block";
    },
    noMap: function() {
      document.getElementById("kakaoMap").style.display="none";
    },
    onSubmit() {  // 이런식으로 collection에 데이터 추가함 
                addDoc(collection(db,"toiletsaAddress"),{
                address:"김승우",
                index:1,
                review:1
              })
    },
async getData(){
  /*
      const querySnapshot =  await getDocs(collection(db, "toiletYouseong"));
      querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data().address);
      this.addressTogeo(doc.data().address, this.map, doc.data().index);
      });
      const querySnapshot2 =  await getDocs(collection(db, "toiletDaejeon"));
      querySnapshot2.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data().address);
      this.addressTogeo(doc.data().address, this.map, doc.data().index);
      });
      const querySnapshot3 =  await getDocs(collection(db, "publicToilet"));
      querySnapshot3.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data().address);
      this.addressTogeo(doc.data().address, this.map, doc.data().index);
      });
*/

      for(var i=0;i<44; i++){
            //var  data = JSON.stringify(toilet.__collections__.toiletAddress)
            this.addressTogeo(JSON.stringify(toiletyouseong.__collections__.toiletAddress[i].소재지),this.map)
                  }
      for(var j=0;j<447; j++){
            //var  data = JSON.stringify(toilet.__collections__.toiletAddress)
            this.addressTogeo(JSON.stringify(toiletseogu.__collections__.toiletAddress[j].address),this.map)
                      
          }  
    },

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
      //this.gps()
      this.getData()
            
    },
    //gps 위치로 이동
    gps() {
      var self = this;
      var map = self.map;
      if(self.gpsMarker != null){
        self.gpsMarker.setMap(null);
      }
      if (navigator.geolocation) {
        //gps 사용 GeoLoaction접속
        navigator.geolocation.getCurrentPosition(function (position) {
          var lat = position.coords.latitude,
            lon = position.coords.longitude;
          var locPosition = new kakao.maps.LatLng(lat, lon)
          displayMarker(locPosition);
        });
      } else {
        //gps 사용불가
        var locPosition = new kakao.maps.LatLng(
            36.36662192460574,
            127.34445497915917
          )
        displayMarker(locPosition);
      }
      //마커 표시, locPosition:좌표
      function displayMarker(locPosition) {
        var marker = new kakao.maps.Marker({ map: map, position: locPosition});
        map.setCenter(locPosition);
        self.gpsMarker = marker;
      }
    },
    addressTogeo(address, map, index){
      var self=this;
      var geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, function(result, status){
        if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        // 결과값으로 받은 위치를 마커로 표시합니다
        self.addMarker(coords,map, index);
        }
      })
    },
    addMarker(position,map, index){
        var self = this;
        var markers = self.markers;
        var marker = new kakao.maps.Marker({
         // 마커를 표시할 지도
          last_click_position:0,
          map:map,
          position:position, // 마커를 표시할 위치
         // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          lickable: true,
        });
      let iwRemoveable = true,
      iwposition=position; 
      var infowindow = new kakao.maps.InfoWindow({
          last_click_position : iwposition,
          removable : iwRemoveable

      });
      kakao.maps.event.addListener(marker, 'click', function(){
      // 마커 위에 인포윈도우를 표시합니다
      infowindow.open(map, marker);
      map.setCenter(position);
      self.targetPosition = position;
      self.liveGPS(position.getLat(), position.getLng(), index);       
      }); 
      markers.push(marker);
    },
    liveGPS(targetLat, targetLon, toilet_nm) {
      var self = this;
      if(self.newID != null){
        navigator.geolocation.clearWatch(self.newID);
      }
      if (navigator.geolocation) {
        //gps 사용
        this.newID = navigator.geolocation.watchPosition(function (position) {
          var lat = position.coords.latitude,
            lon = position.coords.longitude;
          var distance = getDistance(
            lat,
            lon,
            targetLat,
            targetLon
          );
          self.targetNumber = toilet_nm;
          if (distance <= 5000) {
            //거리가 ''m 이내 일 경우
            navigator.geolocation.clearWatch(self.newID);
            self.status_change();
            return;
          }
        });
      } else {
        //gps 사용불가
        alert("현재 위치 확인 불가");
      }
      function getDistance(lat1, lng1, lat2, lng2) {
        //두 좌표간의 거리를 구하는 공식
        function deg2rad(deg) {
          return deg * (Math.PI / 180);
        }
        var R = 6371;
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lng2 - lng1);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // d는 km이다
        return d * 1000;
      }
    },
    handle_toggle() {
      if (this.isNear) {
        this.isShow = !this.isShow;
        this.showModal = !this.showModal;
      }
    },
    status_change() {
      if(this.isShow){
        this.isNear = false;
        this.isShow = false;
      }
      else{
        this.isNear = true;
      }
    },
    //키워드 검색
    searchPlace(){
      //const keyword = e.target.value.trim();
      var self = this;
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
      
      self.searchDisplayChange();
    },
    clear(){
      var markers=this.markers;
      function setMarkers(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }            
      }
        setMarkers(null);
    },set(){
      var map=this.map;
      var markers=this.markers;
      function setMarkers(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }  
    } setMarkers(map);
    },
    ShowButton: function(){
      if(document.getElementById("toggle").checked){
        this.clear();
      }else{
        this.set();
      }
    },
    //키워드 검색 결과 클릭시 해당 위치로 화면 이동
    showPlace(place){
      console.log(place);
      var locPosition = new kakao.maps.LatLng(place.y, place.x)
      var self= this;
      if(self.gpsMarker != null){
        self.gpsMarker.setMap(null);
      }
      function displayMarker(locPosition){
        //var map = new kakao.maps.Map(container, options);
        var map = self.map;
        var marker = new kakao.maps.Marker({
          map : map,
          position: locPosition
        });
        map.setCenter(locPosition);
        self.gpsMarker = marker;
      }
      displayMarker(locPosition);
      self.searchDisplayChange();
    },
    searchDisplayChange(){
      this.searchBoxDisplay = !this.searchBoxDisplay;
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
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey="+process.env.VUE_APP_KAKAOMAP_KEY;
      script.onload = () => kakao.maps.load(this.initMap);
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