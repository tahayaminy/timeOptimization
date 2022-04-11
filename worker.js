let passedTime = {
    hour: 0, min: 0, sec: 0
};
let workToDo;
onmessage = (e) => {
    workToDo = e.data[0];
    passedTime = e.data[1];
}
let timer = setInterval(() => {
    if (passedTime.sec + 1 < 60) {
        passedTime.sec += 1;
    } else {
        if (passedTime.min + 1 < 60) {
            passedTime.min += 1;
        } else {
            passedTime.hour += 1;
            passedTime.min = 0;
            passedTime.sec = 0;
        }
        passedTime.sec = 0;
    }
    postMessage([{
        width: `${(((passedTime.hour * 60 * 60) + (passedTime.min * 60) + passedTime.sec) * 100) / (workToDo.total * 60 * 60)}%`,
        text: `${passedTime.hour} ساعت و ${passedTime.min} دقیقه`
    }, false, [passedTime.hour, passedTime.min, passedTime.sec]])


    if ((workToDo.total * 60 * 60) <= ((passedTime.hour * 60 * 60) + (passedTime.min * 60) + (passedTime.sec))) {
        clearInterval(timer)
        console.log('%c end', 'color:red');
        postMessage([{
            width: `${(((passedTime.hour * 60 * 60) + (passedTime.min * 60) + passedTime.sec) * 100) / (workToDo.total * 60 * 60)}%`,
            text: `${passedTime.hour} ساعت و ${passedTime.min} دقیقه`
        }, true])
    }
}, 1000);
