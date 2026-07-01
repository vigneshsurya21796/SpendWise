import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdEdit, MdDelete, MdSearch } from "react-icons/md";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Food", "Transport", "Shopping", "Entertainment", "Health", "Bills", "Education", "Travel", "Other"];
const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€" };

// ── Edit Modal ──────────────────────────────────────────────
const EditModal = ({ expense, onClose }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      merchant: expense.merchant,
      amount: expense.amount,
      date: expense.date?.slice(0, 10),
      category: expense.category,
      notes: expense.notes || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.put(`/expenses/${expense._id}`, { ...data, amount: Number(data.amount) });
      toast.success("Expense updated");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["stats-summary"] });
      queryClient.invalidateQueries({ queryKey: ["stats-categories"] });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Expense</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Merchant"
            {...register("merchant", { required: true })}
          />
          <input
            type="number"
            step="0.01"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
            {...register("amount", { required: true })}
          />
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("date", { required: true })}
          />
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("category", { required: true })}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Notes (optional)"
            rows={2}
            {...register("notes")}
          />
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60">
              {isSubmitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Delete Modal ─────────────────────────────────────────────
const DeleteModal = ({ expense, onClose }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/expenses/${expense._id}`);
      toast.success("Expense deleted");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["stats-summary"] });
      queryClient.invalidateQueries({ queryKey: ["stats-categories"] });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Expense?</h3>
        <p className="text-sm text-gray-500 mb-5">
          This will permanently delete <span className="font-medium">{expense.merchant}</span>.
        </p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-60">
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────
const Expenses = () => {
  const { user } = useAuth();
  const symbol = CURRENCY_SYMBOLS[user?.currency] || "₹";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (month) params.append("month", month);

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses", search, category, month],
    queryFn: () => api.get(`/expenses?${params.toString()}`).then((r) => r.data.data),
  });

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            placeholder="Search merchant…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input
          type="month"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        {(search || category || month) && (
          <button
            onClick={() => { setSearch(""); setCategory(""); setMonth(""); }}
            className="text-sm text-gray-500 hover:text-gray-800 underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : expenses.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">No expenses found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 font-medium">Merchant</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Notes</th>
                <th className="px-5 py-3 font-medium text-right">Amount</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">{e.merchant}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{e.category}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{new Date(e.date).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-3 text-gray-400 max-w-37.5 truncate">{e.notes || "—"}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-800">{symbol}{e.amount.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditTarget(e)} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <MdEdit className="text-lg" />
                      </button>
                      <button onClick={() => setDeleteTarget(e)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <MdDelete className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editTarget && <EditModal expense={editTarget} onClose={() => setEditTarget(null)} />}
      {deleteTarget && <DeleteModal expense={deleteTarget} onClose={() => setDeleteTarget(null)} />}
    </div>
  );
};

export default Expenses;
