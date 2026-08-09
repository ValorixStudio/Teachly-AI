"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Zap, Plus, Trash2, Upload, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Info, Layers, Activity, TrendingUp } from 'lucide-react';

interface RNNLayer {
  id: number;
  type: 'lstm' | 'gru' | 'simple_rnn' | 'dense';
  units: number;
  returnSequences?: boolean;
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

interface SequenceData {
  sequences: number[][];
  labels: number[];
  timeSteps: number;
}

export default function RNNSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logPanelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme & UI State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<'charts' | 'logs' | 'explorer'>('charts');
  const [showExplorer, setShowExplorer] = useState(false);

  // Network Configuration
  const [layers, setLayers] = useState<RNNLayer[]>([]);
  const [layerType, setLayerType] = useState<RNNLayer['type']>('lstm');
  const [layerUnits, setLayerUnits] = useState(64);
  const [returnSequences, setReturnSequences] = useState(false);
  const [dropout, setDropout] = useState(0.2);
  const [timeSteps, setTimeSteps] = useState(10);
  const [featureSize, setFeatureSize] = useState(32);
  const [numClasses, setNumClasses] = useState(2);

  // Training State
  const [training, setTraining] = useState(false);
  const [modelBuilt, setModelBuilt] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [loss, setLoss] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [maxEpochs, setMaxEpochs] = useState(50);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState(0.001);
  const [time, setTime] = useState(0);

