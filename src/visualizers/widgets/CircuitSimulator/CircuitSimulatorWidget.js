/*globals define, WebGMEGlobal*/

/**
 * Generated by VisualizerGenerator 1.7.0 from webgme on Thu Nov 29 2018 16:05:07 GMT-0600 (Central Standard Time).
 */

define(['css!./styles/CircuitSimulatorWidget.css'], function () {
    'use strict';

    var CircuitSimulatorWidget,
        WIDGET_CLASS = 'circuit-simulator';

    CircuitSimulatorWidget = function (logger, container) {
        this._logger = logger.fork('Widget');


        this._el = container;

        this.nodes = {};
        this._initialize();

        this._logger.debug('ctor finished');
    };

    CircuitSimulatorWidget.prototype._initialize = function () {
        var width = this._el.width(),
            height = this._el.height(),
            self = this;

        // set widget class
        this._el.addClass(WIDGET_CLASS);
 };

    CircuitSimulatorWidget.prototype.onWidgetContainerResize = function (width, height) {
        this._logger.debug('Widget is resizing...');
    };

    // Adding/Removing/Updating items
    CircuitSimulatorWidget.prototype.addNode = function (desc) {
    };

    CircuitSimulatorWidget.prototype.removeNode = function (gmeId) {
    };

    CircuitSimulatorWidget.prototype.updateNode = function (desc) {
    };

    /* * * * * * * * Visualizer event handlers * * * * * * * */

    CircuitSimulatorWidget.prototype.onNodeClick = function (/*id*/) {
        // This currently changes the active node to the given id and
        // this is overridden in the controller.
    };

    CircuitSimulatorWidget.prototype.onBackgroundDblClick = function () {
       // this._el.append('<div>Background was double-clicked!!</div>');
    };

    /* * * * * * * * Visualizer life cycle callbacks * * * * * * * */
    CircuitSimulatorWidget.prototype.destroy = function () {
    };

    CircuitSimulatorWidget.prototype.onActivate = function () {     
        // Load simulator in iframe
        this._el.html('<iframe id="simframe" src="/routers/DigitalJSRouter/get" style="width:100%;height:100%; padding: 0; margin: 0;"></iframe>');
    };

    CircuitSimulatorWidget.prototype.onDeactivate = function () {
        this._logger.debug('CircuitSimulatorWidget has been deactivated');
    };

    return CircuitSimulatorWidget;
});
