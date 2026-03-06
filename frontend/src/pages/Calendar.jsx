import '../styles/Dashboard.css';
import { useState } from 'react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="page-content">
      <h2>Calendar</h2>
      <p>Apne tasks ko calendar view mein dekh sakte ho:</p>
      
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={prevMonth} className="calendar-nav">{"<"}</button>
          <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={nextMonth} className="calendar-nav">{">"}</button>
        </div>
        
        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        <div className="calendar-days">
          {days.map((day, index) => {
            const isToday = day === today.getDate() && 
              currentDate.getMonth() === today.getMonth() && 
              currentDate.getFullYear() === today.getFullYear();
            return (
              <div 
                key={index} 
                className={`calendar-day ${isToday ? 'today' : ''} ${day === null ? 'empty' : ''}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

