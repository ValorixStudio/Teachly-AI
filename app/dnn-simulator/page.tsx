"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Zap, Plus, Trash2, Upload, BarChart3, AlertCircle, CheckCircle, Info, Network, TrendingUp, Settings } from 'lucide-react';

interface DenseLayer {
  id: number;
  units: number;
  activation: 'relu' | 'sigmoid' | 'tanh' | 'linear' | 'softmax';
  dropout?: number;
}

interface Alert {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface LogEntry {
  time: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface DataSet {
  features: number[][];
  labels: number[];
  numFeatures: number;
  numSamples: number;
}

export default function DNNSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logPanelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme & UI State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<'charts' | 'logs' | 'analysis'>('charts');
  const [showWeightVisualization, setShowWeightVisualization] = useState(false);

  // Network Configuration
  const [layers, setLayers] = useState<DenseLayer[]>([]);
  const [layerUnits, setLayerUnits] = useState(128);
  const [activation, setActivation] = useState<DenseLayer['activation']>('relu');
  const [dropout, setDropout] = useState(0.2);
  const [inputFeatures, setInputFeatures] = useState(20);
  const [numClasses, setNumClasses] = useState(3);
  const [optimizerType, setOptimizerType] = useState<'adam' | 'sgd' | 'rmsprop'>('adam');

  // Training State
  const [training, setTraining] = useState(false);
  const [modelBuilt, setModelBuilt] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [loss, setLoss] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [maxEpochs, setMaxEpochs] = useState(100);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState(0.001);
  const [time, setTime] = useState(0);
  const [valAccuracy, setValAccuracy] = useState(0);

  // Data State
  const [dataset, setDataset] = useState<DataSet | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [trainTestSplit, setTrainTestSplit] = useState(0.8);

  // Analysis State
  const [layerActivations, setLayerActivations] = useState<number[]>([]);
  const [gradients, setGradients] = useState<number[]>([]);

  // Alerts & Logs
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const speedLabels = ['2x Slow', 'Normal', '2x Fast'];
  const speeds = [0.5, 1, 2];

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(saved);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Draw network architecture
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bgColor = isDarkMode ? '#1e293b' : '#f8fafc';
    const textColor = isDarkMode ? '#cbd5e1' : '#475569';
    const primaryColor = isDarkMode ? '#a78bfa' : '#7c3aed';

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(1, isDarkMode ? '#334155' : '#f1f5f9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const layerSpacing = canvas.width / (layers.length + 2);
    const startX = layerSpacing;

    const activationColors: { [key: string]: string } = {
      relu: primaryColor,
      sigmoid: isDarkMode ? '#f472b6' : '#ec4899',
      tanh: isDarkMode ? '#fbbf24' : '#f59e0b',
      linear: isDarkMode ? '#34d399' : '#10b981',
      softmax: isDarkMode ? '#60a5fa' : '#3b82f6'
    };

    // Draw nodes with connections
    const drawNodesForLayer = (x: number, count: number, label: string, color: string) => {
      const nodeRadius = 4;
      const spacing = Math.min(canvas.height / (count + 1), 30);
      
      for (let i = 0; i < Math.min(count, 8); i++) {
        const y = centerY - (count * spacing) / 2 + i * spacing;
        
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      if (count > 8) {
        ctx.fillStyle = textColor;
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`...${count - 8} more`, x, centerY + 40);
      }

      ctx.shadowColor = 'transparent';
      ctx.fillStyle = textColor;
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, centerY + 55);
    };

    // Input layer
    drawNodesForLayer(startX, inputFeatures, `Input\n(${inputFeatures})`, primaryColor);

    // Hidden layers
    let x = startX + layerSpacing;
    layers.forEach((layer, idx) => {
      drawNodesForLayer(x, layer.units, `${layer.activation}\n(${layer.units})`, activationColors[layer.activation]);
      x += layerSpacing;
    });

    // Output layer
    x += layerSpacing;
    const successColor = isDarkMode ? '#34d399' : '#10b981';
    drawNodesForLayer(x, numClasses, `Output\n(${numClasses})`, successColor);

