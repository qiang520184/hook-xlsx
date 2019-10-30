import React, { useState, useEffect,useRef } from 'react';
import { Table, Upload, Button } from 'antd';
import json from './201909打卡情况(2).json';
import XLSX from 'xlsx';
import './index.scss';
function uploadFilesChange(file) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsBinaryString(file);
		fileReader.onload = function() {
			let { result } = this;
			const workbook = XLSX.read(result, { type: 'binary' });
			let obj = {};
			Object.entries(workbook.Sheets).forEach(([ keys, value ]) => {
				obj[keys] = XLSX.utils.sheet_to_json(value);
			});
			resolve(obj);
		};
	});
}

function allDay(month, year = new Date().getFullYear()) {
	//判断闰年
	if ((+year % 4 === 0 && +year % 100 !== 0) || +year % 400 === 0) {
		if (+month === 1) {
			return 29;
		}
	} else {
		return [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][+month];
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
function formateEcxal(data, name) {
	var newData = [];
	data.forEach(([ keys, values ]) => {
		if (values && values.length) {
			let mouth = keys.substr(0, 1);
			let year = name.substr(0, 4);
			let day = allDay(mouth - 1, year);
			let firstDayWeek = new Date(`${year}/${mouth}/1`).getDay();
			let restday = restDay(day, firstDayWeek);
			let { saturday, sunday } = restday;
			let list = [];
			values.forEach((e) => {
				let obj = {};
				obj.name = e['姓名'];
				obj.workNumber = e['工号'];
				obj.phone = e['手机号'];
				obj.department = e['一级部门'];
				obj.group = e['二级部门'];
				obj.mouth = mouth;
				obj.saturdayOvertimeList = [];
				obj.sundayOvertimeList = [];
				obj.overtimeList = [];
				obj.saturday = saturday;
				obj.sunday = sunday;
				e['姓名'] &&
					Object.entries(e).forEach(([ key, value ]) => {
						if (key && key.split('/').length > 1) {
							let [ M, D ] = key.split('/');

							if (saturday.includes(+D)) {
								obj.saturdayOvertimeList.push(D);
							} else if (sunday.includes(+D)) {
								console.log(value.indexOf('~') >= 0, D);
								obj.sundayOvertimeList.push(D);
							} else {
								let [ hour, minute ] = value && value.split('~')[1].split(':');
								if ((+hour === 21 && minute >= 30) || hour > 21) {
									obj.overtimeList.push(D);
								}
							}
						}
					});
				obj.saturdayOvertimeNum = obj.saturdayOvertimeList.length;
				obj.sundayOvertimeNum = obj.sundayOvertimeList.length;
				obj.overtimeNum = obj.overtimeList.length;
				obj.overtimePay =
					(obj.saturdayOvertimeList.length + obj.sundayOvertimeList.length) * 50 +
					obj.overtimeList.length * 20;
				list.push(obj);
			});
			newData.push({
				mouth,
				year,
				day,
				firstDayWeek,
				list
			});
		}
	});
	return newData;
}

function MyTable() {
	var column = [
		{
			title: '姓名',
			width: 150,
			dataIndex: 'name',
			key: 'name',
			fixed: 'left'
		},
		{
			title: '工号',
			width: 150,
			dataIndex: 'workNumber',
			key: '开发部'
		},
		{
			title: '手机号',
			dataIndex: 'phone',
			key: '',
			width: 200
		},
		{
			title: '部门',
			dataIndex: 'department',
			key: '2',
			width: 150
		},
		{
			title: '开发组',
			dataIndex: 'group',
			key: '3',
			width: 150
		},
		{
			title: '月份',
			dataIndex: 'mouth',
			key: '4',
			width: 150
		},
		{
			title: '周六加班天数',
			dataIndex: 'saturdayOvertimeNum',
			key: '6',
			width: 150
			// render: (item) => item.saturdayOvertimeList.length
		},
		{
			title: '周日加班天数',
			dataIndex: 'sundayOvertimeNum',
			key: '7',
			width: 150
		},
		{
			title: '工作日加班天数',
			dataIndex: 'overtimeNum',
			key: '8',
			width: 150
		},
		{
			title: 'money',
			key: 'operation',
			fixed: 'right',
			width: 100,
			render: (item) => <a>{item.overtimePay}</a>
		}
	];
	const inputRef = useRef(null);
	const [ columns, setColumns ] = useState(column);
	const [ data, setData ] = useState([]);
	useEffect(() => {
		setData(Object.values(json[0].prosenData));
	}, []);
	return (
		<div>
			<div className="top">
				<Button type="dashed" onClick={() => inputRef.current.click()}>选择考勤表</Button>
				<input
					ref={inputRef}
					style={{display: 'none'}}
					type="file"
					accept=".xls,.xlsx"
					onInput={(e) => {
						e.persist();
						console.log(e, e.target.files[0], e.target.value, XLSX);
						var files = e.target.files[0];
						var name = files.name;
						uploadFilesChange(files).then((res) => {
							let dataList = formateEcxal(Object.entries(res), name);
							let data = [];
							dataList.map((item) => {
								data.push(...item.list);
							});
							setData(data);
						});
					}}
				/>
			</div>
			<Table columns={columns} dataSource={data} rowKey="name" scroll={{ x: 800, y: 1000 }} bordered />
		</div>
	);
}
export default MyTable;
