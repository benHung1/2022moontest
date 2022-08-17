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
        examBlockClass: function() {
            return {
                "exam-block-lock": this.isAnswer != '' || (this.user.quizTimes >= 1 && this.user.share == false) || this.user.quizTimes == 2,
            };
        }
    },
    mounted() {
        this.user.memberId = getCookie('memberId') ? getCookie('memberId') : '';
        this.user.inputMemberId = getCookie('memberId') ? getCookie('memberId') : '';
        this.loadProfile();
        this.getQuestion();
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
            this.user.signed = false;
            this.user.point = 0;
            this.user.quizTimes = 0;
            this.getDailyBonus();
            this.getPoint();
            this.getQuizTimes();
        },
        sign: function() {
            $.post(this.apiBaseUrl + "/dailybonus/point", {
                'member': vm.user.memberId,
                'event': vm.name,
                'action': '1',
            }, function() {
                vm.drawSurprise();
                vm.getDailyBonus();
                vm.getPoint();
                vm.getQuizTimes(); 
            });
        },
        drawSurprise: function() {
            if(this.surpriseDay.includes(this.dailyBonus.length + 1)){
                setTimeout(function(){
                    vm.toggleDialog('SURPRISE');
                }, 1000);
                this.surprise = this.surprises[Math.floor(Math.random() * this.surprises.length)];
                $.post(this.apiBaseUrl + "/dailybonus/point", {
                    'member': vm.user.memberId,
                    'event': vm.name,
                    'action': vm.surprise.id,
                }, function() {
                    vm.getPoint();
                });
            }
        },
        showQuestion: function() {
            if (this.user.quizTimes >= 2) {
                return false;
            }
            this.toggleDialog('');
            this.isAnswer = '';
            this.question = this.questions[Math.floor(Math.random() * this.questions.length)];
            this.toggleDialog('QUIZ');
        },
        pickAnswer: function(ans) {
            if (this.user.quizTimes >= 2 || (this.user.quizTimes == 1 && this.user.share == false)) {
                return false;
            }
            this.isAnswer = ans == this.question.answer ? 'TRUE' : 'FALSE';
            if (this.isAnswer == 'TRUE') {
                this.user.quizTimes++;
                $.post(this.apiBaseUrl + "/dailybonus/point", {
                    'member': vm.user.memberId,
                    'event': vm.name,
                    'action': '2',
                }, function(scoreId) {
                    vm.getPoint();
                    vm.getQuizTimes();
                });
            }
        },
        clickOk: function() {
            window.open(this.question.url);
            if(this.isAnswer == 'TRUE'){
                this.toggleDialog('');   
            }
            this.isAnswer = '';
        },
        getDailyBonus: function() {
            $.get(this.apiBaseUrl + "/dailybonus/?event=" + this.name + "&member=" + this.user.memberId + "&action=1",
                function(result) {
                    if (result) {
                        vm.dailyBonus = JSON.parse(result);
                        if (vm.dailyBonus.length != 0) {
                            let last = new Date(vm.dailyBonus[vm.dailyBonus.length - 1]['created_at']);
                            let today = new Date();
                            vm.user.signed = today.getFullYear() + '/' + today.getMonth() + '/' + today.getDate() == last.getFullYear() + '/' + last.getMonth() + '/' + last.getDate();
                        }
                    }
                });
        },
        getPoint: function() {
            $.get(this.apiBaseUrl + "/dailybonus/point?event=" + this.name + "&member=" + this.user.memberId,
                function(result) {
                    if (result) {
                        vm.user.point = JSON.parse(result)['total'];
                    }
                });
        },
        getQuizTimes: function() {
            $.get(this.apiBaseUrl + "/dailybonus/?event=" + this.name + "&member=" + this.user.memberId + "&action=2",
                function(result) {
                    if (result) {
                        vm.user.quizTimes = 0;
                        let today = new Date();
                        JSON.parse(result).forEach(function(item, index, array) {
                            let date = new Date(item['created_at']);
                            if (today.getFullYear() + '/' + today.getMonth() + '/' + today.getDate() == date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()) {
                                vm.user.quizTimes++;
                            }
                        });
                    }
                });
        },
        getQuestion: function() {
            $.get(this.apiBaseUrl + "/question/?event=" + this.name,
                function(result) {
                    if (result) {
                        vm.questions = JSON.parse(result);
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
