angular.module('ShMusicApp').directive('sourcemanager', function($rootScope) {
  return {
    scope: {},
    templateUrl: '/static/components/sourcemanager/template.html',
    link : function (scope, element, attrs) {

    	scope.toggleSourceAdd = function () {
    		console.log('toggle action' );
    		if (!scope.showSourceAdd) {
    			scope.showSourceAdd = true;
    		} else {
    			if (scope.dataSource) {
    				scope.sources.push(scope.dataSource);
    				scope.saveSources();
    				scope.showSourceAdd = false;
    			}
    		}
    	};

    	scope.saveSources = function () {
    		localStorage.setItem('sources', JSON.stringify(scope.sources));
    	};

    	scope.loadSources = function () {
    		var sources = localStorage.getItem('sources') || JSON.stringify([
    			'file system'
    		]);
    		scope.sources = JSON.parse(sources);
    	}

    	scope.deleteSelectedSource = function () {
    		console.log('delete action', scope.selectedSource);
    	};

    	scope.onChange = function () {
    		$rootScope.$broadcast('sourceChange', scope.selectedSource);
    	}



    	scope.loadSources();
    }
  };
});