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
        signed: false,
        quizTimes: 0,
        share: false,
      },
      points: [],
      rewards: [],
      /* NOTICE | LOGIN | MYID */
      dialog: "",
      /* HOME */
      section: "",
      /* RECORD | TURNTABLE */
      activetab: "RECORD",
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

// 從這開始 從這開始 從這開始 從這開始 從這開始

window.onload = function () {
  if (localStorage.getItem("token") !== null) {
    getUserIdFirst();
  } else {
  }
};

let userNumber;

let userPoint;

let userToken;

let signed;

let userId;

let userFinalPointResults;

let userFinalTurnTableResults;

async function getUserPointResult() {
  document.getElementById("UserPointResult").classList.add("active");
  document.getElementById("UserTurnTableResult").classList.remove("active");

  document.getElementById("Abox").style.display = "block";
  document.getElementById("Bbox").style.display = "none";

  userToken = localStorage.getItem("token");

  if (localStorage.getItem("token") !== null) {
    let pointResult = document.getElementById("pointResult");

    await fetch("https://event.setn.com/api/2022moonTest/point/histories", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${userToken}`,
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((finalData) => {
        // console.log(typeof finalData.histories === "object");
        localStorage.setItem("pointResults", JSON.stringify(finalData));
      })
      .catch((error) => {
        console.log(error);
      });

    userFinalPointResults = JSON.parse(localStorage.getItem("pointResults"));

    if (typeof userFinalPointResults === "array") {
      let finalUserPoints = "";

      userFinalPointResults.histories.reverse();
      userFinalPointResults.histories.map((val) => {
        finalUserPoints += `
            <li class="pointsbox">
            <div class="box-left">
              <span id="pointDate">${val.date}</span>
              <p id="desc">${val.description}</p>
            </div>
            <div class="box-right">
              <p id="point"><strong></strong>${val.point}點</p>
            </div>
          </li>
            `;
      });
      pointResult.innerHTML = finalUserPoints;
    } else {
      let finalUserPointsRuslts = "";

      pointFinalResult = Object.values(userFinalPointResults.histories);

      pointFinalResult.map((val) => {
        finalUserPointsRuslts += `
          <li class="pointsbox">
          <div class="box-left">
            <span id="pointDate">${val.date}</span>
            <p id="desc">${val.description}</p>
          </div>
          <div class="box-right">
            <p id="point"><strong></strong>${val.point}點</p>
          </div>
        </li>
          `;
      });
      pointResult.innerHTML = finalUserPointsRuslts;
    }
  }
}

async function getUserTurnTableResult() {
  document.getElementById("UserPointResult").classList.remove("active");
  document.getElementById("UserTurnTableResult").classList.add("active");
  document.getElementById("Abox").style.display = "none";
  document.getElementById("Bbox").style.display = "block";

  userToken = localStorage.getItem("token");

  if (localStorage.getItem("token") !== null) {
    await fetch("https://event.setn.com/api/2022moonTest/spinToWin/histories", {
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
        localStorage.setItem("turnTableResults", JSON.stringify(finalData));
      })
      .catch((error) => {
        console.log(error);
      });
    userFinalTurnTableResults = JSON.parse(
      localStorage.getItem("turnTableResults")
    );

    if (typeof userFinalTurnTableResults === "array") {
      let finalUserTurnTable = "";
      userFinalTurnTableResults.histories.map((val) => {
        finalUserTurnTable += `
            <li class="pointsbox">
            <div class="box-left">
              <span>${val.date}</span>
              <b class="join-item">參加轉盤兌換</b>
              <b>${val.description}</b>
            </div>
            <div class="box-right">
              <p><strong>${val.point}</strong>點</p>
            </div>
          </li>
        `;
      });
      turnTableResult.innerHTML = finalUserTurnTable;
    } else {
      let finalUserTurnTableRuslts = "";

      pointFinalResult = Object.values(userFinalTurnTableResults.histories);

      pointFinalResult.map((val) => {
        finalUserTurnTableRuslts += `
          <li class="pointsbox">
          <div class="box-left">
            <span id="pointDate">${val.date}</span>
            <p id="desc">${val.description}</p>
          </div>
          <div class="box-right">
            <p id="point"><strong></strong>${val.point}點</p>
          </div>
        </li>
          `;
      });
      turnTableResult.innerHTML = finalUserTurnTableRuslts;
    }
  }
}

function getUserIdFirst() {
  signed = localStorage.getItem("signed");
  userNumber = localStorage.getItem("userId");
  userToken = localStorage.getItem("token");
  userPoint = localStorage.getItem("point");

  fetch("https://event.setn.com/api/2022moonTest/signin", {
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
      popupClosed();
      document.getElementById("userLoginNumber").style.display = "none";
      document.getElementById("userLoginEventNumber").style.display = "block";
      document.getElementById("userLoginPoint").style.display = "block";
      document.getElementById("userLoginEventNumberValue").innerText =
        userNumber;
      document.getElementById("userLoginPointValue").innerText =
        finalData.point;
      getUserPointResult();
    })
    .catch((error) => {
      console.log(error);
      alert("請輸入正確的活動編號");
      return false;
    });
}

function getUserId() {
  let userNumber = document.getElementById("userNumberInput").value;
  if (!userNumber) {
    alert("請不要空白");
    return false;
  } else {
    fetch("https://event.setn.com/api/2022moonTest/signin", {
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
        document.getElementById("userLoginNumber").style.display = "none";
        document.getElementById("userLoginEventNumber").style.display = "block";
        document.getElementById("userLoginPoint").style.display = "block";
        document.getElementById("userLoginEventNumberValue").innerText =
          finalData.id;
        document.getElementById("userLoginPointValue").innerText =
          finalData.point;
        getUserPointResult();
      })
      .catch((error) => {
        console.log(error);
        alert("請輸入正確的活動編號");
        return false;
      });
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
  document.getElementById("popup").style.display = "none";
  document.getElementsByClassName("popup")[0].style.display = "none";
  document.getElementById("noticepage").style.display = "none";
  document.getElementById("fade").style.display = "none";
  document.getElementById("iphonepage").style.display = "none";
}

// 登入活動編號 彈窗

function getUserLogin() {
  document.getElementById("fade").style.display = "block";
  document.getElementById("popup").style.display = "block";
}
