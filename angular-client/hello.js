angular.module('demo', [])
// controller
.controller('Hello', function($scope, $http)
{
	$http.get('http://localhost:5000/test').
	then(function(response)
	{
		// model
		$scope.greeting = response.data;
	});
});


/*
	MVC

	Hello-> controller
	gretting -> Model

*/