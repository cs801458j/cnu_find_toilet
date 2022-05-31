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
           <button id="enter" v-on:click="searchPlace()"> 검색 </button>
        </div>
        <div class="results">
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
</style>

<script>
import axios from 'axios';
import toilet from '../assets/toiletyouseong.json'
import {db}from '../plugin/firebase.js'
import {collection,addDoc//,getDocs, QueryDocumentSnapshot,query,DocumentData
} from 'firebase/firestore'
//import {ref} from 'vue'

export default  {
  data() {
    return {
      markers:[],
      datas:toilet,
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
      marker_count:0

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
      //const items=ref<QueryDocumentSnapshot<DocumentData>[]>([])
      /* 데이터 갖고오기... 아직 구현중 
      const items = ref<QueryDocumentSnapshot<DocumentData>[]([])
      const q = query(collection(db, "toiletDajeon"))
      const querySnapshot =await getDocs(q);
      items.value=querySnapshot.docs*/
      /*
        db.collection('toiletDajeon')
            db.collection('toiletYouseong')
            const querySnapshot = await getDocs(collection(db, "cities"));
            querySnapshot.forEach((doc) => {
             // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
              });*/
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
      this.gps()
      const BASE_URL = "http://apis.data.go.kr/3660000/PublicToiletListService/getPublicToiletList?serviceKey="+process.env.VUE_APP_TOILET_KEY
                             + "&numOfRows=" + this.numOfRows + "&pageNo=" + this.pageNo;
      axios.get(BASE_URL).then((result) => {
               for(var i=0; i<result.data.resultlist.length; i++){
                this.addressTogeo((result.data.resultlist[i].locplc_lnm).toString(),this.map)
              }

            })
      // 데이터 firebase에 저장하는 방법 !!  
            /*
            for(var j=0;j<44; j++){
              //var  data = JSON.stringify(toilet.__collections__.toiletAddress)
               this.addressTogeo(JSON.stringify(toilet.__collections__.toiletAddress[j].address))
              addDoc(collection(db,"toiletYouseong"),{
                index:j,
                review:4,
                address:JSON.stringify(toilet.__collections__.toiletAddress[j].소재지)
              }) 
            }*/
            // 데이터 firebase에서 읽어오기       
            
            
    },

    //gps 위치로 이동
    gps() {
      var self = this;
      var map = self.map;
      if (navigator.geolocation) {
        //gps 사용 GeoLoaction접속
        navigator.geolocation.getCurrentPosition(function (position) {
          var lat = position.coords.latitude,
            lon = position.coords.longitude;
          var locPosition = new kakao.maps.LatLng(lat, lon),
            message = '<div style="padding:5px;">현재 위치</div>';
          displayMarker(locPosition, message);
        });
      } else {
        //gps 사용불가
        var locPosition = new kakao.maps.LatLng(
            36.36662192460574,
            127.34445497915917
          ),
          message = "위치 정보를 불러올 수 없습니다.";
        displayMarker(locPosition, message);
      }
      //마커 표시, locPosition:좌표, message:메세지
      function displayMarker(locPosition, message) {
        var marker = new kakao.maps.Marker({ map: map, position: locPosition });
        var iwContent = message,
          iwRemoveable = true;
        var infowindow = new kakao.maps.InfoWindow({
          content: iwContent,
          removable: iwRemoveable,
        });
        map.setCenter(locPosition);
        infowindow.open(map, marker);
      }
    },
    addressTogeo(address, map){
      var self=this;
      var geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, function(result, status){
        if (status === kakao.maps.services.Status.OK) {
 
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      
        // 결과값으로 받은 위치를 마커로 표시합니다
        
        
        self.addMarker(coords,map);
      
        // 인포윈도우로 장소에 대한 설명을 표시합니다

        }
      })
    },
    addMarker(position,map){
        var self = this;
        var markers = self.markers;
        var marker = new kakao.maps.Marker({
         // 마커를 표시할 지도
        last_click_position:0,
        map:map,
        position:position, // 마커를 표시할 위치
         // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        
        lickable: true

      });

          
      let iwRemoveable = true,

      iwposition=position; 
      var infowindow = new kakao.maps.InfoWindow({
        last_click_position:iwposition,
        removable : iwRemoveable

      });
      kakao.maps.event.addListener(marker, 'click', function(){
      // 마커 위에 인포윈도우를 표시합니다
       infowindow.open(map, marker);
      }); 
      markers.push(marker);
    }
    ,
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
      
      const db = this.$db;
      db.collection('toiletAddress').add({address:'',index:'1',review:'5'})
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
      var locPosition = new kakao.maps.LatLng(place.y, place.x),
      message = '<div style="padding:5px;">검색 위치</div>';
      var self= this;
      function displayMarker(locPosition, message){
        //var map = new kakao.maps.Map(container, options);
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