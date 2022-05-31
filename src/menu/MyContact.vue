<template>
    <div class="MyContact">
        <div class="container">
            <h1>문의하기</h1>
            <form action="action_page.php" v-on:submit="showSubmit">
                <label for="contact">1. 무엇을 도와드릴까요?</label>
                <select v-model="contactTag" id="contact" name="contact">
                    <option value="" disabled selected>선택 사항</option>
                    <option>앱 이용에 문제가 있습니다.</option>
                    <option>화장실 사용에 문제가 있습니다.</option>
                    <option>기타</option>
                </select>
                <textarea v-model="contactContent" id="content" name="content" placeholder="문의사항을 입력해주세요." style="height:200px"></textarea>
                <label for="contact">2. 개인정보제공 동의서</label>
                <div class="flex-container1">
                  <label id="name">성함</label>
                  <input v-model="lname" type="text" id="lname" name="lastname" placeholder="이름">
                  <input v-model="fname" type="text" id="fname" name="firstname" placeholder="성">
                </div>
                <div class="flex-container2">
                  <label id="email">이메일</label>
                  <input v-model="email" type="text" id="emailbox" name="emailbox" placeholder="답변 회신을 위한 이메일">
                </div>
                <form action="" id="personal information agreement">
                  <ul class="content box">
                    <li>「개인정보보호법 제 15조(개인정보의 수집, 이용), 제 17조(개인정보의 제공),
                          제 18조(개인정보의 이용, 제공, 제한), 제 22조(동의를 받는 방법)」에 의거 개인정보처리에
                          관하여 고지를 받았으며 본인은 이와 같이 개인정보 수집 및 이용, 제공에 동의합니다.
                    </li>
                  </ul>
                  <div class="radio">
                    <li>
                      <input id="r1" type="radio" name="radio" value="1" checked>
                      <label for="r1">동의</label>
                    </li>
                    <li>
                      <input id="r2" type="radio" name="radio" value="2">
                      <label for="r2">비동의</label>
                    </li>
                  </div>
                </form>
                <input type="submit" value="보내기">
            </form>
        </div>
    </div>
</template>

<script>
export default({
  data() {
    return {
      contactTag: '',
      contctContent: '',
      fname: '',
      lname: '',
      email: '',
    };
  },
  methods:{
    showSubmit(e){
      e.preventDefault();
      console.log("tag = " + this.contactTag);
      console.log("content = " + this.contactContent);
      console.log("fname = " + this.fname);
      console.log("lname = " + this.lname);
      console.log("lname = " + this.email);
    }
  }
})
</script>

<style scoped>
input[type=text], select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 14px;
  margin-bottom: 16px;
  resize: vertical
}
select option[value=""][disabled]{
  display: none;
}
input[id*="name"]{
  margin-right: 20px;
  margin-left: 40px;
}
.container {
  border-radius: 5px;
  background-color: #ffd0d0;
  padding: 20px;
}
.container h1{
  margin-bottom: 50px;
  color: black;
}
.container label{
  font-size: 120%;
}
#content{
  margin-bottom:50px;
}
.flex-container1{
  display: flex;
}
.flex-container1 label {
  padding: 10px;
}
.flex-container2{
  display: flex;
}
#name{
  width: 300px;
  margin-top: 15px;
  margin-left: -20px;
  margin-right: -40px;
}
#email{
  width: 70px;
  margin-top: 25px;
  margin-right: 5px;
}
.radio li{
  width: 50%;
  float: left;
}
input[type=submit] {
  background-color: #e77777;
  color: white;
  padding: 12px 20px;
  margin-top: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
input[type=submit]:hover {
  background-color: #c62934;
}
</style>

<style lang = "scss">
  @import url(//fonts.googleapis.com/earlyaccess/hanna.css);
  .MyContact{
    font-family: 'Hanna';
    font-size: 100%;
    z-index: 10000;
  }
  li{
    list-style:none;
  }
  @supports(-webkit-appearance: none) or (-moz-appearance: none) {
  input[type='radio'] {
    --active: #275EFE;
    --active-inner: #fff;
    --focus: 2px rgba(39, 94, 254, .3);
    --border: #BBC1E1;
    --border-hover: #275EFE;
    --background: #fff;
    --disabled: #F6F8FF;
    --disabled-inner: #E1E6F9;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 21px;
    outline: none;
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin: 0;
    cursor: pointer;
    border: 1px solid var(--bc, var(--border));
    background: var(--b, var(--background));
    transition: background .3s, border-color .3s, box-shadow .2s;
    &:after {
      content: '';
      display: block;
      left: 0;
      top: 0;
      position: absolute;
      transition: transform var(--d-t, .3s) var(--d-t-e, ease), opacity var(--d-o, .2s);
    }
    &:checked {
      --b: var(--active);
      --bc: var(--active);
      --d-o: .3s;
      --d-t: .6s;
      --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
    }
    &:disabled {
      --b: var(--disabled);
      cursor: not-allowed;
      opacity: .9;
      &:checked {
        --b: var(--disabled-inner);
        --bc: var(--border);
      }
      & + label {
        cursor: not-allowed;
      }
    }
    &:hover {
      &:not(:checked) {
        &:not(:disabled) {
          --bc: var(--border-hover);
        }
      }
    }
    &:focus {
      box-shadow: 0 0 0 var(--focus);
    }
    &:not(.switch) {
      width: 21px;
      &:after {
        opacity: var(--o, 0);
      }
      &:checked {
        --o: 1;
      }
    }
    & + label {
      font-size: 14px;
      line-height: 21px;
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
      margin-left: 4px;
    }
  }
  input[type='radio'] {
    border-radius: 50%;
    &:after {
      width: 19px;
      height: 19px;
      border-radius: 50%;
      background: var(--active-inner);
      opacity: 0;
      transform: scale(var(--s, .7));
      vertical-align:middle;
    }
    &:checked {
      --s: .5;
    }
  }
}
</style>