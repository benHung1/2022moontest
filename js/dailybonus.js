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

let siginFinished ;

let quizId;





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
        console.log(finalData);
      localStorage.setItem('userId', finalData.id)
      alert('登入成功')
      popupClosed();
      document.getElementById('userLoginNumber').style.display = 'none';
      document.getElementById('userLoginEventNumber').style.display = 'block'
      document.getElementById('userLoginPoint').style.display = 'block'
      document.getElementById('userLoginEventNumberValue').innerText = finalData.id
      document.getElementById('userLoginPointValue').innerText = finalData.point
      dailyBonusGetStared();
      for(let i = 0; i < finalData.signin.histories.length; i++ ) {
        // console.log(finalData.signin.histories[i]);
        // console.log(document.getElementsByClassName('normal-box')[i]); 
        if(finalData.signin.histories[i].signed) {
            document.getElementsByClassName('normal-box')[i].classList.add('finished')
            siginFinished = document.getElementsByClassName('finished')[i]
            // console.log(siginFinished.parentNode.nextElementSibling);
        }
        document.getElementById('signtoday-btn').addEventListener('click', function() {
            document.getElementById('signtoday-btn').style.display = 'none';
            document.getElementById('signtomorrow-btn').style.display = 'block';
            siginFinished.parentNode.nextElementSibling.classList.add('finished');
            if(siginFinished.parentNode.nextElementSibling.firstElementChild.innerText == 'DAY 3' || siginFinished.parentNode.nextElementSibling.firstElementChild.innerText == 'DAY 6' || siginFinished.parentNode.nextElementSibling.firstElementChild.innerText == 'DAY 9' || siginFinished.parentNode.nextElementSibling.firstElementChild.innerText == 'DAY 12' || siginFinished.parentNode.nextElementSibling.firstElementChild.innerText == 'DAY 15' || siginFinished.parentNode.nextElementSibling.firstElementChild.innerText == 'DAY 18' || siginFinished.parentNode.nextElementSibling.firstElementChild.innerText == 'DAY 21') {
                document.getElementById('eggpopup').style.display = 'block';
                document.getElementById('fade').style.display = 'block';
                document.getElementById('surprisePoints').innerText = 'finalData.bouns.point點'
            }
        })
    }    
  }).catch((error) => {
      console.log(error);
      alert("請輸入正確的活動編號");
      return false;
    })  
  }
}

function getNewsPopup () {
    document.getElementById('newsPopup').style.display = 'block'
    document.getElementById('fade').style.display = 'block';
    fetch('https://event.setn.com/api/2022moonTest/quiz')
    .then((data) => {
        return data.json();
    }).then((finalData) => {
        console.log(finalData);
        document.getElementById('question').innerText = `Q. ${finalData[0].text}`;
        document.getElementById('answerA').innerText = `A. ${finalData[0].options[0]}`;
        document.getElementById('answerB').innerText = `B. ${finalData[0].options[1]}`;
        document.getElementById('openBook').addEventListener('click', function() {
            window.open(finalData[0].referrence)
        })
        localStorage.setItem('quizId', finalData[0].id)
        // localStorage.setItem('quizAnsA', )
    }).catch((error) => {
        console.log(error);
    })
}

function getNewsAnswerA () {

    quizId = localStorage.getItem('quizId');

    fetch('https://event.setn.com/api/2022moonTest/quiz', {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: `${quizId}`,
          }),
    })
}



function dailyBonusGetStared () {
    userId = localStorage.getItem('userId');
    // if(userId !== '' ) {
        document.getElementById('loginbtn-start').style.display = 'none';
        document.getElementById('signtoday-btn').style.display = 'block';

        document.getElementById('newsbtn-exam grey').style.display = 'none';
        document.getElementById('newsbtn-exam').style.display ='block';

    // }
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
  document.getElementById('eggpopup').style.display ='none';
  document.getElementById('newsPopup').style.display = 'none';
}

// 登入活動編號 彈窗

function getUserLogin () {
  document.getElementById('fade').style.display = 'block';
  document.getElementById('popup').style.display = 'block'
}


