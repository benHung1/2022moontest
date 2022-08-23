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
  // if (document.location.protocol == "http:") {
  //     window.location.replace(window.location.href.replace("http:", "https:"));
  // }

  vm = new Vue(app);
});

// 從這開始 從這開始 從這開始 從這開始 從這開始 從這開始 從這開始

// 進來先打第一隻api

let finalPrize;

let quota;
let startItem = "";

window.onload = function () {
  if (localStorage.getItem("token") !== null) {
    getQuota();
  } else {
    console.log("有妳媽token");
  }
};

async function getQuota() {
  await fetch("https://event.setn.com/api/2022moonTest/spinToWin", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "token",
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((finalData) => {
      console.log(finalData);
      localStorage.setItem("firstQuota", finalData.spinToWin.quota);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getfinalPrize() {
  await fetch("https://event.setn.com/api/2022moonTest/spinToWin", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "token",
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((finalData) => {
      console.log(finalData);

      finalPrize = finalData.spinToWin.win.name;
      localStorage.setItem("finalQuota", finalData.spinToWin.quota);

      startItem = finalPrize;
    })
    .catch((error) => {
      console.log(error);
    });
}

PrizeSon = [
  "燒肉眾二代目500元券",
  "燒肉哦爺500元券",
  "鹿兒島燒肉500元券",
  "燒肉眾500元券",
  "再接再厲",
  "3D優質按摩滾筒",
  "7-11壹佰元禮券",
  "電動按摩筋膜槍",
];
totalNum = 8; // 轉盤 總數
turnNum = [1, 2, 3, 4, 5, 6, 7, 8]; //概率 獎品編號
isStatr = false; //鎖住 不能重複點擊;
lenCloc = 0;
turn = 4; //轉盤最低幾圈 你想幾圈

// 取出剛進頁面的扣打

let firstQuota = localStorage.getItem("firstQuota");
document.getElementById("count").innerText = firstQuota;

let finalQuota;

//開始
async function start() {
  finalQuota = localStorage.getItem("finalQuota");

  if (!isStatr && firstQuota > 0) {
    isStatr = true;
    await this.getfinalPrize();
    if (startItem != "") {
      random = PrizeSon.indexOf(startItem);
      operation(random);
    } else {
      return false;
    }
  } else if (firstQuota == 0 && !isStatr) {
    alert("剩餘次數不足喔");
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
  if (finalQuota > 0) {
    wheel.style.transform = "rotate(" + (lenCloc * sun - Prize * 45) + "deg)";
    setTimeout(
      function () {
        alert(PrizeSon[Prize]); //傳什麼給你什麼
        isStatr = false;
        // 取出轉完的扣打
        document.getElementById("count").innerText = finalQuota;
      }.bind(this),
      3000
    );
  }
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
}
