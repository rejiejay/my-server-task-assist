export const dateToFormat = (myDate: Date): string => {
    var yyyy = myDate.getFullYear();

    var mm = myDate.getMonth() + 1;
    var mmstring = mm < 10 ? '0' + mm : mm;

    var dd = myDate.getDate();
    var ddstring = dd < 10 ? '0' + dd : dd;

    return `${yyyy}-${mmstring}-${ddstring}`;
}

export const dateToYYYYmmNumber = (myDate: Date): string => {
    var yyyy = myDate.getFullYear();

    var mm = myDate.getMonth() + 1;
    var mmstring = mm < 10 ? '0' + mm : mm;

    var dd = myDate.getDate();
    var ddstring = dd < 10 ? '0' + dd : dd;

    return `${yyyy}${mmstring}${ddstring}`;
}

export const dateToYYYYmmDDhhMM00 = (myDate: Date): string => {
    var yyyy = myDate.getFullYear();

    var mm = myDate.getMonth() + 1;
    var mmstring = mm < 10 ? '0' + mm : mm;

    var dd = myDate.getDate();
    var ddstring = dd < 10 ? '0' + dd : dd;

    var hh = myDate.getHours();
    var hhstring = hh < 10 ? '0' + hh : hh;

    return `${yyyy}-${mmstring}-${ddstring} ${hhstring}:00`;
}

export const dateToYYYYmmDDhhMM = (myDate: Date): string => {
    var yyyy = myDate.getFullYear();

    var mm = myDate.getMonth() + 1;
    var mmstring = mm < 10 ? '0' + mm : mm;

    var dd = myDate.getDate();
    var ddstring = dd < 10 ? '0' + dd : dd;

    var hh = myDate.getHours();
    var hhstring = hh < 10 ? '0' + hh : hh;

    var Min = myDate.getMinutes();
    var Minstring = Min < 10 ? '0' + Min : Min;

    return `${yyyy}-${mmstring}-${ddstring} ${hhstring}:${Minstring}`;
}

export const dateToYYYYmmDDhhMMss = (myDate: Date): string => {
    var yyyy = myDate.getFullYear();

    var mm = myDate.getMonth() + 1;
    var mmstring = mm < 10 ? '0' + mm : mm;

    var dd = myDate.getDate();
    var ddstring = dd < 10 ? '0' + dd : dd;

    var hh = myDate.getHours();
    var hhstring = hh < 10 ? '0' + hh : hh;

    var Min = myDate.getMinutes();
    var Minstring = Min < 10 ? '0' + Min : Min;

    var ss = myDate.getSeconds();
    var ssstring = ss < 10 ? '0' + ss : ss;

    return `${yyyy}-${mmstring}-${ddstring} ${hhstring}:${Minstring}:${ssstring}`;
}

export const YYYYmmDDhhMMssToTimestamp = (YYYYmmDDhhMMss: string): number => {
    var YDArray = YYYYmmDDhhMMss.split(' ');
    var YYYYmmDDarray = YDArray[0].split('-');
    var hhMMssArray = YDArray[1].split(':');

    return new Date(+YYYYmmDDarray[0], (+YYYYmmDDarray[1] - 1), +YYYYmmDDarray[2], +hhMMssArray[0], +hhMMssArray[1], +hhMMssArray[2]).getTime();
}

export const YYYYmmDDToTimestamp = (YYYYmmDD: string): number => {
    var YDArray = YYYYmmDD.split(' ');
    var YYYYmmDDarray = YDArray[0].split('-');

    return new Date(+YYYYmmDDarray[0], (+YYYYmmDDarray[1] - 1), +YYYYmmDDarray[2]).getTime();
}
