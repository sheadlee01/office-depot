define([
//#region Module Dependencies
    'app',

// Base'
    'base/view_base',

// Templates 
    'text!templates/menu.item.html'

//#endregion Module Dependencies
],
function (app, ViewBase, tmplMenuItem) {

    var Module = function () {

        // Set copy of this module
        var Accordion = this;

        // If module requires multiple views, app them inside of the Views object.
        Accordion.Views = {};

        // If module requires module-level events, extend it with Backbone.Events
        _.extend(Accordion, Backbone.Events);

        // This is the base view for the module, it kick-starts the initialization and rendering.
        Accordion.View = ViewBase.extend({

            initialize: function () {
                var _this = this;
                _.bindAll(this, 'render');

                _this.compileAndCacheTemplates([
                    { name: 'tmplMenuItem', content: tmplMenuItem }
                ]);

                if (_this.options.allowDropdowns === undefined) {
                    _.extend(_this.options, {
                        allowDropdowns: false
                    });
                }

                _this.render();
            },

            render: function () {
                var _this = this;

                _this.$el.html('');
                _this.collection.each(function (menu) {

                    // Create a Menu View.
                    var menuView = new Accordion.Views.MenuItem({ model: menu });

                    // Render the Menu View so we can start inserting submenus if applicable.

                    var $menu = menuView.render().$el;

                    //Get Subs
                    var subMenus = menu.get('Subs');

                    if (subMenus !== null && subMenus.length && _this.options.allowDropdowns) {
                        //Turn the subs into a backbone collection
                        subMenus = new Backbone.Collection(menu.get('Subs'));

                        //Add a UL to insert the submenu items into
                        $menu.append('<ul class="level2" style="display: none;"></ul>');

                        subMenus.each(function (submenu) {
                            // Create a SubMenu View
                            subMenuView = new Accordion.Views.MenuItem({ model: submenu });

                            // Find the appropriate SubMenu UL and insert the SubMenu LI
                            $menu.find('ul').append(subMenuView.render().el);
                        });
                    }

                    // Write the Menu to the EL it was passed.
                    _this.$el.append($menu);
                });


            }

        });


        Accordion.Views.MenuItem = ViewBase.extend({

            tagName: 'li',
            events: {
                'click .menuItem': 'menuItemHandler'
            },

            initialize: function (options) {
                var _this = this;

                _.bindAll(this, 'render');

                _this.template = JST.tmplMenuItem;

            },

            render: function () {
                var _this = this;

                _this.$el.html($.tmpl(_this.template, _this.model.toJSON()));

                return _this;
            },

            menuItemHandler: function (event) {
                event.preventDefault();
                event.stopPropagation();

                var _this = this
                    , $target = $(event.currentTarget);

                $target.find('i').toggleClass('icon-right').toggleClass('icon-down');

                var subLevel = $target.closest('li').find('.level2').slideToggle(200);
                if (subLevel.length === 0) {
                    Accordion.trigger('click', _this.model);
                } else {
                    _this.model.set({ offsetTop: event.target.offsetTop });
                    Accordion.trigger('click', _this.model);
                }

                return false;
            }

        });

    };

    // Return our module, which will have to be called with 'new' ex: var module =  new Module();
    return Module;

});