<template>
    <router-view>
        <div class= up >
            <router-link to='/kakaoMap'>
                <button class="up_button">
                    <div class=up_text>제일 가까운 화장실</div>
                    <img src="https://ifh.cc/g/paOswt.png">
                </button>
            </router-link>
        </div>
        <div class = down>
            <router-link to='/kakaoMap'>
                <button class ="down_button">
                    <div class="down_text">리뷰가 좋은 화장실</div>
                    <img src="https://ifh.cc/g/ofGToM.png">
                </button>
            </router-link>
        </div>
    </router-view>
    
</template>
<style scoped>
    .up img{
        margin-top: 20px;
        max-height: 200px;
    }
    .up_button{
        width: 100%;
        height: 300px;
        background-color:rgb(9, 88, 167);
    }
    .up_text{
        margin-top: 0px;
    }
    .down_button img{
        margin-top: 20px;
        height: 200px;
    }
    .down_button{
        width: 100%;
        height: 300px;
        background-color:rgb(246, 207, 33);
    }
    .down_text{
        margin-top: 0px;
    }
</style>

<style lang = "scss">
    .up{
        font-family: 'Jua'
    }
    .up_text{
        font-size: 30px;
    }
    .down_text{
        font-size: 30px;
    }
</style>