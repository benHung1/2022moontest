var app = {
    el: "#app",
    data() {
        return {
            name: "2022classTest",
            apiBaseUrl: "https://event.setn.com/ci",
            domain: "acts.setn.com",
            user: {
                id: ""
            },
            /* NOTICE*/
            dialog: "",
            showTotal: 0,
        };
    },
    mounted() {
        this.user.memberId = getCookie('memberId') ? getCookie('memberId') : '';
        this.getEveryDaySign();
    },
    methods: {
        toggleSection: function(name) {
            location.href = name + ".html";
        },
        toggleDialog: function(name) {
            this.dialog = this.dialog == name ? "" : name;
        },
        FacebookShare: function() {
            facebookMe.target.id = this.user.id;
            facebookMe.target.refer = this.name;
            facebookMe.target.href = 'https://acts.setn.com/event/' + this.name;
            facebookMe.target.hashtag = "#簽到隨堂考";
            facebookMe.share();
        },
        getEveryDaySign: function() {
            this.showTotal = parseInt(1500 - parseInt(String(Date.now()).slice(5, 7)) * 21 / 3 + String(Date.now()).slice(7, 10) / 10);
            setInterval(function() {
                vm.showTotal = parseInt(1500 - parseInt(String(Date.now()).slice(5, 7)) * 21 / 3 + String(Date.now()).slice(7, 10) / 10);
            }, Math.floor(Math.random() * 20000));
        },
    }
};

$(document).ready(function() {

    // if (document.location.protocol == "http:") {
    //     window.location.replace(window.location.href.replace("http:", "https:"));
    // }

    vm = new Vue(app);


});
