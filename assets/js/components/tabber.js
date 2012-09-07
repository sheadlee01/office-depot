define([
//#region Module Dependencies
    'app',

// Plugins
    'base/model_base',
    'base/view_base'

//#endregion
],

function (app, ModelBase, ViewBase) {

	var Module = function () {
		var Tabber = this;

		Tabber.Views = {};
		Tabber.Models = {};
		Tabber.Collections = {};

		_.extend(Tabber, Backbone.Events);

		//#region Module Views

		Tabber.View = ViewBase.extend({
			events: {
				'click .nav-tabs a': 'tabClick'
			},
			initialize: function (options) {
				var _this = this;
				_.bindAll(this, 'render', 'addAll', 'addOne');

				_this.setupData();


			},
			setupData: function () {
				var _this = this;

				//var tabs = [{ title: "title1", content: '<p>Stuff</p>' }, { title: "title2", content: '<p>More Stuff</p>' }, { title: "title3", content: '<p>Last Stuff</p>'}];

				var $tabHtml = $('<div class="tabbable"><ul class="nav nav-tabs"></ul><div class="tab-content"></div></div>');
				var $tabNav = $tabHtml.find('ul');
				var $tabBody = $tabHtml.find('.tab-content');

				_.each(_this.options.tabs, function (tab, count) {
					var tClass = (count === 0) ? 'active' : '';
					$tabNav.append('<li class="' + tClass + '"><a href="#tab' + count + '" data-toggle="tab">' + tab.title + '</a></li>');
					$tabBody.append('<div class="tab-pane ' + tClass + '" id="tab' + count + '">' + tab.content + '</div>');
				});

				_this.render($tabHtml);
			},
			render: function ($tabHtml) {
				var _this = this;

				_this.$el.append($tabHtml);
			},
			tabClick: function (event) {
				event.preventDefault();

				$(event.target).closest('li').addClass('active').siblings().removeClass('active');
				$(event.target.hash).addClass('active').siblings().removeClass('active');

				return false;
			}

		});

		//#endregion


	};

	// Required, return the module for AMD compliance
	return Module;
});