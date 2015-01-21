var aplicacion = angular.module('appl', []);
var loaded=false;
aplicacion.controller('Albums', function($scope, $http ) {

    $scope.id = null;
    $scope.nombre = '';
    $scope.Spotify_albums = [];
    $scope.Deezer_albums = [];
    $scope.Spotify_album_tracks = [];
    

    $scope.cargarAlbums = function(id){
        $http({
            method: 'GET', url: 'https://api.spotify.com/v1/artists/'+id+'/albums'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.Spotify_albums = data.items;
            }else{
                alert('Error al intentar recuperar los datos de spotify.');
            }
        }).
        error(function() {
            alert('Error al intentar recuperar los datos de spotify.');
        });
    };

    $scope.showTracks = function(parame){
        $http({
            method: 'GET', url: 'https://api.spotify.com/v1/albums/'+parame+''
        }).success(function(data) {
            if(typeof(data) == 'object'){
                $scope.Spotify_album_tracks = data.tracks.items;
                setTimeout(function() {setURLs();}, 1000);
            }else{
                alert('Error al intentar recuperar los datos de spotify 1.');
            }
        }).error(function(d) {
            alert('Error al intentar recuperar los datos de spotify.');
            console.log('https://api.spotify.com/v1/albums/'+parame);
        });
    };

    $scope.lookFor = function(){
        var field=document.getElementById('LookFor').value;
        $http({
            method: 'GET', url: 'https://api.spotify.com/v1/search?q='+field+'&type=artist,album,track'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.Spotify_albums = data.albums;
            }else{
                alert('Error al intentar recuperar los datos de spotify.');
            }
        }).
        error(function() {
            alert('Error al intentar recuperar los datos de spotify.');
        });
    };

    $scope.playPreview = function(SongURL){
        var player=document.getElementById("ply")
        player.src=SongURL;
        player.play();
    }
});
    


function share_song(keys,values){
    var result="{";
    if(keys.length == values.length){
        if (keys.indexOf("text") == -1) {
            keys.push("text");
            values.push("");
        }else{
            if (values[keys.indexOf("text")] == "!ask_for_text") {
                values[keys.indexOf("text")] = prompt("Please enter your message", "");
            };
        };

        for (var i = 0; i < keys.length; i++) {
            result=result+'"'+keys[i]+'": "'+values[i]+'"';
            if (i<keys.length - 1) {result=result+", "};
        };
        result=result+"}";
        result=JSON.parse(result);
        $.post("/p/create",result).always(function(data){
            alert(data);
        });
    }
    
}

