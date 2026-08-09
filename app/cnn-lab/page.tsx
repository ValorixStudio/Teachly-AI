"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Zap, Plus, Trash2, RotateCcw, ChevronDown, AlertCircle, CheckCircle, Info, Grid3x3, Package, Zap as ZapIcon, Droplet, Settings } from 'lucide-react';

interface Layer {
  id: number;
  type: 'conv' | 'pool' | 'dense' | 'dropout' | 'batch';
  filters?: number;
  kernel?: number;
  poolSize?: number;
  units?: number;
  rate?: number;
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

export default function CNNSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [layerType, setLayerType] = useState<Layer['type']>('conv');
  const [inputH, setInputH] = useState(28);
  const [inputW, setInputW] = useState(28);
  const [numClasses, setNumClasses] = useState(10);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState(0.001);
  const [maxEpochs, setMaxEpochs] = useState(50);
  const [accuracy, setAccuracy] = useState(0);
  const [loss, setLoss] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [time, setTime] = useState(0);
  const [training, setTraining] = useState(false);
  const [activeTab, setActiveTab] = useState<'charts' | 'logs' | 'predictions'>('charts');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [modelBuilt, setModelBuilt] = useState(false);
  const [layerConfig, setLayerConfig] = useState({ filters: 32, kernel: 3, poolSize: 2, units: 128, dropoutRate: 0.5 });
  const logPanelRef = useRef<HTMLDivElement>(null);
  const speedLabels = ['2x Slow', 'Normal', '2x Fast'];
  const speeds = [0.5, 1, 2];

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(saved);
  }, []);

  // Update theme in DOM
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Draw architecture canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bgColor = isDarkMode ? '#1e293b' : '#f8fafc';
    const textColor = isDarkMode ? '#cbd5e1' : '#475569';
    const primaryColor = isDarkMode ? '#818cf8' : '#6366f1';

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(1, isDarkMode ? '#334155' : '#f1f5f9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const spacing = 140;
    let x = 60;

    const drawNode = (x: number, y: number, size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = 'transparent';
    };

    const drawLabel = (x: number, y: number, text: string) => {
      ctx.fillStyle = textColor;
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, x, y + 25);
    };

    // Input layer
    drawNode(x, centerY, 12, primaryColor);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Input', x, centerY + 35);

    // Draw layers
    const layerColors: { [key: string]: string } = {
      conv: primaryColor,
      pool: isDarkMode ? '#f472b6' : '#ec4899',
      dense: isDarkMode ? '#34d399' : '#10b981',
      dropout: isDarkMode ? '#fbbf24' : '#f59e0b',
      batch: isDarkMode ? '#a5b4fc' : '#818cf8'
    };

    layers.forEach((layer) => {
      x += spacing;
      const size = layer.type === 'dense' ? 10 : 8;
      drawNode(x, centerY, size, layerColors[layer.type]);
      
      const labels: { [key: string]: string } = {
        conv: `Conv-${layer.filters}`,
        pool: `Pool-${layer.poolSize}`,
        dense: `Dense-${layer.units}`,
        dropout: `Drop-${((layer.rate || 0.5) * 100 | 0)}%`,
        batch: 'BatchNorm'
      };
      drawLabel(x, centerY, labels[layer.type]);
    });

    // Output layer
    x += spacing;
    const successColor = isDarkMode ? '#34d399' : '#10b981';
    drawNode(x, centerY, 12, successColor);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Output', x, centerY + 35);
  }, [layers, isDarkMode]);

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
    const newLayer: Layer = {
      id: Date.now(),
      type: layerType
    };

    switch (layerType) {
      case 'conv':
        newLayer.filters = layerConfig.filters;
        newLayer.kernel = layerConfig.kernel;
        break;
      case 'pool':
        newLayer.poolSize = layerConfig.poolSize;
        break;
      case 'dense':
        newLayer.units = layerConfig.units;
        break;
      case 'dropout':
        newLayer.rate = layerConfig.dropoutRate;
        break;
    }

    setLayers([...layers, newLayer]);
    showAlert('Layer added successfully! 🎉', 'success');
    createParticles(100, 100);
  };

  const deleteLayer = (id: number) => {
    setLayers(layers.filter(l => l.id !== id));
    showAlert('Layer removed! 👋', 'info');
  };

  const buildModel = () => {
    if (layers.length === 0) {
      showAlert('Please add at least one layer!', 'error');
      return;
    }
    addLog(`Building model with ${layers.length} layers...`, 'success');
    showAlert('✨ Model built successfully!', 'success');
    setModelBuilt(true);
    createParticles(150, 150);
  };

  const startTraining = () => {
    if (layers.length === 0) {
      showAlert('Build a model first!', 'error');
      return;
    }

    setTraining(true);
    addLog('🚀 Training started...', 'success');
    showAlert('Training initiated! Watch the metrics update in real-time.', 'info');

    let currentEpoch = 0;
    const speed = speeds[Math.min(Math.floor(animationSpeed * 2), 2)];

    const interval = setInterval(() => {
      currentEpoch++;
      const noise = (Math.random() - 0.5) * 0.15;
      const newAccuracy = Math.min(0.99, 0.3 + (currentEpoch / maxEpochs) * 0.65 + noise);
      const newLoss = Math.max(0.05, 2 - (currentEpoch / maxEpochs) * 1.8 + noise);

      setAccuracy(newAccuracy);
      setLoss(newLoss);
      setEpoch(currentEpoch);
      setTime(currentEpoch * 0.8);

      if (currentEpoch % 5 === 0 || currentEpoch === maxEpochs) {
        addLog(
          `Epoch ${currentEpoch}/${maxEpochs} - Loss: ${newLoss.toFixed(4)}, Acc: ${(newAccuracy * 100).toFixed(1)}%`,
          'info'
        );
      }

      if (currentEpoch >= maxEpochs) {
        clearInterval(interval);
        setTraining(false);
        addLog('🎉 Training complete!', 'success');
        showAlert(
          `Training finished! Your model achieved ${(newAccuracy * 100).toFixed(1)}% accuracy!`,
          'success'
        );
      }
    }, (1000 / speed) / animationSpeed);

    return () => clearInterval(interval);
  };

  const createParticles = (x: number, y: number) => {
    // Particle effect implementation would go here
    // For now, we'll keep it simple
  };

  const handleSpeedChange = () => {
    setAnimationSpeed(prev => {
      const idx = speeds.indexOf(prev);
      return speeds[(idx + 1) % speeds.length];
    });
  };

  const layerIcons: { [key: string]: string } = {
    conv: '🔷',
    pool: '📦',
    dense: '⚡',
    dropout: '💧',
    batch: '⚙️'
  };

  const layerDescriptions: { [key: string]: (layer: Layer) => string } = {
    conv: (layer) => `${layer.filters} filters, ${layer.kernel}×${layer.kernel} kernel`,
    pool: (layer) => `${layer.poolSize}×${layer.poolSize} pooling`,
    dense: (layer) => `${layer.units} units`,
    dropout: (layer) => `${((layer.rate || 0.5) * 100).toFixed(0)}% dropout rate`,
    batch: () => 'Batch normalization'
  };

  useEffect(() => {
    if (logPanelRef.current) {
      logPanelRef.current.scrollTop = logPanelRef.current.scrollHeight;
    }
  }, [logs]);

  // Initial logs
  useEffect(() => {
    addLog('Welcome to Neural Canvas! 🧠', 'success');
    addLog('Start by configuring your input size and adding layers', 'info');
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark-mode bg-slate-900' : 'bg-white'}`} 
         style={{
           background: isDarkMode 
             ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
             : 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
         }}>
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className={`rounded-3xl shadow-xl overflow-hidden mb-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 px-8 py-10">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-black text-white mb-2">🚀 Neural Canvas</h1>
                <p className="text-white/90 text-sm">Interactive CNN Architecture Designer with Live Visualization</p>
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
                Design, train, and visualize your CNN architecture in real-time
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
            {/* Input Configuration */}
            <div className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-slate-800 hover:border-indigo-500' : 'bg-white hover:border-indigo-500'} border-2 border-transparent`}>
              <h2 className="text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
                <Grid3x3 className="w-6 h-6" />
                Input Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Image Dimensions</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={inputH}
                      onChange={(e) => setInputH(parseInt(e.target.value))}
                      min={8}
                      max={224}
                      className={`px-4 py-3 rounded-lg border-2 font-mono text-sm transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                      } focus:outline-none`}
                      placeholder="Height"
                    />
                    <input
                      type="number"
                      value={inputW}
                      onChange={(e) => setInputW(parseInt(e.target.value))}
                      min={8}
                      max={224}
                      className={`px-4 py-3 rounded-lg border-2 font-mono text-sm transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                      } focus:outline-none`}
                      placeholder="Width"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Add Layer</label>
                  <select
                    value={layerType}
                    onChange={(e) => setLayerType(e.target.value as Layer['type'])}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                    } focus:outline-none`}
                  >
                    <option value="conv">🔷 Convolutional</option>
                    <option value="pool">📦 Pooling</option>
                    <option value="dense">⚡ Dense</option>
                    <option value="dropout">💧 Dropout</option>
                    <option value="batch">⚙️ Batch Normalization</option>
                  </select>
                </div>

                {layerType === 'conv' && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={layerConfig.filters}
                      onChange={(e) => setLayerConfig({...layerConfig, filters: parseInt(e.target.value)})}
                      className={`px-4 py-2 rounded-lg border-2 text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                      placeholder="Filters"
                    />
                    <input
                      type="number"
                      value={layerConfig.kernel}
                      onChange={(e) => setLayerConfig({...layerConfig, kernel: parseInt(e.target.value)})}
                      className={`px-4 py-2 rounded-lg border-2 text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                      placeholder="Kernel"
                    />
                  </div>
                )}
                {layerType === 'pool' && (
                  <input
                    type="number"
                    value={layerConfig.poolSize}
                    onChange={(e) => setLayerConfig({...layerConfig, poolSize: parseInt(e.target.value)})}
                    className={`w-full px-4 py-2 rounded-lg border-2 text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                    placeholder="Pool Size"
                  />
                )}
                {layerType === 'dense' && (
                  <input
                    type="number"
                    value={layerConfig.units}
                    onChange={(e) => setLayerConfig({...layerConfig, units: parseInt(e.target.value)})}
                    className={`w-full px-4 py-2 rounded-lg border-2 text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                    placeholder="Units"
                  />
                )}
                {layerType === 'dropout' && (
                  <input
                    type="number"
                    value={layerConfig.dropoutRate}
                    onChange={(e) => setLayerConfig({...layerConfig, dropoutRate: parseFloat(e.target.value)})}
                    min={0}
                    max={1}
                    step={0.1}
                    className={`w-full px-4 py-2 rounded-lg border-2 text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                    placeholder="Dropout Rate"
                  />
                )}

                <button
                  onClick={addLayer}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Layer
                </button>
              </div>
            </div>

            {/* Layer Stack */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-indigo-500`}>
              <h2 className="text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Layer Stack
              </h2>

              {layers.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`text-4xl mb-3 opacity-30`}>🧩</div>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Start adding layers to build your network
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {layers.map((layer, i) => (
                    <div
                      key={layer.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 hover:border-indigo-500'
                          : 'bg-slate-50 border-slate-200 hover:border-indigo-500'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {layerIcons[layer.type]} {layer.type.toUpperCase()}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {layerDescriptions[layer.type](layer)}
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Output Classes</label>
                <input
                  type="number"
                  value={numClasses}
                  onChange={(e) => setNumClasses(parseInt(e.target.value))}
                  min={2}
                  max={1000}
                  className={`w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                  } focus:outline-none`}
                />

                <button
                  onClick={buildModel}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {modelBuilt ? '✓ Model Ready' : '🏗️ Build Model'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Architecture Visualization */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-indigo-500`}>
              <h2 className="text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
                <Grid3x3 className="w-6 h-6" />
                Network Architecture
              </h2>
              <canvas
                ref={canvasRef}
                className={`w-full h-64 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
              />
            </div>

            {/* Training Dashboard */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-indigo-500`}>
              <h2 className="text-xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Training Dashboard
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Accuracy', value: `${(accuracy * 100).toFixed(1)}%`, fill: accuracy * 100 },
                  { label: 'Loss', value: loss.toFixed(3), fill: Math.min((1 - loss) * 100, 100) },
                  { label: 'Epochs', value: `${epoch}/${maxEpochs}`, fill: (epoch / maxEpochs) * 100 },
                  { label: 'Time', value: time.toFixed(1) + 's', fill: (epoch / maxEpochs) * 100 }
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 hover:border-indigo-500'
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-500'
                    }`}
                  >
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold text-indigo-600 mb-2">{metric.value}</p>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-pink-600 transition-all duration-500"
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
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-2`}>Max Epochs</p>
                  <input
                    type="number"
                    value={maxEpochs}
                    onChange={(e) => setMaxEpochs(parseInt(e.target.value))}
                    className={`w-full text-center font-mono text-sm px-2 py-1 rounded border-0 ${isDarkMode ? 'bg-slate-600 text-white' : 'bg-white text-slate-900'}`}
                  />
                </div>
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
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-indigo-500`}>
              <div className="flex gap-2 mb-6 border-b-2 border-slate-200 dark:border-slate-700">
                {['charts', 'logs', 'predictions'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all duration-300 ${
                      activeTab === tab
                        ? 'border-indigo-600 text-indigo-600'
                        : isDarkMode
                        ? 'border-transparent text-slate-400 hover:text-slate-200'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'charts' && '📈 Charts'}
                    {tab === 'logs' && '📝 Logs'}
                    {tab === 'predictions' && '🎯 Predictions'}
                  </button>
                ))}
              </div>

              {activeTab === 'charts' && (
                <div className="text-center py-8 text-slate-500">
                  <p>Chart visualization would go here (using Chart.js)</p>
                </div>
              )}

              {activeTab === 'logs' && (
                <div
                  ref={logPanelRef}
                  className={`max-h-64 overflow-y-auto p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} font-mono text-xs space-y-1`}
                >
                  {logs.length === 0 ? (
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Logs will appear here...</p>
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

              {activeTab === 'predictions' && (
                <div className="text-center py-8 text-slate-500">
                  <p>Predictions visualization would go here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}