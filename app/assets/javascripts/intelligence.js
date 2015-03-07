
aplicacion.controller('advanced_search', function($scope, $http ) {
    $scope.adv_songs = [];
    $scope.adv_songs_ids = [];
    $scope.deezer_adv_songs_ids = [];
    $scope.suggestions = [];
    $scope.selector = -1;

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
        var spotify_url = 'http://developer.echonest.com/api/v4/playlist/static?api_key=ZCSQWTH1IHKZYUWVX'+art_param+'&bucket=id:spotify&bucket=id:deezer&format=json&results='+limit+'&type=artist-radio&bucket=tracks&sort='+sort_by;
        var deezer_url = 'http://developer.echonest.com/api/v4/playlist/static?api_key=ZCSQWTH1IHKZYUWVX'+art_param+'&bucket=id:deezer&format=json&results='+limit+'&type=artist-radio&bucket=tracks&sort='+sort_by;
        console.log(spotify_url);
        $scope.spotify(spotify_url);
        //$scope.deezer(deezer_url);
    }
    $scope.spotify = function(url){
        $http({
            method: 'GET', url: url
        }).success(function(data){
            $scope.adv_songs = data.response.songs;
            for (var i = 0; i < $scope.adv_songs.length; i++) {
                if($scope.adv_songs[i].tracks.length != 0){
                    var spo_found = false;
                    var dz_found = false;
                    for (var j = 0; j < $scope.adv_songs[i].tracks.length; j++) {
                        tmp = $scope.adv_songs[i].tracks[j].foreign_id;
                        
                        if ($scope.adv_songs[i].tracks[j].catalog == "spotify" && !spo_found){
                            $scope.adv_songs_ids.push(tmp.split(':')[2]);
                            console.log("sp => "+tmp.split(':')[2]);
                            spo_found = true;
                        }
                        
                        if ($scope.adv_songs[i].tracks[j].catalog == "deezer" && !dz_found){
                            $scope.deezer_adv_songs_ids.push(tmp.split(':')[2]);
                            console.log("dz => "+tmp.split(':')[2]);
                            dz_found = true;
                        }
                        if(spo_found && dz_found){break;}

                    };
                    
                }
            };
            //build_playlist($scope.adv_songs_ids);
        }).error(function(){
            alert("spotify failed");
        });
    }
    $scope.suggestArtist = function(e){
        e.preventDefault();
        if(e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 13){
            $http({
                method: 'GET', url: 'http://developer.echonest.com/api/v4/artist/search?api_key=ZCSQWTH1IHKZYUWVX&format=json&results=5&bucket=id:spotify&bucket=id:deezer&name=' + $("#artist").val().split(",")[$("#artist").val().split(",").length-1]
            }).success(function(data) {
                if(typeof(data) == 'object'){
                    $scope.suggestions = data.response.artists;
                }else{
                    console.log('Error al intentar recuperar los datos de echonest.');
                }
            }).
            error(function() {
                console.log('Error al intentar recuperar los datos de echonest.');
            });
        }else{
            if(e.keyCode == 40 && $scope.selector < $scope.suggestions.length){
                $scope.selector = $scope.selector + 1;
                $(".option").removeClass("active");
                $("#n" + $scope.selector).addClass("active");
            }
            if(e.keyCode == 38 && $scope.selector > -1){
                $scope.selector = $scope.selector - 1;
                $(".option").removeClass("active");
                $("#n" + $scope.selector).addClass("active");
            }
            if(e.keyCode == 13 && $scope.selector != -1){
                //alert($scope.suggestions[$scope.selector].name);

                $("#artist").val($("#artist").val().replace($("#artist").val().split(",")[$("#artist").val().split(",").length-1], "") + $scope.suggestions[$scope.selector].name);
                $scope.suggestions = [];
                $(".option").removeClass("active"); 
                $scope.selector = -1;
            }
            if(e.keyCode == 38 && $scope.selector == -1){ $(".option").removeClass("active");  $scope.selector = -1; }
        }
    };
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
function build_playlist(){
    var spotify_uri = "";
    var deezer_uri = "";
    $(".songs_to_play").each(function(){
        spotify_uri = spotify_uri + $(this).data("spotify") + ",";
    });
    $(".songs_to_play").each(function(){
        deezer_uri = deezer_uri + $(this).data("deezer") + ",";
    });
    spotify_uri = spotify_uri.substr(0, spotify_uri.length-1);
    deezer_uri = deezer_uri.substr(0, deezer_uri.length-1);

    console.log("spo => "+spotify_uri);
    console.log("deezer => "+deezer_uri);
    $("#playlisting").attr("src","https://embed.spotify.com/?uri=spotify:trackset:MUTEPLAYLIST:"+spotify_uri);
    $("#deezerPlaylist").attr("src","http://www.deezer.com/plugins/player?autoplay=false&playlist=true&width=480&height=480&cover=true&title=MUTEPLAYLIST&format=horizontal&app_id=139673&type=tracks&id="+deezer_uri);
    
}