    // Draw connections
    ctx.strokeStyle = isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(100, 116, 139, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    // Connections from input to first hidden layer
    if (layers.length > 0) {
      for (let i = 0; i < Math.min(inputFeatures, 4); i++) {
        for (let j = 0; j < Math.min(layers[0].units, 4); j++) {
          ctx.beginPath();
          ctx.moveTo(startX, centerY - (inputFeatures * 30) / 2 + i * 30);
          ctx.lineTo(startX + layerSpacing, centerY - (layers[0].units * 30) / 2 + j * 30);
          ctx.stroke();
        }
      }
    }

    ctx.setLineDash([]);
  }, [layers, inputFeatures, numClasses, isDarkMode]);

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time, message, type }]);
  };

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 3000);
  };

  const addLayer = () => {
    const newLayer: DenseLayer = {
      id: Date.now(),
      units: layerUnits,
      activation: activation,
      dropout: dropout
    };

    setLayers([...layers, newLayer]);
    showAlert('Dense layer added successfully! 🎉', 'success');
    addLog(`Added Dense layer with ${layerUnits} units (${activation} activation)`, 'success');
  };

  const deleteLayer = (id: number) => {
    setLayers(layers.filter(l => l.id !== id));
    showAlert('Layer removed! 👋', 'info');
    addLog('Dense layer removed from architecture', 'info');
  };

  const buildModel = () => {
    if (layers.length === 0) {
      showAlert('Please add at least one hidden layer!', 'error');
      return;
    }
    
    const totalParams = 
      (inputFeatures * layers[0].units) +
      layers.reduce((sum, layer, idx) => {
        const prevUnits = idx === 0 ? inputFeatures : layers[idx - 1].units;
        return sum + (prevUnits * layer.units) + layer.units;
      }, 0) +
      (layers[layers.length - 1].units * numClasses) + numClasses;

    addLog(`Building DNN with ${layers.length} hidden layers...`, 'success');
    addLog(`Total parameters: ${totalParams.toLocaleString()}`, 'info');
    showAlert('✨ Deep Neural Network built successfully!', 'success');
    setModelBuilt(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setDataset(data);
        setDataLoaded(true);
        setInputFeatures(data.numFeatures);
        showAlert('✅ Dataset loaded successfully!', 'success');
        addLog(`Loaded dataset with ${data.numSamples} samples and ${data.numFeatures} features`, 'success');
      } catch (err) {
        showAlert('❌ Failed to parse JSON file', 'error');
        addLog('File upload failed: Invalid JSON format', 'error');
      }
    };
    reader.readAsText(file);
  };

  const startTraining = () => {
    if (layers.length === 0) {
      showAlert('Build a model first!', 'error');
      return;
    }

    setTraining(true);
    addLog('🚀 DNN Training started...', 'success');
    addLog(`Using ${optimizerType.toUpperCase()} optimizer with LR=${learningRate}`, 'info');
    showAlert('Training initiated! Monitor the metrics in real-time.', 'info');

    let currentEpoch = 0;
    const speed = speeds[Math.min(Math.floor(animationSpeed * 2), 2)];

    const interval = setInterval(() => {
      currentEpoch++;
      const noise = (Math.random() - 0.5) * 0.1;
      const newAccuracy = Math.min(0.99, 0.40 + (currentEpoch / maxEpochs) * 0.55 + noise);
      const newValAccuracy = Math.min(0.96, 0.35 + (currentEpoch / maxEpochs) * 0.58 + noise - 0.02);
      const newLoss = Math.max(0.05, 3 - (currentEpoch / maxEpochs) * 2.8 + noise);

      setAccuracy(newAccuracy);
      setValAccuracy(newValAccuracy);
      setLoss(newLoss);
      setEpoch(currentEpoch);
      setTime(currentEpoch * 1.5);

      // Simulate layer activations
      const activations = layers.map(() => Math.random() * 100);
      setLayerActivations(activations);

      // Simulate gradients
      const grads = layers.map(() => Math.random() * 0.1);
      setGradients(grads);

      if (currentEpoch % 10 === 0 || currentEpoch === maxEpochs) {
        addLog(
          `Epoch ${currentEpoch}/${maxEpochs} - Loss: ${newLoss.toFixed(4)} - Train Acc: ${(newAccuracy * 100).toFixed(1)}% - Val Acc: ${(newValAccuracy * 100).toFixed(1)}%`,
          'info'
        );
      }

      if (currentEpoch >= maxEpochs) {
        clearInterval(interval);
        setTraining(false);
        addLog('🎉 DNN Training complete!', 'success');
        showAlert(
          `Training finished! Model achieved ${(newAccuracy * 100).toFixed(1)}% training and ${(newValAccuracy * 100).toFixed(1)}% validation accuracy!`,
          'success'
        );
      }
    }, (1000 / speed) / animationSpeed);

    return () => clearInterval(interval);
  };

  const handleSpeedChange = () => {
    const idx = speeds.indexOf(animationSpeed);
    setAnimationSpeed(speeds[(idx + 1) % speeds.length]);
  };

  const activationIcons: { [key: string]: string } = {
    relu: '⚡',
    sigmoid: '〰️',
    tanh: '∞',
    linear: '📈',
    softmax: '🎯'
  };

  useEffect(() => {
    if (logPanelRef.current) {
      logPanelRef.current.scrollTop = logPanelRef.current.scrollHeight;
    }
  }, [logs]);

  // Initial logs
  useEffect(() => {
    addLog('Welcome to DNN Simulator! 🧠', 'success');
    addLog('Configure your deep neural network architecture', 'info');
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark-mode bg-slate-900' : 'bg-white'}`}
         style={{
           background: isDarkMode
             ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
             : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
         }}>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className={`rounded-3xl shadow-xl overflow-hidden mb-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-10">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-black text-white mb-2">🧠 DNN Simulator</h1>
                <p className="text-white/90 text-sm">Deep Neural Network Builder with Real-time Training Analysis</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-xl backdrop-blur-md transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-white/20 hover:bg-white/30'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                  title="Toggle theme"
                >
                  {isDarkMode ? (
                    <Sun className="w-6 h-6 text-white" />
                  ) : (
                    <Moon className="w-6 h-6 text-white" />
                  )}
                </button>
                <button
                  onClick={handleSpeedChange}
                  className={`px-4 py-2 rounded-xl backdrop-blur-md bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-all duration-300 flex items-center gap-2`}
                >
                  <Zap className="w-4 h-4" />
                  Speed: {speedLabels[speeds.indexOf(animationSpeed)]}
                </button>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className={`px-8 py-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            {alerts.length === 0 ? (
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Build, train, and analyze deep neural networks with interactive visualization
              </p>
            ) : (
              <div className="space-y-2">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`flex items-center gap-3 p-3 rounded-lg animate-in slide-in-from-left duration-300 ${
                      alert.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-200' :
                      alert.type === 'error' ? 'bg-red-500/10 text-red-600 border border-red-200' :
                      'bg-blue-500/10 text-blue-600 border border-blue-200'
                    }`}
                  >
                    {alert.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                    {alert.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    {alert.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
                    <span className="text-sm">{alert.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* Network Configuration */}
            <div className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-slate-800 hover:border-violet-500' : 'bg-white hover:border-violet-500'} border-2 border-transparent`}>
              <h2 className="text-xl font-bold text-violet-600 mb-6 flex items-center gap-2">
                <Network className="w-6 h-6" />
                Network Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Input Features</label>
                  <input
                    type="number"
                    value={inputFeatures}
                    onChange={(e) => setInputFeatures(parseInt(e.target.value))}
                    min={1}
                    max={1000}
                    className={`w-full px-4 py-3 rounded-lg border-2 font-mono text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-violet-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-violet-500'
                    } focus:outline-none`}
                    placeholder="Number of input features"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Hidden Layer Units</label>
                  <input
                    type="number"
                    value={layerUnits}
                    onChange={(e) => setLayerUnits(parseInt(e.target.value))}
                    min={8}
                    max={1024}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-violet-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-violet-500'
                    } focus:outline-none`}
                    placeholder="Units per layer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Activation Function</label>
                  <select
                    value={activation}
                    onChange={(e) => setActivation(e.target.value as DenseLayer['activation'])}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-violet-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-violet-500'
                    } focus:outline-none`}
                  >
                    <option value="relu">⚡ ReLU</option>
                    <option value="sigmoid">〰️ Sigmoid</option>
                    <option value="tanh">∞ Tanh</option>
                    <option value="linear">📈 Linear</option>
                    <option value="softmax">🎯 Softmax</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Dropout</label>
                    <input
                      type="number"
                      value={dropout}
                      onChange={(e) => setDropout(parseFloat(e.target.value))}
                      min={0}
                      max={0.9}
                      step={0.1}
                      className={`w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-violet-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-violet-500'
                      } focus:outline-none`}
                      placeholder="0.0 - 0.9"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Output Classes</label>
                    <input
                      type="number"
                      value={numClasses}
                      onChange={(e) => setNumClasses(parseInt(e.target.value))}
                      min={2}
                      max={1000}
                      className={`w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-violet-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-violet-500'
                      } focus:outline-none`}
                      placeholder="Number of classes"
                    />
                  </div>
                </div>

                <button
                  onClick={addLayer}
                  className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Dense Layer
                </button>
              </div>
            </div>

            {/* Layer Stack */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-violet-500`}>
              <h2 className="text-xl font-bold text-violet-600 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Dense Layers ({layers.length})
              </h2>

              {layers.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`text-4xl mb-3 opacity-30`}>🏗️</div>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Add dense layers to build your network
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {layers.map((layer, i) => (
                    <div
                      key={layer.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 hover:border-violet-500'
                          : 'bg-slate-50 border-slate-200 hover:border-violet-500'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {activationIcons[layer.activation]} Dense Layer
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {layer.units} units • {layer.activation} • {(layer.dropout! * 100).toFixed(0)}% dropout
                        </p>
                      </div>
                      <button
                        onClick={() => deleteLayer(layer.id)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isDarkMode
                            ? 'hover:bg-red-500/20 text-red-400'
                            : 'hover:bg-red-500/20 text-red-600'
                        }`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t-2 border-slate-200 dark:border-slate-700 mt-6 pt-6">
                <button
                  onClick={buildModel}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {modelBuilt ? '✓ Model Ready' : '🏗️ Build Model'}
                </button>
              </div>
            </div>

            {/* Dataset Upload */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-violet-500`}>
              <h2 className="text-xl font-bold text-violet-600 mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Load Dataset
              </h2>

              <div>
                <label className="block px-6 py-8 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer text-center"
                       style={{
                         borderColor: isDarkMode ? '#a78bfa' : '#7c3aed',
                         backgroundColor: isDarkMode ? '#2e1065' : '#f5f3ff'
                       }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: isDarkMode ? '#a78bfa' : '#7c3aed' }} />
                  <p className={`font-semibold mb-1 ${isDarkMode ? 'text-violet-200' : 'text-violet-600'}`}>
                    Click to upload dataset
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-violet-300/70' : 'text-violet-600/70'}`}>
                    JSON files with features and labels
                  </p>
                </label>
                {dataLoaded && (
                  <p className={`text-xs mt-3 p-2 rounded ${isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}`}>
                    ✅ Dataset loaded: {dataset?.numSamples} samples, {dataset?.numFeatures} features
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Network Visualization */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-violet-500`}>
              <h2 className="text-xl font-bold text-violet-600 mb-6 flex items-center gap-2">
                <Network className="w-6 h-6" />
                Network Architecture
              </h2>
              <canvas
                ref={canvasRef}
                className={`w-full h-64 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
              />
            </div>

            {/* Training Dashboard */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-violet-500`}>
              <h2 className="text-xl font-bold text-violet-600 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Training Dashboard
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Train Acc', value: `${(accuracy * 100).toFixed(1)}%`, fill: accuracy * 100 },
                  { label: 'Val Acc', value: `${(valAccuracy * 100).toFixed(1)}%`, fill: valAccuracy * 100 },
                  { label: 'Loss', value: loss.toFixed(3), fill: Math.min((1 - loss / 3) * 100, 100) },
                  { label: 'Epochs', value: `${epoch}/${maxEpochs}`, fill: (epoch / maxEpochs) * 100 }
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 hover:border-violet-500'
                        : 'bg-slate-50 border-slate-200 hover:border-violet-500'
                    }`}
                  >
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold text-violet-600 mb-2">{metric.value}</p>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-500"
                        style={{ width: `${metric.fill}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-2`}>Batch Size</p>
                  <input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(parseInt(e.target.value))}
                    className={`w-full text-center font-mono text-sm px-2 py-1 rounded border-0 ${isDarkMode ? 'bg-slate-600 text-white' : 'bg-white text-slate-900'}`}
                  />
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-2`}>LR</p>
                  <input
                    type="number"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    step={0.0001}
                    className={`w-full text-center font-mono text-sm px-2 py-1 rounded border-0 ${isDarkMode ? 'bg-slate-600 text-white' : 'bg-white text-slate-900'}`}
                  />
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-2`}>Epochs</p>
                  <input
                    type="number"
                    value={maxEpochs}
                    onChange={(e) => setMaxEpochs(parseInt(e.target.value))}
                    className={`w-full text-center font-mono text-sm px-2 py-1 rounded border-0 ${isDarkMode ? 'bg-slate-600 text-white' : 'bg-white text-slate-900'}`}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Optimizer</label>
                <select
                  value={optimizerType}
                  onChange={(e) => setOptimizerType(e.target.value as any)}
                  className={`w-full px-4 py-2 rounded-lg border-2 text-sm ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="adam">Adam</option>
                  <option value="sgd">SGD</option>
                  <option value="rmsprop">RMSprop</option>
                </select>
              </div>

              <button
                onClick={startTraining}
                disabled={training || !modelBuilt}
                className={`w-full px-6 py-3 font-bold rounded-lg transition-all duration-300 transform flex items-center justify-center gap-2 ${
                  training || !modelBuilt
                    ? 'bg-slate-400 text-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {training ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Training...
                  </>
                ) : (
                  <>▶ Start Training</>
                )}
              </button>
            </div>

            {/* Tabs Section */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-violet-500`}>
              <div className="flex gap-2 mb-6 border-b-2 border-slate-200 dark:border-slate-700 overflow-x-auto">
                {['charts', 'logs', 'analysis'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-violet-600 text-violet-600'
                        : isDarkMode
                        ? 'border-transparent text-slate-400 hover:text-slate-200'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'charts' && '📈 Charts'}
                    {tab === 'logs' && '📝 Logs'}
                    {tab === 'analysis' && '🔍 Analysis'}
                  </button>
                ))}
              </div>

              {activeTab === 'charts' && (
                <div className="text-center py-8 text-slate-500">
                  <p>Training curves and performance charts would display here (Chart.js integration)</p>
                </div>
              )}

              {activeTab === 'logs' && (
                <div
                  ref={logPanelRef}
                  className={`max-h-64 overflow-y-auto p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} font-mono text-xs space-y-1`}
                >
                  {logs.length === 0 ? (
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Training logs will appear here...</p>
                  ) : (
                    logs.map((log, idx) => (
                      <div
                        key={idx}
                        className={
                          log.type === 'success' ? 'text-green-500' :
                          log.type === 'error' ? 'text-red-500' :
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        }
                      >
                        <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>[{log.time}]</span> {log.message}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <div className="space-y-4">
                    <div>
                      <p className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        Layer Activations
                      </p>
                      {layerActivations.length === 0 ? (
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Start training to see activation patterns
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {layerActivations.map((act, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                  Layer {idx + 1}
                                </span>
                                <span className={`text-xs font-mono ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                                  {act.toFixed(1)}%
                                </span>
                              </div>
                              <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}>
                                <div
                                  className="h-full bg-gradient-to-r from-violet-600 to-purple-600"
                                  style={{ width: `${act}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-600 pt-4">
                      <p className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        Gradient Magnitude
                      </p>
                      {gradients.length === 0 ? (
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Training metrics will appear here
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {gradients.map((grad, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                  Grad {idx + 1}
                                </span>
                                <span className={`text-xs font-mono ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                  {grad.toFixed(4)}
                                </span>
                              </div>
                              <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}>
                                <div
                                  className="h-full bg-gradient-to-r from-green-600 to-emerald-600"
                                  style={{ width: `${Math.min(grad * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
