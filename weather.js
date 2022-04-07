function unixHour(num) {
    var sec = new Date(num * 1000);
    return sec.getHours();
}
if (navigator.cookieEnabled) {
    var api;
    let httpcheck = new XMLHttpRequest();
    httpcheck.onload = () => {
        if (httpcheck.responseText) {
            api = httpcheck.responseText;
            useData(JSON.parse(api));
        } else {
            fetch(
                "https://api.openweathermap.org/data/2.5/onecall?lat=37.1955948&lon=50.1529566&exclude=alerts,minutely,current&units=metric&appid=81a57d03343af64fed7d77b4fdcb7340"
            )
                .then((get) => get.json())
                .then((obj) => {
                    var api = {
                        today: {
                            dt: obj.daily[0].dt,
                            sunrise: obj.daily[0].sunrise,
                            sunset: obj.daily[0].sunset,
                            temp: {
                                min: obj.daily[0].temp.min,
                                max: obj.daily[0].temp.max,
                            },
                        },
                        tomorrow: {
                            dt: obj.daily[1].dt,
                            sunrise: obj.daily[1].sunrise,
                            sunset: obj.daily[1].sunset,
                            temp: {
                                min: obj.daily[1].temp.min,
                                max: obj.daily[1].temp.max,
                            },
                        },
                        hourly: [],
                    };
                    var expire;
                    for (let hour of obj.hourly) {
                        if (unixHour(hour.dt) == 0) {
                            expire = calcExpire(hour.dt);
                            break;
                        } else {
                            api.hourly.push({ dt: hour.dt, temp: hour.temp });
                        }
                    }
                    function calcExpire(timestamp) {
                        let current = new Date(api.today.dt * 1000);
                        let cuHour = current.getHours();
                        let cuMin = current.getMinutes();
                        let cuSec = current.getSeconds();
                        let expire = new Date(timestamp * 1000);
                        let exHour = expire.getHours();
                        let exMin = expire.getMinutes();
                        let exSec = expire.getSeconds();
                        if (
                            exHour * 3600 + exMin * 60 + exSec >
                            cuHour * 3600 + cuMin * 60 + cuSec
                        ) {
                            return (
                                exHour * 3600 +
                                exMin * 60 +
                                exSec -
                                (cuHour * 3600 + cuMin * 60 + cuSec)
                            );
                        } else if (
                            exHour * 3600 + exMin * 60 + exSec <
                            cuHour * 3600 + cuMin * 60 + cuSec
                        ) {
                            return (
                                cuHour * 3600 +
                                cuMin * 60 +
                                cuSec -
                                (exHour * 3600 + exMin * 60 + exSec)
                            );
                        }
                    }
                    let http = new XMLHttpRequest();
                    http.onload = () => {
                        useData(api);
                    };
                    http.open("POST", "./cookie.php");
                    http.setRequestHeader(
                        "Content-type",
                        "application/x-www-form-urlencoded"
                    );
                    http.send(
                        "api=" + JSON.stringify(api) + "&time=" + expire + "&if=true"
                    );
                });
        }
    };
    httpcheck.open("POST", "./cookie.php");
    httpcheck.send();
} else {
    alert("enable cookie!");
}
/////////////////////////////

var $ = (el) => {
    return document.querySelector(el);
};
const current = [];
const MIN = (time) => {
    return time[0] * 60 + Number(time[1]);
};
var daybreak = [24, 0];
const DayBreak = (current) => {
    daybreak[0] += current[0];
    daybreak[1] = current[1];
};
var DayBreakFlag = false;

