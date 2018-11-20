/*globals define, _*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */

define([
    'js/Decorators/DecoratorBase',
    './DiagramDesigner/LogicGateDecorator.DiagramDesignerWidget',
    './PartBrowser/LogicGateDecorator.PartBrowserWidget'
], function (DecoratorBase, LogicGateDecoratorDiagramDesignerWidget, LogicGateDecoratorPartBrowserWidget) {

    'use strict';

    var LogicGateDecorator,
        __parent__ = DecoratorBase,
        __parent_proto__ = DecoratorBase.prototype,
        DECORATOR_ID = 'LogicGateDecorator';

    LogicGateDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        __parent__.apply(this, [opts]);

        this.logger.debug('LogicGateDecorator ctor');
    };

    _.extend(LogicGateDecorator.prototype, __parent_proto__);
    LogicGateDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    LogicGateDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            DiagramDesigner: LogicGateDecoratorDiagramDesignerWidget,
            PartBrowser: LogicGateDecoratorPartBrowserWidget
        };
    };

    return LogicGateDecorator;
});