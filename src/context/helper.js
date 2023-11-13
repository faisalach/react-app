
export const helper = () => {
    const numberFormat = (text) => {
        if(text === undefined){
            return "";
        }
        text    = text.toString();
        if(text.match(/[0-9]/g)){
            text    = parseFloat(text.replace(/[^0-9.]/g,''));
            const formatter    = new Intl.NumberFormat("id-ID","",",",".");
            return formatter.format(text);
        }else{
            return text;
        }
    }
    const moneyFormat = (text) => {
        return "Rp"+numberFormat(text);
    }
    const dateFormat = (formatDate) => {
        let model         = new Date(formatDate);
        let year          = model.getFullYear();
        let monthIndex    = model.getMonth();
        let date          = model.getDate();
        let day           = model.getDay();

        let monthName       = '';

        switch(monthIndex){
            case 0:
                monthName   = "Jan";
            break;
            case 1:
                monthName   = "Feb";
            break;
            case 2:
                monthName   = "Mar";
            break;
            case 3:
                monthName   = "Apr";
            break;
            case 4:
                monthName   = "Mei";
            break;
            case 5:
                monthName   = "Jun";
            break;
            case 6:
                monthName   = "Jul";
            break;
            case 7:
                monthName   = "Agu";
            break;
            case 8:
                monthName   = "Sep";
            break;
            case 9:
                monthName   = "Okt";
            break;
            case 10:
                monthName   = "Nov";
            break;
            case 11:
                monthName   = "Des";
            break;
            default:
                break;
        }

        let dayName     = '';
        switch (day) {
            case 0:
                dayName     = "Minggu";
                break;
            case 1:
                dayName     = "Senin";
                break;
            case 2:
                dayName     = "Selasa";
                break;
            case 3:
                dayName     = "Rabu";
                break;
            case 4:
                dayName     = "Kamis";
                break;
            case 5:
                dayName     = "Jumat";
                break;
            case 6:
                dayName     = "Sabtu";
                break;
            default:
                break;
        
        }

        date        = date > 9 ? date : "0"+date;

        return `${dayName}, ${date} ${monthName} ${year}`;
    }

    const timeFormat = (formatDate) => {
        let model         = new Date(formatDate);
        let hour          = model.getHours();
        let minute        = model.getMinutes();

        hour        = hour > 9 ? hour : "0"+hour;
        minute        = minute > 9 ? minute : "0"+minute;

        return `${hour}:${minute}`;
    }

    return {
        moneyFormat,
        numberFormat,
        dateFormat,
        timeFormat
    }
};