<template>
  
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
      <button @click="gps()" style="background-color:transparent; border: none; width:60px; height:60px;"><img src="./layout/Gps.png" style="border:none; height: 45px; width: 45px"></button>
    </div>

    </div>
  </div>
  <div>
    <Teleport to="body">
      <modal :show="showInfo" @close="showInfo = false" >
        <template #header>
          <h3 style="text-align: center;"> {{ this.targetName }} </h3>
          <div style="padding: 30px; text-align: center;">
            <button @click="voteGood()" style="display: inline-block; background-color:transparent; border:none; margin: auto;">
            <img id="up" src="./layout/thumbs-up.png" style="height: 50px; width: 50px">
            <br> {{this.targetLike}} </button>
            <button @click="voteBad()" style="display: inline-block; background-color:transparent; border:none; margin: auto;">
            <img id="down" src="./layout/thumbs-down.png" style="height: 50px; width: 50px">
            <br> {{this.targetHate}} </button>
          </div>
        </template>
        <template #body>
          
        </template>
      </modal>
    </Teleport>
  </div>
</template>

<style scoped>
#kakaoMap {
  top: 20px;
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
  width: 4rem;
  margin: 2rem;
  height: 2rem;
  float: right;
  right: -30px;
  display: block;
  position: relative;
  border-radius: 2rem;
  background-color: #fff;
  box-shadow: 0 0 1rem 3px rgba(0 0 0 / 15%);
  cursor: pointer;
  z-index: 11;
}

.toggleSwitch .toggleButton {
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 50%;
  left: 2rem;
  transform: translateY(-50%);
  border-radius: 50%;
  background: #f03d3d;
}

/* 체크박스가 체크되면 변경 이벤트 */
#toggle:checked ~ .toggleSwitch {
  background: #f03d3d;
}

