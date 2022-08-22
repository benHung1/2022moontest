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
      dailyBonus: [],
      surpriseDay: [3, 6, 9, 12, 15, 18, 21],
      surprises: [
        {
          description: "+5",
          id: "3",
        },
        {
          description: "+10",
          id: "4",
        },
        {
          description: "x1",
          id: "5",
        },
        {
          description: "x2",
          id: "6",
        },
      ],
      surprise: {
        description: "",
        id: "",
      },
      questions: [],
      question: {
        question: "",
        options: [],
        answer: "",
        url: "",
      },
      isAnswer: "",
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

// 從這開始 從這開始 從這開始 從這開始 從這開始

let userId;

let siginFinished;

let notSigninFinished;

let quizId;

let quizUrl;

let dailyQuota;

let finalDailyQuota;


window.onload = function () {
  getUserIdFirst();
}

function getUserIdFirst () {
  fetch("https://event.setn.com/api/2022moonTest/signin", {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'token',
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((finalData) => {
      console.log(finalData);
      localStorage.setItem("userId", finalData.id);
      popupClosed();
      document.getElementById("userLoginNumber").style.display = "none";
      document.getElementById("userLoginEventNumber").style.display = "block";
      document.getElementById("userLoginPoint").style.display = "block";
      document.getElementById("userLoginEventNumberValue").innerText =
        finalData.id;
      document.getElementById("userLoginPointValue").innerText =
        finalData.point;
      dailyBonusGetStared();
      for (let i = 0; i < finalData.signin.histories.length; i++) {
        // console.log(finalData.signin.histories[i]);
        // console.log(document.getElementsByClassName('normal-box')[i]);
        if (finalData.signin.histories[i].signed) {
          document
            .getElementsByClassName("normal-box-container")
            [i].classList.add("finished");
          siginFinished = document.getElementsByClassName("finished")[i];
          // console.log(siginFinished.classList.contains("finished") == true);
        }
      }
      // 登入成功後簽到按鈕

      document
        .getElementById("signtoday-btn")
        .addEventListener("click", function () {
          fetch("https://event.setn.com/api/2022moonTest/signin", {
            method: 'POST',
            mode: 'cors',
            headers: {
              "Content-Type": "application/json",
              'Authorization': 'token',
            },        
          })
            .then((data) => {
              return data.json();
            })
            .then((finalData) => {
              console.log(finalData);
              notSigninFinished = document.getElementsByClassName(
                "normal-box-container"
              )[0];
              document.getElementById("signtoday-btn").style.display = "none";
              document.getElementById("signtomorrow-btn").style.display =
                "block";

              // 代表從第一天開始
              if (siginFinished == undefined) {
                notSigninFinished.classList.add("finished");
              } else {
                siginFinished.nextElementSibling.classList.add("finished");
                // 如果簽到天數為三的位數 && 前面兩天都有簽到的話
                if (
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 3" &&
                    document
                      .getElementsByClassName("normal-box-container")[0]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[1]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 6" &&
                    document
                      .getElementsByClassName("normal-box-container")[3]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[4]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 9" &&
                    document
                      .getElementsByClassName("normal-box-container")[6]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[7]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 12" &&
                    document
                      .getElementsByClassName("normal-box-container")[9]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[10]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 15" &&
                    document
                      .getElementsByClassName("normal-box-container")[12]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[13]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 18" &&
                    document
                      .getElementsByClassName("normal-box-container")[15]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[16]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 21" &&
                    document
                      .getElementsByClassName("normal-box-container")[19]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[20]
                      .classList.contains("finished") == true)
                ) {
                  document.getElementById("eggpopup").style.display = "block";
                  document.getElementById("fade").style.display = "block";
                  document.getElementById("surprisePoints").innerText =
                    `${finalData.bouns.point}點`;
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      localStorage.setItem('dailyQuota', finalData.quiz.quota)
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
        'Authorization': 'token',
      },
      body: JSON.stringify({
        // 第一次要帶
        id: `${userNumber}`,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((finalData) => {
        console.log(finalData);
        localStorage.setItem("userId", finalData.id);
        alert("登入成功");
        popupClosed();
        document.getElementById("userLoginNumber").style.display = "none";
        document.getElementById("userLoginEventNumber").style.display = "block";
        document.getElementById("userLoginPoint").style.display = "block";
        document.getElementById("userLoginEventNumberValue").innerText =
          finalData.id;
        document.getElementById("userLoginPointValue").innerText =
          finalData.point;
        dailyBonusGetStared();
        for (let i = 0; i < finalData.signin.histories.length; i++) {
          // console.log(finalData.signin.histories[i]);
          // console.log(document.getElementsByClassName('normal-box')[i]);
          if (finalData.signin.histories[i].signed) {
            document
              .getElementsByClassName("normal-box-container")
              [i].classList.add("finished");
            siginFinished = document.getElementsByClassName("finished")[i];
            // console.log(siginFinished.classList.contains("finished") == true);
          }
        }
        // 登入成功後簽到按鈕

        document
        .getElementById("signtoday-btn")
        .addEventListener("click", function () {
          fetch("https://event.setn.com/api/2022moonTest/signin", {
            method: 'POST',
            mode: 'cors',
            headers: {
              "Content-Type": "application/json",
              'Authorization': 'token',
            },        
          })
            .then((data) => {
              return data.json();
            })
            .then((finalData) => {
              console.log(finalData);
              notSigninFinished = document.getElementsByClassName(
                "normal-box-container"
              )[0];
              document.getElementById("signtoday-btn").style.display = "none";
              document.getElementById("signtomorrow-btn").style.display =
                "block";

              // 代表從第一天開始
              if (siginFinished == undefined) {
                notSigninFinished.classList.add("finished");
              } else {
                siginFinished.nextElementSibling.classList.add("finished");
                // 如果簽到天數為三的位數 && 前面兩天都有簽到的話
                if (
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 3" &&
                    document
                      .getElementsByClassName("normal-box-container")[0]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[1]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 6" &&
                    document
                      .getElementsByClassName("normal-box-container")[3]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[4]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 9" &&
                    document
                      .getElementsByClassName("normal-box-container")[6]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[7]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 12" &&
                    document
                      .getElementsByClassName("normal-box-container")[9]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[10]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 15" &&
                    document
                      .getElementsByClassName("normal-box-container")[12]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[13]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 18" &&
                    document
                      .getElementsByClassName("normal-box-container")[15]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[16]
                      .classList.contains("finished") == true) ||
                  (siginFinished.nextElementSibling.firstElementChild
                    .innerText == "DAY 21" &&
                    document
                      .getElementsByClassName("normal-box-container")[19]
                      .classList.contains("finished") == true &&
                    document
                      .getElementsByClassName("normal-box-container")[20]
                      .classList.contains("finished") == true)
                ) {
                  document.getElementById("eggpopup").style.display = "block";
                  document.getElementById("fade").style.display = "block";
                  document.getElementById("surprisePoints").innerText =
                    `${finalData.bouns.point}點`;
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });

        localStorage.setItem('dailyQuota', finalData.quiz.quota)
      })
      .catch((error) => {
        console.log(error);
        alert("請輸入正確的活動編號");
        return false;
      });
  }
}

function getNewsPopup() {

  dailyQuota = localStorage.getItem('dailyQuota')
  finalDailyQuota = localStorage.getItem('finalDailyQuota')

  // if( dailyQuota > 0 || finalDailyQuota == 2) {
    document.getElementById("newsPopup").style.display = "block";
    document.getElementById("fade").style.display = "block";
    fetch("https://event.setn.com/api/2022moonTest/quiz", {
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'token',
      },  
    })
      .then((data) => {
        return data.json();
      })
      .then((finalData) => {
        console.log(finalData);
        document.getElementById("question").innerText = `Q. ${finalData[0].text}`;
        document.getElementById(
          "answerA"
        ).innerText = `A. ${finalData[0].options[0]}`;
        document.getElementById(
          "answerB"
        ).innerText = `B. ${finalData[0].options[1]}`;
        document
          .getElementById("openBook")
          .addEventListener("click", function () {
            window.open(finalData[0].referrence);
          });
        localStorage.setItem("quizId", finalData[0].id);
        localStorage.setItem("quizUrl", finalData[0].referrence);
      })
      .catch((error) => {
        console.log(error);
      });  
  // } else if ( dailyQuota == 0 ){
  //   document.getElementById("newsPopup").style.display = "block";
  //   document.getElementById("fade").style.display = "block";
  //   document.getElementById('share-exam-false').style.display = 'none';
  //   document.getElementById('exambox').style.display = 'none';
  //   document.getElementById('share-exam-over').style.display = 'block';
  // } else if(finalDailyQuota == 1) {
  //   document.getElementById("share-exam-share").style.display = "block";
  //   document.getElementById('exambox').style.display = 'none';
  // } else if(finalDailyQuota == 0) {
    //   document.getElementById("share-exam-over").style.display = "block";
    //   document.getElementById('exambox').style.display = 'none';
    // } 


}

function getNewsAnswerA() {
  quizId = localStorage.getItem("quizId");

  fetch("https://event.setn.com/api/2022moonTest/quiz", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'token',
    },
    body: JSON.stringify({
      id: `${quizId}`,
      option: 0,
    }),
  })
    .then((data) => {
      return data.json();
    })
    .then((finalData) => {
      console.log(finalData);
      document.getElementById("exambox").style.display = "none";
      localStorage.setItem('finalDailyQuota', finalData.quiz.quota)
      if ( finalData.quiz.isRight ) {
          document.getElementById("share-exam-true").style.display = "block";
      } else {
          document.getElementById("share-exam-false").style.display = "block";
      }
    });
}

function getNewsAnswerB() {
  quizId = localStorage.getItem("quizId");

  fetch("https://event.setn.com/api/2022moonTest/quiz", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'token',
    },
    body: JSON.stringify({
      id: `${quizId}`,
      option: 1,
    }),
  })
    .then((data) => {
      return data.json();
    })
    .then((finalData) => {
      console.log(finalData);
      document.getElementById("exambox").style.display = "none";
      if (finalData.quiz.isRight) {
        document.getElementById("share-exam-true").style.display = "block";
      } else {
        document.getElementById("share-exam-false").style.display = "block";
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function newsClickOk() {
  quizUrl = localStorage.getItem("quizUrl");
  window.open(quizUrl);
  // document.getElementsByClassName("exambtn")[0].innerText = "分享";
  popupClosed();
}

function shareFaceBook() {
  window.open("https://www.google.com");
  popupClosed();
}
function dailyBonusGetStared() {
  userId = localStorage.getItem("userId");
  // if(userId !== '' ) {
  document.getElementById("loginbtn-start").style.display = "none";
  document.getElementById("signtoday-btn").style.display = "block";

  document.getElementById("newsbtn-exam grey").style.display = "none";
  document.getElementById("newsbtn-exam").style.display = "block";
  // }
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
  document.getElementById("eggpopup").style.display = "none";
  document.getElementById("newsPopup").style.display = "none";
  document.getElementById("exambox").style.display = "block";
  document.getElementById("share-exam-true").style.display = "none";
  document.getElementById("share-exam-share").style.display = "none";
}

// 登入活動編號 彈窗

function getUserLogin() {
  document.getElementById("fade").style.display = "block";
  document.getElementById("popup").style.display = "block";
}
