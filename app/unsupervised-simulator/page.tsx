"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Zap, Plus, Trash2, Upload, BarChart3, AlertCircle, CheckCircle, Info, Layers, TrendingUp, Settings, Play, Pause, RotateCcw } from 'lucide-react';

interface UnsupervisedModel {
  id: number;
  type: 'kmeans' | 'dbscan' | 'hierarchical' | 'pca' | 'tsne' | 'autoencoder';
  params: {
    clusters?: number;
    eps?: number;
    minSamples?: number;
    components?: number;
    learningRate?: number;
    epochs?: number;
  };
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

interface DataPoint {
  x: number;
  y: number;
  cluster?: number;
  anomaly?: boolean;
}

interface DataSet {
  points: DataPoint[];
  originalDim: number;
  numSamples: number;
}

export default function UnsupervisedSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plotCanvasRef = useRef<HTMLCanvasElement>(null);
  const logPanelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme & UI State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<'visualization' | 'logs' | 'metrics'>('visualization');

  // Model Configuration
  const [modelType, setModelType] = useState<UnsupervisedModel['type']>('kmeans');
  const [models, setModels] = useState<UnsupervisedModel[]>([]);
  const [numClusters, setNumClusters] = useState(3);
  const [eps, setEps] = useState(0.5);
  const [minSamples, setMinSamples] = useState(5);
  const [components, setComponents] = useState(2);
  const [learningRate, setLearningRate] = useState(0.001);
  const [epochs, setEpochs] = useState(100);

  // Training State
  const [training, setTraining] = useState(false);
  const [modelBuilt, setModelBuilt] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [maxEpochs, setMaxEpochs] = useState(100);
  const [loss, setLoss] = useState(0);
  const [silhouetteScore, setSilhouetteScore] = useState(0);
  const [anomalyScore, setAnomalyScore] = useState(0);
  const [time, setTime] = useState(0);

  // Data State
  const [dataset, setDataset] = useState<DataSet | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [generatedDataType, setGeneratedDataType] = useState<'normal' | 'blobs' | 'moons' | 'circles'>('blobs');
  const [numSamples, setNumSamples] = useState(300);

  // Visualization State
  const [showCentroids, setShowCentroids] = useState(true);
  const [showDensity, setShowDensity] = useState(false);
  const [colorScheme, setColorScheme] = useState<'clusters' | 'distance' | 'anomaly'>('clusters');

  // Alerts & Logs
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Metrics
  const [clusterSizes, setClusterSizes] = useState<number[]>([]);
  const [inertia, setInertia] = useState(0);
  const [purity, setPurity] = useState(0);

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

  // Draw model comparison
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bgColor = isDarkMode ? '#1e293b' : '#f8fafc';
    const textColor = isDarkMode ? '#cbd5e1' : '#475569';
    const primaryColor = isDarkMode ? '#60a5fa' : '#3b82f6';

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(1, isDarkMode ? '#334155' : '#f1f5f9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const spacing = canvas.width / (models.length + 2);
    const startX = spacing;

    const modelColors: { [key: string]: string } = {
      kmeans: primaryColor,
      dbscan: isDarkMode ? '#f472b6' : '#ec4899',
      hierarchical: isDarkMode ? '#fbbf24' : '#f59e0b',
      pca: isDarkMode ? '#34d399' : '#10b981',
      tsne: isDarkMode ? '#a78bfa' : '#8b5cf6',
      autoencoder: isDarkMode ? '#60a5fa' : '#0ea5e9'
    };

    // Draw algorithm nodes
    const drawNode = (x: number, y: number, size: number, color: string, label: string) => {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.fillStyle = textColor;
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y + 35);
    };

    // Input
    drawNode(startX, centerY, 14, primaryColor, 'Data');

    // Models
    let x = startX + spacing;
    models.forEach((model) => {
      drawNode(x, centerY, 12, modelColors[model.type], model.type.toUpperCase());
      x += spacing;
    });

