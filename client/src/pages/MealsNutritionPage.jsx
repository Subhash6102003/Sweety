import React, { useState } from 'react';
import { Utensils, Apple, Flame, Clock, Plus, TrendingUp, X, CheckCircle2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEFAULT_MEALS = [
  {
    id: 1,
    meal: 'Breakfast',
    time: '08:45 AM',
    items: 'Steel-cut oats, chia seeds, almond butter',
    carbs: 34,
    protein: 12,
    fats: 14,
    impact: 'Optimal Postprandial Curve'
  },
  {
    id: 2,
    meal: 'Lunch',
    time: '12:30 PM',
    items: 'Grilled chicken breast, brown rice, green salad',
    carbs: 58,
    protein: 42,
    fats: 16,
    impact: 'Moderate Post-Meal Rise'
  }
];

export const MealsNutritionPage = () => {
  const { user } = useAuth();
  const isDemo = user?.email === 'demo@sweety.app';
  const storageKey = `sweety_meals_${user?.id || 'guest'}`;

  const [meals, setMeals] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
      return isDemo ? DEFAULT_MEALS : [];
    } catch {
      return isDemo ? DEFAULT_MEALS : [];
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [mealSlot, setMealSlot] = useState('Breakfast');
  const [items, setItems] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fats, setFats] = useState('');
  const [toast, setToast] = useState('');

  const handleLogMeal = (e) => {
    e.preventDefault();
    if (!items.trim() || !carbs) return;

    const newMeal = {
      id: Date.now(),
      meal: mealSlot,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: items.trim(),
      carbs: Number(carbs) || 0,
      protein: Number(protein) || 0,
      fats: Number(fats) || 0,
      impact: Number(carbs) > 60 ? 'High Carbohydrate Load' : 'Moderate Glycemic Load'
    };

    const updated = [newMeal, ...meals];
    setMeals(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save meals:', err);
    }

    setToast(`Logged "${mealSlot}" with ${carbs}g carbs`);
    setTimeout(() => setToast(''), 3000);
    setItems('');
    setCarbs('');
    setProtein('');
    setFats('');
    setModalOpen(false);
  };

  const handleDeleteMeal = (id) => {
    const updated = meals.filter(m => m.id !== id);
    setMeals(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to delete meal:', err);
    }
  };

  // Macro Totals
  const totalCarbs = meals.reduce((sum, m) => sum + (Number(m.carbs) || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (Number(m.protein) || 0), 0);
  const totalFats = meals.reduce((sum, m) => sum + (Number(m.fats) || 0), 0);

  return (
    <div className="flex flex-col w-full space-y-6 pb-12 font-sans text-on-surface">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
              NUTRITIONAL TELEMETRY &bull; MACRO LOGGING
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Meals &amp; Nutritional Telemetry
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-2xl">
            Carbohydrate macro distribution, glycemic load impacts, and real-time meal bolus calculations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs shadow-sm hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Log Meal &amp; Carbs</span>
        </button>
      </div>

      {/* Daily Macro Summary (Calculated from real meals) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30">
          <span className="text-xs font-bold text-outline uppercase tracking-wider block">Total Carbohydrates</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-3xl font-extrabold text-primary tabular-nums">{totalCarbs}g</span>
            <span className="text-xs text-outline font-semibold">of 140g target</span>
          </div>
          <p className="text-xs text-outline font-medium mt-1">
            {totalCarbs > 0 ? `${meals.length} meal entries recorded` : 'Awaiting today\'s meal logs'}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30">
          <span className="text-xs font-bold text-outline uppercase tracking-wider block">Total Protein</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">{totalProtein}g</span>
            <span className="text-xs text-outline font-semibold">consumed</span>
          </div>
          <p className="text-xs text-outline font-medium mt-1">Supports sustained satiety</p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30">
          <span className="text-xs font-bold text-outline uppercase tracking-wider block">Healthy Fats</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-3xl font-extrabold text-on-surface tabular-nums">{totalFats}g</span>
            <span className="text-xs text-outline font-semibold">consumed</span>
          </div>
          <p className="text-xs text-outline font-medium mt-1">Blunts rapid glycemic absorption</p>
        </div>
      </div>

      {/* Meals Log List */}
      {meals.length > 0 ? (
        <div className="space-y-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-bold text-on-surface">{meal.meal}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold text-[10px]">
                      {meal.time}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">{meal.items}</p>
                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="font-bold text-primary tabular-nums">{meal.carbs}g Carbs</span>
                    {meal.protein > 0 && <span className="text-outline tabular-nums">&bull; {meal.protein}g Protein</span>}
                    {meal.fats > 0 && <span className="text-outline tabular-nums">&bull; {meal.fats}g Fats</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface text-xs font-semibold border border-outline-variant/30">
                  {meal.impact}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteMeal(meal.id)}
                  title="Remove Meal Entry"
                  className="p-1.5 rounded-lg text-outline hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-surface-container-lowest border border-dashed border-outline-variant/60 text-center space-y-3">
          <Utensils className="w-10 h-10 text-outline mx-auto" />
          <div>
            <strong className="text-sm font-bold text-on-surface block">No Meals Logged Today</strong>
            <p className="text-xs text-outline max-w-sm mx-auto mt-1">
              Log your breakfast, lunch, or dinner carbohydrate counts to calculate postprandial glycemic impact.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs shadow-xs hover:bg-primary-container transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log First Meal</span>
          </button>
        </div>
      )}

      {/* LOG MEAL MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-surface-container-lowest">
              <div>
                <h3 className="font-display font-bold text-base text-on-surface">Log Meal &amp; Carbohydrates</h3>
                <p className="text-xs text-outline">Record foods, carbohydrate grams, and macro details.</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleLogMeal} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Meal Window *</label>
                  <select
                    value={mealSlot}
                    onChange={(e) => setMealSlot(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Breakfast">Breakfast (Morning)</option>
                    <option value="Lunch">Lunch (Midday)</option>
                    <option value="Dinner">Dinner (Evening)</option>
                    <option value="Snack">Snack / Pre-Workout</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Total Carbs (grams) *</label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    required
                    placeholder="e.g. 45"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Foods / Items Consumed *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="e.g. 1 bowl oatmeal, 1 banana, almond milk"
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  className="w-full p-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-semibold focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Protein (g) (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 20"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Fats (g) (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 10"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/40 text-xs font-bold text-outline hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-all cursor-pointer"
                >
                  Save Meal Log
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
