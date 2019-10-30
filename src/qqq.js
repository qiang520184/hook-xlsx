function debounce(fn, delay, scope) {
	let timer = null;
	let count = 1;
	return function() {
		let context = scope || this,
			args = arguments;
		clearTimeout(timer);
		console.log(Date.now(), ', 触发第', count++, '次滚动事件！');
		timer = setTimeout(function() {
			fn.apply(context, args);
			console.log(Date.now(), ', 可见只有当高频事件停止，最后一次事件触发的超时调用才能在delay时间后执行!');
		}, delay);
	};
}

function throttle2(fn, threshold, scope) {
	let timer;
	return function() {
		let context = scope || this;
		let args = arguments;
		if (!timer) {
			timer = setTimeout(function() {
				fn.apply(context, args);
				timer = null;
			}, threshold);
		}
	};
}

function throttle(fn, threshold, scope) {
	let timer;
	let prev = Date.now();
	return function() {
		let context = scope || this,
			args = arguments;
		let now = Date.now();
		if (now - prev > threshold) {
			prev = now;
			fn.apply(context, args);
		}
	};
}

function debounce(fn, delay, scope) {
	let timer = null;
	// 返回函数对debounce作用域形成闭包
	return function() {
		// setTimeout()中用到函数环境总是window,故需要当前环境的副本；
		let context = scope || this,
			args = arguments;
		// 如果事件被触发，清除timer并重新开始计时
		clearTimeout(timer);
		timer = setTimeout(function() {
			fn.apply(context, args);
		}, delay);
	};
}

function throttle(fn, threshold, scope) {
	let timer;
	let prev = Date.now();
	return function() {
		let context = scope || this,
			args = arguments;
		let now = Date.now();
		if (now - prev > threshold) {
			prev = now;
			fn.apply(context, args);
		}
	};
}

function debounce(fn, delay, scope) {
	let timer = null;
	// 返回函数对debounce作用域形成闭包
	return function() {
		// setTimeout()中用到函数环境总是window,故需要当前环境的副本；
		let context = scope || this,
			args = arguments;
		// 如果事件被触发，清除timer并重新开始计时
		clearTimeout(timer);
		timer = setTimeout(function() {
			fn.apply(context, args);
		}, delay);
	};
}

let els = document.getElementsByClassName('container');
let count1 = 0,
	count2 = 0,
	count3 = 0;
const THRESHOLD = 200;

els[0].addEventListener('scroll', function handle() {
	console.log('普通滚动事件！count1=', ++count1);
});
els[1].addEventListener(
	'scroll',
	debounce(function handle() {
		console.log('执行滚动事件!（函数防抖） count2=', ++count2);
	}, THRESHOLD)
);
els[2].addEventListener(
	'scroll',
	throttle(function handle() {
		console.log(Date.now(), ', 执行滚动事件!（函数节流） count3=', ++count3);
	}, THRESHOLD)
);
