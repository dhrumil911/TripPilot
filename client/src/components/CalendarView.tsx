import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ItineraryItem {
  id: string;
  title: string;
  description: string | null;
  itineraryDate: string;
  startTime: string | null;
  endTime: string | null;
  sortOrder: number;
}

interface Stop {
  id: string;
  cityName: string;
  startDate: string;
  endDate: string;
  stopOrder: number;
}

interface CalendarViewProps {
  startDate: string;
  endDate: string;
  itineraryItems: ItineraryItem[];
  stops: Stop[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ startDate, endDate, itineraryItems, stops }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(startDate || Date.now()));
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setExpandedDay(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setExpandedDay(null);
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const days = [];
    const firstDay = firstDayOfMonth(year, month);
    const totalDays = daysInMonth(year, month);

    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days in current month
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    // Padding for next month to complete the grid (optional, up to 42 days)
    const remaining = 42 - days.length;
    for (let i = 0; i < remaining; i++) {
      days.push(null);
    }

    return days;
  }, [currentMonth]);

  const getStopForDate = (dateStr: string) => {
    return stops.find(stop => {
      const stopStart = new Date(stop.startDate).toISOString().split('T')[0];
      const stopEnd = new Date(stop.endDate).toISOString().split('T')[0];
      return dateStr >= stopStart && dateStr <= stopEnd;
    });
  };

  const getItemsForDate = (dateStr: string) => {
    return itineraryItems.filter(item => {
      // Assuming itineraryDate includes time, slice it, or it's just YYYY-MM-DD
      const itemDate = new Date(item.itineraryDate).toISOString().split('T')[0];
      return itemDate === dateStr;
    });
  };

  const tripStartStr = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
  const tripEndStr = endDate ? new Date(endDate).toISOString().split('T')[0] : '';
  const todayStr = new Date().toISOString().split('T')[0];

  const stopColors = ['bg-teal', 'bg-coral', 'bg-sand']; // and text-white or text-charcoal accordingly

  return (
    <div className="bg-paper border border-sand rounded-xl p-4 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-editorial text-lg text-charcoal font-bold">
          {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-1.5 rounded hover:bg-sand-light text-charcoal transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded hover:bg-sand-light text-charcoal transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-[10px] font-bold uppercase tracking-wider text-charcoal-muted py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-24 bg-transparent"></div>;
          }

          const dateStr = date.toISOString().split('T')[0];
          const isWithinTrip = dateStr >= tripStartStr && dateStr <= tripEndStr;
          const isToday = dateStr === todayStr;
          
          const dayItems = getItemsForDate(dateStr);
          const stop = getStopForDate(dateStr);
          const hasItems = dayItems.length > 0;
          
          const stopColorClass = stop 
            ? stopColors[stop.stopOrder % stopColors.length] + (stopColors[stop.stopOrder % stopColors.length] === 'bg-sand' ? ' text-charcoal' : ' text-paper')
            : '';

          return (
            <div 
              key={dateStr}
              onClick={() => {
                if (hasItems) {
                  setExpandedDay(expandedDay === dateStr ? null : dateStr);
                }
              }}
              className={`
                h-24 p-1 rounded-lg border flex flex-col relative
                ${isWithinTrip ? 'bg-white border-sand' : 'bg-paper/50 border-transparent text-charcoal-muted/40'}
                ${isToday ? 'ring-2 ring-coral border-transparent' : ''}
                ${hasItems ? 'cursor-pointer hover:border-teal/30' : ''}
                overflow-hidden transition-all
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-semibold ${!isWithinTrip ? 'opacity-50' : ''} ${isToday ? 'text-coral' : 'text-charcoal'}`}>
                  {date.getDate()}
                </span>
                {stop && isWithinTrip && (
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider truncate max-w-[60%] ${stopColorClass}`}>
                    {stop.cityName}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                {dayItems.slice(0, 2).map(item => (
                  <div key={item.id} className="text-[9px] bg-sand-light text-charcoal px-1 py-0.5 rounded truncate">
                    {item.title}
                  </div>
                ))}
                {dayItems.length > 2 && (
                  <div className="text-[9px] text-teal font-semibold px-1">
                    +{dayItems.length - 2} more
                  </div>
                )}
              </div>

              {expandedDay === dateStr && (
                <div className="absolute top-full left-0 mt-1 z-10 w-48 bg-white border border-sand rounded shadow-lg p-2 max-h-48 overflow-y-auto">
                  <div className="text-[10px] font-bold text-charcoal-muted uppercase mb-2 border-b border-sand pb-1">
                    {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="space-y-2">
                    {dayItems.map(item => (
                      <div key={item.id} className="text-xs">
                        <div className="font-semibold text-charcoal">{item.title}</div>
                        {item.startTime && <div className="text-[10px] text-teal">{item.startTime} {item.endTime ? `- ${item.endTime}` : ''}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {itineraryItems.length === 0 && (
         <div className="text-center mt-4 pb-2">
           <p className="text-xs text-charcoal-muted">No itinerary items scheduled yet.</p>
         </div>
      )}
    </div>
  );
};
