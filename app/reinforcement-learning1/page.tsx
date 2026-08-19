"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Zap, Plus, Trash2, Play, Pause, RotateCcw, BarChart3, AlertCircle, CheckCircle, Info, Layers, TrendingUp, Settings } from 'lucide-react';

interface RLEnvironment {
  id: number;
  type: 'cartpole' | 'gridworld' | 'mountaincar' | 'acrobot' | 'lunarlander';
  name: string;
  description: string;
}

interface RLAgent {
  id: number;
  type: 'qlearning' | 'sarsa' | 'ppo' | 'ddqn' | 'a3c';
  name: string;
  learningRate: number;
  epsilon: number;
  discountFactor: number;
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

interface GameState {
  position: number;
  angle: number;
  velocity: number;
  score: number;
  done: boolean;
}

export default function ReinforcementLearningSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);
  const logPanelRef = useRef<HTMLDivElement>(null);

  // Theme & UI State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<'training' | 'logs' | 'qvalues'>('training');
  const [isRunning, setIsRunning] = useState(false);

  // Environment & Agent Configuration
  const [selectedEnvironment, setSelectedEnvironment] = useState<RLEnvironment['type']>('cartpole');
  const [selectedAgent, setSelectedAgent] = useState<RLAgent['type']>('qlearning');
  const [learningRate, setLearningRate] = useState(0.1);
  const [epsilon, setEpsilon] = useState(0.1);
  const [discountFactor, setDiscountFactor] = useState(0.99);
  const [batchSize, setBatchSize] = useState(32);
  const [updateFrequency, setUpdateFrequency] = useState(4);

  // Training State
  const [episode, setEpisode] = useState(0);
  const [maxEpisodes, setMaxEpisodes] = useState(500);
  const [stepCount, setStepCount] = useState(0);
  const [cumulativeReward, setCumulativeReward] = useState(0);
  const [averageReward, setAverageReward] = useState(0);
  const [loss, setLoss] = useState(0);
  const [epsilonValue, setEpsilonValue] = useState(epsilon);

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    position: 50,
    angle: 0,
    velocity: 0,
    score: 0,
    done: false
  });

  // Training History
  const [rewardHistory, setRewardHistory] = useState<number[]>([]);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [episodeSteps, setEpisodeSteps] = useState<number[]>([]);

  // Environments & Agents
  const [environments, setEnvironments] = useState<RLEnvironment[]>([]);
  const [agents, setAgents] = useState<RLAgent[]>([]);

  // Analysis State
  const [qValues, setQValues] = useState<number[]>([]);
  const [policyVisuals, setPolicyVisuals] = useState<number[]>([]);
  const [exploreExploitRatio, setExploreExploitRatio] = useState(0);

  // Alerts & Logs
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const speedLabels = ['2x Slow', 'Normal', '2x Fast'];
  const speeds = [0.5, 1, 2];

  const environmentDetails: { [key: string]: RLEnvironment } = {
    cartpole: {
      id: 1,
      type: 'cartpole',
      name: 'CartPole',
      description: 'Balance a pole on a moving cart'
    },
    gridworld: {
      id: 2,
      type: 'gridworld',
      name: 'GridWorld',
      description: 'Navigate to goal in a grid'
    },
    mountaincar: {
      id: 3,
      type: 'mountaincar',
      name: 'Mountain Car',
      description: 'Drive car up the mountain'
    },
    acrobot: {
      id: 4,
      type: 'acrobot',
      name: 'Acrobot',
      description: 'Swing a double pendulum'
    },
    lunarlander: {
      id: 5,
      type: 'lunarlander',
      name: 'Lunar Lander',
      description: 'Land spaceship safely'
    }
  };

  const agentDetails: { [key: string]: RLAgent } = {
    qlearning: {
      id: 1,
      type: 'qlearning',
      name: 'Q-Learning',
      learningRate: 0.1,
      epsilon: 0.1,
      discountFactor: 0.99
    },
    sarsa: {
      id: 2,
      type: 'sarsa',
      name: 'SARSA',
      learningRate: 0.1,
      epsilon: 0.1,
      discountFactor: 0.99
    },
    ppo: {
      id: 3,
      type: 'ppo',
      name: 'PPO',
      learningRate: 0.001,
      epsilon: 0.2,
      discountFactor: 0.99
    },
    ddqn: {
      id: 4,
      type: 'ddqn',
      name: 'Double DQN',
      learningRate: 0.0001,
      epsilon: 0.1,
      discountFactor: 0.99
    },
    a3c: {
      id: 5,
      type: 'a3c',
      name: 'A3C',
      learningRate: 0.0005,
      epsilon: 0.05,
      discountFactor: 0.99
    }
  };

  // Initialize theme
  useEffect(() => {
    setIsDarkMode(localStorage.getItem('theme') === 'dark');
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Draw agent/environment comparison
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bgColor = isDarkMode ? '#1e293b' : '#f8fafc';
    const textColor = isDarkMode ? '#cbd5e1' : '#475569';
    const primaryColor = isDarkMode ? '#fbbf24' : '#f59e0b';

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(1, isDarkMode ? '#334155' : '#f1f5f9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const nodeRadius = 8;
    const spacing = canvas.width / 5;

    const drawNode = (x: number, y: number, size: number, color: string, label: string, emoji: string) => {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, x, y);

      ctx.fillStyle = textColor;
      ctx.font = 'bold 11px Arial';
      ctx.fillText(label, x, y + 30);
    };

    // Agent -> Environment -> State -> Reward
    drawNode(spacing * 0.5, centerY, 12, isDarkMode ? '#a78bfa' : '#8b5cf6', 'Agent', '🤖');
    drawNode(spacing * 1.5, centerY, 12, primaryColor, 'Environment', '🌍');
    drawNode(spacing * 2.5, centerY, 12, isDarkMode ? '#34d399' : '#10b981', 'State', '📊');
    drawNode(spacing * 3.5, centerY, 12, isDarkMode ? '#60a5fa' : '#3b82f6', 'Reward', '🏆');

    // Draw arrows
    ctx.strokeStyle = isDarkMode ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    const drawArrow = (fromX: number, toX: number, y: number) => {
      ctx.beginPath();
      ctx.moveTo(fromX, y);
      ctx.lineTo(toX, y);
      ctx.stroke();
      // Arrow head
      const headlen = 8;
      const angle = 0;
      ctx.fillStyle = isDarkMode ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.3)';
      ctx.beginPath();
      ctx.moveTo(toX, y);
      ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), y - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), y - headlen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    };

    drawArrow(spacing * 0.5 + 12, spacing * 1.5 - 12, centerY);
    drawArrow(spacing * 1.5 + 12, spacing * 2.5 - 12, centerY);
    drawArrow(spacing * 2.5 + 12, spacing * 3.5 - 12, centerY);

    ctx.setLineDash([]);
  }, [isDarkMode]);

  // Draw game environment
  useEffect(() => {
    if (!gameCanvasRef.current) return;

    const canvas = gameCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bgColor = isDarkMode ? '#1e293b' : '#f8fafc';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid background
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

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 50;

    if (selectedEnvironment === 'cartpole') {
      // Draw ground
      ctx.strokeStyle = isDarkMode ? '#cbd5e1' : '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, centerY + 60);
      ctx.lineTo(canvas.width, centerY + 60);
      ctx.stroke();

      // Draw cart
      const cartWidth = 40;
      const cartHeight = 20;
      const cartX = centerX + (gameState.position - 50) * scale;
      ctx.fillStyle = isDarkMode ? '#f59e0b' : '#f97316';
      ctx.fillRect(cartX - cartWidth / 2, centerY + 40, cartWidth, cartHeight);

      // Draw wheels
      ctx.fillStyle = isDarkMode ? '#1e293b' : '#000000';
      ctx.beginPath();
      ctx.arc(cartX - 12, centerY + 60, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cartX + 12, centerY + 60, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw pole
      const poleLength = 40;
      const poleEndX = cartX + Math.sin(gameState.angle) * poleLength;
      const poleEndY = centerY + 40 - Math.cos(gameState.angle) * poleLength;

      ctx.strokeStyle = isDarkMode ? '#60a5fa' : '#3b82f6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cartX, centerY + 40);
      ctx.lineTo(poleEndX, poleEndY);
      ctx.stroke();

      // Draw pole end
      ctx.fillStyle = isDarkMode ? '#60a5fa' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(poleEndX, poleEndY, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedEnvironment === 'gridworld') {
      // Draw grid world
      const gridSize = 5;
      const cellSize = canvas.width / (gridSize + 2);

      ctx.fillStyle = isDarkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)';
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = cellSize * (i + 1);
          const y = cellSize * (j + 1);
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }

      // Draw agent
      const agentPos = Math.floor(gameState.position / 20) % (gridSize * gridSize);
      const agentX = (agentPos % gridSize) + 1;
      const agentY = Math.floor(agentPos / gridSize) + 1;

      ctx.fillStyle = isDarkMode ? '#fbbf24' : '#f59e0b';
      ctx.fillRect(agentX * cellSize + 5, agentY * cellSize + 5, cellSize - 10, cellSize - 10);

      // Draw goal
      const goalX = gridSize;
      const goalY = gridSize;
      ctx.fillStyle = isDarkMode ? '#34d399' : '#10b981';
      ctx.fillRect(goalX * cellSize + 5, goalY * cellSize + 5, cellSize - 10, cellSize - 10);
    } else if (selectedEnvironment === 'mountaincar') {
      // Draw mountain
      ctx.fillStyle = isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.2)';
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 5) {
        const normalizedX = x / canvas.width;
        const y = Math.sin(normalizedX * Math.PI) * 50 + canvas.height - 80;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Draw car
      const carX = (gameState.position / 100) * canvas.width;
      const carY = canvas.height - 80 + Math.sin((gameState.position / 100) * Math.PI) * 50;

      ctx.fillStyle = isDarkMode ? '#f59e0b' : '#f97316';
      ctx.fillRect(carX - 15, carY - 10, 30, 15);
      ctx.fillStyle = isDarkMode ? '#1e293b' : '#000000';
      ctx.beginPath();
      ctx.arc(carX - 8, carY + 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(carX + 8, carY + 5, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Default visualization
      ctx.fillStyle = isDarkMode ? '#60a5fa' : '#3b82f6';
      const x = (gameState.position / 100) * canvas.width;
      const y = centerY + Math.sin(gameState.angle) * 50;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw score
    ctx.fillStyle = isDarkMode ? '#cbd5e1' : '#475569';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${gameState.score}`, canvas.width - 20, 30);
    ctx.font = '12px Arial';
    ctx.fillText(`Steps: ${stepCount}`, canvas.width - 20, 50);
  }, [gameState, selectedEnvironment, isDarkMode, stepCount]);

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

  const addEnvironment = () => {
    const env = environmentDetails[selectedEnvironment];
    setEnvironments([...environments, env]);
    showAlert(`${env.name} environment added! 🌍`, 'success');
    addLog(`Added ${env.name} environment`, 'success');
  };

  const addAgent = () => {
    const agent = agentDetails[selectedAgent];
    setAgents([...agents, agent]);
    showAlert(`${agent.name} agent added! 🤖`, 'success');
    addLog(`Added ${agent.name} agent with LR=${learningRate}`, 'success');
  };

  const deleteEnvironment = (id: number) => {
    setEnvironments(environments.filter(e => e.id !== id));
    showAlert('Environment removed! 👋', 'info');
  };

  const deleteAgent = (id: number) => {
    setAgents(agents.filter(a => a.id !== id));
    showAlert('Agent removed! 👋', 'info');
  };

  const startTraining = () => {
    if (agents.length === 0 || environments.length === 0) {
      showAlert('Please add an agent and environment!', 'error');
      return;
    }

    setIsRunning(true);
    addLog('🚀 Training started...', 'success');
    addLog(`Agent: ${agentDetails[selectedAgent].name} | Env: ${environmentDetails[selectedEnvironment].name}`, 'info');
    showAlert('Training initiated!', 'info');

    let currentEpisode = 0;
    let currentStep = 0;
    let rewards = [...rewardHistory];
    let losses = [...lossHistory];
    let steps = [...episodeSteps];
    const speed = speeds[Math.min(Math.floor(animationSpeed * 2), 2)];

    const interval = setInterval(() => {
      currentEpisode++;
      currentStep = 0;

      // Simulate training dynamics
      const baseReward = 50 + (currentEpisode / maxEpisodes) * 150;
      const noiseEpisodeReward = (Math.random() - 0.5) * 40;
      const episodeReward = baseReward + noiseEpisodeReward;
      rewards.push(Math.max(0, episodeReward));

      const newLoss = Math.max(0.1, 2 - (currentEpisode / maxEpisodes) * 1.8 + (Math.random() - 0.5) * 0.4);
      losses.push(newLoss);

      const stepInEpisode = Math.floor(50 + (currentEpisode / maxEpisodes) * 150 + (Math.random() - 0.5) * 30);
      steps.push(Math.max(10, stepInEpisode));

      setEpisode(currentEpisode);
      setStepCount(stepInEpisode);
      setCumulativeReward(episodeReward);
      setAverageReward(rewards.reduce((a, b) => a + b, 0) / rewards.length);
      setLoss(newLoss);

      // Update epsilon decay
      const newEpsilon = epsilon * Math.exp(-currentEpisode / 100);
      setEpsilonValue(newEpsilon);

      // Simulate game state changes
      setGameState(prev => ({
        ...prev,
        position: 40 + Math.sin(currentEpisode * 0.05) * 10,
        angle: Math.sin(currentEpisode * 0.1) * 0.3,
        score: episodeReward,
        velocity: Math.cos(currentEpisode * 0.05) * 5
      }));

      // Update Q-values visualization
      const newQValues = Array.from({ length: 4 }, () => Math.random() * 50);
      setQValues(newQValues);

      // Update policy
      const newPolicy = Array.from({ length: 5 }, (_, i) => 
        (i === Math.floor(Math.random() * 5) ? 1 : 0) * 100
      );
      setPolicyVisuals(newPolicy);

      setRewardHistory(rewards);
      setLossHistory(losses);
      setEpisodeSteps(steps);
      setExploreExploitRatio((newEpsilon / epsilon) * 100);

      if (currentEpisode % 50 === 0 || currentEpisode === maxEpisodes) {
        addLog(
          `Episode ${currentEpisode}/${maxEpisodes} - Reward: ${episodeReward.toFixed(1)} - Loss: ${newLoss.toFixed(3)} - Epsilon: ${newEpsilon.toFixed(3)}`,
          'info'
        );
      }

      if (currentEpisode >= maxEpisodes) {
        clearInterval(interval);
        setIsRunning(false);
        addLog('🎉 Training complete!', 'success');
        showAlert(
          `Training finished! Final Average Reward: ${(rewards.reduce((a, b) => a + b, 0) / rewards.length).toFixed(1)}`,
          'success'
        );
      }
    }, (1000 / speed) / animationSpeed);

    return () => clearInterval(interval);
  };

  const stopTraining = () => {
    setIsRunning(false);
    showAlert('Training paused! 👋', 'info');
    addLog('Training paused by user', 'info');
  };

  const resetTraining = () => {
    setEpisode(0);
    setStepCount(0);
    setCumulativeReward(0);
    setAverageReward(0);
    setLoss(0);
    setRewardHistory([]);
    setLossHistory([]);
    setEpisodeSteps([]);
    setGameState({
      position: 50,
      angle: 0,
      velocity: 0,
      score: 0,
      done: false
    });
    setIsRunning(false);
    showAlert('Training reset! 🔄', 'info');
    addLog('Training metrics reset', 'info');
  };

  const handleSpeedChange = () => {
    const idx = speeds.indexOf(animationSpeed);
    setAnimationSpeed(speeds[(idx + 1) % speeds.length]);
  };

  useEffect(() => {
    if (logPanelRef.current) {
      logPanelRef.current.scrollTop = logPanelRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    addLog('Welcome to Reinforcement Learning Simulator! 🎮', 'success');
    addLog('Add agents and environments to get started', 'info');
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark-mode bg-slate-900' : 'bg-white'}`}
         style={{
           background: isDarkMode
             ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
             : 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)'
         }}>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className={`rounded-3xl shadow-xl overflow-hidden mb-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-10">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-black text-white mb-2">🎮 RL Simulator</h1>
                <p className="text-white/90 text-sm">Reinforcement Learning Agent Training & Interactive Environments</p>
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
                Build RL agents and train them in interactive environments
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
            {/* Agent Configuration */}
            <div className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-slate-800 hover:border-amber-500' : 'bg-white hover:border-amber-500'} border-2 border-transparent`}>
              <h2 className="text-xl font-bold text-amber-600 mb-6 flex items-center gap-2">
                🤖 Agent Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Algorithm</label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value as any)}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-amber-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                    } focus:outline-none`}
                  >
                    <option value="qlearning">📈 Q-Learning</option>
                    <option value="sarsa">🔄 SARSA</option>
                    <option value="ppo">🚀 PPO</option>
                    <option value="ddqn">🧠 Double DQN</option>
                    <option value="a3c">⚡ A3C</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Learning Rate</label>
                  <input
                    type="number"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    min={0.0001}
                    max={1}
                    step={0.01}
                    className={`w-full px-4 py-3 rounded-lg border-2 font-mono text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-amber-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                    } focus:outline-none`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Epsilon (Exploration)</label>
                  <input
                    type="number"
                    value={epsilon}
                    onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                    min={0}
                    max={1}
                    step={0.01}
                    className={`w-full px-4 py-3 rounded-lg border-2 font-mono text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-amber-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                    } focus:outline-none`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Discount Factor (Gamma)</label>
                  <input
                    type="number"
                    value={discountFactor}
                    onChange={(e) => setDiscountFactor(parseFloat(e.target.value))}
                    min={0}
                    max={1}
                    step={0.01}
                    className={`w-full px-4 py-3 rounded-lg border-2 font-mono text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-amber-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                    } focus:outline-none`}
                  />
                </div>

                <button
                  onClick={addAgent}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Agent
                </button>
              </div>
            </div>

            {/* Environment Configuration */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-amber-500`}>
              <h2 className="text-xl font-bold text-amber-600 mb-6 flex items-center gap-2">
                🌍 Environment
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Environment Type</label>
                  <select
                    value={selectedEnvironment}
                    onChange={(e) => setSelectedEnvironment(e.target.value as any)}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-amber-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                    } focus:outline-none`}
                  >
                    <option value="cartpole">🛒 CartPole</option>
                    <option value="gridworld">🔲 GridWorld</option>
                    <option value="mountaincar">🚗 Mountain Car</option>
                    <option value="acrobot">🤸 Acrobot</option>
                    <option value="lunarlander">🚀 Lunar Lander</option>
                  </select>
                </div>

                <div>
                  <p className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {environmentDetails[selectedEnvironment]?.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Batch Size</label>
                    <input
                      type="number"
                      value={batchSize}
                      onChange={(e) => setBatchSize(parseInt(e.target.value))}
                      min={8}
                      max={256}
                      className={`w-full px-3 py-2 rounded-lg border-2 text-sm font-mono ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-amber-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                      } focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Update Freq</label>
                    <input
                      type="number"
                      value={updateFrequency}
                      onChange={(e) => setUpdateFrequency(parseInt(e.target.value))}
                      min={1}
                      max={50}
                      className={`w-full px-3 py-2 rounded-lg border-2 text-sm font-mono ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-amber-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                      } focus:outline-none`}
                    />
                  </div>
                </div>

                <button
                  onClick={addEnvironment}
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Environment
                </button>
              </div>
            </div>

            {/* Active Agents */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-amber-500`}>
              <h2 className="text-xl font-bold text-amber-600 mb-4 flex items-center gap-2">
                🤖 Agents ({agents.length})
              </h2>
              {agents.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>No agents added yet</p>
              ) : (
                <div className="space-y-2">
                  {agents.map((agent, idx) => (
                    <div key={agent.id} className={`flex items-center justify-between p-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {idx + 1}. {agent.name}
                      </span>
                      <button onClick={() => deleteAgent(agent.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Environments */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-amber-500`}>
              <h2 className="text-xl font-bold text-amber-600 mb-4 flex items-center gap-2">
                🌍 Environments ({environments.length})
              </h2>
              {environments.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>No environments added yet</p>
              ) : (
                <div className="space-y-2">
                  {environments.map((env, idx) => (
                    <div key={env.id} className={`flex items-center justify-between p-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {idx + 1}. {env.name}
                      </span>
                      <button onClick={() => deleteEnvironment(env.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Training Controls */}
            <div className="flex gap-3">
              <button
                onClick={startTraining}
                disabled={isRunning || agents.length === 0 || environments.length === 0}
                className={`flex-1 px-6 py-3 font-bold rounded-lg transition-all duration-300 transform flex items-center justify-center gap-2 ${
                  isRunning || agents.length === 0 || environments.length === 0
                    ? 'bg-slate-400 text-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                <Play className="w-5 h-5" />
                Start
              </button>
              <button
                onClick={stopTraining}
                disabled={!isRunning}
                className={`flex-1 px-6 py-3 font-bold rounded-lg transition-all duration-300 ${
                  !isRunning
                    ? 'bg-slate-400 text-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white hover:shadow-lg'
                }`}
              >
                <Pause className="w-5 h-5" />
              </button>
              <button
                onClick={resetTraining}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>

          {/* Middle & Right - Training & Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* RL Loop Diagram */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-amber-500`}>
              <h2 className="text-xl font-bold text-amber-600 mb-6 flex items-center gap-2">
                <Layers className="w-6 h-6" />
                RL Loop
              </h2>
              <canvas
                ref={canvasRef}
                className={`w-full h-40 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
              />
            </div>

            {/* Game Environment */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-amber-500`}>
              <h2 className="text-xl font-bold text-amber-600 mb-6 flex items-center gap-2">
                🎮 Environment Visualization
              </h2>
              <canvas
                ref={gameCanvasRef}
                className={`w-full h-80 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
              />
            </div>

            {/* Performance Metrics */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-amber-500`}>
              <h2 className="text-xl font-bold text-amber-600 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Performance Metrics
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Episode', value: episode.toString(), color: 'from-amber-600 to-orange-600' },
                  { label: 'Reward', value: cumulativeReward.toFixed(1), color: 'from-green-600 to-emerald-600' },
                  { label: 'Avg Reward', value: averageReward.toFixed(1), color: 'from-blue-600 to-cyan-600' },
                  { label: 'Loss', value: loss.toFixed(3), color: 'from-red-600 to-pink-600' }
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 hover:border-amber-500'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-500'
                    }`}
                  >
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
                      {metric.label}
                    </p>
                    <p className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Epsilon Decay */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Epsilon (Exploration Rate)
                    </span>
                    <span className={`text-xs font-mono ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                      {epsilonValue.toFixed(3)}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-orange-600 transition-all duration-500"
                      style={{ width: `${epsilonValue * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Explore/Exploit Ratio
                    </span>
                    <span className={`text-xs font-mono ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                      {exploreExploitRatio.toFixed(1)}%
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-500"
                      style={{ width: `${Math.min(exploreExploitRatio, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Training Analysis Tabs */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 border-transparent hover:border-amber-500`}>
              <div className="flex gap-2 mb-6 border-b-2 border-slate-200 dark:border-slate-700 overflow-x-auto">
                {['training', 'logs', 'qvalues'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-amber-600 text-amber-600'
                        : isDarkMode
                        ? 'border-transparent text-slate-400 hover:text-slate-200'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'training' && '📊 Training'}
                    {tab === 'logs' && '📝 Logs'}
                    {tab === 'qvalues' && '🧠 Q-Values'}
                  </button>
                ))}
              </div>

              {activeTab === 'training' && (
                <div className="space-y-4">
                  <div>
                    <p className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                      Reward History
                    </p>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {rewardHistory.length === 0 ? 'No data yet' : `Episodes: ${rewardHistory.length} | Max: ${Math.max(...rewardHistory).toFixed(1)} | Avg: ${(rewardHistory.reduce((a, b) => a + b, 0) / rewardHistory.length).toFixed(1)}`}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                      Loss History
                    </p>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {lossHistory.length === 0 ? 'No data yet' : `Samples: ${lossHistory.length} | Current: ${lossHistory[lossHistory.length - 1].toFixed(3)}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
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
              )}

              {activeTab === 'qvalues' && (
                <div className="space-y-3">
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    Q-Values for Actions
                  </p>
                  {qValues.length === 0 ? (
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Start training to see Q-values
                    </p>
                  ) : (
                    qValues.map((qValue, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Action {idx}
                          </span>
                          <span className={`text-xs font-mono ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                            {qValue.toFixed(2)}
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}>
                          <div
                            className="h-full bg-gradient-to-r from-amber-600 to-orange-600"
                            style={{ width: `${Math.min((qValue / 50) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
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
