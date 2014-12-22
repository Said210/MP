var aplicacion = angular.module('appl', []);

aplicacion.controller('Albums', function($scope, $http ) {

    $scope._id = null;
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
                setTimeout(function() {setURLs(); alert("preOne")}, 3000);
            }else{
                alert('Error al intentar recuperar los datos de spotify 1.');
            }
        }).error(function(d) {
            alert('Error al intentar recuperar los datos de spotify.');
            console.log('https://api.spotify.com/v1/albums/'+parame);
        });
    };

    $scope.buscar = function(){
        var field=document.getElementById('LookFor').value;
        $http({
            method: 'GET', url: 'https://api.spotify.com/v1/search?q='+field+'&type=album,artist,track'
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