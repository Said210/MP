aplicacion.controller('advanced_search', function($scope, $http ) {
    $scope.advanced_artists=[];

    $scope.advanced_search=function(){
        var style=$('input[name="style"]:checked').val();
        var limit=document.getElementById('results').value;
        var mood=$('input[name="mood"]:checked').val();
        $http({
            method: 'GET', url: 'https://api.spotify.com/v1/search?q='+field+'&type=artist'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.spotify_artists = data.artists;
            }else{
                alert('Error al intentar recuperar los datos de spotify.');
            }
        }).
        error(function() {
            alert('Error al intentar recuperar los datos de spotify.');
        });
    }

});

aplicacion.controller('suggestions', function($scope, $http ) {

	$scope.similar_artists=[];
	$scope.similar_artists_pics=[];
	$scope.spotify_artists=[];
    $scope.dude_top_tracks=[];

	$scope.buscar = function(){
        
        var field=document.getElementById('LookFor').value;
        $http({
            method: 'GET', url: 'https://api.spotify.com/v1/search?q='+field+'&type=artist'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.spotify_artists = data.artists;
            }else{
                alert('Error al intentar recuperar los datos de spotify.');
            }
        }).
        error(function() {
            alert('Error al intentar recuperar los datos de spotify.');
        });
    };

	$scope.find_similar_artists = function(id){
		$scope.similar_artists_pics=[];
        $http({
        	//echonest request using spotify URI
            method: 'GET', url: 'http://developer.echonest.com/api/v4/artist/similar?api_key=ZCSQWTH1IHKZYUWVX&id='+id+'&format=json&bucket=id:spotify'
            /* if it'd be deezer uri
			method: 'GET', url: 'http://developer.echonest.com/api/v4/artist/similar?api_key=ZCSQWTH1IHKZYUWVX&id=deezer:artist:13&format=json&bucket=id:spotify'
            */
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.similar_artists = data.response.artists;
            }else{
                alert('Error al intentar recuperar los datos de echonest.');
            }

            for (var i = 0; i< $scope.similar_artists.length - 1; i++) {
		    	$scope.getImage(i);
		    	console.log(i);
	    	}

        }).
        error(function() {
            alert('Error al intentar recuperar los datos de echonest.');
        });

    };
    $scope.getImage = function(i){
    	var id=$scope.similar_artists[i].foreign_ids[0].foreign_id;
    	id=id.split(':')[2];
    	$http({
            method: 'GET', url: 'https://api.spotify.com/v1/artists/'+id
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.similar_artists_pics.push(data);
            }else{
                alert('Error al intentar recuperar los datos de echonest.');
            }
        }).
        error(function() {
            alert('Error al intentar recuperar los datos de echonest.');
        });
    }
    $scope.show_top_music = function(id){
        //https://api.spotify.com/v1/artists/2ziB7fzrXBoh1HUPS6sVFn/top-tracks?country=MX

        $http({
            method: 'GET', url: 'https://api.spotify.com/v1/artists/'+id+'/top-tracks?country=MX'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.dude_top_tracks = data.tracks;
                setTimeout(function() {setURLs();}, 1000);
            }else{
                alert('Error al intentar recuperar los datos de canciones de spotify.');
            }
        }).
        error(function() {
            alert('Error al intentar recuperar los datos de canciones de spotify.');
        });

    }
    $scope.playPreview = function(SongURL){
        var player=document.getElementById("ply")
        player.src=SongURL;
        player.play();
    }

});

function setURLs(){
        $(".playButton").each(function(){
            play_Btn($(this));
        });
    }
    function play_Btn(elem){
        $(elem).attr("src","https://embed.spotify.com/?uri="+$(elem).data("uris"));
    }