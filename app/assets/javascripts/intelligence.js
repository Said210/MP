aplicacion.controller('advanced_search', function($scope, $http ) {
    $scope.adv_songs = [];
    $scope.adv_songs_ids = [];

    /*$scope.advanced_search=function(){
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
        //id=id.split(':')[2];
    }*/
    $scope.smart_playisting = function(){
        var art = $('#artist').val();
        var seed = [];
        var art_param = "";
        var tmp = "";
        adv_songs_ids = [];
        seed = art.split(",");
        for (var i = 0; i < seed.length; i++) {
            art_param = art_param + "&artist=" + seed[i];
        };
        art_param = art_param.replace(/\s/g,"+");
        var limit = $('#results').val();
        var sort_by = $('form input[name=sort_by]:checked').val();
        console.log('http://developer.echonest.com/api/v4/playlist/static?api_key=ZCSQWTH1IHKZYUWVX'+art_param+'&bucket=id:spotify&format=json&results='+limit+'&type=artist-radio&bucket=tracks&sort='+sort_by);
        $http({
            method: 'GET', url: 'http://developer.echonest.com/api/v4/playlist/static?api_key=ZCSQWTH1IHKZYUWVX'+art_param+'&bucket=id:spotify&format=json&results='+limit+'&type=artist-radio&bucket=tracks&sort='+sort_by
        }).success(function(data){
            $scope.adv_songs = data.response.songs;
            for (var i = 0; i < $scope.adv_songs.length; i++) {
                tmp = $scope.adv_songs[i].tracks[0].foreign_id;
                $scope.adv_songs_ids.push(tmp.split(':')[2]);
            };
            build_playlist($scope.adv_songs_ids);
        }).error(function(){
            alert("failed");
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
function build_playlist(elems){
    alert("ejec");
    var uri = "";
    for (var i = 0; i < elems.length; i++) {
        if(uri != elems.length-1){ uri = uri + elems[i] + ","; }
    };
    alert(uri);
    $("#playlisting").attr("src","https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:"+uri);
}