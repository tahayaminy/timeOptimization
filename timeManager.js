let sleepHour = 20;
let diff = 24 - sleepHour;
myTime = {
    sleep: 8,
    work: 7,
    mine: {total:3,passed:[0, 0, 0]},
    others: {
        total: 6,
        animals: 3,
        food: 3
    }
};
let workToDo;

setInterval(timeManager, 1000);
function timeManager() {
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

    $('#daylengthVal').style.width = `${(((remainTime.hour * 60 * 60) + (remainTime.min * 60) + remainTime.sec) * 100) / (24 * 60 * 60)}%`;

    $('#daylengthText').innerText = `${remainTime.hour} ساعت و ${remainTime.min} دقیقه و ${remainTime.sec} ثانیه باقی مانده!`
}

function mainTime(el, shart) {
    if (shart == 0) {
        el.classList.add('hidden');
        el.nextElementSibling.classList.remove('hidden');
        mainTimeWorks();
    } else if (shart == 1) {
        el.classList.add('hidden');
        el.previousElementSibling.classList.remove('hidden');
        stop()
    }
}

function chooseWork(work) {
    if (work == 'myWork') {
        workToDo = myTime.mine.total;
    } else if (work == 'company') {
        workToDo = myTime.work;
    }
    console.log(workToDo)
}
let timer;
let passedTime = {
    hour: 0,
    min: 0,
    sec: 0
};
function mainTimeWorks() {
    let date = new Date();

    timer = setInterval(() => {
        if (passedTime.sec + 1 < 60) {
            passedTime.sec += 1;
        } else {
            if (passedTime.min + 1 < 60) {
                passedTime.min += 1;
            } else {
                passedTime.hour += 1;
                passedTime.min = 0;
                passedTime.sec = 0;
                console.log((passedTime.hour * 60 * 60) + (passedTime.min * 60) + (passedTime.sec));
                console.log(`${(passedTime.hour)}:${(passedTime.min)}:${passedTime.sec}`);
            }
            passedTime.sec = 0;
        }

        if ((workToDo * 60 * 60) <= ((passedTime.hour * 60 * 60) + (passedTime.min * 60) + (passedTime.sec))) {
            clearInterval(timer)
            console.log('%c end', 'color:red');
        }
    }, 1000)


}

function stop() {
    clearInterval(timer);
    console.log(passedTime)
}