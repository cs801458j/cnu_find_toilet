<template>
  <div>
    <div id="kakaoMap" ></div>
    
  </div>
</template>

<style scoped>
#kakaoMap {
  width: 86%;
  height: 400px;
  margin: auto;
}
</style>

<script>

export default  {
  data() {
    return {
      map: null,
    };
  },
  //  methods <- 일반적으로 템플릿 내부에서 이벤트 리스너로 사용됨
  methods: {
    initMap() {
      const container = document.getElementById("kakaoMap");
      const options = {
        center: new kakao.maps.LatLng(36.36662192460574, 127.34445497915917),
        level: 3// 지도의 레벨 (확대, 축소 정도)
      };
      this.map = new kakao.maps.Map(container, options);
    }, //지도 생성 및 객체 리턴 
    findRoot() {
      
  }
  },
  mounted() {
    if (!window.kakao || !window.kakao.maps) {
      // script 태그 객체 생성
      const script = document.createElement('script');
      /* global */
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
