//////////////////////////////////////////////////////////////////////////////////////
// http://opengameart.org/content/background-voices

// http://opengameart.org/content/rpg-sound-pack
// http://opengameart.org/content/dark-ambiences
// http://opengameart.org/content/ghost
// http://opengameart.org/content/excited-horror-sound
// http://opengameart.org/content/4-atmospheric-ghostly-loops
//////////////////////////////////////////////////////////////////////////////////////
function randint(min, max)
{
	return ~~(min + ((max-min)*Math.random()));
}
function lerp(a, b, x) {
	return a + ((b-a)*x);
}
function enable_fullscreen()
{
	var elem = document.documentElement;
	if (elem.requestFullscreen)
	{
		elem.requestFullscreen();
	}
	else if (elem.msRequestFullscreen)
	{
		elem.msRequestFullscreen();
	}
	else if (elem.mozRequestFullScreen)
	{
		elem.mozRequestFullScreen();
	}
	else if (elem.webkitRequestFullscreen)
	{
		elem.webkitRequestFullscreen();
	}
}
var KMAP = {};
var UP_KEY = 38;
var DOWN_KEY = 40;
var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var W_KEY = 87;
var S_KEY = 83;

var ON_KEY_DOWN = [];

document.documentElement.onkeydown = function(key)
{
	key = key || window.key;
	KMAP[key.keyCode] = true;
	for(var i=0; i < ON_KEY_DOWN.length; i++)
	{
		ON_KEY_DOWN[i](key);
	}
};
document.documentElement.onkeyup = function(key)
{
	key = key || window.key;
	KMAP[key.keyCode] = false;
};
//////////////////////////////////////////////////////////////////////////////////////
var INTRO_TEXT_PT = "Texto introdutório";
// fixme > profissional revision
var INTRO_TEXT_EN = "";
var INTRO_TEXT = INTRO_TEXT_PT;
//////////////////////////////////////////////////////////////////////////////////////
var TextFader = function(game, x, y)
{
	// o valor que eh decrementado do alpha do texto
	this.velocity = 0.002;
	this.game = game;
	this.text = '';
	// o indice do texto
	this.index = 0;
	this.style = { font: "40px Times New Roman", fill: "#ffffff", align: "center" };
	this.sprite = this.game.add.text(x, y, this.text[0], this.style);
	this.sprite.anchor.set(0.5);
	this.sprite.alpha = 0;
	// 'in' quando eh fadein 'out' quando eh fadeout
	this.state = 'in'; // in|out
	// indica se a animacao chegou ao fim
	this.end = true;
};
TextFader.prototype.update = function()
{
	if(this.end) {
		return;
	}

	if(this.state == 'in')
	{
		this.sprite.alpha += this.velocity;
		if(this.sprite.alpha >= 0.5)
		{
			this.state = 'out';
		}
	}
	else if(this.state == 'out')
	{
		this.sprite.alpha -= this.velocity;
		if(this.sprite.alpha <= 0)
		{
			this.state = 'in';
			this.index += 1;
			if (this.index >= this.text.length) {
				this.end = true;
			}
			else {
				this.sprite.text = this.text[this.index];
			}
		}
	}
};
TextFader.prototype.restart = function(text)
{
	this.text = text.split('\n');
	this.index = 0;
	this.state = 'in';
	this.sprite.alpha = 0.0;
	this.sprite.text = this.text[0];
	this.end = false;
};
//////////////////////////////////////////////////////////////////////////////////////
var SimpleParticle = function(game, x, y, vel, sprite_name)
{
	this.game = game;
	this.vel = vel;
	this.sprite = this.game.add.sprite(x, y, sprite_name);
	this.sprite.scale.setTo(4,4);
	this.sprite.anchor.setTo(0.5,0.5);
};
SimpleParticle.prototype.update = function()
{
	this.sprite.alpha -= 0.02;
	this.sprite.x += this.vel[0];
	this.sprite.y += this.vel[1];
};
var SimpleEmissor = function(game, x, y, max_particles, sprite_name)
{
	this.game = game;
	this.x = x;
	this.y = y;
	// if rotate is true the particles rotates in update function
	this.rotate = false;
	// if scale is true the particles scale down in update function
	this.scale = false;
	// when the particle dies it reborn with the following alpha
	this.max_alpha = 0.5;
	this.particles = [];
	for (var i=0;i<max_particles;i++)
	{
		var new_particle = new SimpleParticle(this.game, this.x, this.y, [-4,0], sprite_name);
		new_particle.sprite.alpha = Math.random();
		new_particle.sprite.tint = CROW_COLOR;
		this.particles.push( new_particle );
	}
};
SimpleEmissor.prototype.update = function()
{
	for(var i=0;i < this.particles.length; i++)
	{
		this.particles[i].update();
		if (this.particles[i].sprite.alpha <= 0.0)
		{
			this.particles[i].sprite.alpha = this.max_alpha;
			this.particles[i].sprite.x = this.x + (Math.random()*10);
			this.particles[i].sprite.y = this.y + (Math.random()*10);

			if(this.rotate) {
				this.particles[i].sprite.rotation += randint(10,12);
			}
		}
	}
};
SimpleEmissor.prototype.set_tint = function(value)
{
	for(var i=0; i < this.particles.length; i++)
	{
		this.particles[i].sprite.tint = value;
	}
};
SimpleEmissor.prototype.set_alpha = function(value)
{
	this.max_alpha = value;
};
SimpleEmissor.prototype.set_scale = function(value)
{
	for(var i=0; i< this.particles.length; i++)
	{
		this.particles[i].sprite.scale.setTo(value, value);
	}
};
SimpleEmissor.prototype.set_velocity = function(value)
{
	for(var i=0; i < this.particles.length; i++)
	{
		this.particles[i].vel = value;
	}
};
//////////////////////////////////////////////////////////////////////////////////////
var MenuButton = function(game, x, y, text, event, event_parent)
{
	this.game = game;
	this.style = { font: "40px Terminal", fill: "#ffffff", align: "left" };
	this.button = this.game.add.text(x, y, text, this.style);
	this.button.alpha = 0.0;
	this.button.inputEnabled = true;
	this.button.anchor.set(0.0);
	var initial_tween = this.game.add.tween(this.button);
	initial_tween.to( { alpha: 0.5 }, 2000, "Linear", true);
	initial_tween.onComplete.add(
		function()
		{
			this.button.events.onInputOver.add(
				function()
				{
					this.__mouse_over(this.button);
				},
			this);
			this.button.events.onInputOut.add(
				function()
				{
					this.__mouse_leave(this.button);
				},
			this);
			this.button.events.onInputDown.add(event, event_parent);
		},
	this);
};
MenuButton.prototype.__mouse_over = function(button)
{
	this.game.add.tween(button).to( { alpha: 0.8 }, 500, "Linear", true);
	document.body.style.cursor = 'pointer';
};
MenuButton.prototype.__mouse_leave = function(button)
{
	this.game.add.tween(button).to( { alpha: 0.5 }, 500, "Linear", true);
	document.body.style.cursor = 'default';
};
var MainMenu = function(phase)
{
	this.phase = phase;
	this.game = phase.game;
	this.canplay = false;
	this.play_button = new MenuButton(this.game, 100, 200, 'Start', this.play_button_handler, this);
};
MainMenu.prototype.play_button_handler = function()
{
	this.play_button.button.kill();
	this.canplay = true;
	document.body.style.cursor = 'default';
};
//////////////////////////////////////////////////////////////////////////////////////
function lerp(a, b, c) {
	return a + ((b-a)*c);
}
var phase01 = function(game){};
phase01.prototype = {
	preload: function()
	{
		this.game.stage.backgroundColor = 0x00264d;

		this.music = this.game.add.audio('bg-music');
		this.music.loop = true;
		// this.music.play();

		this.stars = [];
		var i = 100;
		while (i--) {
			var star = this.game.add.sprite(
				lerp(0, 1200, Math.random() ),
				lerp(0, 480, Math.random() ),
				'white');
			var scale = lerp(1,3, Math.random() );
			star.scale.setTo(scale, scale);
			this.stars.push( star );
		}
		
		// a flag that will be true when you click in 'play' button
		this.main_menu = new MainMenu(this);
		
		this.create_footer();
	},
	create_footer: function()
	{
		this.footer = new MenuButton(this.game, this.game.world.width, this.game.world.height,
			'created by willie lawrence - based in http://famicase.com/11/softs/39.html',
			function(){
				window.location = "http://vls2.tk";
			}, this);
		this.footer.button.anchor.set(1.0);
		this.footer.button.style.font = "15px Terminal";
	},
	create: function()
	{	
	},
	hide_text: function()
	{
		this.game.add.tween(this.text).to( { alpha: 0.0 }, 4000, "Linear", true);
	},
	update: function()
	{
		if (this.main_menu.canplay) {
			//
		}
	}
};