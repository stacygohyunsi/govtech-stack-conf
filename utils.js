const moment = require('moment');
const utils = {
	checkIsBeforeCurrentDate: function(dateValue) {
		let dateToCheck = moment(dateValue).format('YYYY-MM-DD HH:mm');
		let todaysDate = moment().format('YYYY-MM-DD HH:mm');
		return (moment(dateToCheck).isBefore(todaysDate, 'second'));
	},
	generateNewDatePlusUTCMinutesFromNow: function(minutesToAdd) {
		let current = new Date();
		current.setMinutes(current.getMinutes() + minutesToAdd);
		return current;
	}
}

module.exports = utils;