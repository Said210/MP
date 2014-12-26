

aplicacion.controller('suggestions', function($scope, $http ) {

	$scope.similar_artists=[];
	$scope.similar_artists_pics=[];
	$scope.spotify_artists=[];
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

});