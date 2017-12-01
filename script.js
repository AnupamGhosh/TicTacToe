(function() {
	var CROSS = 1;
	var CIRCL = 0;
	var XELEM = '<div class="cross"><div class="lt"></div><div class="rt"></div></div>';
	var OELEM = '<div class="circle"></div>';
// 	var tttWorker = new Worker('worker.js');

	var move = CIRCL;
	var nineSq = document.getElementById("nine-box");
	var sInput = document.getElementsByClassName("switch")[0];


	nineSq.addEventListener("mouseover", function(event) {
		var moveElem = move == CROSS ? XELEM : OELEM;
		if (event.target.classList.contains('box') && 
			!event.target.classList.contains('box-disabled') &&
			!event.target.classList.contains('hovered')) {
			event.target.insertAdjacentHTML('afterbegin', moveElem);
			event.target.classList.add('hovered');
		}
	});
	nineSq.addEventListener("mouseout", function(event) {
		var moveElem = move == CROSS ? XELEM : OELEM;
		if (event.target.classList.contains('box') && 
			!event.target.classList.contains('box-disabled') &&
			event.target.classList.contains('hovered')) {
			event.target.removeChild(event.target.firstChild);
			event.target.classList.remove('hovered');
		}
	});
	nineSq.addEventListener("click", function(event) {
		var moveElem = move == CROSS ? XELEM : OELEM;
		if (event.target.classList.contains('box') &&
			!event.target.classList.contains('box-disabled')) {
			event.target.classList.add('box-disabled');
			event.target.classList.remove('hovered');
			console.log(event.target.dataset.row);
			console.log(event.target.dataset.col);
			move = !move;
		}
	});

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