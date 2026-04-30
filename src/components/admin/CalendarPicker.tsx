"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarPickerProps {
  startDate: string;
  endDate: string;
  onRangeSelect: (start: string, end: string) => void;
  onClose: () => void;
}

export function CalendarPicker({ startDate, endDate, onRangeSelect, onClose }: CalendarPickerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (selectingStart) {
      onRangeSelect(clickedDate, "");
      setSelectingStart(false);
    } else {
      if (new Date(clickedDate) < new Date(startDate)) {
        onRangeSelect(clickedDate, startDate);
      } else {
        onRangeSelect(startDate, clickedDate);
      }
      setSelectingStart(true);
    }
  };

  const isSelected = (day: number) => {
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dateStr === startDate || dateStr === endDate;
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    const date = new Date(dateStr);
    return date > new Date(startDate) && date < new Date(endDate);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const totalDays = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  return (
    <div className="p-6 w-full max-w-sm">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-sm font-black font-playfair text-[#5d5f61]">{monthName} {year}</h4>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}-${i}`} className="text-center text-[10px] font-black text-gray-500 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          
          const selected = isSelected(day);
          const range = isInRange(day);
          
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={cn(
                "relative h-10 w-10 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center",
                selected ? "bg-[#c81c6a] text-white shadow-lg" : 
                range ? "bg-[#c81c6a]/10 text-[#c81c6a]" :
                "text-[#5d5f61] hover:bg-gray-50"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <div>
           <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Selected Range</p>
           <p className="text-[10px] font-bold text-[#5d5f61]">
             {startDate ? startDate : "Select Start"} — {endDate ? endDate : "Select End"}
           </p>
        </div>
        <button 
          onClick={onClose}
          className="bg-[#5d5f61] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c81c6a] transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
