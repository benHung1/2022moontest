var app = {
  el: "#app",
  data() {
    return {
      name: "2022classTest",
      apiBaseUrl: "https://event.setn.com/ci",
      domain: "acts.setn.com",
      user: {
        id: "",
        name: "",
        memberId: "",
        inputMemberId: "",
        contact: "",
        point: 0,
        reward: "",
        draw: false,
      },
      tableStep: 0,
      turnOn: false,
      drawChance: 0,
      baseDeduct: 10,
      /* NOTICE | LOGIN | MYID | QUIZ | SURPRISE */
      dialog: "",
      /* HOME */
      section: "",
      reloginBtn: false,
    };
  },
  computed: {},
  mounted() {},
  methods: {},
};

$(document).ready(function () {
  vm = new Vue(app);
});

// 從這開始 從這開始 從這開始 從這開始 從這開始 從這開始 從這開始

// 進來先打第一隻api

let finalPrize;

let quota;
let startItem = "";

let userNumber;

let userPoint;

let userToken;

let signed;

let userId;

window.onload = function () {
  if (localStorage.getItem("token") !== null) {
    getQuota();
  } else {
    console.log("沒token");
  }
};

async function getUserId() {
  let userNumber = document.getElementById("userNumberInput").value;
  if (!userNumber) {
    alert("請不要空白");
    return false;
  } else {
    await fetch("https://event.setn.com/api/2022moonTest/signin", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${userToken}`,
      },
      body: JSON.stringify({
        id: `${userNumber}`,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((finalData) => {

        localStorage.clear();

        localStorage.setItem("signed", finalData.signin.signed);
        localStorage.setItem("token", finalData.token);
        localStorage.setItem("userId", finalData.id);
        localStorage.setItem("point", finalData.point);
        alert("登入成功");
        popupClosed();
        getQuota();
      })
      .catch((error) => {
        console.log(error);
        alert("請輸入正確的活動編號");
        return false;
      });
  }
}

// token ture = 有值 才去執行以下

function getUserToken() {
  return !(userToken === null || userToken === undefined);
}

async function getQuota() {
  signed = localStorage.getItem("signed");
  userNumber = localStorage.getItem("userId");
  userToken = localStorage.getItem("token");
  userPoint = localStorage.getItem("point");

  await fetch("https://event.setn.com/api/2022moonTest/spinToWin", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((finalData) => {
      console.log(finalData);
      localStorage.setItem("firstQuota", finalData.spinToWin.quota);
      document.getElementById("count").innerText = finalData.spinToWin.quota;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getfinalPrize() {
  if (!getUserToken()) return;
  await fetch("https://event.setn.com/api/2022moonTest/spinToWin", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userToken}`,
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((finalData) => {
      console.log(finalData);

      finalPrize = finalData.spinToWin.win.name;
      localStorage.setItem("finalQuota", finalData.spinToWin.quota);
      // 取出轉完的扣打
      document.getElementById("count").innerText = finalData.spinToWin.quota;

      startItem = finalPrize;
    })
    .catch((error) => {
      console.log(error);
    });
}

PrizeSon = [
  "燒肉眾二代目500元券",
  "燒肉眾哦爺500元券",
  "鹿兒島燒肉500元券",
  "燒肉眾500元券",
  "再接再厲",
  "3D硬質按摩滾筒",
  "7-11壹百元禮券",
  "電動按摩筋膜槍",
];

totalNum = 8; // 轉盤 總數
turnNum = [1, 2, 3, 4, 5, 6, 7, 8]; //概率 獎品編號
isStatr = false; //鎖住 不能重複點擊;
lenCloc = 0;
turn = 4; //轉盤最低幾圈 你想幾圈

// 取出剛進頁面的扣打

let firstQuota;

let finalQuota;

//開始
async function start() {
  firstQuota = localStorage.getItem("firstQuota");
  finalQuota = localStorage.getItem("finalQuota");

  if (!getUserToken() ) {
    document.getElementById("popup").style.display = "block";
    document.getElementById("fade").style.display = "block";
  };

  if (finalQuota === '0' && !isStatr) {
    alert('剩餘次數不足囉');
    return;
  }


  if (!isStatr && firstQuota > 0) {
    isStatr = true;
    await this.getfinalPrize();

    // startItem 為 "" || null || undefined時 再反轉

    if (!startItem) {
      return;
    } else {
      random = PrizeSon.indexOf(startItem);
      if (random === -1) return;

      operation(random);

      // console.log("startItem" + startItem);
      // console.log("random" + random);
    }
  } 
}

function operation(ran) {
  let wheel = document.getElementById("wheel");
  lenCloc++;
  let Prize = turnNum[ran] - 1;
  let sun = turn * 360; //最小圈数
  if (Prize >= totalNum) {
    Prize = 0;
  }
  if (firstQuota > 0) {
    wheel.style.transform = "rotate(" + (lenCloc * sun - Prize * 45) + "deg)";
    setTimeout(
      function () {
        alert("恭喜您中獎" + PrizeSon[Prize]); //傳什麼給你什麼
        isStatr = false;
      }.bind(this),
      3000
    );
  }
}

// 會員編號彈窗

function memberNumber() {
  document.getElementById("iphonepage").style.display = "block";
  document.getElementById("popup").style.display = "none";
}

// 注意事項彈窗

function popupOpen() {
  document.getElementById("fade").style.display = "block";
  document.getElementsByClassName("popup")[0].style.display = "block";
  document.getElementById("noticepage").style.display = "block";
}

// 關閉彈窗

function popupClosed() {
  document.getElementById("noticepage").style.display = "none";
  document.getElementById("fade").style.display = "none";
  document.getElementById("popup").style.display = "none";
  document.getElementById("iphonepage").style.display = "none";
}
