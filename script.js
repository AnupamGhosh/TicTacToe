(function() {
	var ROWS = 3;
	var COLS = 3;
	var CROSS = 1;
	var CIRCL = 0;
	var XELEM = '<div class="cross"><div class="lt"></div><div class="rt"></div></div>';
	var OELEM = '<div class="circle"></div>';
	var comFirst = true;

	var tttWorker = new Worker('TicTacToe.js');
	tttWorker.postMessage({
		task: 'init'
	});
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
				console.log(row);
				console.log(col);
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
			}
			break;

		case 'moveComputer':
			ttt = result.ttt;
			var moveElem = move == CROSS ? XELEM : OELEM;
			var outputBox = boxes[result.rc];
			outputBox.classList.add('box-disabled');
			outputBox.insertAdjacentHTML('afterbegin', moveElem);
			nineSq.classList.remove('disabled');
			move = !move;
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
		this.classList.toggle('is-transitioned');
		comFirst = !comFirst;
		var nodes = nineSq.children;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].classList.contains("box") && nodes[i].firstElementChild) {
				nodes[i].classList.remove("box-disabled");
				nodes[i].removeChild(nodes[i].firstElementChild);
			}
		}
	});
})();
