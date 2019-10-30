const xlsx = require('node-xlsx');
const fs = require('fs');
const name = '201907、08打卡情况.xls';
// const name = '201909打卡情况(2).xlsx';

function allDay(month, year = new Date().getFullYear()) {
	//判断闰年
	if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
		if (month == 1) {
			return 29;
		}
	} else {
		return [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][month];
	}
}

function restDay(day, firstDayWeek) {
	let saturday = [];
	let sunday = [];
	for (let i = 1; i <= day; i++) {
		if (!firstDayWeek) {
			if (i % 7 === 0) {
				saturday.push(i);
				sunday.push(i + 1);
			} else if (i === 1) {
				sunday.push(i);
			}
		} else {
			if (i % 7 === 7 - firstDayWeek) {
                saturday.push(i);
                if (i + 1 <= day) {
                    sunday.push(i + 1);
                }
			}
		}
	}
	return {
		saturday,
		sunday
	};
}
// 解析得到文档中的所有 sheet
// var sheets = xlsx.parse('./201909打卡情况(1).xlsx');
var sheets = xlsx.parse(name);
// console.log(sheets, 'sheetssheets')
// 普通加班补助
const RegularOvertimePay = 20;
// 普通加班补助
const SpecialOvertimePay = 50;

function excal(excalData) {
    console.log(excalData, 'excalData')
	let data = [];
	excalData.forEach((dataItem) => {
		let date = new Date();
		let prosenData = {};
		let mouth = null;
		let day = null;
		let saturday,
			sunday = null;
		let title = [];
		dataItem.data.forEach((item, index) => {
			if (index && item.length) {
				let workTime = JSON.parse(JSON.stringify(item)).slice(8);
				let overtimeNum = 0;
				let saturdayOvertimeNum = 0;
				let sundayOvertimeNum = 0;
				workTime &&
					workTime.length &&
					workTime.forEach((e, index) => {
						if (saturday.includes(index + 1)) {
							if (e && e.toString().indexOf('~') >= 0) {
								saturdayOvertimeNum += 1;
							}
						} else if (sunday.includes(index + 1)) {
							if (e && e.toString().indexOf('~') >= 0) {
								sundayOvertimeNum += 1;
							}
						} else {
							if (e && e.toString().indexOf('~') >= 0) {
								let [ hour, minute ] = e.split('~')[1].split(':');
								if (hour > 21) {
									overtimeNum += 1;
								} else if (hour == 21 && minute >= 30) {
									overtimeNum += 1;
								}
							}
						}
					});
				title.forEach((ele, i) => {
					let [ name, workNumber, phone, department, group, team, department4, workCity ] = item.slice(0, 6);
					let obj = {
						name,
						workNumber,
						phone,
						department,
						group,
						team,
						department4,
						workCity,
						workTime,
						overtimePay:
							RegularOvertimePay * overtimeNum +
							SpecialOvertimePay * (saturdayOvertimeNum + sundayOvertimeNum),
						overtimeNum,
						saturdayOvertimeNum,
						sundayOvertimeNum
					};
					prosenData[item[0]] = {
						...obj,
						day,
						mouth,
						saturday,
						sunday
					};
				});
			} else if (!index) {
				title = item;
				// mouth = dataItem.name;
				mouth = dataItem.name.substr(0, 1);
				day = allDay(mouth - 1);
				let firstDayWeek = new Date(`${date.getFullYear()}/${mouth}/1`).getDay();
				let restday = restDay(day, firstDayWeek);
				saturday = restday.saturday;
				sunday = restday.sunday;
			}
		});
		// console.log(item.data, '----------------')
		data.push({
			month: dataItem.name,
			prosenData
		});
	});
	return data;
}
// console.log(excal(sheets), 'prosenData')s
excal(sheets);
let data = Object.values(excal(sheets));

// console.log(name.substr(0,name.lastIndexOf('.')), 'name.substr(0,name.lastIndexOf')
fs.writeFile(
	`./src/pages/${name.substr(0, name.lastIndexOf('.'))}.json`,
	JSON.stringify(data, null, '\t'),
	'utf8',
	(err) => {
		if (err) {
			console.log(err);
		}
	}
);
