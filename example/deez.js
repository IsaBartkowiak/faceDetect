function play(mood){
	console.log(mood);
	if(mood == 'sad'){ //dido
		DZ.player.playTracks([2654285,2654285]);
	}
	if(mood == 'angry'){
		DZ.player.playTracks([1035785, 1035785]);
	}
	if(mood == 'happy'){ 
		DZ.player.playTracks([17384502, 17384502]);
	}
	if(mood == 'neutral'){ //you got the love
		DZ.player.playTracks([7561784, 7561784]);
	}
}

function deezer (mood){

	DZ.init({
		appId  : '156241',
		channelUrl : 'localhost/projet-app/example/channel.html',
		player: {
			onload: function () {
				play(mood);
			}
		}

	});
}