  // Data State
  const [sequenceData, setSequenceData] = useState<SequenceData | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentSample, setCurrentSample] = useState(0);
  const [explorerStep, setExplorerStep] = useState(0);

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

  // Draw architecture
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
    const spacing = 160;
    let x = 80;

    const drawNode = (x: number, y: number, size: number, color: string, label: string) => {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      // Connection visualization
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(x, y, size + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const drawLabel = (x: number, y: number, text: string) => {
      ctx.fillStyle = textColor;
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, x, y + 30);
    };

    // Input
    drawNode(x, centerY, 12, primaryColor, 'Input');
    ctx.fillStyle = textColor;
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Input', x, centerY + 35);

    // Layers
    const layerColors: { [key: string]: string } = {
      lstm: primaryColor,
      gru: isDarkMode ? '#f472b6' : '#ec4899',
      simple_rnn: isDarkMode ? '#fbbf24' : '#f59e0b',
      dense: isDarkMode ? '#34d399' : '#10b981'
    };

    layers.forEach((layer) => {
      x += spacing;
      const size = layer.type === 'dense' ? 10 : 9;
      drawNode(x, centerY, size, layerColors[layer.type], layer.type);
      
      const label = `${layer.type.replace('_', ' ')}\n${layer.units} units`;
      ctx.fillStyle = textColor;
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      const lines = label.split('\n');
      lines.forEach((line, idx) => {
        ctx.fillText(line, x, centerY + 20 + (idx * 12));
      });
    });

    // Output
    x += spacing;
    const successColor = isDarkMode ? '#34d399' : '#10b981';
    drawNode(x, centerY, 12, successColor, 'Output');
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
    const newLayer: RNNLayer = {
      id: Date.now(),
      type: layerType,
      units: layerUnits,
      returnSequences: returnSequences && layers.length < 2,
      dropout: dropout
    };

    setLayers([...layers, newLayer]);
    showAlert('Layer added successfully! 🎉', 'success');
    addLog(`Added ${layerType} layer with ${layerUnits} units`, 'success');
  };

  const deleteLayer = (id: number) => {
    setLayers(layers.filter(l => l.id !== id));
    showAlert('Layer removed! 👋', 'info');
    addLog('Layer removed from architecture', 'info');
  };

  const buildModel = () => {
    if (layers.length === 0) {
      showAlert('Please add at least one layer!', 'error');
      return;
    }
    addLog(`Building RNN model with ${layers.length} layers...`, 'success');
    showAlert('✨ RNN Model built successfully!', 'success');
    setModelBuilt(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setSequenceData(data);
        setDataLoaded(true);
        showAlert('✅ Sequence data loaded successfully!', 'success');
        addLog('Loaded sequence data with ' + data.sequences.length + ' samples', 'success');
      } catch (err) {
        showAlert('❌ Failed to parse JSON file', 'error');
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
    addLog('🚀 RNN Training started...', 'success');
    showAlert('Training initiated! Watch the metrics update in real-time.', 'info');

    let currentEpoch = 0;
    const speed = speeds[Math.min(Math.floor(animationSpeed * 2), 2)];

    const interval = setInterval(() => {
      currentEpoch++;
      const noise = (Math.random() - 0.5) * 0.12;
      const newAccuracy = Math.min(0.98, 0.25 + (currentEpoch / maxEpochs) * 0.70 + noise);
      const newLoss = Math.max(0.08, 2.5 - (currentEpoch / maxEpochs) * 2.2 + noise);

      setAccuracy(newAccuracy);
      setLoss(newLoss);
      setEpoch(currentEpoch);
      setTime(currentEpoch * 1.2);

      if (currentEpoch % 5 === 0 || currentEpoch === maxEpochs) {
        addLog(
          `Epoch ${currentEpoch}/${maxEpochs} - Loss: ${newLoss.toFixed(4)}, Acc: ${(newAccuracy * 100).toFixed(1)}%`,
          'info'
        );
      }

      if (currentEpoch >= maxEpochs) {
        clearInterval(interval);
        setTraining(false);
        addLog('🎉 RNN Training complete!', 'success');
        showAlert(
          `Training finished! Model achieved ${(newAccuracy * 100).toFixed(1)}% accuracy!`,
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

  const layerTypeIcons: { [key: string]: string } = {
    lstm: '🔄',
    gru: '🔁',
    simple_rnn: '↩️',
    dense: '⚡'
  };

  useEffect(() => {
    if (logPanelRef.current) {
      logPanelRef.current.scrollTop = logPanelRef.current.scrollHeight;
    }
  }, [logs]);

  // Initial logs
  useEffect(() => {
    addLog('Welcome to RNN Simulator! 🧠', 'success');
    addLog('Build your RNN architecture by adding layers', 'info');
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark-mode bg-slate-900' : 'bg-white'}`}
         style={{
           background: isDarkMode
             ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
             : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
         }}>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className={`rounded-3xl shadow-xl overflow-hidden mb-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-10">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-black text-white mb-2">🔁 RNN Simulator</h1>
                <p className="text-white/90 text-sm">Build, visualize, and train Recurrent Neural Networks on sequence data</p>
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
                Design, train, and visualize RNNs for sequence modeling tasks
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
            {/* Configuration */}
            <div className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-slate-800 hover:border-purple-500' : 'bg-white hover:border-purple-500'} border-2 border-transparent`}>
              <h2 className="text-xl font-bold text-purple-600 mb-6 flex items-center gap-2">
                <Layers className="w-6 h-6" />
                Layer Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Sequence Parameters</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={timeSteps}
                      onChange={(e) => setTimeSteps(parseInt(e.target.value))}
                      min={5}
                      max={100}
                      className={`px-4 py-3 rounded-lg border-2 font-mono text-sm transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                      } focus:outline-none`}
                      placeholder="Time Steps"
                    />
                    <input
                      type="number"
                      value={featureSize}
                      onChange={(e) => setFeatureSize(parseInt(e.target.value))}
                      min={1}
                      max={512}
                      className={`px-4 py-3 rounded-lg border-2 font-mono text-sm transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                      } focus:outline-none`}
                      placeholder="Features"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Layer Type</label>
                  <select
                    value={layerType}
                    onChange={(e) => setLayerType(e.target.value as RNNLayer['type'])}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                    } focus:outline-none`}
                  >
                    <option value="lstm">🔄 LSTM</option>
                    <option value="gru">🔁 GRU</option>
                    <option value="simple_rnn">↩️ Simple RNN</option>
                    <option value="dense">⚡ Dense</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={layerUnits}
                    onChange={(e) => setLayerUnits(parseInt(e.target.value))}
                    min={8}
                    max={512}
                    className={`px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                    } focus:outline-none`}
                    placeholder="Units"
                  />
                  <input
                    type="number"
                    value={dropout}
                    onChange={(e) => setDropout(parseFloat(e.target.value))}
                    min={0}
                    max={0.9}
                    step={0.1}
                    className={`px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                    } focus:outline-none`}
                    placeholder="Dropout"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={returnSequences}
                    onChange={(e) => setReturnSequences(e.target.checked)}
                    className="w-5 h-5 accent-purple-600"
                  />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Return Sequences
                  </span>
                </label>

                <button
                  onClick={addLayer}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Layer
                </button>
              </div>
            </div>

            {/* Layer Stack */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-purple-500`}>
              <h2 className="text-xl font-bold text-purple-600 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Layer Stack ({layers.length})
              </h2>

              {layers.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`text-4xl mb-3 opacity-30`}>🧩</div>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Start adding RNN layers to build your network
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {layers.map((layer, i) => (
                    <div
                      key={layer.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 hover:border-purple-500'
                          : 'bg-slate-50 border-slate-200 hover:border-purple-500'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {layerTypeIcons[layer.type]} {layer.type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {layer.units} units {layer.returnSequences ? '• Sequences' : ''} {layer.dropout ? `• ${(layer.dropout * 100).toFixed(0)}% Dropout` : ''}
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
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                  } focus:outline-none mb-4`}
                />

                <button
                  onClick={buildModel}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {modelBuilt ? '✓ Model Ready' : '🏗️ Build Model'}
                </button>
              </div>
            </div>

            {/* Data Upload */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-purple-500`}>
              <h2 className="text-xl font-bold text-purple-600 mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Upload Sequence Data
              </h2>

              <div>
                <label className="block px-6 py-8 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer text-center"
                       style={{
                         borderColor: isDarkMode ? '#a78bfa' : '#667eea',
                         backgroundColor: isDarkMode ? '#4c1d95' : '#f0f0ff'
                       }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: isDarkMode ? '#a78bfa' : '#667eea' }} />
                  <p className={`font-semibold mb-1 ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                    Click to upload or drag & drop
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-purple-300/70' : 'text-purple-600/70'}`}>
                    JSON files with sequence data
                  </p>
                </label>
                {dataLoaded && (
                  <p className={`text-xs mt-3 p-2 rounded ${isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}`}>
                    ✅ Sequence data loaded successfully
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Architecture Visualization */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-purple-500`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-purple-600 flex items-center gap-2">
                  <Layers className="w-6 h-6" />
                  Network Architecture
                </h2>
                <button
                  onClick={() => setShowExplorer(!showExplorer)}
                  className={`px-3 py-1 text-xs font-bold rounded transition-all duration-300 ${
                    showExplorer
                      ? 'bg-purple-600 text-white'
                      : isDarkMode
                      ? 'bg-slate-700 text-purple-300 hover:bg-slate-600'
                      : 'bg-slate-200 text-purple-600 hover:bg-slate-300'
                  }`}
                >
                  🔬 Explore
                </button>
              </div>
              <canvas
                ref={canvasRef}
                className={`w-full h-64 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
              />
            </div>

            {/* Training Dashboard */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-purple-500`}>
              <h2 className="text-xl font-bold text-purple-600 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Training Dashboard
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Accuracy', value: `${(accuracy * 100).toFixed(1)}%`, fill: accuracy * 100 },
                  { label: 'Loss', value: loss.toFixed(3), fill: Math.min((1 - loss / 2.5) * 100, 100) },
                  { label: 'Epochs', value: `${epoch}/${maxEpochs}`, fill: (epoch / maxEpochs) * 100 },
                  { label: 'Time', value: time.toFixed(1) + 's', fill: (epoch / maxEpochs) * 100 }
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 hover:border-purple-500'
                        : 'bg-slate-50 border-slate-200 hover:border-purple-500'
                    }`}
                  >
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold text-purple-600 mb-2">{metric.value}</p>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
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
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-purple-500`}>
              <div className="flex gap-2 mb-6 border-b-2 border-slate-200 dark:border-slate-700">
                {['charts', 'logs', 'explorer'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all duration-300 ${
                      activeTab === tab
                        ? 'border-purple-600 text-purple-600'
                        : isDarkMode
                        ? 'border-transparent text-slate-400 hover:text-slate-200'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'charts' && '📈 Charts'}
                    {tab === 'logs' && '📝 Logs'}
                    {tab === 'explorer' && '🔬 Explorer'}
                  </button>
                ))}
              </div>

              {activeTab === 'charts' && (
                <div className="text-center py-8 text-slate-500">
                  <p>Training charts visualization would go here (using Chart.js)</p>
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

              {activeTab === 'explorer' && (
                <div className={`p-6 rounded-lg text-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  {dataLoaded ? (
                    <div className="space-y-4">
                      <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        Sequence Explorer
                      </p>
                      <div className="flex items-center justify-between">
                        <button className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-200 hover:bg-slate-300'}`}>
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          Sample {currentSample + 1} / {sequenceData?.sequences.length || 0}
                        </p>
                        <button className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-200 hover:bg-slate-300'}`}>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
                        <p className={`text-xs font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          Time steps: {timeSteps} | Features: {featureSize}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Upload sequence data to explore
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}