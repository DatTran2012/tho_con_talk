"use strict";

/* -----------------------------------------------------------------------
   SECTION 1: POLYFILLS, CONSTANTS & SAFE STORAGE LAYER
------------------------------------------------------------------------ */
if (window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    const radius = Math.min(r || 0, Math.max(0, w / 2), Math.max(0, h / 2));
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + w, y, x + w, y + h, radius);
    this.arcTo(x + w, y + h, x, y + h, radius);
    this.arcTo(x, y + h, x, y, radius);
    this.arcTo(x, y, x + w, y, radius);
    this.closePath();
    return this;
  };
}

const APP_VERSION = "v3.1.0";
const STORAGE_KEY_ARCHIVE = "tho_con_talk_archive_v8";
const STORAGE_KEY_RUN = "tho_con_talk_run_v9";
const memoryStorageFallback = {};

function safeGetItem(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (err) {
    return memoryStorageFallback[key] || null;
  }
}

function safeSetItem(key, val) {
  try {
    window.localStorage.setItem(key, val);
  } catch (err) {
    memoryStorageFallback[key] = val;
  }
}

function safeRemoveItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    delete memoryStorageFallback[key];
  }
}

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const el = document.createElement("div");
  el.className = "px-3.5 py-2.5 rounded-2xl bg-stone-900/95 border border-amber-400/45 text-amber-100 text-xs shadow-xl transition-all duration-300";
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(-6px)";
    setTimeout(() => el.remove(), 300);
  }, 3200);
}
