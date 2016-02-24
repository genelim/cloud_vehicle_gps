angular
	.module('app')
	.service('User_Authentication', User_Authentication);

User_Authentication.$inject = ['$resource'];

function User_Authentication($resource) {
	return $resource('/api/user_authentication/:id');
}