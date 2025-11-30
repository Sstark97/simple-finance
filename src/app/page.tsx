'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Dashboard } from '../domain/models/Dashboard';
import Link from "next/link";

// Función para obtener el mes en formato YYYY-MM
const getYearMonth = (date: Date) => date.toISOString().slice(0, 7);

export default function Home() {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(getYearMonth(new Date()));

  // Formulario de Transacción
  const [newTransaction, setNewTransaction] = useState({
    fechaCobro: new Date().toISOString().split('T')[0],
    concepto: '',
    importe: 0,
    categoria: '',
  });

  // Formulario de Ajustes Mensuales
  const [monthlySettings, setMonthlySettings] = useState({
    month: new Date().toISOString().split('T')[0],
    ingresos: 0,
    ahorro: 0,
    inversion: 0,
  });

  // Formulario de Patrimonio Neto
  const [netWorth, setNetWorth] = useState({
    month: new Date().toISOString().split('T')[0],
    hucha: 0,
    invertido: 0,
  });
  
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setDashboardData(null);

      const res = await fetch(`/api/dashboard?month=${selectedMonth}-01`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch dashboard data');
      }
      
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  // Cargar datos del Dashboard al montar y cuando cambie el mes seleccionado
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || 'Failed to add transaction');
      }
      alert('Transacción añadida con éxito!');
      // Recargar datos del dashboard para reflejar el nuevo gasto
      fetchDashboardData();
      setNewTransaction({ fechaCobro: new Date().toISOString().split('T')[0], concepto: '', importe: 0, categoria: '' });
    } catch (err: any) {
      alert(`Error al añadir transacción: ${err.message}`);
      console.error(err);
    }
  };

  const handleMonthlySettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(monthlySettings),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || 'Failed to update monthly settings');
      }
      alert('Ajustes mensuales actualizados con éxito!');
      const data: Dashboard = await res.json();
      // Si el mes actualizado es el que se está viendo, se actualiza el estado
      if (getYearMonth(new Date(data.mes)) === selectedMonth) {
        setDashboardData(data);
      }
    } catch (err: any) {
      alert(`Error al actualizar ajustes mensuales: ${err.message}`);
      console.error(err);
    }
  };

  const handleNetWorthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/networth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(netWorth),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || 'Failed to update net worth');
      }
      alert('Patrimonio neto actualizado con éxito!');
    } catch (err: any) {
      alert(`Error al actualizar patrimonio neto: ${err.message}`);
      console.error(err);
    }
  };


  const ingresos = dashboardData?.ingresos || 0;
  const gastos = dashboardData?.gastos || 0;
  const ahorro = dashboardData?.ahorro || 0;
  const inversion = dashboardData?.inversion || 0;
  const dineroLibre = dashboardData?.dineroLibre || 0;
  const estado = dashboardData?.estado || 'N/A';

  const totalGoals = ahorro + inversion;
  const balance = ingresos - gastos;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Finanzas Personales</h1>

        <nav className="flex justify-center gap-6 mb-6">
          <Link href="/gastos" className="text-blue-600 hover:underline font-medium">
            Ver Historial de Gastos
          </Link>
          <Link href="/patrimonio" className="text-blue-600 hover:underline font-medium">
            Ver Historial de Patrimonio
          </Link>
        </nav>

        {/* Selector de Mes */}
        <section className="month-selector flex items-center gap-4">
            <label htmlFor="month-select" className="font-medium text-gray-700">Seleccionar Mes:</label>
            <input
                type="month"
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
        </section>


        {loading && <div className="text-center p-4 text-blue-600">Cargando datos del dashboard...</div>}
        {error && <div className="text-center p-4 text-red-600 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>}

        {/* Resumen del Dashboard */}
        {dashboardData && !loading && (
          <section className="dashboard-summary bg-blue-50 p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Dashboard Mensual</h2>
            <p className="text-gray-700"><strong>Mes:</strong> {new Date(dashboardData.mes).toLocaleDateString('es-ES', { timeZone: 'UTC', month: 'long', year: 'numeric' })}</p>
            <p className="text-2xl font-bold text-green-600 my-2">Dinero Libre: {dineroLibre.toFixed(2)} €</p>
            <div className="text-sm text-gray-600 grid grid-cols-2 gap-x-4">
              <p>Ingresos: {ingresos.toFixed(2)} €</p>
              <p>Gastos: {gastos.toFixed(2)} €</p>
              <p>Ahorro Obj.: {ahorro.toFixed(2)} €</p>
              <p>Inversión Obj.: {inversion.toFixed(2)} €</p>
              <p>Balance: {balance.toFixed(2)} €</p>
              <p>Obj. Totales: {totalGoals.toFixed(2)} €</p>
              <p className="font-semibold mt-2 col-span-2">Estado: {estado}</p>
            </div>
          </section>
        )}

        {/* Formulario Añadir Transacción */}
        <section className="transaction-form bg-green-50 p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-green-800 mb-3">Añadir Transacción</h2>
          <form onSubmit={handleTransactionSubmit} className="space-y-4">
            <div>
              <label htmlFor="fechaCobro" className="block text-sm font-medium text-gray-700">Fecha</label>
              <input
                type="date"
                id="fechaCobro"
                value={newTransaction.fechaCobro}
                onChange={(e) => setNewTransaction({ ...newTransaction, fechaCobro: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="concepto" className="block text-sm font-medium text-gray-700">Concepto</label>
              <input
                type="text"
                id="concepto"
                value={newTransaction.concepto}
                onChange={(e) => setNewTransaction({ ...newTransaction, concepto: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="importe" className="block text-sm font-medium text-gray-700">Importe (€)</label>
              <input
                type="number"
                id="importe"
                value={newTransaction.importe}
                onChange={(e) => setNewTransaction({ ...newTransaction, importe: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
              <input
                type="text"
                id="categoria"
                value={newTransaction.categoria}
                onChange={(e) => setNewTransaction({ ...newTransaction, categoria: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Añadir Transacción
            </button>
          </form>
        </section>

        {/* Formulario de Ajustes Mensuales */}
        <section className="monthly-settings-form bg-yellow-50 p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-yellow-800 mb-3">Ajustes Mensuales</h2>
          <form onSubmit={handleMonthlySettingsSubmit} className="space-y-4">
            <div>
              <label htmlFor="settingsMonth" className="block text-sm font-medium text-gray-700">Mes</label>
              <input
                type="date"
                id="settingsMonth"
                value={monthlySettings.month}
                onChange={(e) => setMonthlySettings({ ...monthlySettings, month: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="ingresos" className="block text-sm font-medium text-gray-700">Ingresos</label>
              <input
                type="number"
                id="ingresos"
                value={monthlySettings.ingresos}
                onChange={(e) => setMonthlySettings({ ...monthlySettings, ingresos: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="ahorro" className="block text-sm font-medium text-gray-700">Ahorro Objetivo</label>
              <input
                type="number"
                id="ahorro"
                value={monthlySettings.ahorro}
                onChange={(e) => setMonthlySettings({ ...monthlySettings, ahorro: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="inversion" className="block text-sm font-medium text-gray-700">Inversión Objetivo</label>
              <input
                type="number"
                id="inversion"
                value={monthlySettings.inversion}
                onChange={(e) => setMonthlySettings({ ...monthlySettings, inversion: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2"
                step="0.01"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Actualizar Ajustes Mensuales
            </button>
          </form>
        </section>

        {/* Formulario de Patrimonio Neto */}
        <section className="networth-form bg-purple-50 p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-purple-800 mb-3">Actualizar Patrimonio Neto</h2>
          <form onSubmit={handleNetWorthSubmit} className="space-y-4">
            <div>
              <label htmlFor="netWorthMonth" className="block text-sm font-medium text-gray-700">Mes</label>
              <input
                type="date"
                id="netWorthMonth"
                value={netWorth.month}
                onChange={(e) => setNetWorth({ ...netWorth, month: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="hucha" className="block text-sm font-medium text-gray-700">Hucha (Efectivo)</label>
              <input
                type="number"
                id="hucha"
                value={netWorth.hucha}
                onChange={(e) => setNetWorth({ ...netWorth, hucha: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="invertido" className="block text-sm font-medium text-gray-700">Invertido</label>
              <input
                type="number"
                id="invertido"
                value={netWorth.invertido}
                onChange={(e) => setNetWorth({ ...netWorth, invertido: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
                step="0.01"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Actualizar Patrimonio Neto
            </button>
          </form>
        </section>

      </div>
    </main>
  );
}
