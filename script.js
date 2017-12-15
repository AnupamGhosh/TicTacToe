(function() {
	var ROWS = 3;
	var COLS = 3;
	var CROSS = 1;
	var CIRCL = 0;
	var XELEM = '<div class="cross"><div class="lt"></div><div class="rt"></div></div>';
	var OELEM = '<div class="circle"></div>';
	var tttWorker = new Worker('worker.js');

	var move = CIRCL;
	var nineSq = document.getElementById("nine-box");
	var sInput = document.getElementsByClassName("switch")[0];
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
				tttWorker.postMessage({r: row, c: col});
				move = !move;
			}
		});
	});

	tttWorker.onmessage = function(result) {
		var moveElem = move == CROSS ? XELEM : OELEM;
		var outputBox = boxes[result.data.r * ROWS + result.data.c];
		outputBox.classList.add('box-disabled');
		outputBox.insertAdjacentHTML('afterbegin', moveElem);
	};

	sInput.addEventListener("click", function() {
		this.classList.toggle('is-transitioned');
		var nodes = nineSq.children;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].classList.contains("box") && nodes[i].firstElementChild) {
				nodes[i].classList.remove("box-disabled");
				nodes[i].removeChild(nodes[i].firstElementChild);
			}
		}
	});
})();