#toggle:checked ~ .toggleSwitch .toggleButton {
  left: calc(100% - 4rem);
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
    
  
    right: 0px;
    border-radius:50%;
    top:400px;
    position: absolute;
    z-index: 10000;
    overflow-y: auto;
   transform: scale(0.85);
  } 
  
   .setCenter img{
   
    transform: scale(1.31);
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
import Modal from '../map/module/modal.vue'
import Rating from '../map/module/ratingStar.vue'
import {collection,addDoc,getDoc, doc, updateDoc, setDoc, getDocs
} from 'firebase/firestore'
export default  {
  components:{
    Modal,
    Rating,
  },
  data() {
    return {
      dbCollection:[],
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
      docName:"",
      posts: [],
      numOfRows: '',
      pageNo: '',
      marker_count:0,
      isNear: false, //목표 화장실과 가까이 있는지 여부(거리는 아래 함수에서 직접 설정 가능)
      showModal: false, //별점 모달창을 띄울지 여부 결정, 현재 사용 안함.
      currentPosition: null, // 현재 지점 position 객체
      searchPosition: null, // 검색 지점 position 객체
      targetPosition: null, // 목표 지점 position 객체
      targetNumber: null, //목표 지점
      newID: null, // watchPosition 객체, clear할때 호출.
      gpsMarker: null, // 과거 gps 마커가 있는지 확인용. gps가 호출 되었을때 이 변수에 값이 저장되어 있다면 이전 마커를 삭제.
      searchMarker: null,
      searchBoxDisplay: false, //검색창을 표시하는지 여부, 만약 검색 결과가 클릭되었다면 false로 가리고, 검색 버튼을 누르면 true로 보여줌.
      showInfo: false, // 정보 모달창을 띄울지 여부를 결정, 현재 사용.
      targetAddr: null, // 목표 지점 문자열 주소.
      targetLike: 0, // 목표 지점 좋아요 수
      targetHate: 0, // 목표 지점 싫어요 수
      targetName: null, // 목표 지점 문자열 이름, 정보 모달창에 띄움.
      targetCode: 0, // 목표 지점이 분류된 JSON 파일.
      targetIndex: 0, // 목표 지점이 저장된 index
      thisLat: 0, // initmap() 할때 저장되는 gps 위치 정보, 화장실 마커를 그리는데 활용(거리 파악, 마커 설정)
      thisLng: 0, // initmap() 할때 저장되는 gps 위치 정보, 화장실 마커를 그리는데 활용(거리 파악, 마커 설정)
      movingID: null, // 움직이는 gps 객체, watchPosition ID를 초기화 시킬때 사용
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
    jsonparse(data,length,local){
      for(var i=0; i<length ; i++){
            //var  data = JSON.stringify(toilet.__collections__.toiletAddress)
            this.addressTogeo(JSON.stringify(data.toiletAddress[i].address).replace('(',''),this.map, i, JSON.stringify(data.toiletAddress[i].like), JSON.stringify(data.toiletAddress[i].hate), JSON.stringify(data.toiletAddress[i].name), local, 0, 0)
            }
    },
    async getData(){
      /*
      this.jsonparse(toiletSeogu1,toiletSeogu1.toiletAddress.length, 6)
      this.jsonparse(toiletDongu1,toiletDongu1.toiletAddress.length, 2)
      this.jsonparse(toiletJunggui1,toiletJunggui1.toiletAddress.length, 4)
      this.jsonparse(toiletUsung,toiletUsung.toiletAddress.length, 8)
      this.jsonparse(toiletDaeduk1,toiletDaeduk1.toiletAddress, 0)
      this.jsonparse(toiletSeogu2,toiletSeogu2.toiletAddress.length, 7)
      this.jsonparse(toiletDongu2,toiletDongu2.toiletAddress.length, 3)
      this.jsonparse(toiletJunggu2,toiletJunggu2.toiletAddress.length, 5)
      this.jsonparse(toiletUsung2,toiletUsung2.toiletAddress.length, 9)
      this.jsonparse(toiletDaeduk2,toiletDaeduk2.toiletAddress.length, 1)
      this.dbCollection=["Daeduk1","Daeduk2","Dongu1","Dongu2"
      ,"Junggu1", "Junggu2", "Seogu1", "Seogu2","Usung1", "Usung2"]
      */
      /*
      for(var i=0; i<10; i++){
        setting(i);
      }
      function setting(code){
        var self = this;
        for(var i=0; i < region[code].toiletAddress.length ; i++){
          this.ratingStore[code][0][i] = region[code].toiletAddress.like;
          self.ratingStore[code][1][i] = region[code].toiletAddress.hate;
        }
      }*/
      var toiletList = this.dbCollection
      for(var i=0; i<toiletList.length; i++){
        var path = await toiletList[i]    
       // const docRef =await doc(db, path, (path+"_"+this.targetIndex));
      const querySnapshot = await getDocs(collection(db, path));
      querySnapshot.forEach((doc) => {
        this.targetCode=i
        this.docName=doc.id,
        this.targetAddr = doc.data().address,
        this.targetName = doc.data().name,
        this.targetLike =doc.data().like,
        this.targetHate =doc.data().hate,
        this.addressTogeo(this.targetAddr,this.map,this.targetLike,this.targetHate,this.targetName, this.docName,this.targetCode)
      });
      }      
    },
    //초기 맵 생성
    async initMap() {
      const container = document.getElementById("kakaoMap");
      const options = {
        center: new kakao.maps.LatLng(36.36662192460574, 127.34445497915917),
        level: 3
      };
      //kakao.maps.disabledHD();
      this.map = new kakao.maps.Map(container, options);//지도 생성
      this.dbCollection=["Daeduk1","Daeduk2","Dongu1","Dongu2"
      ,"Junggu1", "Junggu2", "Seogu1", "Seogu2","Usung1", "Usung2"]
      this.numOfRows = '200'
      this.pageNo = '1' 
      this.getData();
      this.movingGPS();
    },
    //gps 위치로 이동
    gps() {
      var self = this;
      var map = self.map;
      map.setCenter(self.currentPosition);
    },
    movingGPS(){
      var self = this;
      if(navigator.geolocation){
        self.movingID = navigator.geolocation.watchPosition(success);
      }
      function success(position){
        var lat = position.coords.latitude,
            lon = position.coords.longitude;
        var locPosition = new kakao.maps.LatLng(lat, lon);
        self.currentPosition = locPosition;
        self.thisLat = lat;
        self.thisLng = lon;
        self.displayMarker(locPosition);
      }
    },
    addressTogeo(address, map, like, hate, name, docName,code){
      var self=this;
      var geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, function(result, status){
        if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        // 결과값으로 받은 위치를 마커로 표시합니다
        self.addMarker(coords, map, like, hate, name,docName,code);
        }
      })
    },
    async addMarker(position, map, targetlike, targethate, name, docName,code){
        var self = this;
        var distance = self.getDistance(self.thisLat, self.thisLng, position.getLat(), position.getLng());
        self.targetLike =targetlike;
        self.targetHate =targethate;
        var imageSrc
        if( self.targetLike - self.targetHate > 10){
          imageSrc = 'https://ifh.cc/g/ChK0kg.png';
        }else if(distance < 1000){
          imageSrc = 'https://ifh.cc/g/y14s6O.png';
        }
        else{
          imageSrc = 'https://ifh.cc/g/7T2t07.png';
        }// 마커이미지의 주소입니다
        var imageSize = new kakao.maps.Size(40, 40), // 마커이미지의 크기입니다
            imageOption = {offset: new kakao.maps.Point(27, 69)};
        var markers = self.markers;
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
        var marker = new kakao.maps.Marker({
        // 마커를 표시할 지도
            last_click_position:0,
            map:map,
            position:position, // 마커를 표시할 위치
            lickable: true,
            image: markerImage,
          });
          kakao.maps.event.addListener(marker, 'click', function(){
          // 마커 위에 인포윈도우를 표시합니다
          //self.getLikeHate();
          // self.targetAddr = address;
            self.targetLike =targetlike;
            self.targetHate =targethate;
            self.targetCode =code;
            self.docName = docName;
            self.targetName = name;
            self.targetPosition = position;
            self.infoModal();
            map.setCenter(position);
            self.liveGPS(position.getLat(), position.getLng());       
          });
          markers.push(marker);          
    },
    liveGPS(targetLat, targetLon, toilet_nm) {
      var self = this;
      var distance = self.getDistance(self.currentPosition.getLat(),self.currentPosition.getLng(),targetLat,targetLon);
      self.targetNumber = toilet_nm;
      if (distance <= 1000){
          self.isNear = true;
          return;
        };
      },
    displayMarker(locPosition) {
        var self = this;
        var map = self.map;
        var imageSrc = 'https://ifh.cc/g/b8Hnnm.png';
        var imageSize = new kakao.maps.Size(60, 60);
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        if(self.gpsMarker != null){
          self.gpsMarker.setMap(null);
        }
        var marker = new kakao.maps.Marker({ 
          map: map,
          position: locPosition,
          image: markerImage,
          });
        self.currentPosition = locPosition;
        self.gpsMarker = marker;
    },
    getDistance(lat1, lng1, lat2, lng2) {
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
      },
    infoModal(){
      this.showInfo = !this.showInfo;
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
    showPlace(place){ //키워드 검색 결과 클릭시 발생합니다.
      console.log(place);
      var locPosition = new kakao.maps.LatLng(place.y, place.x)
      var self= this;
      self.searchPosition = locPosition;
      self.searchPlaceMarker(locPosition);
      self.searchDisplayChange();
    },
    searchPlaceMarker(locPosition){// 검색 지역에 대한 마커를 표시합니다.
        var self = this;
        var map = self.map;
        var imageSrc = 'https://ifh.cc/g/yD4ZVd.png',
            imageSize = new kakao.maps.Size(40, 40);
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        var marker = new kakao.maps.Marker({ 
          map: map, 
          position: locPosition,
          image: markerImage,
          });
        if(self.searchMarker != null){
          self.searchMarker.setMap(null);
        }
        self.searchMarker = marker;
        map.setCenter(locPosition);
    },
    searchDisplayChange(){
      this.searchBoxDisplay = !this.searchBoxDisplay;
    },
    async updateLike(){
      var path=this.dbCollection[this.targetCode]
      const userDoc =doc(db,path,
      (path+"_"+this.targetIndex))
          
      await updateDoc(userDoc, {
        like: this.targetLike
        })         
      },
    async updateLike(){
      var path=this.dbCollection[this.targetCode]
      const userDoc =doc(db,path,
      (this.docName))   
       await updateDoc(userDoc, {
        like: this.targetLike
        })
          
      },
    async updateHate(){
      var path=this.dbCollection[this.targetCode]
      const userDoc =doc(db,path,
      (this.docName))
          
       await updateDoc(userDoc, {
        hate: this.targetHate
        })
          
      },
    voteGood(){
      var self = this;
      if(self.isNear){
        //이미지 변경
        self.isNear = !self.isNear;
        self.targetLike++;
        this.updateLike()
      }
    },
    voteBad(){
      var self = this;
      if(self.isNear){
        self.isNear = !self.isNear;
        self.targetHate++;
        this.updateHate()
      }
    }
    },
  mounted() {
    /*
    if (!window.kakao || !window.kakao.maps) {
      // script 태그 객체 생성
      const script = document.createElement('script');
      /* global */
      /*
      document.cookie = "safeCookie1=foo; SameSite=Lax"; 
      document.cookie = "safeCookie2=foo";
      document.cookie = "crossCookie=bar; SameSite=None; Secure";
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey="+process.env.VUE_APP_KAKAOMAP_KEY;
      script.onload = () => kakao.maps.load(this.initMap);
      document.head.appendChild(script);    
    } else {
      this.initMap();      
    }
    */
   if (window.kakao && window.kakao.maps) {
      setTimeout(() => { this.initMap() }, 100)
    } else {
      const script = document.createElement('script')
      /* global kakao */
      document.cookie = "safeCookie1=foo; SameSite=Lax"; 
      document.cookie = "safeCookie2=foo";  
      document.cookie = "crossCookie=bar; SameSite=None; Secure";
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey="+process.env.VUE_APP_KAKAOMAP_KEY;
      script.onload = () => kakao.maps.load(this.initMap)

      document.head.appendChild(script)
    }
  }
}
</script>