async function useData(data) {
    var now = new Date();
    var temp;
    for (let hour of data.hourly) {
        var timestamp = new Date(hour.dt * 1000);
        if (now.getHours() == timestamp.getHours()) {
            temp = hour.temp;
        }
    }

    // FOR TEMP
    $("#upTemp").innerText = Math.ceil(data.today.temp["max"]);
    $("#downTemp").innerText = Math.floor(data.today.temp["min"]);
    $(".current-temp").innerText = `${Math.round(temp)}°C`;
    $(".speedmeter__hand").style = `transform: translate(-50%,-10px) rotateZ(${
        ((Math.round(temp) + 10) * 180) / 50 + 270
    }deg);`;

    // FOR SVG
    function times(dt) {
        var time = [];
        var objDate = new Date(dt * 1000);
        time.push(objDate.getHours());
        time.push(objDate.getMinutes());
        return time;
    }
    $("#sunrise span:first-child").innerText = times(data.today.sunrise)[0];
    $("#sunrise span:last-child").innerText = times(data.today.sunrise)[1];
    $("#sunset span:first-child").innerText = times(data.today.sunset)[0];
    $("#sunset span:last-child").innerText = times(data.today.sunset)[1];

    var gold;
    var sun;
    var dark;
    var distance =
        MIN([23, 59]) -
        MIN(times(data.today.sunset)) +
        MIN(times(data.tomorrow.sunrise));

    current.push(now.getHours());
    current.push(now.getMinutes());

    if (MIN(current) >= 0 && MIN(current) <= MIN(times(data.today.sunrise))) {
        DayBreakFlag = true;
    }
    if (MIN(current) > MIN(times(data.today.sunset)) && DayBreakFlag == false) {
        //OK
        //COMPLETE DAY
        $("#gold").style.strokeDashoffset = "-383";
        $(".cont-sun--moon").style.transform = "rotate(450deg)";

        sunMoon =
            ((MIN(current) - MIN(times(data.today.sunset))) * 180) / (distance + 1);
        setTimeout(Night, 2000);

        function Night() {
            $("#dark").style = "opacity:1;";
            $("#dark-pluk").style = "display:block;";
            $(".bi-moon-stars-fill").style = "display:block;";
            $(".bi-sun-fill").style = "display:none;";
            dark =
                ((MIN(current) - MIN(times(data.today.sunset))) * 383) / (distance + 1);
            $(".cont-sun--moon").style.transform = `rotate(${sunMoon + 450}deg)`;
            $("#dark").style.strokeDashoffset = `${383 - dark}`;
        }

        $("#sunrise span:first-child").innerText = times(data.tomorrow.sunrise)[0];
        $("#sunrise span:last-child").innerText = times(data.tomorrow.sunrise)[1];
    } else if (DayBreakFlag) {
        //OK
        DayBreak(current);

        //COMPELETE DAY
        $("#gold").style.strokeDashoffset = "-383";
        $(".cont-sun--moon").style.transform = "rotate(450deg)";
        //prevsunset
        let httpcheck=new XMLHttpRequest();
        httpcheck.onload=()=>{
            if (httpcheck.responseText) {
                dayBreakfunc(httpcheck.responseText);
            } else {
                let http=new XMLHttpRequest();
                fetch(
                    `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=37.1955948&lon=50.1529566&units=metric&dt=${
                        (data.today.dt * 1000 - 24 * 60 * 60 * 1000) / 1000
                    }&appid=81a57d03343af64fed7d77b4fdcb7340`
                )
                    .then((get) => get.json())
                    .then((prev) =>{
                        http.open("POST", "./prevcookie.php");
                        http.setRequestHeader(
                            "Content-type",
                            "application/x-www-form-urlencoded"
                        );
                        http.send(
                            `prevsunset=${prev.current.sunset}`
                        );
                        dayBreakfunc(prev.current.sunset);
                    })
            }
        }
        function dayBreakfunc(prevsunset){
            sunMoon =
                ((MIN(daybreak) - MIN(times(prevsunset))) * 180) / (distance + 1);
            setTimeout(Sun, 2000);
            function Sun() {
                $("#dark").style = "opacity:1;";
                $("#dark-pluk").style = "display:block;";
                $(".bi-moon-stars-fill").style = "display:block;";
                $(".bi-sun-fill").style = "display:none;";
                dark =
                    ((MIN(daybreak) - MIN(times(prevsunset))) * 383) /
                    (distance + 1);
                $(".cont-sun--moon").style.transform = `rotate(${sunMoon +450 }deg)`;
                $("#dark").style.strokeDashoffset = `${383 - dark}`;
            }
        }
        httpcheck.open("POST", "./prevcookie.php");
        httpcheck.send();

        $("#sunrise span:first-child").innerText = times(data.today.sunrise)[0];
        $("#sunrise span:last-child").innerText = times(data.today.sunrise)[1];
    } else {
        //OK
        gold =
            ((MIN(current) - MIN(times(data.today.sunrise))) * 383) /
            (MIN(times(data.today.sunset)) - MIN(times(data.today.sunrise)));
        $("#gold").style.strokeDashoffset = `-${gold}`;
        sun =
            ((MIN(current) - MIN(times(data.today.sunrise))) * 180) /
            (MIN(times(data.today.sunset)) - MIN(times(data.today.sunrise)));
        $(".cont-sun--moon").style.transform = `rotate(${sun + 270}deg)`;
    }
}
