/*globals define, _, DEBUG, $*/
/*eslint-env browser*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */


define([
    'js/Constants',
    'js/NodePropertyNames',
    'js/Widgets/PartBrowser/PartBrowserWidget.DecoratorBase',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.Constants',
    'text!../DiagramDesigner/LogicGateDecorator.DiagramDesignerWidget.html',
    'css!../DiagramDesigner/LogicGateDecorator.DiagramDesignerWidget.css',
    'css!./LogicGateDecorator.PartBrowserWidget.css'
], function (CONSTANTS,
             nodePropertyNames,
             PartBrowserWidgetDecoratorBase,
             DiagramDesignerWidgetConstants,
             LogicGateDecoratorDiagramDesignerWidgetTemplate) {

    'use strict';

    var LogicGateDecoratorPartBrowserWidget,
        __parent__ = PartBrowserWidgetDecoratorBase,
        DECORATOR_ID = 'LogicGateDecoratorPartBrowserWidget';

    LogicGateDecoratorPartBrowserWidget = function (options) {
        var opts = _.extend({}, options);

        __parent__.apply(this, [opts]);

        this.logger.debug('LogicGateDecoratorPartBrowserWidget ctor');
    };

    _.extend(LogicGateDecoratorPartBrowserWidget.prototype, __parent__.prototype);
    LogicGateDecoratorPartBrowserWidget.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    LogicGateDecoratorPartBrowserWidget.prototype.$DOMBase = (function () {
        var el = $(LogicGateDecoratorDiagramDesignerWidgetTemplate);
        //use the same HTML template as the LogicGateDecorator.DiagramDesignerWidget
        //but remove the connector DOM elements since they are not needed in the PartBrowser
        el.find('.' + DiagramDesignerWidgetConstants.CONNECTOR_CLASS).remove();
        return el;
    })();

    LogicGateDecoratorPartBrowserWidget.prototype.beforeAppend = function () {
        this.$el = this.$DOMBase.clone();

        //find name placeholder
        this.skinParts.$name = this.$el.find('.name');

        this._renderContent();
    };

    LogicGateDecoratorPartBrowserWidget.prototype.afterAppend = function () {
    };

    LogicGateDecoratorPartBrowserWidget.prototype._renderContent = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        //render GME-ID in the DOM, for debugging
        if (DEBUG) {
            this.$el.attr({'data-id': this._metaInfo[CONSTANTS.GME_ID]});
        }

        if (nodeObj) {
            this.skinParts.$name.text(nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '');
        }
    };

    LogicGateDecoratorPartBrowserWidget.prototype.update = function () {
        this._renderContent();
    };

    return LogicGateDecoratorPartBrowserWidget;
});