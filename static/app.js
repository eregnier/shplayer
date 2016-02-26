var module = angular.module('ShMusicApp', ['angularSoundManager']);

module.controller('MainCtrl', function ($scope, $http) {

	var path = localStorage.getItem('music_folder');

	$scope.rootpath = path;
	$scope.interpath = '';

	$scope.go = function (path) {
		if (path === '/') {
			path = '';
			$scope.interpath = '';
		}
		if (path === '..') {
			path = '';
			var splitter = $scope.interpath.split('/')
			splitter.pop();
			$scope.interpath = splitter.join('/');
		}

		var new_path = $scope.rootpath
		if ($scope.interpath) {
			new_path += $scope.interpath;
		}
		if (path) {
			new_path += '/' + path;
		}

		$http.get('/music' + new_path).success(function (data) {
			if (data.success) {
				console.log('retrieved', data);
				$scope.folders = data.data.folders;
				$scope.files = data.data.files;
				$scope.interpath = new_path.replace($scope.rootpath, '');
				$scope.updateMusics();
			}
		});
	}

	if (!path) {
		alert('music_folder localStorage value not defined !');
	} else {
		$scope.go('');
	}

	$scope.updateMusics = function () {
		var folderSongs = [];
		angular.forEach($scope.files, function (value, index) {
			var music_path = $scope.rootpath + $scope.interpath + '/' + value;
			console.log(music_path, index);
			folderSongs.push({
				url: 'file' + music_path,
				id: index + '',
				title: music_path.split('/').pop().replace('.mp3', '')
			});
		})
		$scope.folderSongs = folderSongs;
	}

});
