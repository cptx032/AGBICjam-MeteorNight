var preload = function(game){}
preload.prototype = {
	preload: function()
	{
		this.game.debug.text("LOADING...",this.game.world.centerX,this.game.world.centerY);
		this.game.stage.backgroundColor = 0xeeeeee;
		var loadingBar = this.add.sprite(0,480,"loading");
		loadingBar.anchor.setTo(0.0,1.0);
		this.load.setPreloadSprite(loadingBar);
		this.game.load.audio('bg-music', 'assets/audio/churchbell.wav');
		this.game.load.image("sky","assets/imgs/Sky.png");
		this.game.load.image("fg","assets/imgs/fg.png");
		this.game.load.image("white","assets/imgs/white.png");
	},
	create: function()
	{
		this.game.state.start('Game');
	},
	update: function() {
	}
}