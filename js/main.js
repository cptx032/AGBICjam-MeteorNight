/*
Author: Willie Lawrence
Email: cptx032 arroba gmail dot com
*/

function main()
{
	(function()
	{
		var game = new Phaser.Game(1200, 480, Phaser.AUTO, 'pangolin-game');
		game.state.add("Boot", boot);
		game.state.add("PortraitMode", boot);
		game.state.add("Preload", preload);
		game.state.add("Game", phase01);
		game.state.start("Boot");
	}());
}