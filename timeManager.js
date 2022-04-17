let sleepHour = 20;
let diff = 24 - sleepHour;
let workToDo;
let color
let background;
let date=new Date();
let jsonData={
    sleep: 8,
    work: {name:'company',total: 7, passed: [0, 0, 0],origin:[0,0,0]},
    mine: {name:'myWork',total: 3, passed: [0, 0, 0],origin:[0,0,0]},
    others: {auto:true,total: 6, passed: [0, 0, 0],origin:[4,0,0]},
    date:date.getDate(),
    stopOplay:false,
    prevWork:null
};
var myTime= jsonData;
var w;
if(localStorage.getItem("myTime")===null){
    myTime = jsonData;
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
    if(((passedTime.hour-diff)*3600)+(passedTime.min*60)+(passedTime.sec)>(20*3600) && (((passedTime.hour-diff)*3600)+(passedTime.min*60)+(passedTime.sec)<((23*3600)+(59*60)+59))){
        remainTime = {
            hour: passedTime.hour - diff,
            min: 60 - passedTime.min,
            sec: 60 - passedTime.sec,
        };
        if(date.getDate()!= myTime.date){
            myTime = jsonData;
            localStorage.setItem("myTime",`${JSON.stringify(myTime)}`);
        }
    }
    $('#daylengthVal').style.width = `${(((remainTime.hour * 60 * 60) + (remainTime.min * 60) + remainTime.sec) * 100) / (24 * 60 * 60)}%`;
    $('#daylengthText').innerText = `${remainTime.hour} ساعت و ${remainTime.min} دقیقه و ${remainTime.sec} ثانیه باقی مانده!`
}

function controll(el, shart) {
    if (shart == 0){
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

if(!myTime.stopOplay){
    stop();
}else{
    workToDo=myTime.prevWork;
    chooseWork(workToDo.name);
    mainTimeWorks();
    let playel=$('#playel');
    controll(playel,0);
}

function mainTimeWorks() {
    let date=new Date();
    myTime.stopOplay=true;

    myTime.others.auto=false;
    myTime.prevWork=workToDo;
    passedTime= {
        hour: workToDo.passed[0],
        min: workToDo.passed[1],
        sec: workToDo.passed[2]
    };
    let vari=[passedTime.hour,passedTime.min,passedTime.sec];
    workToDo.origin=[date.getHours(),date.getMinutes(),date.getSeconds()];



    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            w = new Worker("worker.js");
        }
        w.postMessage([workToDo,passedTime,workToDo.origin])
        w.onmessage=(e)=>{
            workToDo.passed[0]=e.data[2][0]+vari[0];
            workToDo.passed[1]=e.data[2][1]+vari[1];
            workToDo.passed[2]=e.data[2][2]+vari[2];
            $('#worksVal').style.width = `${(((workToDo.passed[0] * 60 * 60) + (workToDo.passed[1] * 60) + workToDo.passed[2]) * 100) / (workToDo.total * 60 * 60)}%`;
            $('#workText').innerText=`${workToDo.passed[0]} ساعت و ${workToDo.passed[1]} دقیقه`;
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
    myTime.stopOplay=false;
    let vari=[passedTime.hour,passedTime.min,passedTime.sec]
    if(!myTime.others.auto){
        let date=new Date();
        myTime.others.origin=[date.getHours(),date.getMinutes(),date.getSeconds()];
    }
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            w = new Worker("worker.js");
        }
        w.postMessage([myTime.others,passedTime,myTime.others.origin])
        w.onmessage=(e)=>{
            if(myTime.others.auto){
                myTime.others.passed=e.data[2];
                $('#otherVal').style.width = e.data[0].width;
                $('#otherText').innerText=e.data[0].text;
            }else{
                myTime.others.passed[0]=e.data[2][0]+vari[0];
                myTime.others.passed[1]=e.data[2][1]+vari[1];
                myTime.others.passed[2]=e.data[2][2]+vari[2];
                $('#otherVal').style.width = `${(((myTime.others.passed[0] * 60 * 60) + (myTime.others.passed[1] * 60) + myTime.others.passed[2]) * 100) / (myTime.others.total * 60 * 60)}%`;
                $('#otherText').innerText=`${myTime.others.passed[0]} ساعت و ${myTime.others.passed[1]} دقیقه`;
            }
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
chooseWork(myTime.prevWork.name);
$('#worksVal').style.width = `${(((myTime.prevWork.passed[0] * 60 * 60) + (myTime.prevWork.passed[1] * 60) + myTime.prevWork.passed[2]) * 100) / (myTime.prevWork.total * 60 * 60)}%`;
$('#workText').innerText=`${myTime.prevWork.passed[0]} ساعت و ${myTime.prevWork.passed[1]} دقیقه`;
$('#otherVal').style.width = `${(((myTime.others.passed[0] * 60 * 60) + (myTime.others.passed[1] * 60) + myTime.others.passed[2]) * 100) / (myTime.others.total * 60 * 60)}%`;
$('#otherText').innerText=`${myTime.others.passed[0]} ساعت و ${myTime.others.passed[1]} دقیقه`;
function clearw(){
    w.terminate();
}