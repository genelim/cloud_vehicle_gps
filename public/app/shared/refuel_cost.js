angular
	.module('app')
	.service('Refuel_Cost', Refuel_Cost);

Refuel_Cost.$inject = ['$resource'];

function Refuel_Cost($resource) {
	return $resource('/api/refuel/:id', null, {
		update: {
      		method: 'PUT'
    	},
    	delete: { 
    		method: 'DELETE', params: {id: 'id'} 
    	},
    	query: {
    		method: 'GET',
    		isArray: false
    	}
	});
}