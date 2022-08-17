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
    computed: {
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
            this.getReward();
        },
        getPoint: function() {
            $.get(this.apiBaseUrl + "/dailybonus/point?event=" + this.name + "&member=" + this.user.memberId,
                function(result) {
                    if (result) {
                        vm.user.point = JSON.parse(result)['total'];
                        vm.points = JSON.parse(result)['record'];
                        vm.points.forEach(function(item, index, array) {
                            let date = new Date(item['created_at']);
                            vm.points[index].date = String(date.getMonth()+1).padStart(2,'0') + '/' + String(date.getDate()).padStart(2,'0');
                            vm.points[index].num = item['num'].split('.')[0];
                            if(item['num'].split('')[0] != '-'){
                                vm.points[index].num = '+' + vm.points[index].num; 
                            }
                        });
                    }
                });
        },
        getReward: function() {
            $.get(this.apiBaseUrl + "/lottery/?event=" + this.name + "&member=" + this.user.memberId,
                function(result) {
                    if (result) {
                        vm.rewards = JSON.parse(result);
                        vm.rewards.forEach(function(item, index, array) {
                            let date = new Date(item['created_at']);
                            vm.rewards[index].date = String(date.getMonth()+1).padStart(2,'0') + '/' + String(date.getDate()).padStart(2,'0');
                            vm.rewards[index].name = vm.rewards[index].name? vm.rewards[index].name : '明天再來一次';
                        });
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
