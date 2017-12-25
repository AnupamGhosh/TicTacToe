(function() {
	'use strict';
	var ROWS = 3;
	var COLS = 3;
	var CROSS = 1;
	var CIRCL = 0;
	var XELEM = '<div class="cross"><div class="lt"></div><div class="rt"></div></div>';
	var OELEM = '<div class="circle"></div>';
	var comFirst = true;

	var tttWorker = new Worker('TicTacToe.js');
	tttWorker.postMessage({ task: 'init'});
	var ttt = null;

	var move = CROSS;
	var nineSq = document.getElementById("nine-box");
	var sInput = document.querySelector(".switch");
	var boxes = document.querySelectorAll('#nine-box > .box');


	boxes.forEach(function (box, i) {
		box.addEventListener("mouseover", function(event) {
			var moveElem = move == CROSS ? XELEM : OELEM;
			if (!box.classList.contains('box-disabled') &&
				!box.classList.contains('hovered')) {
				box.insertAdjacentHTML('afterbegin', moveElem);
				box.classList.add('hovered');
			}
		});
		box.addEventListener("mouseout", function(event) {
			var moveElem = move == CROSS ? XELEM : OELEM;
			if (!box.classList.contains('box-disabled') &&
				box.classList.contains('hovered')) {
				box.removeChild(box.firstChild);
				box.classList.remove('hovered');
			}
		});
		box.addEventListener("click", function(event) {
			var moveElem = move == CROSS ? XELEM : OELEM;
			if (!box.classList.contains('box-disabled')) {
				box.classList.add('box-disabled');
				box.classList.remove('hovered');

				var row = parseInt(i / ROWS);
				var col = parseInt(i % COLS);
				tttWorker.postMessage({
					task: 'movePlayer',
					ttt: ttt,
					r: row,
					c: col
				});
				nineSq.classList.add('disabled');
				move = !move;
			}
		});
	});

	tttWorker.onmessage = function(msg) {
		var result = msg.data;
		switch (result.task) {
		case 'init':
			ttt = result.ttt;
			if (comFirst) {
				tttWorker.postMessage({
					task: 'moveComputer',
					ttt: ttt
				});
				nineSq.classList.add('disabled');
			}
			break;

		case 'moveComputer':
			var moveElem = move == CROSS ? XELEM : OELEM;
			ttt = result.ttt;
			var outputBox = boxes[result.rc];
			outputBox.classList.add('box-disabled');
			outputBox.insertAdjacentHTML('afterbegin', moveElem);
			move = !move;
			if (!result.end) {
				nineSq.classList.remove('disabled');
			} else {
				console.log(result.end.boxes);
				result.end.boxes.forEach(function (box) {
					boxes[box[0] * ROWS + box[1]].classList.add('win-color');
				});
			}
			break;

		case 'movePlayer':
			ttt = result.ttt;
			tttWorker.postMessage({
				task: 'moveComputer',
				ttt: ttt
			});
		}
	};

	sInput.addEventListener("click", function() {
		// setTimeout(function (element) {
			this.parentElement.classList.toggle('is-transitioned');
		// }, 300, this.parentElement);
		comFirst = !comFirst;
		tttWorker.postMessage({ task: 'init'});
		nineSq.classList.remove('disabled');
		move = CROSS;
		var nodes = nineSq.children;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].classList.contains("box") && nodes[i].firstElementChild) {
				nodes[i].classList.remove("box-disabled");
				nodes[i].classList.remove("win-color");
				nodes[i].removeChild(nodes[i].firstElementChild);
			}
		}
	});
})();
