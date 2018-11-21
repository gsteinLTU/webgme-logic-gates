/*globals define, _*/
/*jshint browser: true*/

/**
 * This file simply extends the features of the SVG that the panel
 * will support. In this case, it is supporting ports and connections.
 *
 * @author brollb / https://github/brollb
 */


define([
    '../Core/LogicGateDecorator.Core',
    '../Core/LogicGateDecorator.Connections',
    '../Core/LogicGateDecorator.Connectors',
    '../Core/LogicGateDecorator.Ports'
], function (LogicGateDecoratorCore, LogicGateDecoratorConnections, LogicGateDecoratorConnectors, LogicGateDecoratorPorts) {

    'use strict';
    var LogicGateDecorator = function (options) {
        var opts = _.extend({}, options);

        LogicGateDecoratorCore.apply(this, [opts]);

        this.setConnectionAreaDefaults({
            angle1: 0,
            angle2: 0,
            len: 20
        });

    };

    _.extend(LogicGateDecorator.prototype, LogicGateDecoratorCore.prototype);
    _.extend(LogicGateDecorator.prototype, LogicGateDecoratorPorts.prototype);
    _.extend(LogicGateDecorator.prototype, LogicGateDecoratorConnections.prototype);

    return LogicGateDecorator;

});
