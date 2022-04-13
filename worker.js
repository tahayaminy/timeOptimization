let origin;
let workToDo;
let passedTime = {
    hour: 0, min: 0, sec: 0
};
let date=new Date();
onmessage = (e) => {
    workToDo = e.data[0];
    passedTime = e.data[1];
    origin=e.data[2];
}
console.log(origin)
let timer = setInterval(() => {
    passedTime.hour=date.getHours()-origin[0];
    passedTime.min=date.getMinutes()-origin[1];
    passedTime.sec=date.getSeconds()-origin[2];
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
