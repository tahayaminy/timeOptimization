let sleepHour = 20;
let diff = 24 - sleepHour;
let workToDo;
let color
let background;
let date=new Date();
var myTime= {
    sleep: 8,
    work: {total: 7, passed: [0, 0, 0]},
    mine: {total: 3, passed: [0, 0, 0]},
    others: {total: 6, passed: [0, 0, 0],origin:[4,0,0]},
    date:date.getDate(),
    stopORplay:false
};

if(localStorage.getItem("myTime")===null){
    myTime = {
        sleep: 8,
        work: {total: 7, passed: [0, 0, 0]},
        mine: {total: 3, passed: [0, 0, 0]},
        others: {total: 6, passed: [0, 0, 0],origin:[4,0,0]},
        date:date.getDate(),
        stopORplay:false
    };
    localStorage.setItem("myTime",`${JSON.stringify(myTime)}`);
}else{
    let local=localStorage.getItem("myTime");
    myTime=JSON.parse(local);
}

function store(){
    localStorage.setItem("myTime",`${JSON.stringify(myTime)}`);
}

setInterval(daylength, 1000);

function daylength() {
    let date = new Date();
    let passedTime = {
        hour: date.getHours() + diff,
        min: date.getMinutes(),
        sec: date.getSeconds()
    };
    let remainTime = {
        hour: 24 - passedTime.hour,
        min: 60 - passedTime.min,
        sec: 60 - passedTime.sec,
    };
    if(((passedTime.hour-4)*3600)+(passedTime.min*60)+(passedTime.sec)>(20*3600) && (((passedTime.hour-4)*3600)+(passedTime.min*60)+(passedTime.sec)<((23*3600)+(59*60)+59))){
        remainTime = {
            hour: passedTime.hour - 4,
            min: 60 - passedTime.min,
            sec: 60 - passedTime.sec,
        };
        if(date.getDate()!= myTime.date){
            myTime = {
                sleep: 8,
                work: {total: 7, passed: [0, 0, 0]},
                mine: {total: 3, passed: [0, 0, 0]},
                others: {total: 6, passed: [0, 0, 0],origin: [4,0,0]},
                date:date.getDate(),
                stopORplay:false
            };
            localStorage.setItem("myTime",`${JSON.stringify(myTime)}`);
        }
    }
    $('#daylengthVal').style.width = `${(((remainTime.hour * 60 * 60) + (remainTime.min * 60) + remainTime.sec) * 100) / (24 * 60 * 60)}%`;
    $('#daylengthText').innerText = `${remainTime.hour} ساعت و ${remainTime.min} دقیقه و ${remainTime.sec} ثانیه باقی مانده!`
}

function controll(el, shart) {
    if (shart == 0) {
        el.classList.add('hidden');
        el.nextElementSibling.classList.remove('hidden');
        mainTimeWorks();
    } else if (shart == 1) {
        el.classList.add('hidden');
        el.previousElementSibling.classList.remove('hidden');
        stop();
    }
}

function chooseWork(work) {
    if (work == 'myWork') {
        workToDo = myTime.mine;
        color='#003459';
        background='#0034597f'
        $('#worksVal').style.background=color;
        $('#worksCont').style.background=background;
    } else if (work == 'company') {
        workToDo = myTime.work;
        color='#028090';
        background='#0280907f';
        $('#worksVal').style.background=color;
        $('#worksCont').style.background=background;
    }
}

let passedTime = {
    hour: 0,
    min: 0,
    sec: 0
};

if(!myTime.stopORplay){
    stop();
}

function mainTimeWorks() {

    passedTime= {
        hour: workToDo.passed[0],
        min: workToDo.passed[1],
        sec: workToDo.passed[2]
    };
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            w = new Worker("worker.js");
        }
        w.postMessage([workToDo,passedTime])
        w.onmessage=(e)=>{
            $('#worksVal').style.width = e.data[0].width;
            $('#workText').innerText=e.data[0].text;
            workToDo.passed=e.data[2];
            if(e.data[1]){
                let stopel=$('#stopel');
                controll(stopel,1);
            }
            store();
        }
    } else {
        console.log("c% Sorry, your browser does not support Web Workers...",'color:red');
    }

}

function stop() {
    passedTime= {
        hour: myTime.others.passed[0],
        min: myTime.others.passed[1],
        sec: myTime.others.passed[2]
    };
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            w = new Worker("worker.js");
        }
        w.postMessage([myTime.others,passedTime,myTime.others.origin])
        w.onmessage=(e)=>{
            $('#otherVal').style.width = e.data[0].width;
            $('#otherText').innerText=e.data[0].text;
            myTime.others.passed=e.data[2];
            if(e.data[1]){
                let stopel=$('#stopel');
                controll(stopel,1);
            }
            store();
        }
    } else {
        console.log("c% Sorry, your browser does not support Web Workers...",'color:red');
    }
}