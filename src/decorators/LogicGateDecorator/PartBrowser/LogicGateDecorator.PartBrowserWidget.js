/*globals define, _, $*/
/*jshint browser: true*/

/**
 * @author brollb / https://github/brollb
 */

define([
    'js/Constants',
    'js/NodePropertyNames',
    'js/Widgets/PartBrowser/PartBrowserWidget.DecoratorBase',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.Constants',
    'text!../Core/LogicGateDecorator.html',
    './LogicGateDecorator.Core',
    'css!./LogicGateDecorator.PartBrowserWidget'
], function (CONSTANTS,
             nodePropertyNames,
             PartBrowserWidgetDecoratorBase,
             DiagramDesignerWidgetConstants,
             LogicGateDecoratorTemplate,
             LogicGateDecoratorCore) {

    'use strict';

    var LogicGateDecoratorPartBrowserWidget,
        DECORATOR_ID = 'LogicGateDecoratorPartBrowserWidget';


    LogicGateDecoratorPartBrowserWidget = function (options) {
        var opts = _.extend({}, options);

        PartBrowserWidgetDecoratorBase.apply(this, [opts]);
        LogicGateDecoratorCore.apply(this, [opts]);

        this._initializeVariables({connectors: false});

        this.logger.debug('LogicGateDecoratorPartBrowserWidget ctor');
    };


    /************************ INHERITANCE *********************/
    _.extend(LogicGateDecoratorPartBrowserWidget.prototype, PartBrowserWidgetDecoratorBase.prototype);
    _.extend(LogicGateDecoratorPartBrowserWidget.prototype, LogicGateDecoratorCore.prototype);


    /**************** OVERRIDE INHERITED / EXTEND ****************/

    /**** Override from PartBrowserWidgetDecoratorBase ****/
    LogicGateDecoratorPartBrowserWidget.prototype.DECORATORID = DECORATOR_ID;


    /**** Override from PartBrowserWidgetDecoratorBase ****/
    LogicGateDecoratorPartBrowserWidget.prototype.$DOMBase = (function () {
        var el = $(LogicGateDecoratorTemplate);
        //use the same HTML template as the DefaultDecorator.DiagramDesignerWidget
        //but remove the connector DOM elements since they are not needed in the PartBrowser
        el.find('.' + DiagramDesignerWidgetConstants.CONNECTOR_CLASS).remove();
        return el;
    })();


    /**** Override from PartBrowserWidgetDecoratorBase ****/
    LogicGateDecoratorPartBrowserWidget.prototype.beforeAppend = function () {
        this.$el = this.$DOMBase.clone();

        this._renderContent();
    };


    /**** Override from PartBrowserWidgetDecoratorBase ****/
    LogicGateDecoratorPartBrowserWidget.prototype.afterAppend = function () {
    };


    /**** Override from PartBrowserWidgetDecoratorBase ****/
    LogicGateDecoratorPartBrowserWidget.prototype.update = function () {
        this._update();
    };

    LogicGateDecoratorPartBrowserWidget.prototype.afterAppend = function () {
        this.svgContainerWidth = this.$svgContent.outerWidth(true);
        this.svgWidth = this.$svgContent.find('svg').outerWidth(true);
        this.svgHeight = this.$svgContent.find('svg').outerHeight(true);

        var xShift = (this.svgContainerWidth - this.svgWidth) / 2;

        // this._fixPortContainerPosition(xShift);
    };

    /**** Override from PartBrowserWidgetDecoratorBase ****/
    LogicGateDecoratorPartBrowserWidget.prototype.notifyComponentEvent = function (componentList) {
        var len = componentList.length;
        while (len--) {
            this._updatePort(componentList[len]);
        }
    };


    return LogicGateDecoratorPartBrowserWidget;
});
