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
    

aplicacion.controller('profile-panel', function($scope, $http ) {

    $scope.posts=[];
    $scope.post_favs=[];
    $scope.friends=[];
    $scope.u_id=0;
    $scope.current_user_id=0;    
    $scope.load_posts = function(){
        $http({
            method: 'GET', url: '/p/at/'+$scope.u_id+'.json'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.posts = data;
                for (var i = 0; i < $scope.posts.length; i++) {
                    $scope.post_favs.push($scope.posts[i].favs);
                    console.log($scope.posts[i].favs);
                };
                //alert("succed");
                setTimeout(function() {setURLs();}, 1000);
            }else{
                alert('Error al intentar recuperar los posts.');
            }
            loaded=false;
            setTimeout(function() {post_load_images();}, 2000);
        }).
        error(function() {
            alert('Error al intentar recuperar los posts.');
        });

    }
    $scope.get_friends = function(){
        $http({
            method: 'GET', url: '/get/friendlist/'+$scope.u_id+'.json'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.friends = data;
                if($scope.friends.length == 0){
                    
                }
            }else{
                alert('Error al intentar recuperar los amigos.');
            }
        }).
        error(function(data) {
            console.log(data);
            alert('Error al intentar recuperar los amigos.');
        });
    }
    $scope.start=function(id,c_u_id){
        $scope.u_id=id;
        $scope.current_user_id=c_u_id;
        $scope.get_friends();
        $scope.load_posts();
    }
    $scope.owner = function(user_id_param, posted_at_param){
        if($scope.current_user_id==user_id_param){
            return true;
        }else{
            return false;
        }
    }
    $scope.posted_at = function(user_id_param, posted_at_param){
        
        if( $scope.current_user_id == posted_at_param){
            return true;
        }else{
            return false;
        }
    }
    $scope.fav_post = function(me,i){
        var result="{";
        result=result+'"user_id": "'+$scope.current_user_id+'","post_id": "'+i+'"';
        result=result+"}"
        result=JSON.parse(result);
        $.post("/p/fav",result).always(function(data){
            if (data=="Liked") {
                $("#post_fav_id_"+i).text("Unfav");
                $("#post_fav_id_"+i).attr("class","Unfav");
            };
            if (data=="Unliked") {
                $("#post_fav_id_"+i).text("Fav");
                $("#post_fav_id_"+i).attr("class","");
            };
        });
    }
});


var ids, elems, user_ids,profile_post_pics;
ids=[];
elems=[];
user_ids=[];
profile_post_pics=[];
var post_load_images = function(){
    $(".pic").each(function(){
        ids.push($(this).data("post_id"));
        elems.push($(this));
    });
     $(".profile_post_pic").each(function(){
        user_ids.push($(this).data("user_id"));
        profile_post_pics.push($(this));
    });
    if(!loaded){
        for(var ind=0; ind < ids.length ;ind++){
            get_foreign_post_images_urls(ind);
        };
        for (var ind = 0; ind < user_ids.length; ind++) {
            get_foreign_profile_post_images_urls(ind);
        };
    }
    loaded=true;
}
var get_foreign_post_images_urls = function(index){
    $.get( "/p/pic/"+ids[index]).done(function( data ) {
            elems[index].attr("src",data);
        }).fail(function(data){
            console.log("ERROR! -> "+data);
        }).always(function() {
            console.log("Get_for... -> @"+ids[index]);
        });
}
var get_foreign_profile_post_images_urls = function(index){
    setTimeout(function(){
    $.get( "/api/u/get/pic/"+user_ids[index]).done(function( data ) {
            profile_post_pics[index].attr("src",data);
        }).fail(function(data){
            console.log("ERROR! ");
            console.log(data);
        }).always(function() {
            console.log("Profile pic for get_for... -> @"+ids[index]);
        });
    },400*index);
}

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

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

