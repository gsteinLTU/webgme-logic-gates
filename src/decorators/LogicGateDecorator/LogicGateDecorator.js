/*globals define, _*/
/**
 * @author pmeijer / https://github.com/pmeijer
 */

define([
    'js/Decorators/DecoratorBase',
    './DiagramDesigner/LogicGateDecorator.DiagramDesignerWidget',
    './PartBrowser/LogicGateDecorator.PartBrowserWidget'
], function (DecoratorBase, LogicGateDecoratorDiagramDesignerWidget, LogicGateDecoratorPartBrowserWidget) {

    'use strict';

    var LogicGateDecorator,
        DECORATOR_ID = 'LogicGateDecorator';

    LogicGateDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        DecoratorBase.apply(this, [opts]);

        this.logger.debug('LogicGateDecorator ctor');
    };

    _.extend(LogicGateDecorator.prototype, DecoratorBase.prototype);
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