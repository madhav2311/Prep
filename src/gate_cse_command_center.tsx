import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Coffee,
  Moon,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Award,
  Calendar,
  Download,
  Upload,
  Plus,
  Trash2,
  AlertTriangle,
  Zap,
  Target,
  Brain,
  Edit3,
  CheckSquare,
  Sparkles,
  Volume2,
  VolumeX,
  Keyboard,
  RefreshCw,
  X,
  ShieldAlert,
  ChevronRight,
  Database,
  Server,
  Wifi,
  WifiOff,
  Code2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Settings2,
  Save
} from 'lucide-react';

const GATE_SUBJECTS = [
  'Operating Systems',
  'Theory of Computation',
  'Databases (DBMS)',
  'Computer Networks',
  'Algorithms',
  'Data Structures',
  'Computer Organization (COA)',
  'Discrete Mathematics',
  'Engineering Mathematics',
  'General Aptitude'
];

const SUBJECT_COLORS = {
  'Operating Systems': 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  'Theory of Computation': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'Databases (DBMS)': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  'Computer Networks': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Algorithms': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  'Data Structures': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  'Computer Organization (COA)': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  'Discrete Mathematics': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  'Engineering Mathematics': 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  'General Aptitude': 'bg-orange-500/10 text-orange-400 border-orange-500/30'
};

