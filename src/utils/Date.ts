const dateFormatter = new Intl.RelativeTimeFormat('fr-FR', {
    numeric: 'always',
    style: 'long'
});


export const relativeDateComment = (date: Date): string => {
    const diff = date.getTime() - Date.now();
    const seconds = Math.trunc(diff/1000);
    const minutes = Math.trunc(seconds/60);
    const hours = Math.trunc(minutes/60);
    const days = Math.trunc(hours/24);

    if(days !== 0){
        return dateFormatter.format(days, 'days');
    }
    if(hours !== 0){
        return dateFormatter.format(hours, 'hours');
    }
    if(minutes !== 0){
        return dateFormatter.format(minutes, 'minutes');
    }
    if(seconds !== 0){
        return dateFormatter.format(seconds, 'seconds');
    }
    return "maintenant";
};