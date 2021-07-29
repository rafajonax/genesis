class Genius {
	#order = [];
	#clickedOrder = [];
	#score = 0;
	#countdown = document.querySelector(".countdown");
	#fade = document.querySelector(".fade");
	#card = document.querySelector(".card");
	#strokeDashoffset = 2 * Math.PI * 370;
	#progress = document.querySelector(".progress");
	#audios = {
		error: this.createAudio("./sound/error.wav"),
		win: this.createAudio("./sound/win.wav"),
		go: this.createAudio("./sound/go.wav"),
		click: this.createAudio("./sound/click.mp3"),
	};
	#colors = {
		0: {
			element: document.querySelector(".blue"),
			audio: this.createAudio("./sound/do.wav"),
		},
		1: {
			element: document.querySelector(".green"),
			audio: this.createAudio("./sound/re.wav"),
		},
		2: {
			element: document.querySelector(".red"),
			audio: this.createAudio("./sound/mi.wav"),
		},
		3: {
			element: document.querySelector(".yellow"),
			audio: this.createAudio("./sound/fa.wav"),
		},
	};

	constructor() {
		this.init();
	}

	init() {
		Object.keys(this.#colors).forEach((key) => {
			this.#colors[key].element.addEventListener("click", () =>
				this.colorClick(key)
			);
		});
		document.querySelector(".start").addEventListener("click", () => {
			this.playAudio(this.#audios.click);
			this.startGame();
		});
	}

	createAudio(path) {
		return new Audio(path);
	}

	playAudio(audio) {
		audio.pause();
		audio.currentTime = 0;
		setTimeout(() => audio.play(), 10);
	}

	startGame() {
		this.#card.classList.add("hide");
		this.#order = [];
		this.#score = 0;
		this.shuffleOrder();
	}

	nextLevel() {
		this.#score++;
		setTimeout(() => {
			this.playAudio(this.#audios.win);
		}, 250);
		this.shuffleOrder();
	}

	showFade() {
		this.#fade.classList.add("show");
	}

	hideFade() {
		this.playAudio(this.#audios.go);
		this.#fade.classList.remove("show");
	}

	shuffleOrder() {
		this.showFade();
		this.#countdown.classList.add("counting");
		setTimeout(() => {
			this.#progress.style.strokeDashoffset = this.#strokeDashoffset;
			this.#countdown.classList.remove("counting");
			this.#order.push(Math.floor(Math.random() * 4));
			this.#clickedOrder = [];
			this.#order.forEach((colorNumber, i) => {
				this.showOrder(
					this.#colors[colorNumber],
					Number(i) + 1,
					i === this.#order.length - 1
				);
			});
		}, 2000);
	}

	showOrder(color, number, stop) {
		number *= 500;
		setTimeout(() => {
			this.setSelectedColor(color.element);
			this.playAudio(color.audio);
		}, number - 250);
		setTimeout(() => {
			this.removeSelectedColor(color.element);
			if (stop) this.hideFade();
		}, number);
	}

	colorClick(colorNumber) {
		this.#clickedOrder.push(colorNumber);
		this.setSelectedColor(this.#colors[colorNumber].element);

		setTimeout(() => {
			this.removeSelectedColor(this.#colors[colorNumber].element);
		}, 250);

		if (
			this.#clickedOrder[this.#clickedOrder.length - 1] !=
			this.#order[this.#clickedOrder.length - 1]
		) {
			this.gameOver();
			return;
		}

		this.#progress.style.strokeDashoffset =
			(this.#strokeDashoffset / this.#order.length) *
			(this.#order.length - this.#clickedOrder.length);
		this.playAudio(this.#colors[colorNumber].audio);

		if (this.#clickedOrder.length == this.#order.length) {
			this.nextLevel();
		}
	}

	setSelectedColor(element) {
		element.classList.add("selected");
	}

	removeSelectedColor(element) {
		element.classList.remove("selected");
	}

	gameOver() {
		this.showFade();
		this.#card.querySelector(".card-text").textContent = `Pontuação: ${
			this.#score
		}`;
		this.#card.classList.remove("hide");
		this.playAudio(this.#audios.error);
	}
}

new Genius();
