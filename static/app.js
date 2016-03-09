var module = angular.module('ShMusicApp', ['angularSoundManager']);

module.controller('MainCtrl', function ($scope, $http) {

    $scope.interpath = '';
    $scope.selectedSource = 'file system';

    $scope.go = function (path) {


        if (path === '/') {
            path = '';
            if ($scope.selectedSource !== 'file system') {
                $scope.interpath = $scope.selectedSource;
            } else {
                $scope.interpath = '';
            }
        }
        if (path === '..') {
            path = '';
            var splitter = $scope.interpath.split('/');
            splitter.pop();
            $scope.interpath = splitter.join('/');
        }

        //manage external resources
        if ($scope.selectedSource !== 'file system') {
            $scope.browseUrl($scope.interpath + path);
            return;
        }

        var new_path = '';
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
                $scope.interpath = new_path;
                $scope.updateMusics();
                $scope.covers(new_path);
            }
        });
    };

    $scope.covers = function (path) {
        $http.get('/covers' + path).success(function (data) {
            if (data.data && data.data.length) {
                var rnd = parseInt(data.data.length * Math.random());
                $scope.coverUrl = data.data[rnd];
            } else {
                $scope.coverUrl = '';
            }

        });
    };

    guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    $scope.updateMusics = function () {

        var folderSongs = [];
        var prefix = '';

        //Allow query the webserver api, or direct http queries
        if ($scope.selectedSource === 'file system') {
            prefix = 'file';
        }

        angular.forEach($scope.files, function (value, index) {
            var music_path = $scope.interpath + '/' + value;
            console.log(music_path, index);
            folderSongs.push({
                url: prefix + music_path,
                id: guid(),
                title: music_path.split('/').pop().replace('.mp3', '')
            });
        });
        $scope.folderSongs = folderSongs;
    };


    $scope.searchToken = function () {

        console.log('search', $scope.fuzzySearch);
        var now = + new Date();

        setTimeout(function () {

            if ($scope.fuzzySearch.length > 3 && now - $scope.debounce > 700) {
                console.log('trigger search !');
                if ($scope.fuzzySearch) {
                    $http.get('/search/' + $scope.fuzzySearch).success(function (data) {
                        $scope.search = data.data;
                    });
                } else {
                    $scope.search = [];
                }
                $scope.debounce = + new Date();
            }
        }, 600);
    };

    $scope.formatResult = function (result) {
        if (result) {
            console.log(result[0]);
            return result[0].split('/').pop().replace('.mp3', '');
        }
    };

    $scope.goSearch = function (selection) {
        console.log(selection);
        var path = selection[0].replace('./', '').split('/');
        path.pop();
        $scope.interpath = '';
        $scope.go(path.join('/'));
        $scope.search = [];
    };



    $scope.$on('sourceChange', function (e, selectedSource) {
        console.log('selected source', selectedSource);
        $scope.selectedSource = selectedSource
        $scope.interpath = '';
        //switch between remote source or file system folders
        if ($scope.selectedSource === 'file system') {
            $scope.go('');
        } else {
            $scope.browseUrl(selectedSource);
        }
    })

    $scope.browseUrl = function (url) {
        $scope.interpath = url;
        $http.post('/browse', {url: url}).success(function (data) {
            if (data.success) {
                console.log('retrieved', data);
                $scope.folders = data.data.folders;
                $scope.files = data.data.files;
                $scope.updateMusics();
            }
        });
    };


    //initialization folder
    $scope.go('');
    //configuration load
    $http.get('/configuration').success(function (data) {
        $scope.configuration = data.data;
        $scope.useSearch = $scope.configuration.use_fuzzy || $scope.configuration.use_match;
        console.log('useSearch', $scope.configuration.use_fuzzy, $scope.configuration.use_match);
    });
    $scope.debounce = + new Date();
});

