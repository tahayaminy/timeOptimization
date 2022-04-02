const originalDate=new Date();
const solarMonth = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const persianDigits=["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];

class ParsiDate{
    get now(){
        let i=0;
        const yearDigit=originalDate.toLocaleDateString("fa-IR",{year:"numeric"});

        let year='';
        while(i<yearDigit.length){
            let index=persianDigits.indexOf(yearDigit[i]);
            year+=index;
            i++;
        }
        i=0;

        const monthDigit=originalDate.toLocaleDateString("fa-IR",{month:"numeric"});
        let month='';
        while(i<monthDigit.length){
            let index=persianDigits.indexOf(monthDigit[i]);
            month+=index;
            i++;
        }
        i=0;
        month--;

        const dayDigit=originalDate.toLocaleDateString("fa-IR",{day:"numeric"});
        let day='';
        while(i<dayDigit.length){
            let index=persianDigits.indexOf(dayDigit[i]);
            day+=index;
            i++;
        }

        return {year:Number(year),month:solarMonth[month],day:Number(day)};
    }
    get year(){
        let i=0;
        const yearDigit=originalDate.toLocaleDateString("fa-IR",{year:"numeric"});
        let year='';
        while(i<yearDigit.length){
            let index=persianDigits.indexOf(yearDigit[i]);
            year+=index;
            i++;
        }
        return Number(year);
    }
    get month(){
        let i=0;
        const monthDigit=originalDate.toLocaleDateString("fa-IR",{month:"numeric"});
        let month='';
        while(i<monthDigit.length){
            let index=persianDigits.indexOf(monthDigit[i]);
            month+=index;
            i++;
        }
        month--;
        return Number(month);
    }
    get day(){
        let i=0;
        const dayDigit=originalDate.toLocaleDateString("fa-IR",{day:"numeric"});
        let day='';
        while(i<dayDigit.length){
            let index=persianDigits.indexOf(dayDigit[i]);
            day+=index;
            i++;
        }
        return Number(day);
    }
}