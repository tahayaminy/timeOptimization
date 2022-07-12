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
let age={};
let myBirth='1380/04/12';
myBirth=myBirth.split("/");
for(let i=0;i < myBirth.length;i++){
    myBirth[i]=Number(myBirth[i]);
}
age.year=Math.abs(pd.year - myBirth[0]);
age.month=Math.abs((pd.month+1) - myBirth[1]);
age.day=Math.abs(pd.day - myBirth[2]);

if(age.day!=0){
    $('#ageDayTxt').classList.remove('hidden');
    $('#ageDay').innerText+=age.day;
}

if(age.month!=0){
    console.log('run')
    $('#ageMonthTxt').classList.remove('hidden');
    $('#ageMonth').innerText=age.month;
}
if(age.month ==0 && age.day==0){
    $('#completeYear').classList.add('hidden');
}

$('#ageYear').innerText=age.year;


