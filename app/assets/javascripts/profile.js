aplicacion.controller('profile-panel', function($scope, $http ) {

    $scope.posts=[];
    $scope.post_favs=[];
    $scope.friends=[];
    $scope.u_id=0;
    $scope.current_user_id=0;
    $scope.entries = [];

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
                setTimeout(function() {setURLs();}, 1000);
            }else{
                //alert('Error al intentar recuperar los posts.');
            }
            loaded=false;
            setTimeout(function() {post_load_images();}, 600);
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
        $scope.watch_new();
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
    $scope.watch_new = function() {
        var source = new EventSource('/watch/messages');
        var tmp, render;
        render = "<div class='notif'><b>?: </b><br><span>%</span>";
        source.onmessage = function(event) {
            $scope.$apply(function () {
                $scope.entries.push(JSON.parse(event.data));
                console.log(JSON.parse(event.data));
                tmp = JSON.parse(event.data);
                render = render.replace("?",tmp.sent_by.username);
                render = render.replace("%",tmp.message);
                $("#notif-panel").append(render);
                render = "<div class='notif'><b>?</b><br><span>%</span>";
                if ($scope.entries.length > 20) {
                    $scope.prev_messages.push($scope.entries[0]);
                    $scope.entries.shift();
                };
            });
        };
    };

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

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
