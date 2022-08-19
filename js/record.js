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

// 從這開始

function getUserPointResult() {
  document.getElementById("Abox").style.display = "block";
  document.getElementById("Bbox").style.display = "none";

  let pointResult = document.getElementById("pointResult");

  fetch("https://event.setn.com/api/2022moonTest/point/histories")
    .then((data) => {
      return data.json();
    })
    .then((finalData) => {
      console.log(finalData);
      localStorage.setItem("pointResults", JSON.stringify(finalData));
    })
    .catch((error) => {
      console.log(error);
    });

  userFinalPointResults = JSON.parse(localStorage.getItem("pointResults"));

  let finalUserPoints = "";
  userFinalPointResults.histories.map((val) => {
    finalUserPoints += `
        <li class="pointsbox">
        <div class="box-left">
          <span id="pointDate">${val.date.substring(5, 10)}</span>
          <p id="desc">${val.description}</p>
        </div>
        <div class="box-right">
          <p id="point"><strong></strong>${val.point}點</p>
        </div>
      </li>
        `;
  });

  pointResult.innerHTML = finalUserPoints;
}

function getUserTurnTableResult() {
  document.getElementById("Abox").style.display = "none";
  document.getElementById("Bbox").style.display = "block";
  fetch("https://event.setn.com/api/2022moonTest/spinToWin/histories", {
    method: "POST",
    mode: "cors",
  })
    .then((data) => {
      return data.json();
    })
    .then((finalData) => {
      console.log(finalData);
      localStorage.setItem("turnTableResults", JSON.stringify(finalData));
    })
    .catch((error) => {
      console.log(error);
    });

  userFinalTurnTableResults = JSON.parse(
    localStorage.getItem("turnTableResults")
  );

  let finalUserTurnTable = "";
  userFinalTurnTableResults.histories.map((val) => {
    finalUserTurnTable += `
    <li class="pointsbox">
    <div class="box-left">
      <span>${val.date.substring(5, 10)}</span>
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
}