    // Output
    x += spacing;
    const successColor = isDarkMode ? '#34d399' : '#10b981';
    drawNode(x, centerY, 14, successColor, 'Clusters');
  }, [models, isDarkMode]);

  // Draw scatter plot
  useEffect(() => {
    if (!plotCanvasRef.current || !dataset) return;

    const canvas = plotCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bgColor = isDarkMode ? '#1e293b' : '#f8fafc';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (canvas.width / 10) * i;
      const y = (canvas.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw data points
    const margin = 40;
    const width = canvas.width - margin * 2;
    const height = canvas.height - margin * 2;

    const colors = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

    dataset.points.forEach((point, idx) => {
      const x = margin + (point.x * width) / 100;
      const y = margin + ((100 - point.y) * height) / 100;

      // Draw point
      if (colorScheme === 'clusters' && point.cluster !== undefined) {
        ctx.fillStyle = colors[point.cluster % colors.length];
      } else if (colorScheme === 'anomaly' && point.anomaly) {
        ctx.fillStyle = '#ef4444';
      } else {
        ctx.fillStyle = isDarkMode ? '#94a3b8' : '#cbd5e1';
      }

      ctx.beginPath();
      ctx.arc(x, y, point.anomaly ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();

      // Anomaly marker
      if (point.anomaly) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw centroids
    if (showCentroids && dataset.points.length > 0) {
      const uniqueClusters = [...new Set(dataset.points.map(p => p.cluster).filter(c => c !== undefined))];
      
      uniqueClusters.forEach((cluster) => {
        const clusterPoints = dataset.points.filter(p => p.cluster === cluster);
        if (clusterPoints.length === 0) return;

        const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
        const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;

        const cx = margin + (avgX * width) / 100;
        const cy = margin + ((100 - avgY) * height) / 100;

        ctx.fillStyle = colors[cluster as number % colors.length];
        ctx.strokeStyle = isDarkMode ? '#1e293b' : '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy);
        ctx.lineTo(cx + 8, cy);
        ctx.moveTo(cx, cy - 8);
        ctx.lineTo(cx, cy + 8);
        ctx.stroke();

        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = colors[cluster as number % colors.length];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    // Draw axes labels
    ctx.fillStyle = isDarkMode ? '#cbd5e1' : '#475569';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Feature 1 →', canvas.width / 2, canvas.height - 10);
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Feature 2 →', 0, 0);
    ctx.restore();
  }, [dataset, isDarkMode, showCentroids, colorScheme]);

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

  const generateData = () => {
    const points: DataPoint[] = [];
    
    if (generatedDataType === 'blobs') {
      const clusterCenters = Array.from({ length: numClusters }, (_, i) => ({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      }));

      for (let i = 0; i < numSamples; i++) {
        const center = clusterCenters[i % clusterCenters.length];
        points.push({
          x: center.x + (Math.random() - 0.5) * 20,
          y: center.y + (Math.random() - 0.5) * 20,
          cluster: i % clusterCenters.length
        });
      }
    } else if (generatedDataType === 'moons') {
      for (let i = 0; i < numSamples / 2; i++) {
        const t = (i / (numSamples / 2)) * Math.PI;
        const noise = (Math.random() - 0.5) * 10;
        points.push({
          x: Math.cos(t) * 30 + 30 + noise,
          y: Math.sin(t) * 30 + 30 + noise,
          cluster: 0
        });
      }
      for (let i = 0; i < numSamples / 2; i++) {
        const t = (i / (numSamples / 2)) * Math.PI;
        const noise = (Math.random() - 0.5) * 10;
        points.push({
          x: Math.cos(Math.PI - t) * 30 + 70 + noise,
          y: Math.sin(t) * 30 - 30 + noise,
          cluster: 1
        });
      }
    } else if (generatedDataType === 'circles') {
      for (let i = 0; i < numSamples / 2; i++) {
        const angle = (i / (numSamples / 2)) * Math.PI * 2;
        const noise = (Math.random() - 0.5) * 8;
        points.push({
          x: Math.cos(angle) * 30 + 50 + noise,
          y: Math.sin(angle) * 30 + 50 + noise,
          cluster: 0
        });
      }
      for (let i = 0; i < numSamples / 2; i++) {
        const angle = (i / (numSamples / 2)) * Math.PI * 2;
        const noise = (Math.random() - 0.5) * 5;
        points.push({
          x: Math.cos(angle) * 15 + 50 + noise,
          y: Math.sin(angle) * 15 + 50 + noise,
          cluster: 1
        });
      }
    } else {
      // Normal random
      for (let i = 0; i < numSamples; i++) {
        points.push({
          x: Math.random() * 100,
          y: Math.random() * 100
        });
      }
    }

    // Add some anomalies
    const anomalyCount = Math.floor(numSamples * 0.05);
    for (let i = 0; i < anomalyCount; i++) {
      if (points[i]) {
        points[i].anomaly = true;
      }
    }

    const newDataset: DataSet = {
      points,
      originalDim: 2,
      numSamples
    };

    setDataset(newDataset);
    setDataLoaded(true);
    showAlert(`✅ Generated ${numSamples} data points (${generatedDataType})!`, 'success');
    addLog(`Generated ${generatedDataType} dataset with ${numSamples} samples`, 'success');
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
        showAlert('✅ Dataset loaded successfully!', 'success');
        addLog(`Loaded dataset with ${data.numSamples} samples`, 'success');
      } catch (err) {
        showAlert('❌ Failed to parse JSON file', 'error');
        addLog('File upload failed: Invalid JSON format', 'error');
      }
    };
    reader.readAsText(file);
  };

  const addModel = () => {
    const newModel: UnsupervisedModel = {
      id: Date.now(),
      type: modelType,
      params: {
        clusters: numClusters,
        eps: eps,
        minSamples: minSamples,
        components: components,
        learningRate: learningRate,
        epochs: epochs
      }
    };

    setModels([...models, newModel]);
    showAlert(`${modelType.toUpperCase()} model added! 🎯`, 'success');
    addLog(`Added ${modelType} model to pipeline`, 'success');
  };

  const deleteModel = (id: number) => {
    setModels(models.filter(m => m.id !== id));
    showAlert('Model removed! 👋', 'info');
  };

  const trainModel = () => {
    if (models.length === 0) {
      showAlert('Please add at least one model!', 'error');
      return;
    }
    if (!dataLoaded) {
      showAlert('Please load or generate data first!', 'error');
      return;
    }

    setTraining(true);
    setModelBuilt(true);
    addLog('🚀 Training unsupervised model...', 'success');
    showAlert('Training started! Analyzing your data...', 'info');

    let currentEpoch = 0;
    const speed = speeds[Math.min(Math.floor(animationSpeed * 2), 2)];

    const interval = setInterval(() => {
      currentEpoch++;
      
      const newLoss = Math.max(0.1, 3 - (currentEpoch / maxEpochs) * 2.8 + (Math.random() - 0.5) * 0.3);
      const newSilhouette = Math.min(1, 0.3 + (currentEpoch / maxEpochs) * 0.65 + (Math.random() - 0.5) * 0.1);
      const newAnomaly = Math.max(0, 0.1 - (currentEpoch / maxEpochs) * 0.08 + (Math.random() - 0.5) * 0.02);

      setLoss(newLoss);
      setSilhouetteScore(newSilhouette);
      setAnomalyScore(newAnomaly);
      setEpoch(currentEpoch);
      setTime(currentEpoch * 0.8);

      // Simulate cluster updates
      const newClusterSizes = Array.from({ length: numClusters }, () =>
        Math.floor(Math.random() * (numSamples / numClusters) * 1.5)
      );
      setClusterSizes(newClusterSizes);

      const newInertia = Math.max(0, 1000 - (currentEpoch / maxEpochs) * 800 + (Math.random() - 0.5) * 200);
      setInertia(newInertia);

      if (currentEpoch % 10 === 0 || currentEpoch === maxEpochs) {
        addLog(
          `Iteration ${currentEpoch}/${maxEpochs} - Loss: ${newLoss.toFixed(3)} - Silhouette: ${newSilhouette.toFixed(3)}`,
          'info'
        );
      }

      if (currentEpoch >= maxEpochs) {
        clearInterval(interval);
        setTraining(false);
        addLog('🎉 Training complete! Model is ready for analysis.', 'success');
        showAlert(
          `Training finished! Silhouette Score: ${newSilhouette.toFixed(3)}`,
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

  const modelIcons: { [key: string]: string } = {
    kmeans: '🎯',
    dbscan: '🔍',
    hierarchical: '🌳',
    pca: '📉',
    tsne: '📊',
    autoencoder: '🧠'
  };

  const modelDescriptions: { [key: string]: string } = {
    kmeans: 'Partition data into k clusters',
    dbscan: 'Density-based spatial clustering',
    hierarchical: 'Build dendrograms of clusters',
    pca: 'Reduce dimensions linearly',
    tsne: 'Non-linear dimensionality reduction',
    autoencoder: 'Learn compressed representations'
  };

  useEffect(() => {
    if (logPanelRef.current) {
      logPanelRef.current.scrollTop = logPanelRef.current.scrollHeight;
    }
  }, [logs]);

  // Initial logs
  useEffect(() => {
    addLog('Welcome to Unsupervised Learning Simulator! 🧠', 'success');
    addLog('Generate data and configure models to begin', 'info');
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark-mode bg-slate-900' : 'bg-white'}`}
         style={{
           background: isDarkMode
             ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
             : 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)'
         }}>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className={`rounded-3xl shadow-xl overflow-hidden mb-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-10">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-black text-white mb-2">🔍 Unsupervised Learning Simulator</h1>
                <p className="text-white/90 text-sm">Clustering, Dimensionality Reduction & Anomaly Detection</p>
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
                Explore clustering and dimensionality reduction algorithms with interactive visualization
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            {/* Data Generation */}
            <div className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-slate-800 hover:border-blue-500' : 'bg-white hover:border-blue-500'} border-2 border-transparent`}>
              <h2 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Dataset Generation
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Data Type</label>
                  <select
                    value={generatedDataType}
                    onChange={(e) => setGeneratedDataType(e.target.value as any)}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    } focus:outline-none`}
                  >
                    <option value="blobs">☁️ Blobs</option>
                    <option value="moons">🌙 Moons</option>
                    <option value="circles">⭕ Circles</option>
                    <option value="normal">📊 Normal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Number of Samples</label>
                  <input
                    type="number"
                    value={numSamples}
                    onChange={(e) => setNumSamples(parseInt(e.target.value))}
                    min={50}
                    max={5000}
                    className={`w-full px-4 py-3 rounded-lg border-2 font-mono text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                </div>

                <button
                  onClick={generateData}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Generate Data
                </button>

                <div className={`text-xs p-3 rounded-lg ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {dataLoaded ? `✅ ${numSamples} samples loaded` : 'Generate or upload data to start'}
                </div>
              </div>
            </div>

            {/* Model Configuration */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-blue-500`}>
              <h2 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Model Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Algorithm</label>
                  <select
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value as any)}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    } focus:outline-none`}
                  >
                    <option value="kmeans">🎯 K-Means</option>
                    <option value="dbscan">🔍 DBSCAN</option>
                    <option value="hierarchical">🌳 Hierarchical</option>
                    <option value="pca">📉 PCA</option>
                    <option value="tsne">📊 t-SNE</option>
                    <option value="autoencoder">🧠 Autoencoder</option>
                  </select>
                </div>

                {(modelType === 'kmeans' || modelType === 'hierarchical') && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Number of Clusters</label>
                    <input
                      type="number"
                      value={numClusters}
                      onChange={(e) => setNumClusters(parseInt(e.target.value))}
                      min={2}
                      max={10}
                      className={`w-full px-4 py-3 rounded-lg border-2 text-sm ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      } focus:outline-none`}
                    />
                  </div>
                )}

                {modelType === 'dbscan' && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Epsilon (Radius)</label>
                      <input
                        type="number"
                        value={eps}
                        onChange={(e) => setEps(parseFloat(e.target.value))}
                        min={0.1}
                        max={2}
                        step={0.1}
                        className={`w-full px-4 py-3 rounded-lg border-2 text-sm ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        } focus:outline-none`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Min Samples</label>
                      <input
                        type="number"
                        value={minSamples}
                        onChange={(e) => setMinSamples(parseInt(e.target.value))}
                        min={1}
                        max={20}
                        className={`w-full px-4 py-3 rounded-lg border-2 text-sm ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        } focus:outline-none`}
                      />
                    </div>
                  </>
                )}

                {(modelType === 'pca' || modelType === 'tsne') && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Components</label>
                    <input
                      type="number"
                      value={components}
                      onChange={(e) => setComponents(parseInt(e.target.value))}
                      min={2}
                      max={10}
                      className={`w-full px-4 py-3 rounded-lg border-2 text-sm ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      } focus:outline-none`}
                    />
                  </div>
                )}

                {modelType === 'autoencoder' && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Learning Rate</label>
                      <input
                        type="number"
                        value={learningRate}
                        onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                        min={0.0001}
                        max={0.1}
                        step={0.0001}
                        className={`w-full px-4 py-3 rounded-lg border-2 text-sm ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        } focus:outline-none`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Epochs</label>
                      <input
                        type="number"
                        value={epochs}
                        onChange={(e) => setEpochs(parseInt(e.target.value))}
                        min={10}
                        max={500}
                        className={`w-full px-4 py-3 rounded-lg border-2 text-sm ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        } focus:outline-none`}
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={addModel}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Model
                </button>
              </div>
            </div>

            {/* Models List */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-blue-500`}>
              <h2 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                <Layers className="w-6 h-6" />
                Models ({models.length})
              </h2>

              {models.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`text-4xl mb-3 opacity-30`}>🤖</div>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Add unsupervised models to your pipeline
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {models.map((model, i) => (
                    <div
                      key={model.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 hover:border-blue-500'
                          : 'bg-slate-50 border-slate-200 hover:border-blue-500'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {modelIcons[model.type]} {model.type.toUpperCase()}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {modelDescriptions[model.type]}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteModel(model.id)}
                        className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
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

              <button
                onClick={trainModel}
                disabled={training || models.length === 0 || !dataLoaded}
                className={`w-full mt-6 px-6 py-3 font-bold rounded-lg transition-all duration-300 transform flex items-center justify-center gap-2 ${
                  training || models.length === 0 || !dataLoaded
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
          </div>

          {/* Middle & Right - Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pipeline Visualization */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-blue-500`}>
              <h2 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                <Layers className="w-6 h-6" />
                Pipeline Architecture
              </h2>
              <canvas
                ref={canvasRef}
                className={`w-full h-40 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
              />
            </div>

            {/* Data Visualization */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-blue-500`}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Data Visualization
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={colorScheme}
                    onChange={(e) => setColorScheme(e.target.value as any)}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="clusters">Clusters</option>
                    <option value="distance">Distance</option>
                    <option value="anomaly">Anomalies</option>
                  </select>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCentroids}
                      onChange={(e) => setShowCentroids(e.target.checked)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Centroids</span>
                  </label>
                </div>
              </div>
              <canvas
                ref={plotCanvasRef}
                className={`w-full h-80 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
              />
            </div>

            {/* Metrics Dashboard */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-blue-500`}>
              <h2 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Performance Metrics
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Loss', value: loss.toFixed(3), fill: Math.min((1 - loss / 3) * 100, 100) },
                  { label: 'Silhouette', value: silhouetteScore.toFixed(3), fill: silhouetteScore * 100 },
                  { label: 'Anomalies', value: (anomalyScore * 100).toFixed(1) + '%', fill: anomalyScore * 100 },
                  { label: 'Iteration', value: `${epoch}/${maxEpochs}`, fill: (epoch / maxEpochs) * 100 }
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 hover:border-blue-500'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-500'
                    }`}
                  >
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold text-blue-600 mb-2">{metric.value}</p>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500"
                        style={{ width: `${metric.fill}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Cluster Info */}
              {clusterSizes.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    Cluster Distribution
                  </p>
                  <div className="space-y-2">
                    {clusterSizes.map((size, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className={`text-xs font-mono font-bold w-12 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          C{idx}
                        </span>
                        <div className={`h-2 rounded-full overflow-hidden flex-1 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}>
                          <div
                            className={`h-full bg-gradient-to-r ${idx % 2 === 0 ? 'from-blue-600 to-cyan-600' : 'from-cyan-600 to-blue-600'}`}
                            style={{ width: `${Math.min((size / numSamples) * 100 * 2, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          {size}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Logs */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-blue-500`}>
              <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                📝 Training Logs
              </h2>
              <div
                ref={logPanelRef}
                className={`max-h-48 overflow-y-auto p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} font-mono text-xs space-y-1`}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
