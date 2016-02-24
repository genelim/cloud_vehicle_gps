angular
	.module('app')
	.service('User', User);

User.$inject = ['$resource'];

function User($resource) {
	return $resource('/api/user/:id');
}