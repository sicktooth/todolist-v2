exports.getDate = function() {
    const todays = new Date();
    const option = {
        weekday: 'long',
        day: 'numeric', 
        month: 'long'
    }
    return todays.toLocaleDateString('en-US', option);
}

exports.getDay = function() {
    const todays = new Date();
    const option = {
        weekday: 'long'
    }
    return todays.toLocaleDateString('en-US', option);
}