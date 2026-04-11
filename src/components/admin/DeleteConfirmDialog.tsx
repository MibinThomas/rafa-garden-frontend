"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export function DeleteConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Collection?", 
  message = "This action will permanently remove this heritage category and all its product associations. This cannot be undone.",
  loading = false
}: DeleteConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0b2b1a]/60 backdrop-blur-md z-[200]"
          />

          {/* Dialog Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[201] p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-auto"
            >
              {/* Header with Icon */}
              <div className="relative p-10 pb-6 text-center">
                <button 
                  onClick={onClose}
                  className="absolute top-8 right-8 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
                
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                   <AlertTriangle className="text-red-500" size={32} />
                </div>
                
                <h2 className="text-3xl font-black font-playfair text-[#0b2b1a] mb-4">
                  {title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed font-inter">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="p-10 pt-4 flex flex-col gap-3">
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="w-full py-5 bg-[#c81c6a] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete Permanently
                </button>
                
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="w-full py-5 bg-gray-50 text-[#0b2b1a] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-100 transition-all disabled:opacity-50"
                >
                  Keep it for now
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
