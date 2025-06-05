import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Plus, Wallet, BarChart3, History, Target } from 'lucide-react';

const App = () => {
  // --- Nuevo estado para el usuario actual ---
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState('');

  // --- Estado pantalla y transacciones (por usuario) ---
  const [currentScreen, setCurrentScreen] = useState('home');
  const [transactions, setTransactions] = useState<any[]>([]);

  // --- Input para ingresos ---
  const [incomeAmount, setIncomeAmount] = useState('');

  const categories = [
    { id: 'comida', name: 'Comida', emoji: '🍕', color: '#10B981' },
    { id: 'transporte', name: 'Transporte', emoji: '🚗', color: '#3B82F6' },
    { id: 'ocio', name: 'Ocio', emoji: '🎮', color: '#8B5CF6' },
  ];

  // --- Funciones para guardar y cargar datos del localStorage por usuario ---
  const STORAGE_PREFIX = 'zombieFinance_';

  const saveUserData = (user: string, data: {transactions: any[], screen: string}) => {
    localStorage.setItem(`${STORAGE_PREFIX}${user}`, JSON.stringify(data));
  };

  const loadUserData = (user: string) => {
    const dataStr = localStorage.getItem(`${STORAGE_PREFIX}${user}`);
    if (!dataStr) return null;
    try {
      return JSON.parse(dataStr);
    } catch {
      return null;
    }
  };

  // --- Cuando cambia currentUser, cargar datos ---
  useEffect(() => {
    if (!currentUser) return;
    const data = loadUserData(currentUser);
    if (data) {
      setTransactions(data.transactions || []);
      setCurrentScreen(data.screen || 'home');
    } else {
      // Si es nuevo usuario, limpiar estado y poner pantalla home
      setTransactions([]);
      setCurrentScreen('home');
    }
  }, [currentUser]);

  // --- Guardar datos cada vez que cambian ---
  useEffect(() => {
    if (!currentUser) return;
    saveUserData(currentUser, { transactions, screen: currentScreen });
  }, [transactions, currentScreen, currentUser]);

  // --- Cálculos memorables ---
  const monthlyData = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    const expensesByCategory = categories.map(cat => {
      const total = transactions
        .filter(t => t.type === 'expense' && t.category === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...cat, value: total };
    }).filter(cat => cat.value > 0);

    return { totalIncome, totalExpenses, balance, expensesByCategory };
  }, [transactions]);

  // --- Añadir ingresos ---
  const addIncome = () => {
    if (incomeAmount && parseFloat(incomeAmount) > 0) {
      const newTransaction = {
        id: Date.now(),
        type: 'income',
        amount: parseFloat(incomeAmount),
        description: 'Ingreso',
        date: new Date().toISOString().slice(0, 10)
      };
      setTransactions([...transactions, newTransaction]);
      setIncomeAmount('');
      setCurrentScreen('home');
    }
  };

  // --- Añadir gasto ---
  const addExpense = (categoryId: string, amount: number) => {
    const newTransaction = {
      id: Date.now(),
      type: 'expense',
      amount,
      category: categoryId,
      date: new Date().toISOString().slice(0, 10)
    };
    setTransactions([...transactions, newTransaction]);
  };

  // --- Estado zombie ---
  const getZombieMood = () => {
    if (monthlyData.balance > 200) return { 
      zombie: '🧟‍♂️', 
      eyes: '👀', 
      message: 'RICH ZOMBIE!', 
      subtext: 'Dinero = Cerebros',
      color: 'text-green-400',
      glow: 'shadow-green-500/50'
    };
    if (monthlyData.balance > 0) return { 
      zombie: '🧟', 
      eyes: '🤖', 
      message: 'ZOMBIE OK', 
      subtext: 'Calculando...',
      color: 'text-cyan-400',
      glow: 'shadow-cyan-500/50'
    };
    if (monthlyData.balance > -100) return { 
      zombie: '🧟‍♀️', 
      eyes: '⚠️', 
      message: 'ZOMBIE ALERT', 
      subtext: 'Sistema crítico',
      color: 'text-yellow-400',
      glow: 'shadow-yellow-500/50'
    };
    return { 
      zombie: '🧟‍♂️', 
      eyes: '💀', 
      message: 'ZOMBIE BROKE', 
      subtext: 'Error fatal',
      color: 'text-red-400',
      glow: 'shadow-red-500/50'
    };
  };

  const zombieState = getZombieMood();

  // --- Pantalla LOGIN si no hay usuario ---
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-700 to-black text-white px-4">
        <h1 className="text-4xl mb-6 font-mono font-bold">ZOMBIE.FINANCE.EXE</h1>
        <div className="mb-4 w-full max-w-xs">
          <input 
            type="text" 
            placeholder="Enter your username" 
            value={usernameInput}
            onChange={e => setUsernameInput(e.target.value)}
            className="w-full rounded-2xl px-4 py-3 text-black font-mono text-lg"
            autoFocus
          />
        </div>
        <button
          disabled={!usernameInput.trim()}
          onClick={() => setCurrentUser(usernameInput.trim())}
          className="w-full max-w-xs bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-2xl py-3 font-bold text-lg font-mono transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          LOGIN
        </button>
      </div>
    );
  }

  // --- Botón Logout ---
  const logout = () => {
    setCurrentUser(null);
    setTransactions([]);
    setCurrentScreen('home');
  };

  // --- Aquí pones las pantallas que ya tienes, agregando un botón logout en el header para que el usuario pueda salir ---

  // Ejemplo en pantalla home con botón logout:

  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-black text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Header Futurista + Logout */}
          <div className="flex justify-between items-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-green-500/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono text-sm">ZOMBIE.FINANCE.EXE</span>
            </div>
            <button
              onClick={logout}
              className="text-green-400 font-mono text-sm border border-green-500/30 rounded-full px-3 py-1 hover:bg-green-700/30"
              title="Logout"
            >
              LOGOUT
            </button>
          </div>

          {/* Zombie Central Futurista */}
          <div className={`bg-gradient-to-br from-gray-800/60 to-black rounded-3xl py-12 px-10 mb-8 flex flex-col items-center space-y-2 ${zombieState.glow}`}>
            <div className="text-6xl mb-3">{zombieState.zombie}</div>
            <div className="text-4xl font-extrabold">{zombieState.message}</div>
            <div className="text-xs font-bold uppercase tracking-wide text-green-400">{zombieState.subtext}</div>
            <div className="text-6xl">{zombieState.eyes}</div>
          </div>

          {/* Información mensual */}
          <div className="flex justify-around mb-8">
            <div className="text-center">
              <div className="text-green-400 text-lg font-bold">Ingresos</div>
              <div className="text-2xl font-mono font-bold">{monthlyData.totalIncome.toFixed(2)} S/</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 text-lg font-bold">Gastos</div>
              <div className="text-2xl font-mono font-bold">{monthlyData.totalExpenses.toFixed(2)} S/</div>
            </div>
            <div className="text-center">
              <div className="text-white text-lg font-bold">Saldo</div>
              <div className="text-2xl font-mono font-bold">{monthlyData.balance.toFixed(2)} S/</div>
            </div>
          </div>

          {/* Botones principales */}
          <div className="flex justify-around space-x-4">
            <button
              onClick={() => setCurrentScreen('addIncome')}
              className="bg-green-600 rounded-xl py-3 px-6 flex items-center space-x-2 hover:bg-green-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Ingreso</span>
            </button>
            <button
              onClick={() => setCurrentScreen('addExpense')}
              className="bg-red-600 rounded-xl py-3 px-6 flex items-center space-x-2 hover:bg-red-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Gasto</span>
            </button>
          </div>

          {/* Gráfica de gastos por categoría */}
          {monthlyData.expensesByCategory.length > 0 && (
            <div className="mt-8 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={monthlyData.expensesByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    label={(entry) => `${entry.emoji} ${entry.name}`}
                  >
                    {monthlyData.expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Pantalla agregar ingreso ---
  if (currentScreen === 'addIncome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-black text-white px-4 py-8 max-w-md mx-auto">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center text-green-400 mb-6 hover:underline"
        >
          <ArrowLeft className="mr-2" /> Volver
        </button>
        <h2 className="text-3xl font-bold mb-6 font-mono">Agregar Ingreso</h2>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Monto en S/"
          value={incomeAmount}
          onChange={(e) => setIncomeAmount(e.target.value)}
          className="w-full rounded-2xl px-4 py-3 text-black font-mono text-lg mb-4"
        />
        <button
          onClick={addIncome}
          disabled={!incomeAmount || parseFloat(incomeAmount) <= 0}
          className="w-full bg-green-600 rounded-2xl py-3 font-bold font-mono text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Guardar Ingreso
        </button>
      </div>
    );
  }

  // --- Pantalla agregar gasto ---
  if (currentScreen === 'addExpense') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-black text-white px-4 py-8 max-w-md mx-auto">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center text-red-400 mb-6 hover:underline"
        >
          <ArrowLeft className="mr-2" /> Volver
        </button>
        <h2 className="text-3xl font-bold mb-6 font-mono">Agregar Gasto</h2>
        <div className="space-y-4">
          {categories.map(cat => (
            <ExpenseInputRow key={cat.id} category={cat} onAdd={addExpense} />
          ))}
        </div>
      </div>
    );
  }

  // --- Componente para ingresar gasto por categoría ---
  function ExpenseInputRow({ category, onAdd }: { category: any, onAdd: (catId: string, amount: number) => void }) {
    const [amount, setAmount] = useState('');
    return (
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl" style={{backgroundColor: category.color + '40'}}>
          <span className="text-2xl">{category.emoji}</span>
        </div>
        <span className="flex-1 font-mono font-bold">{category.name}</span>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="S/"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-24 rounded-xl px-2 py-1 text-black font-mono"
        />
        <button
          disabled={!amount || parseFloat(amount) <= 0}
          onClick={() => {
            if (amount && parseFloat(amount) > 0) {
              onAdd(category.id, parseFloat(amount));
              setAmount('');
            }
          }}
          className="text-red-500 font-bold font-mono hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </div>
    );
  }

  return null;
};

export default App;

