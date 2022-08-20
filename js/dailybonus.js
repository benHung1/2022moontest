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
            surpriseDay:[3,6,9,12,15,18,21],
            surprises:[
                {
                    description: '+5',
                    id: '3',
                },{
                    description: '+10',
                    id: '4',
                },{
                    description: 'x1',
                    id: '5',
                },{
                    description: 'x2',
                    id: '6',
                },
            ],
            surprise: {
                description: '',
                id: '',
            },
            questions: [],
            question: {
                question: "",
                options: [],
                answer: "",
                url: "",
            },
            isAnswer: '',
            /* NOTICE | LOGIN | MYID | QUIZ | SURPRISE */
            dialog: "",
            /* HOME */
            section: "",
            reloginBtn: false,
        };
    },
    computed: {
    },
    mounted() {
    },
    methods: {
    }
};

$(document).ready(function() {

    // if (document.location.protocol == "http:") {
    //     window.location.replace(window.location.href.replace("http:", "https:"));
    // }

    vm = new Vue(app);
});

// 從這開始 從這開始 從這開始 從這開始 從這開始

let userId;

function getUserId () {
  let userNumber = document.getElementById("userNumberInput").value;
  if (!userNumber) {
    alert('請不要空白')
    return false;
  } else {
    fetch('https://event.setn.com/api/2022moonTest/signin', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: `${userNumber}`,
      }),
    })
    .then((data) => {
      return data.json()
    }).then((finalData)=> {
      localStorage.setItem('userId', finalData.id)
      alert('登入成功')
      popupClosed();
      document.getElementById('userLoginNumber').style.display = 'none';
      document.getElementById('userLoginEventNumber').style.display = 'block'
      document.getElementById('userLoginPoint').style.display = 'block'
      document.getElementById('userLoginEventNumberValue').innerText = finalData.id
      document.getElementById('userLoginPointValue').innerText = finalData.point
    }).catch((error) => {
      console.log(error);
      alert("請輸入正確的活動編號");
      return false;
    })  
  }
}



// 會員編號彈窗

function memberNumber () {
  document.getElementById('iphonepage').style.display = 'block'
  document.getElementById('popup').style.display = 'none'
}

// 注意事項彈窗

function popupOpen() {
  document.getElementById('fade').style.display = 'block';
  document.getElementsByClassName('popup')[0].style.display = 'block'
  document.getElementById('noticepage').style.display = 'block'
}

// 關閉彈窗

function popupClosed() {
  document.getElementById('popup').style.display = 'none'
  document.getElementsByClassName('popup')[0].style.display = 'none'
  document.getElementById('noticepage').style.display = 'none'
  document.getElementById('fade').style.display = 'none';
  document.getElementById('iphonepage').style.display = 'none'
}

// 登入活動編號 彈窗

function getUserLogin () {
  document.getElementById('fade').style.display = 'block';
  document.getElementById('popup').style.display = 'block'
}


