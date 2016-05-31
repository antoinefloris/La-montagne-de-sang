// requete: a browser API for getting smooth animations
window.requete = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d');

var width = 422,
	height = 552;

canvas.width = width;
canvas.height = height;

// Déclaration des variables pour le jeux
var Platformes = [],
	image = document.getElementById("sprite"),
	joueur, NombrePlateforme = 10,
	position = 0,
	gravite = 0.2,
	animation,
	flag = 0,
	boucle, etoile = 0,
	direction, unite = 0, firstRun = true;


var Base = function() {
	this.height = 5;
	this.width = width;
	//Permet de garder le bonhomme stable quand il saute evite de le faire tomber
	this.cx = 0;
	this.cy = 614;
	this.cwidth = 100;
	this.cheight = 5;

	this.moved = 0;

	this.x = 0;
	this.y = height - this.height;

	this.draw = function() {
		try {
			ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
		} catch (e) {}
	};
};

var base = new Base();

// Generation du personnage
var joueur = function() {
	this.vy = 11;
	this.vx = 0;

	this.isMovingLeft = false;
	this.isMovingRight = false;
	this.Mort = false;

	this.width = 55;
	this.height = 40;

	// Permet de changer la taille du bonhomme
	this.cx = 0;
	this.cy = 0;
	this.cwidth = 110;
	this.cheight = 80;

	this.direction = "left";

	this.x = width / 2 - this.width / 2;
	this.y = height;

	// Fonction pour demarrer
	this.draw = function() {
		try {
			if (this.direction == "right") this.cy = 121;
			else if (this.direction == "left") this.cy = 201;
			else if (this.direction == "right_land") this.cy = 289;
			else if (this.direction == "left_land") this.cy = 371;

			ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
		} catch (e) {}
	};

	this.jump = function() {
		this.vy = -8;
	};

	this.Haut = function() {
		this.vy = -16;
	};

};

joueur = new joueur();

// Generation des différentes images

function Platform() {
	this.width = 70;
	this.height = 17;

	this.x = Math.random() * (width - this.width);
	this.y = position;

	position += (height / NombrePlateforme);

	this.flag = 0;
	this.state = 0;

	this.cx = 0;
	this.cy = 0;
	this.cwidth = 105;
	this.cheight = 31;


	this.draw = function() {
		try {

			if (this.type == 1) this.cy = 0;
			else if (this.type == 2) this.cy = 61;
			else if (this.type == 3 && this.flag === 0) this.cy = 31;
			else if (this.type == 3 && this.flag == 1) this.cy = 1000;
			else if (this.type == 4 && this.state === 0) this.cy = 90;
			else if (this.type == 4 && this.state == 1) this.cy = 1000;

			ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
		} catch (e) {}
	};

	// Permet de générer tous les types d'images
//	1=rocher
//	2=monstre
//	3=etoile
	if (unite >= 5000) this.types = [2, 3, 3, 3, 4, 4, 4, 4];
	else if (unite >= 2000 && unite < 5000) this.types = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
	else if (unite >= 1000 && unite < 2000) this.types = [2, 2, 2, 3, 3, 3, 3, 3];
	else if (unite >= 500 && unite < 1000) this.types = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
	else if (unite >= 100 && unite < 500) this.types = [1, 1, 1, 1, 2, 2];
	else this.types = [1];

	this.type = this.types[Math.floor(Math.random() * this.types.length)];

	// Permet de faire disparaitre l'étoile au passage
	if (this.type == 3 && etoile < 1) {
		etoile++;

	} else if (this.type == 3 && etoile >= 1) {
		this.type = 1;
		etoile = 0;
	}
	this.moved = 0;
	this.vx = 1;
}

for (var i = 0; i < NombrePlateforme; i++) {
	Platformes.push(new Platform());
}

	// etoile
var Platform_etoile_substitute = function() {
	this.height = 3000;
	this.width = 70000;

	this.x = 0;
	this.y = 0;

	this.cx = 0;
	this.cy = 554;
	this.cwidth = 105;
	this.cheight = 60;

	this.appearance = false;

	this.draw = function() {
		try {
			if (this.appearance === true) ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
			else return;
		} catch (e) {}
	};
};

