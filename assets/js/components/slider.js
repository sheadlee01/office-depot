define([
//#region Module Dependencies
    'app',

// Plugins
    'base/model_base',
    'base/view_base',

// Templates 
    'text!templates/slider.flexslider.wrapper.html',
    'text!templates/slider.flexslider.slide.html'

//#endregion
],

function (app, ModelBase, ViewBase, tmplSliderWrapper, tmplSliderSlide) {

	var Module = function () {
		var Slider = this;
		
		Slider.Views = {};

		_.extend(Slider, Backbone.Events);

		//#region Module Views

		Slider.View = ViewBase.extend({

			initialize: function (options) {
				var _this = this;
				_.bindAll(this, 'render', 'addAll', 'addOne');

				_this.compileAndCacheTemplates([
                { name: 'tmplSliderWrapper', content: tmplSliderWrapper },
                { name: 'tmplSliderSlide', content: tmplSliderSlide }
            ]);

				_this.template = JST['tmplSliderWrapper'];
				_this.render();
			},
			render: function () {
				var _this = this;

				_this.$el.append($.tmpl(_this.template));

				_this.options = _.extend(_this.options, {
					elModel: _this.$el.find('ul.slides'),
					modelView: Slider.Views.SliderItem
				});

				_this.addAll();

				_this.$el.find('.flexslider').flexslider({
					animation: "slide",
					slideshow: true,
					directionNav: true,
					controlNav: true
				});

			}

		});

		Slider.Views.SliderItem = ViewBase.extend({

			tagName: 'li',
			events: {
				'click ul.slides .slide': 'slideItemHandler'
			},

			initialize: function (options) {
				var _this = this;

				_.bindAll(this, 'render');
				_this.template = JST['tmplSliderSlide'];
			},

			render: function () {
				var _this = this;

				$(_this.el).html($.tmpl(_this.template, _this.model.toJSON()));

				return _this;
			},

			slideItemHandler: function (event) {
				event.preventDefault();
				var _this = this
                , target = $(event.currentTarget);

				Slider.trigger('click', _this.model);

				return false;
			}

		});

		//#endregion


	};

	// Required, return the module for AMD compliance
	return Module;
});