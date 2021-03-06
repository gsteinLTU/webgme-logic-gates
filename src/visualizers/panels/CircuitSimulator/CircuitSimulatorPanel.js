/*globals define, _, WebGMEGlobal*/
/**
 * Generated by VisualizerGenerator 1.7.0 from webgme on Thu Nov 29 2018 16:05:07 GMT-0600 (Central Standard Time).
 */

define([
    'js/PanelBase/PanelBaseWithHeader',
    'js/PanelManager/IActivePanel',
    'widgets/CircuitSimulator/CircuitSimulatorWidget',
    './CircuitSimulatorControl'
], function (
    PanelBaseWithHeader,
    IActivePanel,
    CircuitSimulatorWidget,
    CircuitSimulatorControl
) {
    'use strict';

    var CircuitSimulatorPanel;

    CircuitSimulatorPanel = function (layoutManager, params) {
        var options = {};
        //set properties from options
        options[PanelBaseWithHeader.OPTIONS.LOGGER_INSTANCE_NAME] = 'CircuitSimulatorPanel';
        options[PanelBaseWithHeader.OPTIONS.FLOATING_TITLE] = true;

        //call parent's constructor
        PanelBaseWithHeader.apply(this, [options, layoutManager]);

        this._client = params.client;

        //initialize UI
        this._initialize();

        this.logger.debug('ctor finished');
    };

    //inherit from PanelBaseWithHeader
    _.extend(CircuitSimulatorPanel.prototype, PanelBaseWithHeader.prototype);
    _.extend(CircuitSimulatorPanel.prototype, IActivePanel.prototype);

    CircuitSimulatorPanel.prototype._initialize = function () {
        var self = this;

        //set Widget title
        this.setTitle('');

        
        this.widget = new CircuitSimulatorWidget(this.logger, this.$el);
        
        // Send info about node to widget
        try {
            this._client.runBrowserPlugin(
                "DigitalJSCodeGenerator",
                this._client.getCurrentPluginContext("DigitalJSCodeGenerator"),
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    
                    this.widget.setData(result.jsonString);
            });
        } catch (error) {
            console.log(error);
        }

        this.widget.setTitle = function (title) {
            self.setTitle(title);
        };

        this.control = new CircuitSimulatorControl({
            logger: this.logger,
            client: this._client,
            widget: this.widget
        });

        this.onActivate();
    };

    /* OVERRIDE FROM WIDGET-WITH-HEADER */
    /* METHOD CALLED WHEN THE WIDGET'S READ-ONLY PROPERTY CHANGES */
    CircuitSimulatorPanel.prototype.onReadOnlyChanged = function (isReadOnly) {
        //apply parent's onReadOnlyChanged
        PanelBaseWithHeader.prototype.onReadOnlyChanged.call(this, isReadOnly);

    };

    CircuitSimulatorPanel.prototype.onResize = function (width, height) {
        this.logger.debug('onResize --> width: ' + width + ', height: ' + height);
        this.widget.onWidgetContainerResize(width, height);
    };

    /* * * * * * * * Visualizer life cycle callbacks * * * * * * * */
    CircuitSimulatorPanel.prototype.destroy = function () {
        this.control.destroy();
        this.widget.destroy();

        PanelBaseWithHeader.prototype.destroy.call(this);
        WebGMEGlobal.KeyboardManager.setListener(undefined);
        WebGMEGlobal.Toolbar.refresh();
    };

    CircuitSimulatorPanel.prototype.onActivate = function () {
        this.widget.onActivate();
        this.control.onActivate();
        WebGMEGlobal.KeyboardManager.setListener(this.widget);
        WebGMEGlobal.Toolbar.refresh();
    };

    CircuitSimulatorPanel.prototype.onDeactivate = function () {
        this.widget.onDeactivate();
        this.control.onDeactivate();
        WebGMEGlobal.KeyboardManager.setListener(undefined);
        WebGMEGlobal.Toolbar.refresh();
    };

    return CircuitSimulatorPanel;
});
