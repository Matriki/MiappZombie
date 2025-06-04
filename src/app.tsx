import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Plus, Wallet, BarChart3, History, Target } from 'lucide-react';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', amount: 500, description: 'Mesada', date: '2025-05-01' },
    { id: 2, type: 'expense', amount: 35, category: 'comida', date: '2025-05-03' },
    { id: 3, type: 'expense', amount: 15, category: 'transporte', date: '2025-05-05' },
    { id: 4, type: 'expense', amount: 25, category: 'ocio', date: '2025-05-07' },
  ]);

  const [incomeAmount, setIncomeAmount] = useState('');

  const categories = [
    { id: 'comida', name: 'Comida', emoji: '🍕', color: '#10B981' },
    { id: 'transporte', name: 'Transporte', emoji: '🚗', color: '#3B82F6' },
    { id: 'ocio', name: 'Ocio', emoji: '🎮', color: '#8B5CF6' },
  ];

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

  const addExpense = (categoryId, amount) => {
    const newTransaction = {
      id: Date.now(),
      type: 'expense',
      amount: amount,
      category: categoryId,
      date: new Date().toISOString().slice(0, 10)
    };
    setTransactions([...transactions, newTransaction]);
  };

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

  // Pantalla Principal
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-black text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Header Futurista */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-green-500/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono text-sm">ZOMBIE.FINANCE.EXE</span>
            </div>
          </div>

          {/* Zombie Central Futurista */}
          <div className={`bg-gradient-to-br from-gray-800/60 to-black/80 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 text-center mb-8 ${zombieState.glow} shadow-2xl`}>
            <div className="relative mb-6">
              <div className="text-8xl mb-2 relative">
                {zombieState.zombie}
                <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                  {zombieState.eyes}
                </div>
              </div>
              <div className="flex justify-center space-x-1 mb-4">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>

            <div className="bg-black/50 rounded-2xl p-4 mb-4 border border-green-500/20">
              <div className={`text-3xl font-bold font-mono ${zombieState.color} mb-2`}>
                ${Math.abs(monthlyData.balance).toLocaleString()}
              </div>
              <div className={`text-sm font-mono ${zombieState.color} mb-2`}>
                {zombieState.message}
              </div>
              <div className="text-xs text-gray-400 font-mono">
                {zombieState.subtext}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                <div className="text-green-400">↑ ENTRADA</div>
                <div className="text-white font-bold">${monthlyData.totalIncome}</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <div className="text-red-400">↓ SALIDA</div>
                <div className="text-white font-bold">${monthlyData.totalExpenses}</div>
              </div>
            </div>
          </div>

          {/* Menu Principal */}
          <div className="space-y-4">
            <button
              onClick={() => setCurrentScreen('income')}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-2xl py-4 font-bold text-lg transition-all transform hover:scale-105 shadow-lg border border-green-500/30"
            >
              <div className="flex items-center justify-center space-x-3">
                <Plus className="w-6 h-6" />
                <span className="font-mono">💰 ADD MONEY</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentScreen('expenses')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-2xl py-4 font-bold text-lg transition-all transform hover:scale-105 shadow-lg border border-purple-500/30"
            >
              <div className="flex items-center justify-center space-x-3">
                <Target className="w-6 h-6" />
                <span className="font-mono">💸 SPEND MONEY</span>
              </div>
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentScreen('stats')}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 rounded-2xl py-4 font-bold transition-all transform hover:scale-105 shadow-lg border border-cyan-500/30"
              >
                <div className="flex items-center justify-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-mono text-sm">STATS</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentScreen('history')}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 rounded-2xl py-4 font-bold transition-all transform hover:scale-105 shadow-lg border border-orange-500/30"
              >
                <div className="flex items-center justify-center space-x-2">
                  <History className="w-5 h-5" />
                  <span className="font-mono text-sm">LOG</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla Agregar Dinero
  if (currentScreen === 'income') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-black text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center mr-4 border border-green-500/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-mono text-green-400">ADD MONEY.EXE</h1>
          </div>

          {/* Zombie Pequeño */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🧟‍♂️💰</div>
            <div className="text-green-400 font-mono">ZOMBIE NEEDS MONEY</div>
          </div>

          {/* Input Principal */}
          <div className="bg-gray-800/60 backdrop-blur-xl border border-green-500/30 rounded-3xl p-6 mb-6">
            <input
              type="number"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              className="w-full bg-black/50 border border-green-500/30 rounded-2xl px-6 py-6 text-4xl text-center font-bold font-mono text-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-green-400/50"
              placeholder="0"
              autoFocus
            />
          </div>

          {/* Botones Rápidos */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[50, 100, 200, 300, 500, 1000].map(amount => (
              <button
                key={amount}
                onClick={() => setIncomeAmount(amount.toString())}
                className="bg-gray-800/50 hover:bg-gray-700/50 border border-green-500/30 rounded-xl py-4 font-mono font-bold text-green-400 transition-colors"
              >
                ${amount}
              </button>
            ))}
          </div>

          {/* Botón Confirmar */}
          <button
            onClick={addIncome}
            disabled={!incomeAmount || parseFloat(incomeAmount) <= 0}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl py-4 font-bold font-mono text-lg transition-all shadow-lg border border-green-500/30"
          >
            EXECUTE ADD_MONEY()
          </button>
        </div>
      </div>
    );
  }

  // Pantalla Gastos
  if (currentScreen === 'expenses') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center mr-4 border border-purple-500/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-mono text-purple-400">SPEND MONEY.EXE</h1>
          </div>

          {/* Zombie Pequeño */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🧟‍♀️💸</div>
            <div className="text-purple-400 font-mono">ZOMBIE WANTS STUFF</div>
          </div>

          {/* Categorías */}
          <div className="space-y-6">
            {categories.map(category => (
              <div key={category.id} className="bg-gray-800/60 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{category.emoji}</div>
                    <div>
                      <div className="font-bold font-mono text-lg">{category.name.toUpperCase()}</div>
                      <div className="text-sm text-gray-400 font-mono">
                        SPENT: ${monthlyData.expensesByCategory.find(c => c.id === category.id)?.value || 0}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 25, 50].map(amount => (
                    <button
                      key={amount}
                      onClick={() => {
                        addExpense(category.id, amount);
                        setCurrentScreen('home');
                      }}
                      className="bg-gray-700/50 hover:bg-gray-600/50 border border-purple-500/30 rounded-xl py-3 font-mono font-bold text-purple-400 transition-colors"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Pantalla Estadísticas
  if (currentScreen === 'stats') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900/20 to-black text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center mr-4 border border-cyan-500/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-mono text-cyan-400">STATS.EXE</h1>
          </div>

          {/* Zombie Pequeño */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🧟‍♂️📊</div>
            <div className="text-cyan-400 font-mono">ZOMBIE ANALYTICS</div>
          </div>

          {/* Gráfica */}
          {monthlyData.expensesByCategory.length > 0 ? (
            <div className="bg-gray-800/60 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 mb-6">
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={monthlyData.expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {monthlyData.expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                {monthlyData.expensesByCategory.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between bg-black/30 rounded-xl p-3 border border-cyan-500/20">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      ></div>
                      <span className="font-mono">{cat.emoji} {cat.name.toUpperCase()}</span>
                    </div>
                    <span className="font-bold font-mono text-cyan-400">${cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/60 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 text-center">
              <div className="text-4xl mb-4">📈</div>
              <div className="text-cyan-400 font-mono">NO DATA FOUND</div>
              <div className="text-gray-400 text-sm font-mono mt-2">SPEND MONEY TO SEE STATS</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pantalla Historial
  if (currentScreen === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900/20 to-black text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center mr-4 border border-orange-500/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-mono text-orange-400">HISTORY.LOG</h1>
          </div>

          {/* Zombie Pequeño */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🧟‍♀️📚</div>
            <div className="text-orange-400 font-mono">ZOMBIE MEMORY BANK</div>
          </div>

          {/* Lista de Transacciones */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.slice().reverse().map(transaction => {
              const category = categories.find(c => c.id === transaction.category);
              return (
                <div key={transaction.id} className="bg-gray-800/60 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {transaction.type === 'income' ? '💰' : category?.emoji || '💸'}
                      </div>
                      <div>
                        <div className="font-mono font-bold">
                          {transaction.type === 'income' ? 'MONEY_IN' : `${category?.name.toUpperCase() || 'SPEND'}`}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {new Date(transaction.date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold font-mono ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default App;
