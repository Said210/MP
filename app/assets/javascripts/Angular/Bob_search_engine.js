var application = angular.module('appl', []);
application.controller('bob', function($scope, $http ) {
	$scope.bob_it = function(){
		console.log("Bobbed");
	}
});