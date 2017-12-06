'use strict';

/**
 * @ngdoc directive
 * @name eeh-navigation-navbar
 * @restrict AE
 *
 * @description
 * This directive allows for the creation of a Twitter Bootstrap navbar component.
 *
 * @param {string=} menuName Sets the name of the menu that the directive will render.
 * @param {string=} [navClass=navbar-default navbar-static-top] Sets the ng-class attribute of the top-level nav element.
 * @param {string=} containerClass
 * Sets the ng-class attribute of the top-level "container" element.
 * Common settings are nothing, "container" or "container-fluid".
 * Some custom class or expression can also be used if desired.
 * @param {string=} brandText Sets the text of the brand element.
 * @param {string=} brandState Sets ui-sref of the brand element.
 * @param {string=} brandHref Sets the href attribute of the brand element.
 * @param {string=} brandTarget Sets target attribute of the brand element.
 * @param {string=} brandSrc Sets the src attribute of the image in the brand element.
 * @param {function=} brandClick Sets the callback function of the brand element.
 * @param {function=} refresh A function for refreshing the directive.
 */
var NavbarDirective = function ($window, eehNavigation) {
    return {
        restrict: 'AE',
        templateUrl: 'template/eeh-navigation/navbar/eeh-navigation-navbar.html',
        scope: {
            menuName: '=',
            navClass: '=?',
            containerClass: '=?',
            brandText: '=',
            brandState: '=',
            brandHref: '=',
            brandTarget: '=',
            brandSrc: '=',
            brandClick: '=',
            refresh: '=?',
            hiddenNavbar: '='
        },
        link: function (scope) {
            scope.iconBaseClass = function () {
                return eehNavigation.iconBaseClass();
            };
            scope.navClass = scope.navClass || 'navbar-default navbar-static-top';
            scope.refresh = function () {
                if (angular.isUndefined(scope.menuName)) {
                    return;
                }
                var menuItems = eehNavigation.menuItemTree(scope.menuName);
                scope.leftNavbarMenuItems = menuItems.filter(function (item) { return !item.isHeavy(); });
                scope.rightNavbarMenuItems = menuItems.filter(function (item) { return item.isHeavy(); });
            };
            scope.$watch(eehNavigation.menuItems, scope.refresh, true);

            var windowElement = angular.element($window);
            windowElement.bind('resize', function () {
                scope.$apply();
            });

            var getWindowDimensions = function () {
                return {
                    innerHeight: windowElement[0].innerHeight,
                    innerWidth: windowElement[0].innerWidth
                };
            };

            scope.$watch(getWindowDimensions, function (newValue) {
                if (angular.isUndefined(newValue)) {
                    return;
                }
                var width = (newValue.innerWidth > 0) ? newValue.innerWidth : $window.screen.width;
            }, true);
        }
    };
};

angular.module('eehNavigation').directive('eehNavigationNavbar', ['$window', 'eehNavigation', NavbarDirective]);
angular.module('eehNavigation').controller('collapseCtrl', ['$scope', function(scope) {
      scope.hiddenNavbarSidebar = {
          state: true};
          // if need save status when page reload, we can use cookies
         // need add to parent element controller
         // example:
         //<parent ng-controller="collapseCtrl" >
         //<eeh-navigation-navbar menu-name="'myNavbar'" hidden-navbar="hiddenNavbarSidebar"></eeh-navigation-navbar>
         //<eeh-navigation-sidebar hidden-sidebar="hiddenNavbarSidebar" menu-name="'mySidebar'"></eeh-navigation-sidebar>
         //</parent>

    }]);