var Platform_etoile_substitute = new Platform_etoile_substitute();


	var spring = function() {
	this.x = 0;
	this.y = 0;

	this.width = 26;
	this.height = 30;

	this.cx = 0;
	this.cy = 0;
	this.cwidth = 45;
	this.cheight = 53;

	this.state = 0;

	this.draw = function() {
		try {
			if (this.state === 0) this.cy = 445;
			else if (this.state == 1) this.cy = 501;

			ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
		} catch (e) {}
	};
};

var Spring = new spring();

function init() {
	

	var	direction = "left",
		jumpCount = 0;
	
	firstRun = false;

	// Permet de nettoyer le canvas
	function paintCanvas() {
		ctx.clearRect(0, 0, width, height);
	}

	// Permet de diriger le bonhomme
	function joueurCalc() {
		if (direction == "left") {
			joueur.direction = "left";
			if (joueur.vy < -7 && joueur.vy > -15) joueur.direction = "left_land";
		} else if (direction == "right") {
			joueur.direction = "right";
			if (joueur.vy < -7 && joueur.vy > -15) joueur.direction = "right_land";
		}

	
		document.onkeydown = function(e) {
			var key = e.keyCode;
			
			if (key == 37) {
				direction = "left";
				joueur.isMovingLeft = true;
			} else if (key == 39) {
				direction = "right";
				joueur.isMovingRight = true;
			}
			
			if(key == 32) {
				if(firstRun === true)
					init();
				else 
					renitialisation();
			}
		};

		document.onkeyup = function(e) {
			var key = e.keyCode;
		
			if (key == 37) {
				direction = "left";
				joueur.isMovingLeft = false;
			} else if (key == 39) {
				direction = "right";
				joueur.isMovingRight = false;
			}
		};

		if (joueur.isMovingLeft === true) {
			joueur.x += joueur.vx;
			joueur.vx -= 0.15;
		} else {
			joueur.x += joueur.vx;
			if (joueur.vx < 0) joueur.vx += 0.1;
		}

		if (joueur.isMovingRight === true) {
			joueur.x += joueur.vx;
			joueur.vx += 0.15;
		} else {
			joueur.x += joueur.vx;
			if (joueur.vx > 0) joueur.vx -= 0.1;
		}

		
		// Paramettre la vitesse du personnage
		if(joueur.vx > 2)
			joueur.vx = 2;
		else if(joueur.vx < -2)
			joueur.vx = -2;

		// Permet de sauter sur la gravité
		if ((joueur.y + joueur.height) > base.y && base.y < height) joueur.jump();
		
		// Permet de passer a travers le mur et aussi de revenir 
		if (joueur.x > width) joueur.x = 0 - joueur.width;
		else if (joueur.x < 0 - joueur.width) joueur.x = width;

		// Gravité pour que le bonhomme ne tombe pas
		if (joueur.y >= (height / 2) - (joueur.height / 2)) {
			joueur.y += joueur.vy;
			joueur.vy += gravite;
		}

		// Permet de scroller la map vers le haut
		else {
			Platformes.forEach(function(p, i) {

				if (joueur.vy < 0) {
					p.y -= joueur.vy;
				}

		// Boucle pour charger les plateformes à l'infinit
				if (p.y > height) {
					Platformes[i] = new Platform();
					Platformes[i].y = p.y - height;
				}

			});

			base.y -= joueur.vy;
			joueur.vy += gravite;

			if (joueur.vy >= 0) {
				joueur.y += joueur.vy;
				joueur.vy += gravite;
			}

			unite++;
		}

		//Permet de sauter
		collides();

		if (joueur.Mort === true) gameOver();
	}


	//Monstres

	function platformCalc() {
		var subs = Platform_etoile_substitute;

		Platformes.forEach(function(p, i) {
			if (p.type == 2) {
				if (p.x < 0 || p.x + p.width > width) p.vx *= -1;

				p.x += p.vx;
			}

			if (p.flag == 1 && subs.appearance === false && jumpCount === 0) {
				subs.x = p.x;
				subs.y = p.y;
				subs.appearance = true;

				jumpCount++;
			}

			p.draw();
		});

		if (subs.appearance === true) {
			subs.draw();
			subs.y += 8;
		}

		if (subs.y > height) subs.appearance = false;
	}
	// initialise le score
	var score = 0;

	function collides() {
		//Platformes

		Platformes.forEach(function(p, i) {
			if (joueur.vy > 0 && p.state === 0 && (joueur.x + 15 < p.x + p.width) && (joueur.x + joueur.width - 15 > p.x) && (joueur.y + joueur.height > p.y) && (joueur.y + joueur.height < p.y + p.height)) {

				if (p.type == 3 && p.flag === 0) {
					p.flag = 1;
					jumpCount = 0;
					score++;
					console.log(score);
					return;
				} else if (p.type == 4 && p.state === 0) {
					joueur.jump();
					p.state = 1;
				} else if (p.flag == 1) return;
				else {
					joueur.jump();
				}
			}
		});

		var aff_score = document.getElementById('idScore');
		aff_score.innerHTML = 'Score x ' + score;

		var s = Spring;
		if (joueur.vy > 0 && (s.state === 0) && (joueur.x + 15 < s.x + s.width) && (joueur.x + joueur.width - 15 > s.x) && (joueur.y + joueur.height > s.y) && (joueur.y + joueur.height < s.y + s.height)) {
			s.state = 1;
			joueur.Haut();
		}
	}

	function gameOver() {
		Platformes.forEach(function(p, i) {
			p.y -= 12;
		});

		if(joueur.y > height/2 && flag === 0) {
			joueur.y -= 8;
			joueur.vy = 0;
		} 
		else if(joueur.y < height / 2) flag = 1;
		else if(joueur.y + joueur.height > height) {
			showGoMenu();
			hideunite();
			joueur.Mort = "lol";
		}
	}

	//Emplacement pour charger toutes fonctions
	function updateunite() {
		var uniteText = document.getElementById("unite");
		uniteText.innerHTML = unite;
	}

	function chargement() {
		paintCanvas();
		platformCalc();


		joueurCalc();
		joueur.draw();

		base.draw();

		updateunite();
	}

	boucle = function(){return;};
	animation = function() {
		chargement();
		requete(animation);
	};

	animation();

	hideMenu();
	showunite();
}

