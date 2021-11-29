module.exports.getDate = getDate ;

function getDate() {
    let today = new Date();
    let options = {
        weekday: "long",
        //year: "numeric",
        month: "long",
        day: "numeric"
    }
    let day = today.toLocaleDateString("en-US", options);       //give date in the given format 
    return day;
}