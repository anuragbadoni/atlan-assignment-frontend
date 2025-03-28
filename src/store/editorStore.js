import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

const useEditorStore = create((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

  fullScreen: false,
  toggleFullScreen: () => set((state) => ({ fullScreen: !state.fullScreen })),

  executionTime: 0,
  setExecutionTime: (newTime) => set(() => ({ executionTime: newTime })),

  queryLoading: false,
  setQueryLoading: (loading) => set(() => ({ queryLoading: loading })),

  openTabs: [],
  activeTabId: null,

  savedQueries: JSON.parse(localStorage.getItem("savedQueries")) || [
    { id: uuidv4(), name: "All Customers", query: "SELECT * FROM customers;" },
    { id: uuidv4(), name: "All Orders", query: "SELECT * FROM orders;" },
  ],

  addSavedQuery: (query) =>
    set((state) => {
      const updated = [...state.savedQueries, query];
      localStorage.setItem("savedQueries", JSON.stringify(updated));
      return { savedQueries: updated };
    }),

  queryHistory: [],
  addToHistory: (query) =>
    set((state) => ({ queryHistory: [query, ...state.queryHistory] })),

  openNewTab: (tab) =>
    set((state) => ({
      openTabs: [...state.openTabs, tab],
      activeTabId: tab.id,
    })),

  closeTab: (id) =>
    set((state) => {
      const filtered = state.openTabs.filter((t) => t.id !== id);
      return {
        openTabs: filtered,
        activeTabId: filtered.length ? filtered[0].id : null,
      };
    }),

  switchTab: (id) => set(() => ({ activeTabId: id })),

  updateTabQuery: (id, newQuery) =>
    set((state) => ({
      openTabs: state.openTabs.map((tab) =>
        tab.id === id ? { ...tab, query: newQuery } : tab
      ),
    })),

  updateTabResult: (id, result) =>
    set((state) => ({
      openTabs: state.openTabs.map((tab) =>
        tab.id === id ? { ...tab, result } : tab
      ),
    })),
}));

export default useEditorStore;