function renitialisation() {
	Invisible();
	showunite();
	joueur.Mort = false;
	
	flag = 0;
	position = 0;
	unite = 0;

	base = new Base();
	joueur = new joueur();
	Spring = new spring();
	Platform_etoile_substitute = new Platform_etoile_substitute();

	Platformes = [];
	for (var i = 0; i < NombrePlateforme; i++) {
		Platformes.push(new Platform());
	}
}

//Masque le menu dans le jeu
function hideMenu() {
	var menu = document.getElementById("mainMenu");
	menu.style.zIndex = -1;
}


function joueurJump() {
	joueur.y += joueur.vy;
	joueur.vy += gravite;

	if (joueur.vy > 0 && 
		(joueur.x + 15 < 260) && 
		(joueur.x + joueur.width - 15 > 155) && 
		(joueur.y + joueur.height > 475) && 
		(joueur.y + joueur.height < 500))
		joueur.jump();

	if (direction == "left") {
		joueur.direction = "left";
		if (joueur.vy < -7 && joueur.vy > -15) joueur.direction = "left_land";
	} else if (direction == "right") {
		joueur.direction = "right";
		if (joueur.vy < -7 && joueur.vy > -15) joueur.direction = "right_land";
	}

	
	//Permet de sauter
	if ((joueur.y + joueur.height) > base.y && base.y < height) joueur.jump();
	


	joueur.draw();
}

function chargement() {
	ctx.clearRect(0, 0, width, height);
	joueurJump();
}		

boucle = function() {
	chargement();
	requete(boucle);
};

boucle();
