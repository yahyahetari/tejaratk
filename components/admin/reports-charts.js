'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp,
  Users,
  Store
} from 'lucide-react';

export default function ReportsCharts({ monthlyData }) {
  const [activeChart, setActiveChart] = useState('users');

  // حساب أقصى قيمة للرسم البياني
  const maxValue = Math.max(
    ...monthlyData.map(d => Math.max(d.users, d.merchants)),
    1
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">النمو الشهري</h2>
          <p className="text-sm text-gray-500">تطور عدد المستخدمين والمتاجر خلال الأشهر الماضية</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveChart('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeChart === 'users' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-4 w-4" />
            المستخدمين
          </button>
          <button
            onClick={() => setActiveChart('merchants')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeChart === 'merchants' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Store className="h-4 w-4" />
            المتاجر
          </button>
          <button
            onClick={() => setActiveChart('both')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeChart === 'both' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            الكل
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Chart */}
        <div className="h-64 flex items-end justify-between gap-4">
          {monthlyData.length > 0 ? monthlyData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center gap-1 h-48">
                {(activeChart === 'users' || activeChart === 'both') && (
                  <div 
                    className="w-full max-w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                    style={{ 
                      height: `${(data.users / maxValue) * 100}%`,
                      minHeight: data.users > 0 ? '8px' : '0'
                    }}
                    title={`${data.users} مستخدم`}
                  ></div>
                )}
                {(activeChart === 'merchants' || activeChart === 'both') && (
                  <div 
                    className="w-full max-w-8 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500"
                    style={{ 
                      height: `${(data.merchants / maxValue) * 100}%`,
                      minHeight: data.merchants > 0 ? '8px' : '0'
                    }}
                    title={`${data.merchants} متجر`}
                  ></div>
                )}
              </div>
              <span className="text-xs text-gray-500 font-medium">{data.month}</span>
            </div>
          )) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>لا توجد بيانات كافية</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
          {(activeChart === 'users' || activeChart === 'both') && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-blue-400"></div>
              <span className="text-sm text-gray-600">المستخدمين</span>
            </div>
          )}
          {(activeChart === 'merchants' || activeChart === 'both') && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-emerald-500 to-emerald-400"></div>
              <span className="text-sm text-gray-600">المتاجر</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900">
            {monthlyData.reduce((sum, d) => sum + d.users, 0)}
          </p>
          <p className="text-sm text-gray-500">إجمالي المستخدمين</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900">
            {monthlyData.reduce((sum, d) => sum + d.merchants, 0)}
          </p>
          <p className="text-sm text-gray-500">إجمالي المتاجر</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900">
            {monthlyData.length > 0 ? Math.round(monthlyData.reduce((sum, d) => sum + d.users, 0) / monthlyData.length) : 0}
          </p>
          <p className="text-sm text-gray-500">متوسط المستخدمين/شهر</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900">
            {monthlyData.length > 0 ? Math.round(monthlyData.reduce((sum, d) => sum + d.merchants, 0) / monthlyData.length) : 0}
          </p>
          <p className="text-sm text-gray-500">متوسط المتاجر/شهر</p>
        </div>
      </div>
    </div>
  );
}
