/* eslint-disable no-unused-vars */
import React from 'react';
import { Flame, Droplet, Wheat, Target } from 'lucide-react';

const DashboardHome = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard</h2>
        <p className="text-gray-400">Here is your daily summary based on your logged meals and activity.</p>
      </header>

      {/* HERO CARD: Daily Calorie Equation */}
      <div className="bg-[#121212] border border-gray-800 rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-gray-200">Calories Remaining</h3>
        
        <div className="flex items-center justify-between text-center mb-8 bg-[#0A1128] p-6 rounded-xl border border-gray-800">
          <div>
            <p className="text-sm text-gray-400 mb-1">Base Goal</p>
            <p className="text-2xl font-bold text-white">2,100</p>
          </div>
          <div className="text-2xl font-light text-gray-600">-</div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Food (Logged)</p>
            <p className="text-2xl font-bold text-[#007BFF]">1,450</p>
          </div>
          <div className="text-2xl font-light text-gray-600">+</div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Exercise Burn</p>
            <p className="text-2xl font-bold text-green-400">300</p>
          </div>
          <div className="text-2xl font-light text-gray-600">=</div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Remaining</p>
            <p className="text-3xl font-bold text-white">950</p>
          </div>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-4 mb-2 overflow-hidden">
          <div className="bg-[#007BFF] h-4 rounded-full" style={{ width: '55%' }}></div>
        </div>
        <p className="text-right text-xs text-gray-500">55% of daily target reached</p>
      </div>

      {/* BOTTOM METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Macros Card */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Target size={20} className="text-[#007BFF]" />
            Macronutrients
          </h3>
          <div className="space-y-5">
            <MacroBar label="Protein" current={60} target={150} color="bg-blue-500" icon={Flame} />
            <MacroBar label="Carbs" current={200} target={250} color="bg-purple-500" icon={Wheat} />
            <MacroBar label="Fats" current={45} target={65} color="bg-orange-500" icon={Droplet} />
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-6 text-gray-200">Today's Log</h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-center pb-3 border-b border-gray-800">
              <div>
                <p className="font-medium text-white">Jollof Rice & Chicken</p>
                <p className="text-xs text-gray-500">Lunch • 2 Servings</p>
              </div>
              <span className="text-sm font-bold text-[#007BFF]">850 kcal</span>
            </li>
            <li className="flex justify-between items-center pb-3 border-b border-gray-800">
              <div>
                <p className="font-medium text-white">Akara & Pap</p>
                <p className="text-xs text-gray-500">Breakfast</p>
              </div>
              <span className="text-sm font-bold text-[#007BFF]">600 kcal</span>
            </li>
            <li className="flex justify-between items-center pb-3 border-b border-gray-800 border-none">
              <div>
                <p className="font-medium text-white">Brisk Walk</p>
                <p className="text-xs text-gray-500">Exercise • 45 mins</p>
              </div>
              <span className="text-sm font-bold text-green-400">-300 kcal</span>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
  );
};

// Reusable Component for Macro Progress Bars
const MacroBar = ({ label, current, target, color, icon: IconComponent }) => {
  const percentage = Math.min(100, Math.round((current / target) * 100));
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300 flex items-center gap-1">
          <IconComponent size={14} className="text-gray-500" /> {label} size={14} className="text-gray-500" /&gt; {label}
        </span>
        <span className="text-gray-400">{current}g <span className="text-gray-600">/ {target}g</span></span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default DashboardHome;