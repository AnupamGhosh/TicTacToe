function TicTacToe() {
	this.EMPTY = 0;
	this.CROSS = 1;
	this.CIRCL = 2;
	this.ROWS = 3;
	this.COLS = 3;
	this.LVPT = 10; // point per level
	this.MXPT = Math.pow(this.LVPT, 5);
	this.currentHt = this.ROWS * this.COLS;
	this.movePiece = this.CROSS;
	this.scoreMemo = new Array(Math.pow(3, this.ROWS * this.COLS));
	this.board = function (rows, cols) {
		var b = new Array(rows);
		for (var r = 0; r < rows; r++) {
			b[r] = new Array(cols);
			for (var c = 0; c < cols; c++) {
				b[r][c] = 0;
			}
		}
		return b;
	}(this.ROWS, this.COLS);
}
function minimax(state, xToPlay, height) {
	if (height == 0) return [0, 0, 0, [-1]];
	if (this.scoreMemo[state]) return this.scoreMemo[state];

	// var nodeVal = nodeValue(xToPlay, height, state);
	var nodeVal = nodeValue.call(this, xToPlay, height, state);
	if (nodeVal) return nodeVal;

	var nextMove = [];
	var wins = 0, loss = 0;
	var winScore = 0, losScore = 0;
	var maxScore = xToPlay ? -99 : 99;
	var minScore = xToPlay ? 99 : -99;

	for (var i = 0; i < this.ROWS; i++) {
		for (var j = 0; j < this.COLS; j++) if (this.board[i][j] == this.EMPTY) {
			this.board[i][j] = xToPlay ? this.CROSS : this.CIRCL;
			var newState = state + this.board[i][j] * Math.pow(3, i * this.COLS + j);
			// var newScoreArray = this.minimax(newState, !xToPlay, height - 1);
			var newScoreArray = minimax.call(this, newState, !xToPlay, height - 1);
			this.scoreMemo[newState] = newScoreArray;
			var winsFound = newScoreArray[xToPlay ? 1 : 2];
			var lossFound = newScoreArray[xToPlay ? 2 : 1];
			var betterMax = xToPlay ? maxScore < newScoreArray[0] : maxScore > newScoreArray[0];
			var betterMin = xToPlay ? minScore > newScoreArray[0] : minScore < newScoreArray[0];

				// nextMove = [i * this.COLS + j];
			if (betterMax) {
				nextMove = [i * this.COLS + j];
				maxScore = newScoreArray[0];
				winScore = winsFound;
				wins = winsFound;
			} else if (maxScore == newScoreArray[0] && winScore < winsFound) {
				nextMove.push(i * this.COLS + j);
				winScore = winsFound;
				wins = winsFound;
			} else if (maxScore == newScoreArray[0] && winScore == winsFound) {
				wins += winsFound;
				nextMove.push(i * this.COLS + j);
			}

			if (betterMin || minScore == newScoreArray[0] && losScore < lossFound) {
				minScore = newScoreArray[0];
				losScore = lossFound;
				loss = lossFound;
			} else if (maxScore == newScoreArray[0] && losScore == lossFound) {
				loss += lossFound;
			}
			this.board[i][j] = this.EMPTY;
		}
	}

	if (xToPlay ? maxScore > 0 : maxScore < 0) {
		wins = 1e6;
		loss = 0;
	}
	wins = xToPlay ? wins : loss;
	loss = xToPlay ? loss : wins;
	return [maxScore, wins / this.LVPT, loss, nextMove];
};
function nodeValue(xToPlay, height, state) {
	var opCount = 0; // opn
	var myCount = 0; // ami
	var OPN = xToPlay ? this.CIRCL : this.CROSS;
	var m = -1, move = -1, forked = 0;

	for (var i = 0; i < this.ROWS; i++) { // row
		for (var j = 0; j < this.COLS; j++) {
			if (this.board[i][j] == OPN) {
				opCount++;
			} else if (this.board[i][j] == this.EMPTY) {
				m = i * this.COLS + j;
			} else {
				myCount++;
			}
		}
		if (myCount == 0 && opCount == this.COLS - 1) {
			forked++;
			move = m;
		}
		if (opCount == 0 && myCount == this.COLS - 1) { // I won
			return xToPlay ? [ height, this.MXPT, -this.MXPT, [m] ]
					: [ -height, -this.MXPT, this.MXPT, [m] ];
		}
		myCount = 0;
		opCount = 0;
	}

	for (var i = 0; i < this.ROWS; i++) { // column
		for (var j = 0; j < this.COLS; j++) {
			if (this.board[j][i] == OPN) {
				opCount++;
			} else if (this.board[j][i] == 0) {
				m = j * this.COLS + i;
			} else {
				myCount++;
			}
		}
		if (myCount == 0 && opCount == this.ROWS - 1) {
			forked++;
			move = m;
		}
		if (opCount == 0 && myCount == this.ROWS - 1) { // I won
			return xToPlay ? [ height, this.MXPT, -this.MXPT, [m] ]
					: [ -height, -this.MXPT, this.MXPT, [m] ];
		}
		myCount = 0;
		opCount = 0;
	}

	for (var d = 0; d < 2; d++) {
		for (var i = 0; i < this.ROWS; i++) { // left diagonal
			var j = d == 0 ? i : this.ROWS - 1 - i;
			if (this.board[i][j] == OPN) {
				opCount++;
			} else if (this.board[i][j] == this.EMPTY) {
				m = i * this.COLS + j;
			} else {
				myCount++;
			}
		}
		if (myCount == 0 && opCount == this.ROWS - 1) {
			forked++;
			move = m;
		}
		if (opCount == 0 && myCount == this.ROWS - 1) { // I won
			return xToPlay ? [ height, this.MXPT, -this.MXPT, [m] ]
					: [ -height, -this.MXPT, this.MXPT, [m] ];
		}
		myCount = 0;
		opCount = 0;
	}

	if (forked > 1) { // I am screwed
		return xToPlay ? [ -height, 0, this.MXPT, [m] ]
				: [ height, this.MXPT, 0, [m] ];
	} else if (forked == 1) { // only move
		var r = parseInt(move / this.ROWS);
		var c = move % this.COLS;
		this.board[r][c] = xToPlay ? this.CROSS : this.CIRCL;
		var newState = state + this.board[r][c] * Math.pow(3, r * this.ROWS + c);
		var newScore = minimax.call(this, newState, !xToPlay, height - 1);
		this.scoreMemo[newState] = newScore;
		this.board[r][c] = this.EMPTY;
		return [ newScore[0], newScore[1], newScore[2], [move] ];
	} else { // move a usual
		return null;
	}
};
function saveMove(r, c) {
	this.board[r][c] = this.movePiece;
	this.movePiece = this.movePiece == this.CROSS ? this.CIRCL : this.CROSS;
	this.currentHt--;
};
function getState() {
	var state = 0;
	for (var i = 0; i < this.board.length; i++) {
		for (var j = 0; j < this.board[i].length; j++) {
			state += this.board[i][j] * Math.pow(3, i * this.COLS + j);
		}
	}
	return state;
};


onmessage = function(msg) {
	var input = msg.data;
	switch (input.task) {
		case 'init':
			var ticTacToe = new TicTacToe();
			postMessage({
				task: input.task,
				ttt: ticTacToe
			});
			break;

		case 'movePlayer':
			// input.ttt.saveMove(input.r, input.c);
			saveMove.call(input.ttt, input.r, input.c);
			postMessage({
				task: input.task,
				ttt: input.ttt
			});
			break;

		case 'moveComputer':
			var state = getState.call(input.ttt);
			var scoreArray = minimax.call(input.ttt, state, input.ttt.currentHt % 2, input.ttt.currentHt);
			var ri = parseInt(Math.random() * scoreArray[3].length)
			saveMove.call(input.ttt, parseInt(scoreArray[3][ri] / input.ttt.COLS), scoreArray[3][ri] % input.ttt.ROWS);
			// debugger;
			postMessage({
				task: input.task,
				rc: scoreArray[3][ri],
				ttt: input.ttt
			});
	}
}
