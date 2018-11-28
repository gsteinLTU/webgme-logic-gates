/*globals define*/
/*eslint-env node, browser*/

/**
 * Generated by PluginGenerator 2.20.5 from webgme on Sun Nov 25 2018 13:11:56 GMT-0600 (Central Standard Time).
 * A plugin that inherits from the PluginBase. To see source code documentation about available
 * properties and methods visit %host%/docs/source/PluginBase.html.
 */

define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase'
], function (
    PluginConfig,
    pluginMetadata,
    PluginBase) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);

    /**
     * Initializes a new instance of SystemVerilogCodeGenerator.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin SystemVerilogCodeGenerator.
     * @constructor
     */
    function SystemVerilogCodeGenerator() {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    }

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructure etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    SystemVerilogCodeGenerator.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    SystemVerilogCodeGenerator.prototype = Object.create(PluginBase.prototype);
    SystemVerilogCodeGenerator.prototype.constructor = SystemVerilogCodeGenerator;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(Error|null, plugin.PluginResult)} callback - the result callback
     */
    SystemVerilogCodeGenerator.prototype.main = function (callback) {
        var activeNode = this.activeNode,
            node,
            core = this.core,
            logger = this.logger,
            blobClient = this.blobClient,
            artifact,
            self = this,
            inputNodes = [],
            outputNodes = [],
            gateNodes = [],
            gateNodesConnections = {},
            connectionNodes = [],
            inputsVerilogString,
            outputsVerilogString,
            logicVerilogString,
            gatesVerilogString,
            verilogString;

        /** getCircuitComponents fills inputNodes, outputNodes and gateNodes arrays
         *
         * @param activeNode
         * @param nodes
         */
        function getCircuitComponents(activeNode, nodes){
            var childrenPaths = core.getChildrenPaths(activeNode);
            for(var i = 0; i < childrenPaths.length; i += 1){
                node = nodes[childrenPaths[i]];
                logger.debug('[', childrenPaths[i], '] has name', core.getAttribute(node, 'name'));
                if(self.isMetaTypeOf(node, self.META.Input)){
                    logger.debug("input");
                    inputNodes.push(node);
                }else if(self.isMetaTypeOf(node, self.META.Output)){
                    logger.debug("output");
                    outputNodes.push(node);
                }else if(self.isMetaTypeOf(node, self.META.LogicGate)){
                    logger.debug("gate");
                    gateNodes.push(node);
                    var dict = {};
                    dict["inputs"] = [];
                    dict["outputs"] = [];
                    gateNodesConnections[core.getRelid(node)] = dict;
                }else if(self.isMetaTypeOf(node, self.META.Connection)){
                    logger.debug("connection");
                    connectionNodes.push(node);
                }
            }
        }

        function getGateConnections(nodes){
            logger.debug("number", connectionNodes.length);
            for(var i = 0; i < connectionNodes.length; i += 1){
                var sourceNode = nodes[core.getPointerPath(connectionNodes[i], 'src')];
                var destinationNode = nodes[core.getPointerPath(connectionNodes[i], 'dst')];
                logger.debug("source has name ", core.getAttribute(sourceNode, 'name'));
                logger.debug("destination has name ",core.getAttribute(destinationNode, 'name'));
                logger.debug("SOURCE META Type", core.getAttribute(core.getMetaType(sourceNode), 'name'));
                logger.debug("DEST META Type", core.getAttribute(core.getMetaType(destinationNode), 'name'));
                var sourceParent = core.getParent(sourceNode);
                var destParent = core.getParent(destinationNode);
                if(self.isMetaTypeOf(sourceParent, self.META.LogicGate)){
                    logger.debug("is a logic gate!!");
                    var sourceParentRelid = core.getRelid(sourceParent);
                    var connected = gateNodesConnections[sourceParentRelid];
                    if(self.isMetaTypeOf(destinationNode, self.META.OutPort)){
                        var inputs = connected["inputs"];
                        inputs.push(destParent);
                        connected["inputs"] = inputs;
                    }else{
                        var outputs = connected["outputs"];
                        outputs.push(destParent);
                        connected["outputs"] = outputs;
                    }
                    gateNodesConnections[sourceParentRelid] = connected;
                }
                if(self.isMetaTypeOf(destParent, self.META.LogicGate)){
                    logger.debug("is a logic gate!!");
                    var destinationParentRelid = core.getRelid(destParent);
                    var connected = gateNodesConnections[destinationParentRelid];
                    if(self.isMetaTypeOf(sourceNode, self.META.OutPort)){
                        var inputs = connected["inputs"];
                        inputs.push(sourceParent);
                        connected["inputs"] = inputs;
                    }else{
                        var outputs = connected["outputs"];
                        outputs.push(sourceParent);
                        connected["outputs"] = outputs;
                    }
                    gateNodesConnections[destinationParentRelid] = connected;

                }

            }
        }
        /** getInputsVerilogString generates input string for system verilog code
         *
         */
        function getInputsVerilogString(){
            inputsVerilogString = 'input ';
            for(var i = 0; i < inputNodes.length; i += 1){
                inputsVerilogString = inputsVerilogString + core.getRelid(inputNodes[i]) + ', ';
            }
        }

        /** getOutputsVerilogString generates output string for system verilog code
         *
         */
        function getOutputsVerilogString(){
            outputsVerilogString = 'output ';
            for(var i = 0; i < outputNodes.length; i += 1){
                outputsVerilogString = outputsVerilogString + core.getRelid(outputNodes[i]) + ', ';
            }
        }

        function getGatesVerilogString(){
            gatesVerilogString = "";
            for(var i = 0; i < gateNodes.length; i += 1){
                var gate = gateNodes[i];
                var relid = core.getRelid(gate);
                logger.debug("relid", relid);
                var vals = gateNodesConnections[relid];
                var inputs = vals["inputs"];
                var outputs = vals["outputs"];
                logger.debug("inputs", inputs);

                var inputString = core.getRelid(inputs[0]);
                var outputString = core.getRelid(outputs[0]);

                for(var k = 1; k < inputs.length; k += 1){
                    inputString = inputString + ", " +  core.getRelid(inputs[k]);
                }
                for(var k = 1; k < outputs.length; k += 1){
                     outputString = outputString + ", " + core.getRelid(outputs[k]);
                }

                var gateName = core.getAttribute(gate, 'gatename');
                 gatesVerilogString = gatesVerilogString + gateName + " " + relid
                     + "(" + outputString + ", " + inputString + "); \n";
            }

        }

        this.loadNodeMap(activeNode)
            .then(function (nodes) {

                //get all the components
                getCircuitComponents(activeNode,nodes);
                getInputsVerilogString();
                getOutputsVerilogString();
                getGateConnections(nodes);
                getGatesVerilogString();

                verilogString = 'module '+ core.getAttribute(activeNode, 'name') + '(\n' +
                    inputsVerilogString + '\n' +  outputsVerilogString + '\n' + ');' + '\n' +
                    gatesVerilogString + 'endmodule';
                //
                artifact = self.blobClient.createArtifact('MyArtifact');
                return artifact.addFiles({
                        'verilog.txt': verilogString,
                        'circuit.sv': verilogString
                });
                self.result.setSuccess(true);
                callback(null, self.result);

            }).then(function (fileMetadataHashes) {
                // We can link to each individual file
                self.logger.info('Added files to blob-storage', fileMetadataHashes);
                self.result.addArtifact(fileMetadataHashes[0]);
                self.result.addArtifact(fileMetadataHashes[1]);
                // and/or save the full artifact and link to it (will be a zip file).
                return artifact.save();
            }).then(function (artifactHash) {
                self.result.addArtifact(artifactHash);
                self.logger.info('Added complex artifact to blob-storage', artifactHash);
                self.result.setSuccess(true);
                callback(null, self.result);
            }).catch(function (err) {
                logger.error(err.stack);
                // Result success is false at invocation.
                callback(err, self.result);
            });

    };

    return SystemVerilogCodeGenerator;
});
