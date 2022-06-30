var $ = el => {
    return document.querySelector(el);
};
const gregorianMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d=new Date();
const pd=new ParsiDate();
const pdNow=pd.now;

//solar
$('#SDay').innerText=pdNow.day;
$('#SMonth').innerText=pdNow.month;
$('#SYear').innerText=pdNow.year;

//gregorian
$('#GDay').innerText=d.getDate();
$('#GMonth').innerText=gregorianMonth[d.getMonth()];
$('#GYear').innerText=d.getFullYear();

//accurate age
let age={}
let ageYear=pd.year-1380;
let ageMonth;
if(pd.month<=3){
    ageYear--;
    ageMonth=pd.month+12;
    ageMonth-=4;
    age.year=ageYear;
    age.month=ageMonth;
}
let maxDay;
if(pd.month<=5){
    maxDay=31;
}else{
    maxDay=30;
}
ageDay=Math.abs(maxDay - (Math.abs((pd.day-12))));
if(ageDay<maxDay){
    age.day=ageDay;
    $('#ageDay').innerText+=age.day;
    $('#ageDayTxt').classList.remove('hidden');
}
//month
$('#ageMonthTxt').classList.remove('hidden');

$('#ageYear').innerText=age.year;
$('#ageMonth').innerText=age.month;


