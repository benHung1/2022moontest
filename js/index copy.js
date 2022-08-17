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
                contact: "",
                reward: {},
                score: 0,
            },
            activenews: {
                name: "",
                nameShow: true,
                imgShow: true,
            },
            /* NOTICE | LOGIN | MYID*/
            dialog: "",
            /* HOME */
            section: "", 
            reloginBtn: false,  
            isAddClass: false,
            active_el:0,
            activetab: '1',
        };
    },
    mounted() {
        this.user.memberId = getCookie('memberId')?getCookie('memberId'):'';
    },
    methods: {
        login: function(){
            var re = /^[0-9]+$/;
            if (!re.test(this.user.memberId)){
                alert("請輸入活動編號。");
                this.user.memberId = "";
                return false;
            }
            setCookie('2022hodala_memberId',this.user.memberId , 7 , this.domain);
            this.user.id = (this.user.memberId - 3) / 3;
            $.get(this.apiBaseUrl + "/user/profileComplete/" + this.user.id, 
                function(res) {
                    let result = JSON.parse(res)['GetObject'];
                    if(!result){
                        alert('無會員資料，請確認會員活動編號');
                        vm.user.memberId = "";
                        return false;
                    }
                    vm.user.name = result['userName'];
                    vm.writeScore();
                    vm.toggleDialog('EMAIL');
            });
            // 要查詢資料
            return false;
        },
        sign: function(){
            // 今天打卡
        },
        getDailyBonus: function(){
            // 查詢打卡資料
            // 要比對今天
        },
        inhome: function(){
            this.activenews.name = "" ;
            this.activenews.nameShow = true ;
        },
        backIndex: function(){
            this.inhome();
            this.toggleSection('');
            this.toggleSection('HOME');
        },
        toggleSection: function(name) {
            location.href = name + ".html";
        },
        toggleDialog: function(name) {
            this.dialog = this.dialog == name ? "" : name;
        },
        addClass: function(){
            this.isAddClass = true;
        },
        activate: function(el){
            this.active_el = el;
        },
        FacebookShare: function () {
            facebookMe.target.id = this.user.id;
            facebookMe.target.refer = this.name;
            facebookMe.target.href = 'https://acts.setn.com/event/' + this.name;
            facebookMe.target.hashtag = "#簽到隨堂考";
            facebookMe.share();
        }
    }
};

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
                contact: "",
                reward: {},
                score: 0,
            },
            activenews: {
                name: "",
                nameShow: true,
                imgShow: true,
            },
            /* NOTICE | LOGIN | MYID*/
            dialog: "",
            /* HOME */
            section: "", 
            reloginBtn: false,  
            isAddClass: false,
            active_el:0,
            activetab: '1',
        };
    },
    mounted() {
        this.user.memberId = getCookie('memberId')?getCookie('memberId'):'';
    },
    methods: {
        login: function(){
            var re = /^[0-9]+$/;
            if (!re.test(this.user.memberId)){
                alert("請輸入活動編號。");
                this.user.memberId = "";
                return false;
            }
            setCookie('2022hodala_memberId',this.user.memberId , 7 , this.domain);
            this.user.id = (this.user.memberId - 3) / 3;
            $.get(this.apiBaseUrl + "/user/profileComplete/" + this.user.id, 
                function(res) {
                    let result = JSON.parse(res)['GetObject'];
                    if(!result){
                        alert('無會員資料，請確認會員活動編號');
                        vm.user.memberId = "";
                        return false;
                    }
                    vm.user.name = result['userName'];
                    vm.writeScore();
                    vm.toggleDialog('EMAIL');
            });
            // 要查詢資料
            return false;
        },
        sign: function(){
            // 今天打卡
        },
        getDailyBonus: function(){
            // 查詢打卡資料
            // 要比對今天
        },
        inhome: function(){
            this.activenews.name = "" ;
            this.activenews.nameShow = true ;
        },
        backIndex: function(){
            this.inhome();
            this.toggleSection('');
            this.toggleSection('HOME');
        },
        toggleSection: function(name) {
            location.href = name + ".html";
        },
        toggleDialog: function(name) {
            this.dialog = this.dialog == name ? "" : name;
        },
        addClass: function(){
            this.isAddClass = true;
        },
        activate: function(el){
            this.active_el = el;
        },
        FacebookShare: function () {
            facebookMe.target.id = this.user.id;
            facebookMe.target.refer = this.name;
            facebookMe.target.href = 'https://acts.setn.com/event/' + this.name;
            facebookMe.target.hashtag = "#簽到隨堂考";
            facebookMe.share();
        }
    }
};

$(document).ready(function() {

    // if (document.location.protocol == "http:") {
    //     window.location.replace(window.location.href.replace("http:", "https:"));
    // }

    vm = new Vue(app);

    
});
