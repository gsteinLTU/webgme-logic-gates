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
    'js/Utils/DisplayFormat',
    'js/Utils/GMEConcepts',
    'jquery',
    'underscore',
    'css!./LogicGateDecorator.DiagramDesignerWidget.css',
], function (
    REGISTRY_KEYS,
    CONSTANTS,
    ModelDecoratorDiagramDesignerWidget,
    modelDecoratorTemplate,
    displayFormat,
    GMEConcepts, ) {

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


    /**** Override from ModelDecoratorDiagramDesignerWidget ****/
    LogicGateDecorator.prototype.getConnectionAreas = function (id /*, isEnd, connectionMetaInfo*/ ) {
        var result = [],
            edge = 10,
            LEN = 20;

        if (this.ports[id]) {
            //subcomponent
            var portConnArea = this.ports[id].getConnectorArea(),
                idx = this.portIDs.indexOf(id);

            // Use actual element for port
            var portElement = document.getElementById(id);
            var PORT_CONTAINER_OFFSET_Y = portElement.parentElement.getBoundingClientRect().top - portElement.parentElement.parentElement.parentElement.getBoundingClientRect().top;

            // Fixes connection points at non x1.0 scales
            // NOTE: This is a fix for an issue with jQuery 2.x that was fixed in 3.x
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


    /**** Override from ModelDecoratorCore ****/
    LogicGateDecorator.prototype._updateSVG = function () {

    };

    /**** Override from ModelDecoratorCore ****/
    LogicGateDecorator.prototype._updateName = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            svgURL = null,
            self = this;

        if (nodeObj) {
            this.name = nodeObj.getFullyQualifiedName();
            this.formattedName = displayFormat.resolve(nodeObj);
            svgURL = WebGMEGlobal.SvgManager.getSvgUri(nodeObj, REGISTRY_KEYS.SVG_ICON);
        } else {
            this.name = '';
            this.formattedName = noName;
        }

        // Replace name with icon
        if(svgURL)
        {
            this.skinParts.$name.html($('<img>', {src: svgURL}));
            this.skinParts.$name.parent().addClass('name-wrapper-image');
            this.skinParts.$name.attr('title', this.formattedName);
        } else {
            this.skinParts.$name.text(this.formattedName);
            this.skinParts.$name.parent().removeClass('name-wrapper-image');
            this.skinParts.$name.attr('title', this.formattedName);
        }
    };

    /**** Override from ModelDecoratorCore ****/
    LogicGateDecorator.prototype._updateConnectionType = function () {
        var isConnectionType = GMEConcepts.isConnectionType(this._metaInfo[CONSTANTS.GME_ID]);

        if (isConnectionType) {
            if (!this.skinParts.$divConnType) {
                this.skinParts.$divConnType = CONN_TYPE_BASE.clone();
                this.skinParts.$divConnType.insertAfter(this.skinParts.$name);
                this.skinParts.$divConnType.text('<< Connection >>');
            }
        } else {
            if (this.skinParts.$divConnType) {
                this.skinParts.$divConnType.remove();
                delete this.skinParts.$divConnType;
            }
        }
    };
    return LogicGateDecorator;
});