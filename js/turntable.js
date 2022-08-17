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
    computed: {
        wheelClass: function () {
            return {
                "turnon": this.tableStep == 1,
                "turn1": this.tableStep == 2,
                "turn2": this.tableStep == 3,
                "turn3": this.tableStep == 4,
                "turn4": this.tableStep == 5,
                "turn5": this.tableStep == 6,
                "reward1": this.tableStep == 7 && this.user.reward == "Vidol 8折優惠碼",
                "reward2": this.tableStep == 7 && this.user.reward == "7-ELEVEN 45元咖啡券",
                "reward3": this.tableStep == 7 && this.user.reward == "7-ELEVEN 200元購物金",
                "reward4": this.tableStep == 7 && this.user.reward == "7-ELEVEN 100元購物金",
                "reward5": this.tableStep == 7 && (!this.user.draw || this.user.reward ==''),
                "reward6": this.tableStep == 7 && this.user.reward == "7-ELEVEN 50元購物金",
                "reward7": this.tableStep == 7 && this.user.reward == "7-ELEVEN 25元購物金",
                "reward8": this.tableStep == 7 && this.user.reward == "電電購 100元購物金",
            };
        },
    },
    mounted() {
        this.user.memberId = getCookie('memberId') ? getCookie('memberId') : '';
        this.user.inputMemberId = getCookie('memberId') ? getCookie('memberId') : '';
        this.loadProfile();
    },
    methods: {
        login: function() {
            var re = /^[0-9]+$/;
            if (!re.test(this.user.inputMemberId)) {
                alert("活動編號錯誤，請重新確認輸入。");
                this.user.inputMemberId = "";
                return false;
            }
            this.user.id = (this.user.inputMemberId - 3) / 3;
            $.get(this.apiBaseUrl + "/user/profileComplete/" + this.user.id,
                function(res) {
                    let result = JSON.parse(res)['GetObject'];
                    if (!result) {
                        alert('無會員資料，請確認會員活動編號');
                        vm.user.inputMemberId = "";
                        vm.user.id = "";
                        return false;
                    }
                    alert('登錄成功');
                    vm.user.memberId = vm.user.inputMemberId;
                    setCookie('memberId', vm.user.memberId, 3, vm.domain);
                    vm.user.name = result['userName'];
                    vm.loadProfile();
                    vm.toggleDialog('');
                });
            return false;
        },
        loadProfile: function() {
            this.user.point = 0;
            this.getPoint();
        },
        deduction: function() {
            $.post(this.apiBaseUrl + "/dailybonus/point", {
                'member': vm.user.memberId,
                'event': vm.name,
                'action': '7',
            }, function() {
                vm.getPoint();
            });
        },
        start:function(){
            console.log('start');
            if(this.turnOn){
                console.log('遊戲進行中，請勿點擊');
                return false;
            }
            if(this.user.point < this.baseDeduct){
                alert('剩餘次數不足喔!');
                return false;
            }
            this.deduction();
            this.user.draw = false;
            this.user.reward = '';   
            this.turnOn = true;
            this.tableStep = 1;
            this.draw();
        },
        turnAnimate: function() {
            switch (this.tableStep) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    this.tableStep ++; 
                break;
                default:
                    this.turnOn = false;
                    if(this.user.draw){
                        alert('恭喜你得獎了！');
                    };
                    break;
            }
        },
        draw: function() {
            if (this.user.memberId != "") {
                $.post(this.apiBaseUrl + "/lottery/", {
                    'member': this.user.memberId,
                    'event': this.name,
                }, function(result) {
                    vm.user.draw = JSON.parse(result)['draw'];
                    if(vm.user.draw){
                        vm.user.reward = JSON.parse(result)['reward'];
                    }
                    console.log(JSON.parse(result));
                });
            }
        },
        getPoint: function() {
            $.get(this.apiBaseUrl + "/dailybonus/point?event=" + this.name + "&member=" + this.user.memberId,
                function(result) {
                    if (result) {
                        vm.user.point = JSON.parse(result)['total'];
                        vm.drawChance = Math.floor(vm.user.point/vm.baseDeduct);
                    }
                });
        },
        toggleSection: function(name) {
            location.href = name + ".html";
        },
        toggleDialog: function(name) {
            this.isAnswer = '';
            this.dialog = this.dialog == name ? "" : name;
        },
        FacebookShare: function() {
            facebookMe.target.id = this.user.id;
            facebookMe.target.refer = this.name;
            facebookMe.target.href = 'https://acts.setn.com/event/' + this.name;
            facebookMe.target.hashtag = "#簽到隨堂考";
            facebookMe.share(function() {
                if (vm.user.memberId != "") {
                    vm.user.share = true;
                }
            });
        }
    }
};

$(document).ready(function() {

    // if (document.location.protocol == "http:") {
    //     window.location.replace(window.location.href.replace("http:", "https:"));
    // }

    vm = new Vue(app);


});
