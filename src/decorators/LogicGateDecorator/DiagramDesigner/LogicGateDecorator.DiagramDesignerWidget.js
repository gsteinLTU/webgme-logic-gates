/*globals define, _*/
/**
 * This decorator inherits from the ModelDecorator.DiagramDesignerWidget.
 * With no changes to the methods - it will functions just like the ModelDecorator.
 *
 * For more methods see the ModelDecorator.DiagramDesignerWidget.js in the webgme repository.
 *
 * @author pmeijer / https://github.com/pmeijer
 * @author gstein / https://github.com/gsteinltu
 */

define([
    'js/RegistryKeys',
    'js/Constants',
    'decorators/ModelDecorator/DiagramDesigner/ModelDecorator.DiagramDesignerWidget',
    'text!../Core/LogicGateDecorator.html',
    'jquery',
    'underscore',
    'css!./LogicGateDecorator.DiagramDesignerWidget.css',
], function (
    REGISTRY_KEYS,
    CONSTANTS,
    ModelDecoratorDiagramDesignerWidget,
    modelDecoratorTemplate,) {

    'use strict';

    var LogicGateDecorator,
        DECORATOR_ID = 'LogicGateDecorator';

    LogicGateDecorator = function (options) {
        var opts = _.extend({}, options);

        ModelDecoratorDiagramDesignerWidget.apply(this, [opts]);

        this.logger.debug('LogicGateDecorator ctor');
    };

    LogicGateDecorator.prototype = Object.create(ModelDecoratorDiagramDesignerWidget.prototype);
    LogicGateDecorator.prototype.constructor = LogicGateDecorator;
    LogicGateDecorator.prototype.DECORATORID = DECORATOR_ID;
    LogicGateDecorator.prototype.$DOMBase = $(modelDecoratorTemplate);

    LogicGateDecorator.prototype.on_addTo = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        this.logger.debug('This node was added to the canvas', nodeObj);

        // Call the base-class method..
        ModelDecoratorDiagramDesignerWidget.prototype.on_addTo.apply(this, arguments);
    };

    LogicGateDecorator.prototype.destroy = function () {
        ModelDecoratorDiagramDesignerWidget.prototype.destroy.apply(this, arguments);
    };

    LogicGateDecorator.prototype.update = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        this.logger.debug('This node is on the canvas and received an update event', nodeObj);

        ModelDecoratorDiagramDesignerWidget.prototype.update.apply(this, arguments);
    };

    
    /**** Override from DiagramDesignerWidgetDecoratorBase ****/
    LogicGateDecorator.prototype.getConnectionAreas = function (id/*, isEnd, connectionMetaInfo*/) {
        var result = [],
            edge = 10,
            LEN = 20;
        
        if (this.ports[id]) {
            //subcomponent
            var portConnArea = this.ports[id].getConnectorArea(),
                idx = this.portIDs.indexOf(id);

            // Use actual element for port
            var portElement = document.getElementById(id);

            var PORT_CONTAINER_OFFSET_Y = portElement.parentElement.getBoundingClientRect().top -  portElement.parentElement.parentElement.parentElement.getBoundingClientRect().top; 

            var scale = $(".items").first().css('transform').substring("matrix(".length).split(',')[0];

            result.push({
                id: idx,
                x1: portConnArea.x1,
                y1: portConnArea.y1 + PORT_CONTAINER_OFFSET_Y / scale,
                x2: portConnArea.x2,
                y2: portConnArea.y2 + PORT_CONTAINER_OFFSET_Y / scale,
                angle1: portConnArea.angle1,
                angle2: portConnArea.angle2,
                len: portConnArea.len
            });
        }

        return result;
    };

    return LogicGateDecorator;
});