const CATEGORIES = ['Theory', 'PYQs', 'Mock Test', 'Revision'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getFreshTasks = () => [
  {
    id: `task-${Date.now()}-1`,
    title: 'Solve 15 PYQs on Paging, TLB Hit Calculations & Inverted Page Tables',
    subject: 'Operating Systems',
    category: 'PYQs',
    priority: 'High',
    completed: false,
    retention: { theory: true, pyq: false, r1: false, r2: false, r3: false }
  },
  {
    id: `task-${Date.now()}-2`,
    title: 'Revise Graph Isomorphism, Planar Graphs & Kuratowski Criteria',
    subject: 'Discrete Mathematics',
    category: 'Revision',
    priority: 'High',
    completed: false,
    retention: { theory: true, pyq: false, r1: false, r2: false, r3: false }
  },
  {
    id: `task-${Date.now()}-3`,
    title: 'Master B+ Tree Order, Max Keys & Index Node Splitting Mechanics',
    subject: 'Databases (DBMS)',
    category: 'Theory',
    priority: 'Medium',
    completed: false,
    retention: { theory: false, pyq: false, r1: false, r2: false, r3: false }
  },
  {
    id: `task-${Date.now()}-4`,
    title: 'Dynamic Programming vs Greedy: Matrix Chain Multiplication & 0/1 Knapsack',
    subject: 'Algorithms',
    category: 'Theory',
    priority: 'Medium',
    completed: false,
    retention: { theory: false, pyq: false, r1: false, r2: false, r3: false }
  },
  {
    id: `task-${Date.now()}-5`,
    title: 'Solve 10 Aptitude Questions (Probability & Permutations)',
    subject: 'General Aptitude',
    category: 'PYQs',
    priority: 'Low',
    completed: false,
    retention: { theory: false, pyq: false, r1: false, r2: false, r3: false }
  }
];

const SERVER_SNIPPET = `// server.js - Lightweight Express & MongoDB Backend for GATE CSE Dev Diary
// 1. Run: npm init -y && npm install express mongoose cors dotenv
// 2. Start your local MongoDB: mongod (or docker run -p 27017:27017 -d mongo)
// 3. Start server: node server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gate_tracker';

mongoose.connect(MONGO_URI)
  .then(() => console.log(' Connected to MongoDB: ' + MONGO_URI))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const DiaryEntrySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true, index: true },
  energy: { type: Number, default: 4 },
  win: { type: String, default: '' },
  mistake: { type: String, default: '' },
  tomorrow: { type: String, default: '' },
  notes: { type: String, default: '' },
  lastSyncedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const DiaryEntry = mongoose.model('DiaryEntry', DiaryEntrySchema);

// Ping / Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'mongodb', readyState: mongoose.connection.readyState });
});

// GET diary entry for a specific date (YYYY-MM-DD)
app.get('/api/diary/:date', async (req, res) => {
  try {
    const entry = await DiaryEntry.findOne({ date: req.params.date });
    if (!entry) return res.status(200).json(null);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST upsert diary entry
app.post('/api/diary/:date', async (req, res) => {
  try {
    const doc = await DiaryEntry.findOneAndUpdate(
      { date: req.params.date },
      { ...req.body, date: req.params.date, lastSyncedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE reset / clear diary collection (Fresh Start)
app.delete('/api/diary/reset', async (req, res) => {
  try {
    await DiaryEntry.deleteMany({});
    res.json({ message: 'All diary history cleared successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`🚀 GATE Tracker API listening on http://localhost:\${PORT}\`));
`;

const playAudioBeep = (freq = 600, duration = 120) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration / 1000);
  } catch (e) {
    // browser audio policies
  }
};

export default function App() {
  const todayStr = getTodayDateString();

  // Mode: 'idle' | 'study' | 'break' | 'sleep'
  const [currentMode, setCurrentMode] = useState('idle');
  const [sessionTopic, setSessionTopic] = useState('OS - Virtual Memory & Multi-level Paging');
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dailyTargetHours, setDailyTargetHours] = useState(7.0);
  const [examDate, setExamDate] = useState('2027-02-06');

  // Confirmation modal for Clean Slate / Clear History
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetMongoToo, setResetMongoToo] = useState(true);

  // MongoDB integration states
  const [mongoEndpoint, setMongoEndpoint] = useState(() => {
    return localStorage.getItem('gate_mongo_endpoint') || 'http://localhost:5000';
  });
  const [mongoStatus, setMongoStatus] = useState('idle'); // 'connected' | 'disconnected' | 'checking' | 'idle'
  const [mongoLastSync, setMongoLastSync] = useState(null);
  const [showBackendSnippetModal, setShowBackendSnippetModal] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [isSavingToMongo, setIsSavingToMongo] = useState(false);

  // Daily Metrics state (cumulative seconds)
  const [dailyMetrics, setDailyMetrics] = useState(() => {
    try {
      const saved = localStorage.getItem('gate_daily_metrics');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      [todayStr]: { studySec: 0, breakSec: 0, sleepSec: 0, pyqsSolved: 0 }
    };
  });

  // Tasks state
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('gate_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return getFreshTasks();
  });

  // Diary Entries (LocalStorage + Local MongoDB dual sync)
  const [diaryEntries, setDiaryEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('gate_diary_entries');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      [todayStr]: {
        date: todayStr,
        energy: 4,
        win: '',
        mistake: '',
        tomorrow: '',
        notes: ''
      }
    };
  });

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [taskSubjectFilter, setTaskSubjectFilter] = useState('All');
  const [taskCategoryFilter, setTaskCategoryFilter] = useState('All');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // Form states for new task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState(GATE_SUBJECTS[0]);
  const [newTaskCategory, setNewTaskCategory] = useState(CATEGORIES[0]);
  const [newTaskPriority, setNewTaskPriority] = useState('High');

  const checkMongoConnection = useCallback(async (endpointToTest = mongoEndpoint) => {
    setMongoStatus('checking');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${endpointToTest}/api/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        setMongoStatus('connected');
        return true;
      } else {
        setMongoStatus('disconnected');
        return false;
      }
    } catch (err) {
      setMongoStatus('disconnected');
      return false;
    }
  }, [mongoEndpoint]);

  // Initial connection test
  useEffect(() => {
    checkMongoConnection();
  }, [checkMongoConnection]);

  // Save endpoint changes
  const handleUpdateEndpoint = (newUrl) => {
    setMongoEndpoint(newUrl);
    localStorage.setItem('gate_mongo_endpoint', newUrl);
  };

  // Sync diary entry to MongoDB
  const syncDiaryToMongo = useCallback(async (dateKey, entryData) => {
    if (!entryData) return;
    setIsSavingToMongo(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${mongoEndpoint}/api/diary/${dateKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        setMongoStatus('connected');
        setMongoLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        setMongoStatus('disconnected');
      }
    } catch (err) {
      // Graceful fallback to offline LocalStorage
      setMongoStatus('disconnected');
    } finally {
      setIsSavingToMongo(false);
    }
  }, [mongoEndpoint]);

  // Pull diary entry from MongoDB when selectedDate changes and MongoDB is connected
  useEffect(() => {
    const fetchMongoDiary = async () => {
      if (mongoStatus !== 'connected') return;
      try {
        const res = await fetch(`${mongoEndpoint}/api/diary/${selectedDate}`);
        if (res.ok) {
          const remoteEntry = await res.json();
          if (remoteEntry && remoteEntry.date) {
            setDiaryEntries((prev) => {
              const currentLocal = prev[selectedDate];
              // Merge remote if local is blank or remote exists
              if (!currentLocal || (!currentLocal.win && !currentLocal.notes && (remoteEntry.win || remoteEntry.notes))) {
                return {
                  ...prev,
                  [selectedDate]: {
                    date: remoteEntry.date,
                    energy: remoteEntry.energy || 4,
                    win: remoteEntry.win || '',
                    mistake: remoteEntry.mistake || '',
                    tomorrow: remoteEntry.tomorrow || '',
                    notes: remoteEntry.notes || ''
                  }
                };
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch remote diary:', err);
      }
    };

    fetchMongoDiary();
  }, [selectedDate, mongoStatus, mongoEndpoint]);

  useEffect(() => {
    localStorage.setItem('gate_daily_metrics', JSON.stringify(dailyMetrics));
  }, [dailyMetrics]);

  useEffect(() => {
    localStorage.setItem('gate_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('gate_diary_entries', JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    if (currentMode === 'idle') return;

    const interval = setInterval(() => {
      setDailyMetrics((prev) => {
        const curDate = getTodayDateString();
        const cur = prev[curDate] || { studySec: 0, breakSec: 0, sleepSec: 0, pyqsSolved: 0 };

        if (currentMode === 'study') {
          return { ...prev, [curDate]: { ...cur, studySec: cur.studySec + 1 } };
        } else if (currentMode === 'break') {
          return { ...prev, [curDate]: { ...cur, breakSec: cur.breakSec + 1 } };
        } else if (currentMode === 'sleep') {
          return { ...prev, [curDate]: { ...cur, sleepSec: cur.sleepSec + 1 } };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setCurrentMode((prev) => (prev === 'study' ? 'idle' : 'study'));
        if (soundEnabled) playAudioBeep(currentMode === 'study' ? 440 : 880);
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setCurrentMode((prev) => (prev === 'break' ? 'idle' : 'break'));
        if (soundEnabled) playAudioBeep(520);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setCurrentMode('study');
        if (soundEnabled) playAudioBeep(880);
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setCurrentMode((prev) => (prev === 'sleep' ? 'idle' : 'sleep'));
        if (soundEnabled) playAudioBeep(330);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMode, soundEnabled]);

  const handleClearHistoryAndStartFresh = async () => {
    const freshToday = getTodayDateString();

    // 1. Reset timer mode
    setCurrentMode('idle');

    // 2. Wipe metrics & start today at zero
    const freshMetrics = {
      [freshToday]: { studySec: 0, breakSec: 0, sleepSec: 0, pyqsSolved: 0 }
    };
    setDailyMetrics(freshMetrics);
    localStorage.setItem('gate_daily_metrics', JSON.stringify(freshMetrics));

    // 3. Reset fresh tasks
    const resetTasks = getFreshTasks();
    setTasks(resetTasks);
    localStorage.setItem('gate_tasks', JSON.stringify(resetTasks));

    // 4. Reset journal with clean today entry
    const cleanEntry = {
      date: freshToday,
      energy: 4,
      win: '',
      mistake: '',
      tomorrow: '',
      notes: ''
    };
    const resetDiary = { [freshToday]: cleanEntry };
    setDiaryEntries(resetDiary);
    localStorage.setItem('gate_diary_entries', JSON.stringify(resetDiary));

    // 5. If MongoDB is selected and connected, trigger remote reset
    if (resetMongoToo && mongoStatus === 'connected') {
      try {
        await fetch(`${mongoEndpoint}/api/diary/reset`, { method: 'DELETE' });
        // Put back today's clean record
        await fetch(`${mongoEndpoint}/api/diary/${freshToday}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanEntry)
        });
      } catch (err) {
        console.warn('Failed to reset MongoDB collection:', err);
      }
    }

    setSelectedDate(freshToday);
    setSessionTopic('OS - Virtual Memory & Multi-level Paging');
    setShowResetModal(false);

    if (soundEnabled) playAudioBeep(520, 250);
  };

  const todayData = dailyMetrics[todayStr] || { studySec: 0, breakSec: 0, sleepSec: 0, pyqsSolved: 0 };
  const studyHours = (todayData.studySec / 3600).toFixed(1);
  const breakMinutes = Math.round(todayData.breakSec / 60);
  const sleepHours = (todayData.sleepSec / 3600).toFixed(1);
  const progressPercent = Math.min(100, Math.round((todayData.studySec / (dailyTargetHours * 3600)) * 100));

  const studyMins = todayData.studySec / 60;
  const breakRatio = studyMins > 0 ? (breakMinutes / studyMins) * 100 : 50;
  const isBurnoutRisk = studyMins > 180 && breakMinutes === 0;

  const daysUntilGate = useMemo(() => {
    const target = new Date(examDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [examDate]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 90; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() - i);
      const str = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      const rec = dailyMetrics[str];
      if (rec && rec.studySec >= 2.5 * 3600) {
        streak++;
      } else if (i === 0) {
        continue;
      } else {
        break;
      }
    }
    return Math.max(streak, todayData.studySec >= 2.5 * 3600 ? 1 : 0);
  }, [dailyMetrics, todayData.studySec]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState && soundEnabled) playAudioBeep(920, 100);
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const toggleRetentionStage = (taskId, stage) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            retention: { ...t.retention, [stage]: !t.retention[stage] }
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      category: newTaskCategory,
      priority: newTaskPriority,
      completed: false,
      retention: { theory: false, pyq: false, r1: false, r2: false, r3: false }
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowNewTaskModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchSub = taskSubjectFilter === 'All' || t.subject === taskSubjectFilter;
    const matchCat = taskCategoryFilter === 'All' || t.category === taskCategoryFilter;
    return matchSub && matchCat;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const taskProgress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const currentDiary = diaryEntries[selectedDate] || {
    date: selectedDate,
    energy: 4,
    win: '',
    mistake: '',
    tomorrow: '',
    notes: ''
  };

  const updateCurrentDiary = (field, val) => {
    const updated = {
      ...currentDiary,
      [field]: val
    };

    setDiaryEntries((prev) => ({
      ...prev,
      [selectedDate]: updated
    }));

    // Trigger async sync to MongoDB if connected
    if (mongoStatus === 'connected') {
      syncDiaryToMongo(selectedDate, updated);
    }
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(SERVER_SNIPPET);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleExportJSON = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      dailyMetrics,
      tasks,
      diaryEntries,
      dailyTargetHours,
      examDate,
      mongoEndpoint
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GATE_CSE_COMMAND_CENTER_${todayStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.dailyMetrics) setDailyMetrics(parsed.dailyMetrics);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.diaryEntries) setDiaryEntries(parsed.diaryEntries);
        if (parsed.dailyTargetHours) setDailyTargetHours(parsed.dailyTargetHours);
        if (parsed.examDate) setExamDate(parsed.examDate);
        if (parsed.mongoEndpoint) setMongoEndpoint(parsed.mongoEndpoint);
        if (soundEnabled) playAudioBeep(650, 180);
      } catch (err) {
        console.error('Import failed', err);
      }
    };
    reader.readAsText(file);
  };

  const switchMode = (newMode) => {
    if (newMode === currentMode) {
      setCurrentMode('idle');
    } else {
      setCurrentMode(newMode);
    }
    if (soundEnabled) {
      if (newMode === 'study') playAudioBeep(880);
      else if (newMode === 'break') playAudioBeep(520);
      else if (newMode === 'sleep') playAudioBeep(330);
      else playAudioBeep(440);
    }
  };

  const presetSleepMode = () => {
    setDailyMetrics((prev) => {
      const curData = prev[todayStr] || { studySec: 0, breakSec: 0, sleepSec: 0, pyqsSolved: 0 };
      return {
        ...prev,
        [todayStr]: { ...curData, sleepSec: 6 * 3600 }
      };
    });
    if (soundEnabled) playAudioBeep(400, 180);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide flex items-center gap-2 text-zinc-100">
              GATE CSE Command Center
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Fresh Sprint
              </span>
            </h1>
            <p className="text-xs text-zinc-400">High-retention workspace with Local MongoDB diary sync</p>
          </div>
        </div>

        {/* Global Controls & MongoDB Status */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          
          {/* MongoDB Connection Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border bg-zinc-900/90 border-zinc-800 shadow-sm">
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            
            {mongoStatus === 'connected' ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                MongoDB Live
              </span>
            ) : mongoStatus === 'checking' ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-zinc-400" title="Running in browser LocalStorage mode">
                <WifiOff className="w-3 h-3 text-zinc-500" />
                LocalStorage (Offline)
              </span>
            )}

            <button
              onClick={() => checkMongoConnection()}
              title="Test connection to MongoDB API"
              className="ml-1 text-zinc-500 hover:text-zinc-200 transition"
            >
              <RefreshCw className="w-3 h-3" />
            </button>

            <button
              onClick={() => setShowBackendSnippetModal(true)}
              title="View & copy local Express/MongoDB server setup"
              className="ml-1 text-emerald-400 hover:text-emerald-300 font-sans text-[11px] underline flex items-center gap-0.5"
            >
              <Code2 className="w-3 h-3" />
              Setup Server
            </button>
          </div>

          {/* Start Fresh Button */}
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
            title="Reset history and start fresh from today"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Fresh Today</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Audio Signals' : 'Enable Audio Signals'}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          <label
            title="Import Data JSON"
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 cursor-pointer transition flex items-center"
          >
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={handleExportJSON}
            title="Export Data JSON Backup"
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Real-time State Machine Live Bar */}
        <div className={`rounded-2xl border transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-md ${
          currentMode === 'study'
            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-emerald-900/10'
            : currentMode === 'break'
            ? 'bg-amber-950/20 border-amber-500/40 shadow-amber-900/10'
            : currentMode === 'sleep'
            ? 'bg-indigo-950/20 border-indigo-500/40 shadow-indigo-900/10'
            : 'bg-zinc-900/60 border-zinc-800/80 shadow-black/20'
        }`}>
          <div className="p-5 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left: Mode Badge & Editable Session Name */}
            <div className="flex-1 w-full text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  currentMode === 'study'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                    : currentMode === 'break'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                    : currentMode === 'sleep'
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    currentMode === 'study' ? 'bg-emerald-400' :
                    currentMode === 'break' ? 'bg-amber-400' :
                    currentMode === 'sleep' ? 'bg-indigo-400' : 'bg-zinc-500'
                  }`} />
                  {currentMode === 'idle' ? 'STANDBY / IDLE' : `${currentMode.toUpperCase()} MODE`}
                </span>
                <span className="text-xs text-zinc-400 font-mono bg-zinc-800/60 px-2 py-0.5 rounded">
                  Today: {todayStr}
                </span>
              </div>

              {/* Dynamic Session Label Editor */}
              <div className="flex items-center justify-center lg:justify-start gap-2">
                {isEditingTopic ? (
                  <div className="flex items-center gap-2 w-full max-w-md">
                    <input
                      type="text"
                      value={sessionTopic}
                      onChange={(e) => setSessionTopic(e.target.value)}
                      onBlur={() => setIsEditingTopic(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingTopic(false)}
                      autoFocus
                      className="bg-zinc-800 text-zinc-100 px-3 py-1 text-sm rounded border border-emerald-500/50 w-full focus:outline-none"
                    />
                    <button
                      onClick={() => setIsEditingTopic(false)}
                      className="text-xs bg-emerald-600 px-2 py-1 rounded text-white font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTopic(true)}>
                    <h2 className="text-lg sm:text-xl font-semibold text-zinc-200 group-hover:text-emerald-400 transition">
                      {sessionTopic}
                    </h2>
                    <Edit3 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Active Live Cumulative Timer */}
            <div className="text-center font-mono">
              <div className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100">
                {currentMode === 'study' && formatTime(todayData.studySec)}
                {currentMode === 'break' && formatTime(todayData.breakSec)}
                {currentMode === 'sleep' && formatTime(todayData.sleepSec)}
                {currentMode === 'idle' && formatTime(todayData.studySec)}
              </div>
              <p className="text-[11px] text-zinc-400 uppercase tracking-widest mt-1">
                {currentMode === 'idle' ? 'Total Deep Study Tracked Today' : `Cumulative ${currentMode} Time`}
              </p>
            </div>

            {/* Right: Mode Switchers */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => switchMode('study')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-md ${
                  currentMode === 'study'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {currentMode === 'study' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{currentMode === 'study' ? 'Pause Deep Work' : 'Start Study'}</span>
              </button>

              <button
                onClick={() => switchMode('break')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-md ${
                  currentMode === 'break'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-amber-500/20'
                }`}
              >
                <Coffee className="w-4 h-4" />
                <span>{currentMode === 'break' ? 'End Break' : 'Take Break'}</span>
              </button>

              <button
                onClick={() => switchMode('sleep')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-md ${
                  currentMode === 'sleep'
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-indigo-400 border border-indigo-500/20'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Sleep Mode</span>
              </button>
            </div>
          </div>

          {/* Sub-Bar: Sleep Preset, Target hours & Progress */}
          <div className="border-t border-zinc-800/80 bg-zinc-950/40 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Daily Target: 
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="16"
                  value={dailyTargetHours}
                  onChange={(e) => setDailyTargetHours(parseFloat(e.target.value) || 7)}
                  className="w-12 bg-zinc-800 text-zinc-100 font-bold px-1 py-0.5 rounded text-center border border-zinc-700 focus:outline-none"
                />
                hrs
              </span>
              <span className="text-zinc-700">|</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Breaks: <strong className="text-zinc-200">{breakMinutes} mins</strong>
              </span>
              <span className="text-zinc-700">|</span>
              <span className="flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                Sleep Logged: <strong className="text-zinc-200">{sleepHours}h</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={presetSleepMode}
                className="text-[11px] text-indigo-300 hover:text-indigo-200 bg-indigo-950/40 border border-indigo-800/50 px-2.5 py-1 rounded transition flex items-center gap-1"
                title="Log canonical 10:00 PM – 4:00 AM (6 hrs) sleep block"
              >
                <Moon className="w-3 h-3" />
                Quick Log 10 PM - 4 AM (6h)
              </button>

              <div className="w-28 sm:w-36 bg-zinc-800 rounded-full h-2 overflow-hidden border border-zinc-700/60">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono font-semibold text-emerald-400">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* 4 Cards: Countdown, Streak, Deep Study, Burnout Guard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                Exam Countdown
              </span>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="bg-transparent text-zinc-400 text-[10px] focus:outline-none cursor-pointer"
              />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-sky-400 font-mono">{daysUntilGate} <span className="text-xs font-normal text-zinc-400">days</span></div>
              <div className="text-xs text-zinc-400 mt-0.5">Target: GATE CSE {examDate.slice(0, 4)}</div>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Consistency Streak
              </span>
              <span className="text-[10px] text-amber-500/80 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">≥2.5h/day</span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">{currentStreak} <span className="text-sm font-normal text-zinc-400">day(s)</span></div>
              <div className="text-xs text-zinc-400 mt-0.5">Fresh streak active</div>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Deep Study Today
              </span>
              <button
                onClick={() => {
                  setDailyMetrics((p) => {
                    const cur = p[todayStr] || { studySec: 0, breakSec: 0, sleepSec: 0, pyqsSolved: 0 };
                    return { ...p, [todayStr]: { ...cur, pyqsSolved: (cur.pyqsSolved || 0) + 5 } };
                  });
                }}
                className="text-[10px] text-emerald-400 hover:underline bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"
              >
                +5 PYQs
              </button>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">{studyHours} <span className="text-sm font-normal text-zinc-400">hrs</span></div>
              <div className="text-xs text-zinc-400 mt-0.5">PYQs Solved Today: <strong className="text-zinc-200">{todayData.pyqsSolved || 0}</strong></div>
            </div>
          </div>

          <div className={`rounded-2xl p-4 border flex flex-col justify-between ${
            isBurnoutRisk
              ? 'bg-rose-950/30 border-rose-600/50 text-rose-200'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
          }`}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className={`w-3.5 h-3.5 ${isBurnoutRisk ? 'text-rose-400' : 'text-emerald-400'}`} />
                Burnout Guard
              </span>
              <span className="text-[10px] font-mono">{Math.round(breakRatio)}% break ratio</span>
            </div>
            <div>
              {isBurnoutRisk ? (
                <div>
                  <div className="text-sm font-bold text-rose-400">Excessive Fatigue Alert</div>
                  <p className="text-xs text-rose-300/80 mt-1">&gt;3 hrs study with zero break. Take a 15-minute rest now!</p>
                </div>
              ) : (
                <div>
                  <div className="text-sm font-bold text-emerald-400">Cognitive Balance OK</div>
                  <p className="text-xs text-zinc-400 mt-1">Breaks & deep focus intervals well distributed.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Consistency Heatmap */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-sm text-zinc-200">Consistency Heatmap (Sprint Timeline)</h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <span>0h</span>
              <div className="w-2.5 h-2.5 rounded bg-zinc-800 border border-zinc-700/50" />
              <div className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-800/40" />
              <div className="w-2.5 h-2.5 rounded bg-emerald-700" />
              <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <div className="w-2.5 h-2.5 rounded bg-emerald-300" />
              <span>7h+</span>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="inline-grid grid-flow-col grid-rows-7 gap-1.5">
              {Array.from({ length: 112 }).map((_, i) => {
                const dayOffset = 111 - i;
                const d = new Date();
                d.setDate(d.getDate() - dayOffset);
                const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                const entry = dailyMetrics[dateKey];
                const hours = entry ? entry.studySec / 3600 : 0;
                const isToday = dateKey === todayStr;

                let color = 'bg-zinc-900/90 border border-zinc-800';
                if (hours >= 7) color = 'bg-emerald-400 shadow-sm shadow-emerald-400/40';
                else if (hours >= 5) color = 'bg-emerald-600';
                else if (hours >= 2.5) color = 'bg-emerald-800';
                else if (hours > 0) color = 'bg-emerald-950 border border-emerald-900';

                return (
                  <div
                    key={dateKey}
                    onClick={() => setSelectedDate(dateKey)}
                    title={`${dateKey}${isToday ? ' (Today)' : ''}: ${hours.toFixed(1)} hrs study`}
                    className={`w-3 h-3 rounded-[3px] cursor-pointer transition ${color} ${
                      isToday ? 'ring-1 ring-emerald-400 ring-offset-1 ring-offset-zinc-950' : ''
                    } ${selectedDate === dateKey ? 'ring-2 ring-white scale-125 z-10' : ''}`}
                  />
                );
              })}
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Tip: Today's date is highlighted with a green halo. Click any square to open or sync notes for that day.
          </p>
        </div>

        {/* Dual Panel: GATE Task Matrix & Reflective Diary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: GATE Syllabus & 3-Stage Retention Matrix (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-lg">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                    GATE Syllabus & 3-Stage Retention Matrix
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Theory ➔ 10-15 Yr PYQ ➔ Revision Cycles (R1, R2, R3)</p>
                </div>

                <button
                  onClick={() => setShowNewTaskModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Topic / Task
                </button>
              </div>

              {/* Subject & Category Filters */}
              <div className="flex flex-wrap gap-2 py-3 text-xs">
                <select
                  value={taskSubjectFilter}
                  onChange={(e) => setTaskSubjectFilter(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1 text-zinc-300 focus:outline-none"
                >
                  <option value="All">All Subjects</option>
                  {GATE_SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={taskCategoryFilter}
                  onChange={(e) => setTaskCategoryFilter(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1 text-zinc-300 focus:outline-none"
                >
                  <option value="All">All Types</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <div className="ml-auto text-xs text-zinc-400 flex items-center gap-2">
                  <span>{completedCount}/{tasks.length} Done</span>
                  <div className="w-16 bg-zinc-800 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${taskProgress}%` }} />
                  </div>
                </div>
              </div>

              {/* Task Items */}
              <div className="space-y-3 mt-2 max-h-[550px] overflow-y-auto pr-1">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 text-sm">
                    No tasks match the active filter.
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const subStyle = SUBJECT_COLORS[task.subject] || 'bg-zinc-800 text-zinc-300 border-zinc-700';
                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          task.completed
                            ? 'bg-zinc-950/40 border-zinc-800/60 opacity-60'
                            : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="mt-0.5 text-zinc-400 hover:text-emerald-400 transition"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${subStyle}`}>
                                {task.subject}
                              </span>
                              <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60">
                                {task.category}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                task.priority === 'High' ? 'text-rose-400 bg-rose-500/10' :
                                task.priority === 'Medium' ? 'text-amber-400 bg-amber-500/10' :
                                'text-zinc-400 bg-zinc-800'
                              }`}>
                                {task.priority}
                              </span>
                            </div>

                            <p className={`text-sm font-medium ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                              {task.title}
                            </p>

                            {/* 3-Stage Retention Checkboxes */}
                            <div className="flex flex-wrap items-center gap-3 mt-2.5 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400">
                              <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200">
                                <input
                                  type="checkbox"
                                  checked={task.retention.theory}
                                  onChange={() => toggleRetentionStage(task.id, 'theory')}
                                  className="rounded border-zinc-700 text-emerald-600 focus:ring-0 bg-zinc-800 cursor-pointer"
                                />
                                <span>Theory Concept</span>
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200">
                                <input
                                  type="checkbox"
                                  checked={task.retention.pyq}
                                  onChange={() => toggleRetentionStage(task.id, 'pyq')}
                                  className="rounded border-zinc-700 text-emerald-600 focus:ring-0 bg-zinc-800 cursor-pointer"
                                />
                                <span>10-15y PYQs</span>
                              </label>

                              <div className="flex items-center gap-1 ml-auto">
                                <span className="text-zinc-500 mr-1">Revisions:</span>
                                {['r1', 'r2', 'r3'].map((stage, idx) => (
                                  <button
                                    key={stage}
                                    onClick={() => toggleRetentionStage(task.id, stage)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                                      task.retention[stage]
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                        : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                                    }`}
                                  >
                                    R{idx + 1}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-zinc-600 hover:text-rose-400 transition p-1"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Reflective Micro-Blogging & Nightly Diary with MongoDB Sync (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-lg">
              
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-zinc-100">Reflective Journal</h3>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                      {mongoStatus === 'connected' ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Database className="w-3 h-3" /> Syncing to MongoDB
                          {mongoLastSync && <span className="text-zinc-500 font-mono">({mongoLastSync})</span>}
                        </span>
                      ) : (
                        <span className="text-zinc-500 flex items-center gap-1">
                          <Save className="w-3 h-3" /> Auto-saving to LocalStorage
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Manual sync button */}
                  {mongoStatus === 'connected' && (
                    <button
                      onClick={() => syncDiaryToMongo(selectedDate, currentDiary)}
                      disabled={isSavingToMongo}
                      className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-emerald-400 px-2.5 py-1 rounded-lg border border-zinc-700 flex items-center gap-1 transition"
                      title="Force sync current entry to MongoDB"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSavingToMongo ? 'animate-spin' : ''}`} />
                      Sync
                    </button>
                  )}

                  {/* Day selector */}
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-2.5 py-1 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Energy / Fatigue rating */}
              <div className="py-3 border-b border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Energy & Cognitive Focus:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => updateCurrentDiary('energy', lvl)}
                      className={`w-6 h-6 rounded-md font-bold text-xs transition ${
                        (currentDiary.energy || 4) >= lvl
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-zinc-800 text-zinc-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Structured Reflection Prompts */}
              <div className="space-y-3.5 mt-3">
                {/* Concepts Mastered */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3 h-3" />
                    Concepts Mastered / What Clicked Today
                  </label>
                  <textarea
                    rows={2}
                    value={currentDiary.win || ''}
                    onChange={(e) => updateCurrentDiary('win', e.target.value)}
                    placeholder="e.g. Mastered Multi-level Paging formulas & effective memory access time..."
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none"
                  />
                </div>

                {/* Technical Trap / Mistakes */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    Key Technical Mistakes / GATE Trap Identified
                  </label>
                  <textarea
                    rows={2}
                    value={currentDiary.mistake || ''}
                    onChange={(e) => updateCurrentDiary('mistake', e.target.value)}
                    placeholder="e.g. In inverted page table, table size is proportional to physical frames, not virtual space..."
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-rose-500/50 resize-none"
                  />
                </div>

                {/* Freeform Technical Breakdown */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1">
                    <Brain className="w-3 h-3" />
                    Technical Markdown Log & Proofs
                  </label>
                  <textarea
                    rows={5}
                    value={currentDiary.notes || ''}
                    onChange={(e) => updateCurrentDiary('notes', e.target.value)}
                    placeholder="Formulas, proofs, speed metrics, algorithm variations..."
                    className="w-full font-mono bg-zinc-950/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 resize-none"
                  />
                </div>

                {/* Target for Tomorrow */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-1">
                    <Target className="w-3 h-3" />
                    Tomorrow's High-Leverage Weak Spot
                  </label>
                  <input
                    type="text"
                    value={currentDiary.tomorrow || ''}
                    onChange={(e) => updateCurrentDiary('tomorrow', e.target.value)}
                    placeholder="e.g. Graph Coloring bounds & solve 15 Algorithm Dynamic Programming PYQs"
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* MODAL: New Task */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Add GATE Topic or Sprint Task
              </h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Topic Title / Task</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 20 PYQs on Relational Algebra & Tuple Calculus"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Subject</label>
                  <select
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none"
                  >
                    {GATE_SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={`py-1.5 text-xs rounded-lg font-medium transition ${
                        newTaskPriority === p
                          ? p === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                            p === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                            'bg-zinc-700 text-zinc-200 border border-zinc-600'
                          : 'bg-zinc-800 text-zinc-400 border border-transparent'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Clear History & Fresh Start */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-rose-500/40 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-100">Clear History & Start Fresh Today?</h3>
                <p className="text-xs text-zinc-400">Restart sprint starting from {todayStr}</p>
              </div>
            </div>

            <div className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
              This action will:
              <ul className="list-disc list-inside mt-1.5 space-y-1 text-zinc-400">
                <li>Reset all past daily study/break cumulative records</li>
                <li>Zero out today's timers (<span className="text-zinc-200">00:00:00</span>)</li>
                <li>Clear completed task checkboxes and reload fresh syllabus tasks</li>
                <li>Start a fresh consistency streak starting today</li>
              </ul>
              
              {mongoStatus === 'connected' && (
                <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="resetMongo"
                    checked={resetMongoToo}
                    onChange={(e) => setResetMongoToo(e.target.checked)}
                    className="rounded border-zinc-700 text-rose-600 focus:ring-0 bg-zinc-900 cursor-pointer"
                  />
                  <label htmlFor="resetMongo" className="text-xs text-rose-300 cursor-pointer">
                    Also wipe and clear entries in local MongoDB
                  </label>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearHistoryAndStartFresh}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-900/30 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Yes, Reset & Start Fresh Today
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MongoDB Setup & Code Snippet */}
      {showBackendSnippetModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">Local MongoDB & Express Integration</h3>
                  <p className="text-xs text-zinc-400">Run this 40-line backend on your machine to sync notes locally</p>
                </div>
              </div>
              <button
                onClick={() => setShowBackendSnippetModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Endpoint Config Bar */}
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
                <label className="text-[11px] font-semibold text-zinc-300 block">
                  Backend API Endpoint (CORS enabled):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={mongoEndpoint}
                    onChange={(e) => handleUpdateEndpoint(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-zinc-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    placeholder="http://localhost:5000"
                  />
                  <button
                    onClick={() => checkMongoConnection()}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Test Connection
                  </button>
                </div>
                <div className="text-[11px] flex items-center gap-2 text-zinc-400">
                  <span>Status:</span>
                  {mongoStatus === 'connected' ? (
                    <span className="text-emerald-400 font-bold">Connected to MongoDB</span>
                  ) : (
                    <span className="text-amber-400">Disconnected (Falling back automatically to browser LocalStorage)</span>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-1.5 text-zinc-300">
                <p className="font-semibold text-zinc-200">How to run in 3 quick steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-400">
                  <li>Create a folder and run: <code className="text-emerald-400 font-mono bg-zinc-800 px-1 py-0.5 rounded">npm init -y && npm i express mongoose cors</code></li>
                  <li>Save the code below as <code className="text-emerald-400 font-mono bg-zinc-800 px-1 py-0.5 rounded">server.js</code></li>
                  <li>Run <code className="text-emerald-400 font-mono bg-zinc-800 px-1 py-0.5 rounded">node server.js</code> (requires MongoDB running on default port 27017)</li>
                </ol>
              </div>

              {/* Code Snippet Box */}
              <div className="relative">
                <div className="flex items-center justify-between bg-zinc-950 px-3 py-2 rounded-t-xl border border-zinc-800 border-b-0 text-zinc-400 text-[11px]">
                  <span>server.js (Express + Mongoose)</span>
                  <button
                    onClick={handleCopySnippet}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="bg-zinc-950/90 border border-zinc-800 rounded-b-xl p-3 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-56 leading-relaxed">
                  {SERVER_SNIPPET}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 flex justify-end">
              <button
                onClick={() => setShowBackendSnippetModal(false)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-6 py-4 text-center text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          GATE CSE Sprint Tracker & Command Center
          <span>•</span>
          <span className={mongoStatus === 'connected' ? 'text-emerald-400' : 'text-zinc-500'}>
            {mongoStatus === 'connected' ? '⚡ MongoDB Storage Active' : '💾 LocalStorage Fallback Active'}
          </span>
        </span>
        <span className="font-mono text-[11px] text-zinc-600">Local-First • Distraction-Free</span>
      </footer>

    </div>
  );
}