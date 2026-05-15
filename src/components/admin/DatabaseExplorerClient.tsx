"use client";

import React, { useState, useTransition } from "react";
import { Database, Loader2, Table, RefreshCw, ChevronDown } from "lucide-react";
import { fetchTableData } from "@/actions/admin-core";
import toast from "react-hot-toast";

const TABLES = [
  { value: "profiles", label: "User Profiles" },
  { value: "blogs", label: "Blog Posts" },
  { value: "site_stats", label: "Analytics Stats" },
  { value: "indexed_urls", label: "SEO Indexed URLs" },
];

export default function DatabaseExplorerClient() {
  const [selectedTable, setSelectedTable] = useState("profiles");
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isPending, startFetch] = useTransition();

  const loadTable = (table: string) => {
    startFetch(async () => {
      const res = await fetchTableData(table);
      if (res.success) {
        setRows(res.rows);
        setRowCount(res.count ?? res.rows.length);
        setColumns(res.rows.length > 0 ? Object.keys(res.rows[0]) : []);
        setHasLoaded(true);
      } else {
        toast.error(res.error || "Failed to fetch table data");
      }
    });
  };

  const handleTableChange = (table: string) => {
    setSelectedTable(table);
    setRows([]);
    setColumns([]);
    setHasLoaded(false);
    loadTable(table);
  };

  const formatCell = (value: any) => {
    if (value === null || value === undefined) return <span className="text-slate-300 dark:text-slate-600 italic text-[10px]">null</span>;
    if (typeof value === "boolean") return value ? <span className="text-emerald-500 font-bold text-[10px]">true</span> : <span className="text-rose-500 font-bold text-[10px]">false</span>;
    const str = String(value);
    if (str.length > 60) return <span title={str}>{str.slice(0, 57)}…</span>;
    return str;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-purple-600 rounded-xl shadow-lg shadow-purple-600/25">
            <Database className="text-white w-6 h-6" />
          </div>
          Database Explorer
        </h2>
        <p className="text-slate-500 mt-1 text-sm">Inspect Supabase tables (read-only · 100 rows max).</p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Select Table</label>
            <div className="relative">
              <select
                value={selectedTable}
                onChange={(e) => handleTableChange(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none font-medium cursor-pointer"
              >
                {TABLES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
          <div className="sm:pt-6">
            <button
              onClick={() => loadTable(selectedTable)}
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black rounded-2xl text-sm transition-all shadow-lg shadow-purple-600/25"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Load / Refresh
            </button>
          </div>
        </div>

        {/* Row count */}
        {hasLoaded && (
          <div className="mt-4 flex items-center gap-2">
            <Table size={14} className="text-purple-500" />
            <span className="text-xs font-bold text-slate-500">
              Showing <span className="text-purple-600 dark:text-purple-400">{rows.length}</span> of {rowCount} rows from <code className="bg-slate-100 dark:bg-slate-800 px-1.5 rounded text-purple-600 dark:text-purple-400">{selectedTable}</code>
            </span>
          </div>
        )}
      </div>

      {/* Table Output */}
      {isPending && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
          <p className="text-sm text-slate-500">Fetching rows...</p>
        </div>
      )}

      {!isPending && hasLoaded && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
          {rows.length === 0 ? (
            <div className="py-20 text-center">
              <Database size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">This table has no rows.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-purple-50/70 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 border-b border-purple-100 dark:border-purple-900/40">
                  <tr>
                    <th className="px-4 py-3 font-black tracking-widest uppercase w-10">#</th>
                    {columns.map((col) => (
                      <th key={col} className="px-4 py-3 font-black tracking-widest uppercase whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3 text-slate-400 font-mono">{i + 1}</td>
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-3 text-slate-700 dark:text-slate-300 font-mono whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
                          {formatCell(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
