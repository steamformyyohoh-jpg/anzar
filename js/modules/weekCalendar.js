# This is a completely separate module that coexists with CalendarModule

```javascript
// js/modules/weekCalendar.js
// Week view for Anzar calendar
// Does NOT touch or modify CalendarModule

export const WeekCalendarModule = {
  currentWeek: new Date(),
  
  render(container, data, save) {
    const view = document.createElement('div');
    view.className = 'week-calendar-view';
    view.innerHTML = `
      <aside class="week-sidebar">
        <div class="sidebar-title">Add Event</div>
        <form class="task-form" id="weekTaskForm">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" class="form-input" id="weekTaskTitle" placeholder="Event name" required>
          </div>
          <div class="form-group">
            <label class="form-label">Date *</label>
            <input type="date" class="form-input" id="weekTaskDate" required>
          </div>
          <div class="form-group">
            <label class="form-label">Start Time</label>
            <input type="time" class="form-input" id="weekTaskStartTime">
          </div>
          <div class="form-group">
            <label class="form-label">End Time</label>
            <input type="time" class="form-input" id="weekTaskEndTime">
          </div>
          <div class="form-group">
            <label class="form-label">Priority</label>
            <div class="priority-group" id="weekPriorityGroup">
              <button type="button" class="priority-pill" data-priority="urgent">
                <span class="pill-dot urgent"></span>Urgent
              </button>
              <button type="button" class="priority-pill" data-priority="high">
                <span class="pill-dot high"></span>High
              </button>
              <button type="button" class="priority-pill" data-priority="medium">
                <span class="pill-dot medium"></span>Medium
              </button>
              <button type="button" class="priority-pill" data-priority="low">
                <span class="pill-dot low"></span>Low
              </button>
              <button type="button" class="priority-pill active" data-priority="none">
                <span class="pill-dot none"></span>None
              </button>
            </div>
          </div>
          <button type="submit" class="add-btn">Add Event</button>
        </form>

        <div class="legend">
          <div class="legend-title">Legend</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--urgent)"></span>Urgent</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--high)"></span>High</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--medium)"></span>Medium</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--low)"></span>Low</div>
          <div class="legend-item"><span class="legend-dot" style="background:var(--none)"></span>None</div>
        </div>
      </aside>

      <div class="week-calendar-area">
        <div class="week-header">
          <div class="week-nav">
            <button class="week-nav-btn" id="prevWeek">‹</button>
            <button class="week-nav-btn" id="nextWeek">›</button>
          </div>
          <div class="week-date-range" id="weekDateRange"></div>
          <button class="today-btn" id="weekTodayBtn">Today</button>
        </div>

        <div class="week-grid-container">
          <div class="week-time-labels">
            <div class="time-label-item"></div>
            ${this.generateTimeLabels()}
          </div>
          <div class="week-grid" id="weekGrid"></div>
        </div>
      </div>
    `;
    container.appendChild(view);

    this.setupPriorityButtons(view);
    this.setupFormHandling(view, data, save);
    this.setupNavigation(view, data);
    this.renderWeekGrid(view, data);
  },

  generateTimeLabels() {
    let html = '';
    for (let hour = 6; hour < 18; hour++) {
      const ampm = hour < 12 ? 'AM' : 'PM';
      const display = hour === 0 ? '12 AM' : hour <= 12 ? \`\${hour} \${ampm}\` : \`\${hour - 12} \${ampm}\`;
      html += \`<div class="time-label-item">\${display}</div>\`;
    }
    return html;
  },

  setupPriorityButtons(view) {
    const priorityGroup = view.querySelector('#weekPriorityGroup');
    let selectedPriority = 'none';

    priorityGroup.querySelectorAll('.priority-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        priorityGroup.querySelectorAll('.priority-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedPriority = pill.dataset.priority;
      });
    });

    return selectedPriority;
  },

  setupFormHandling(view, data, save) {
    const form = view.querySelector('#weekTaskForm');
    const priorityGroup = view.querySelector('#weekPriorityGroup');
    let selectedPriority = 'none';

    priorityGroup.querySelectorAll('.priority-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        priorityGroup.querySelectorAll('.priority-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedPriority = pill.dataset.priority;
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = view.querySelector('#weekTaskTitle').value.trim();
      const date = view.querySelector('#weekTaskDate').value;
      const startTime = view.querySelector('#weekTaskStartTime').value || '';
      const endTime = view.querySelector('#weekTaskEndTime').value || '';

      if (!title || !date) {
        alert('Title and Date are required');
        return;
      }

      const task = {
        id: Date.now().toString(),
        title: title,
        date: date,
        priority: selectedPriority,
        startTime: startTime,
        endTime: endTime,
        assignee: '',
        note: '',
        createdAt: new Date().toISOString()
      };

      data.tasks.push(task);
      save();

      // Reset form
      view.querySelector('#weekTaskTitle').value = '';
      view.querySelector('#weekTaskDate').value = '';
      view.querySelector('#weekTaskStartTime').value = '';
      view.querySelector('#weekTaskEndTime').value = '';
      selectedPriority = 'none';
      priorityGroup.querySelectorAll('.priority-pill').forEach(p => p.classList.remove('active'));
      priorityGroup.querySelector('[data-priority="none"]').classList.add('active');

      this.renderWeekGrid(view, data);
    });
  },

  setupNavigation(view, data) {
    view.querySelector('#prevWeek').addEventListener('click', () => {
      this.currentWeek.setDate(this.currentWeek.getDate() - 7);
      this.renderWeekGrid(view, data);
    });

    view.querySelector('#nextWeek').addEventListener('click', () => {
      this.currentWeek.setDate(this.currentWeek.getDate() + 7);
      this.renderWeekGrid(view, data);
    });

    view.querySelector('#weekTodayBtn').addEventListener('click', () => {
      this.currentWeek = new Date();
      this.renderWeekGrid(view, data);
    });
  },

  renderWeekGrid(view, data) {
    const monday = this.getMonday(new Date(this.currentWeek));
    const dateRange = view.querySelector('#weekDateRange');
    const grid = view.querySelector('#weekGrid');

    // Format date range
    const startMonth = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    const endMonth = sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dateRange.textContent = \`\${startMonth} – \${endMonth}\`;

    grid.innerHTML = '';

    // Create day headers
    const headerRow = document.createElement('div');
    headerRow.className = 'week-day-headers';
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(day.getDate() + i);
      const dayHeader = document.createElement('div');
      dayHeader.className = 'week-day-header';
      const dayName = dayNames[day.getDay()];
      const dayDate = day.getDate();
      const isToday = this.isToday(day);
      dayHeader.innerHTML = \`<div class="\${isToday ? 'today-marker' : ''}">\${dayName}</div><div class="day-date \${isToday ? 'today' : ''}">\${dayDate}</div>\`;
      headerRow.appendChild(dayHeader);
    }
    grid.appendChild(headerRow);

    // Create time slots grid (6 AM to 6 PM = 12 hours)
    for (let hour = 6; hour < 18; hour++) {
      const timeRow = document.createElement('div');
      timeRow.className = 'week-time-row';

      // Time label (appears only on left side)
      const timeLabel = document.createElement('div');
      timeLabel.className = 'time-label';
      const ampm = hour < 12 ? 'AM' : 'PM';
      const display = hour === 0 ? '12 AM' : hour <= 12 ? \`\${hour} \${ampm}\` : \`\${hour - 12} \${ampm}\`;
      timeLabel.textContent = display;
      timeRow.appendChild(timeLabel);

      // Day columns
      for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(day.getDate() + i);
        const dateStr = \`\${day.getFullYear()}-\${String(day.getMonth() + 1).padStart(2, '0')}-\${String(day.getDate()).padStart(2, '0')}\`;

        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.dataset.date = dateStr;
        slot.dataset.hour = hour;

        // Get events for this time slot
        const hourStr = String(hour).padStart(2, '0') + ':00';
        const slotTasks = data.tasks.filter(t => {
          if (t.date !== dateStr) return false;
          if (!t.startTime) return false;
          const startHour = parseInt(t.startTime.split(':')[0]);
          return startHour === hour;
        });

        slotTasks.forEach(task => {
          const eventEl = document.createElement('div');
          eventEl.className = \`time-event \${task.priority}\`;
          eventEl.textContent = task.title;
          eventEl.title = \`\${task.startTime || ''} - \${task.endTime || ''}\`;
          slot.appendChild(eventEl);
        });

        timeRow.appendChild(slot);
      }

      grid.appendChild(timeRow);
    }
  },

  getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  },

  isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
};
```