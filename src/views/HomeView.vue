<script setup>
import { computed, ref } from 'vue'
import scheduleData from '@/data/schedule.json'

const today = new Date()

const formatDateKey = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay() // 0 (Sun) - 6 (Sat)
  const diff = (day === 0 ? -6 : 1) - day // make Monday the first day of week
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const addDays = (date, amount) => {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

const selectedDate = ref(formatDateKey(today))
const currentWeekStart = ref(getWeekStart(today))
const viewMode = ref('week') // 'day' | 'week' | 'month'

const weekDays = computed(() => {
  const days = []
  // Monday–Saturday (6 days) to save space, no Sundays
  for (let i = 0; i < 6; i += 1) {
    const date = addDays(currentWeekStart.value, i)
    const key = formatDateKey(date)
    const weekdayShort = date.toLocaleDateString(undefined, { weekday: 'short' })
    const isToday = formatDateKey(today) === key

    days.push({
      key,
      date,
      weekdayShort,
      dayOfMonth: date.getDate(),
      isToday
    })
  }
  return days
})

const statusLegend = [
  { key: 'accepted', label: 'Accepted', color: '#339933', textColor: '#ffffff' },
  {
    key: 'awaiting_reschedule',
    label: 'Awaiting Reschedule Date',
    color: '#800080',
    textColor: '#ffffff'
  },
  { key: 'cancelled', label: 'Cancelled', color: '#ff0000', textColor: '#ffffff' },
  { key: 'completed', label: 'Completed', color: '#00ff66', textColor: '#000000' },
  { key: 'incomplete', label: 'Incomplete', color: '#ff9900', textColor: '#000000' },
  {
    key: 'incomplete_uppers',
    label: 'INCOMPLETE UPPERS',
    color: '#d89fdf',
    textColor: '#000000'
  },
  {
    key: 'inv_head_office',
    label: 'Inv. Head Office',
    color: '#fbff00',
    textColor: '#000000'
  },
  { key: 'invoiced', label: 'Invoiced', color: '#99ffff', textColor: '#000000' },
  { key: 'rejected', label: 'Rejected', color: '#ff00cc', textColor: '#ffffff' },
  { key: 'scheduled', label: 'Scheduled', color: '#3399ff', textColor: '#ffffff' },
  { key: 'tentative', label: 'Tentative', color: '#999999', textColor: '#ffffff' }
]

const statusColorMap = statusLegend.reduce(
  (acc, item) => {
    acc[item.key] = item
    return acc
  },
  {
    in_progress: { key: 'in_progress', label: 'In Progress', color: '#ff9900', textColor: '#000000' }
  }
)

const activeStatusFilter = ref(null)

const franchises = [
  { value: '0', label: '' },
  { value: '1', label: 'Goop Guys Head Office (0)' },
  { value: '3', label: 'Goop Guys Mornington Peninsula (42)' },
  { value: '6', label: 'Goop Guys Sunshine Coast South (16)' },
  { value: '8', label: 'Goop Guys Toowoomba (0)' },
  { value: '1014', label: 'Goop Guys Sunshine Coast North (12)' },
  { value: '1015', label: 'Goop Guys Gold Coast H/O (32)' },
  { value: '1017', label: 'Goop Guys Sydney North (11)' },
  { value: '1021', label: 'Goop Guys Melbourne South East (42)' }
]

const jobStatusOptions = [
  { value: '0', label: '' },
  { value: '7', label: 'Accepted' },
  { value: '15', label: 'Awaiting Reschedule Date' },
  { value: '12', label: 'Cancelled' },
  { value: '1', label: 'Completed' },
  { value: '9', label: 'Incomplete' },
  { value: '28', label: 'INCOMPLETE UPPERS' },
  { value: '14', label: 'Inv. Head Office' },
  { value: '11', label: 'Invoiced' },
  { value: '8', label: 'Rejected' },
  { value: '6', label: 'Scheduled' },
  { value: '4', label: 'Tentative' }
]

const selectedFranchise = ref('3')
const addressFilter = ref('')
const jobStatusFilter = ref('0')

const filteredJobs = computed(() => {
  return scheduleData.jobs.filter((job) => {
    if (activeStatusFilter.value) {
      let jobStatusKey = String(job.status).toLowerCase()
      // Treat in-progress jobs as "Incomplete" for legacy status mapping
      if (jobStatusKey === 'in_progress') jobStatusKey = 'incomplete'

      if (jobStatusKey !== activeStatusFilter.value) {
        return false
      }
    }

    if (addressFilter.value) {
      const query = addressFilter.value.toLowerCase()
      if (!job.address.toLowerCase().includes(query)) {
        return false
      }
    }

    return true
  })
})

const jobsByDate = computed(() => {
  const map = {}
  filteredJobs.value.forEach((job) => {
    if (!map[job.date]) {
      map[job.date] = []
    }
    map[job.date].push(job)
  })
  return map
})

const jobsForSelectedDate = computed(() => jobsByDate.value[selectedDate.value] || [])

const jobsForCurrentWeek = computed(() => {
  return weekDays.value.map((day) => ({
    dateKey: day.key,
    label: day.date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }),
    jobs: jobsByDate.value[day.key] || []
  }))
})

const jobsForCurrentMonth = computed(() => {
  const parts = selectedDate.value.split('-')
  if (parts.length !== 3) return []
  const [year, month] = parts
  const groups = {}

  filteredJobs.value.forEach((job) => {
    const [jobYear, jobMonth, jobDay] = job.date.split('-')
    if (jobYear === year && jobMonth === month) {
      const labelDate = new Date(Number(jobYear), Number(jobMonth) - 1, Number(jobDay))
      const label = labelDate.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })

      if (!groups[job.date]) {
        groups[job.date] = {
          dateKey: job.date,
          label,
          jobs: []
        }
      }
      groups[job.date].jobs.push(job)
    }
  })

  return Object.values(groups).sort((a, b) => (a.dateKey < b.dateKey ? -1 : 1))
})

const currentMonthLabel = computed(() => {
  const anyDay = currentWeekStart.value
  return anyDay.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
})

const selectedDateLabel = computed(() => {
  const parts = selectedDate.value.split('-')
  if (parts.length !== 3) return selectedDate.value
  const [year, month, day] = parts
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
})

const weekRangeLabel = computed(() => {
  const start = currentWeekStart.value
  const end = addDays(currentWeekStart.value, 5)
  const startStr = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const endStr = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${startStr} – ${endStr}`
})

const monthRangeLabel = computed(() => {
  const parts = selectedDate.value.split('-')
  if (parts.length !== 3) return currentMonthLabel.value
  const [year, month] = parts
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
})

const monthCalendarWeeks = computed(() => {
  const parts = selectedDate.value.split('-')
  if (parts.length !== 3) return []
  const [yearStr, monthStr] = parts
  const year = Number(yearStr)
  const monthIndex = Number(monthStr) - 1 // 0–11

  if (Number.isNaN(year) || Number.isNaN(monthIndex)) return []

  const firstOfMonth = new Date(year, monthIndex, 1)
  const startDay = firstOfMonth.getDay() // 0 = Sun
  const calendarStart = new Date(firstOfMonth)
  calendarStart.setDate(firstOfMonth.getDate() - startDay)

  const todayKey = formatDateKey(today)
  const weeks = []

  for (let w = 0; w < 6; w += 1) {
    const days = []
    for (let i = 0; i < 7; i += 1) {
      const index = w * 7 + i
      const date = new Date(calendarStart)
      date.setDate(calendarStart.getDate() + index)
      const key = formatDateKey(date)
      const inCurrentMonth = date.getMonth() === monthIndex

      days.push({
        key,
        date,
        dayOfMonth: date.getDate(),
        isToday: key === todayKey,
        inCurrentMonth,
        jobs: jobsByDate.value[key] || []
      })
    }
    weeks.push(days)
  }

  return weeks
})

const dashboardMonthLabel = computed(() => {
  return today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
})

const dashboardTodayLabel = computed(() => {
  return today.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
})

const dashboardStats = computed(() => {
  const currentYear = today.getFullYear()
  const currentMonthIndex = today.getMonth() + 1 // 1–12
  const todayKey = formatDateKey(today)

  const base = {
    monthTotal: 0,
    todayTotal: 0,
    scheduled: 0,
    completed: 0,
    accepted: 0,
    cancelled: 0
  }

  scheduleData.jobs.forEach((job) => {
    if (!job?.date) return

    const [yearStr, monthStr] = job.date.split('-')
    const y = Number(yearStr)
    const m = Number(monthStr)
    if (y !== currentYear || m !== currentMonthIndex) return

    base.monthTotal += 1
    if (job.date === todayKey) {
      base.todayTotal += 1
    }

    const statusKey = String(job.status).toLowerCase()
    if (statusKey === 'scheduled') base.scheduled += 1
    else if (statusKey === 'completed') base.completed += 1
    else if (statusKey === 'accepted') base.accepted += 1
    else if (statusKey === 'cancelled') base.cancelled += 1
  })

  return base
})

const shiftSelectedDateByDays = (delta) => {
  const parts = selectedDate.value.split('-')
  if (parts.length !== 3) return
  const [year, month, day] = parts.map((p) => Number(p))
  if (!year || !month || !day) return

  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + delta)

  selectedDate.value = formatDateKey(date)
  currentWeekStart.value = getWeekStart(date)
}

const goToPreviousPeriod = () => {
  if (viewMode.value === 'day') {
    shiftSelectedDateByDays(-1)
  } else if (viewMode.value === 'week') {
    currentWeekStart.value = addDays(currentWeekStart.value, -7)
    selectedDate.value = formatDateKey(currentWeekStart.value)
  } else {
    // month view – move one month back
    const parts = selectedDate.value.split('-')
    if (parts.length !== 3) return
    const [year, month] = parts.map((p) => Number(p))
    if (!year || !month) return
    const date = new Date(year, month - 2, 1) // previous month
    selectedDate.value = formatDateKey(date)
    currentWeekStart.value = getWeekStart(date)
  }
}

const goToNextPeriod = () => {
  if (viewMode.value === 'day') {
    shiftSelectedDateByDays(1)
  } else if (viewMode.value === 'week') {
    currentWeekStart.value = addDays(currentWeekStart.value, 7)
    selectedDate.value = formatDateKey(currentWeekStart.value)
  } else {
    // month view – move one month forward
    const parts = selectedDate.value.split('-')
    if (parts.length !== 3) return
    const [year, month] = parts.map((p) => Number(p))
    if (!year || !month) return
    const date = new Date(year, month, 1) // next month
    selectedDate.value = formatDateKey(date)
    currentWeekStart.value = getWeekStart(date)
  }
}

const resetToToday = () => {
  const todayKey = formatDateKey(today)
  selectedDate.value = todayKey
  currentWeekStart.value = getWeekStart(today)
}

const setViewMode = (mode) => {
  viewMode.value = mode
}

const statusLabel = (status) => {
  const map = {
    scheduled: 'Scheduled',
    // Treat in-progress the same as "Incomplete" for legacy mapping
    in_progress: 'Incomplete',
    completed: 'Completed',
    cancelled: 'Cancelled',
    accepted: 'Accepted',
    awaiting_reschedule: 'Awaiting Reschedule Date',
    incomplete: 'Incomplete',
    incomplete_uppers: 'INCOMPLETE UPPERS',
    inv_head_office: 'Inv. Head Office',
    invoiced: 'Invoiced',
    rejected: 'Rejected',
    tentative: 'Tentative'
  }
  return map[status] || status
}

const statusStyle = (status) => {
  if (!status) {
    return {
      backgroundColor: '#e5e7eb',
      color: '#111827'
    }
  }

  const key = String(status).toLowerCase()
  const entry = statusColorMap[key]

  if (entry) {
    return {
      backgroundColor: entry.color,
      color: entry.textColor
    }
  }

  return {
    backgroundColor: '#e5e7eb',
    color: '#111827'
  }
}

const jobCompletedLabel = (job) => {
  if (!job?.date || !job?.endTime) return ''
  const d = new Date(job.date)
  const dateStr = d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
  return `Job Completed: ${dateStr} ${job.endTime}`
}

const formatTime12 = (time) => {
  if (!time) return ''
  const [hourStr, minuteStr] = time.split(':')
  let hour = Number(hourStr)
  const minute = minuteStr || '00'
  const suffix = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${String(hour).padStart(2, '0')}:${minute} ${suffix}`
}

const setStatusFilter = (key) => {
  if (key === null) {
    activeStatusFilter.value = null
    return
  }
  activeStatusFilter.value = activeStatusFilter.value === key ? null : key
}
</script>

<template>
  <main class="schedule-page">
    <section class="schedule-header">
      <div>
        <h1 class="schedule-title">Job schedule</h1>
        <p class="schedule-subtitle">
          See all jobs across your team. Use the calendar to navigate and switch between day, week,
          and month views.
        </p>
      </div>

      

      <div class="schedule-summary-month">
        <div class="summary-month-title">
          This Month Job Summary
        </div>
        <div class="summary-month-row">
          <div class="summary-month-chip">
            <span class="summary-month-chip-label">Scheduled</span>
            <span class="summary-month-chip-value">
              {{ dashboardStats.scheduled }}
            </span>
          </div>
          <div class="summary-month-chip">
            <span class="summary-month-chip-label">Completed</span>
            <span class="summary-month-chip-value">
              {{ dashboardStats.completed }}
            </span>
          </div>
          <div class="summary-month-chip">
            <span class="summary-month-chip-label">Accepted</span>
            <span class="summary-month-chip-value">
              {{ dashboardStats.accepted }}
            </span>
          </div>
          <div class="summary-month-chip">
            <span class="summary-month-chip-label">Cancelled</span>
            <span class="summary-month-chip-value">
              {{ dashboardStats.cancelled }}
            </span>
          </div>
        </div>
      </div>

      <div class="schedule-summary">
        <div class="summary-card">
          <div class="summary-label">
            Jobs Today <br />({{ dashboardTodayLabel }})
          </div>
          <div class="summary-value">
            {{ dashboardStats.todayTotal }}
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-label">
            Total Jobs <br />({{ dashboardMonthLabel }})
          </div>
          <div class="summary-value">
            {{ dashboardStats.monthTotal }}
          </div>
        </div>
      </div>

    </section>

    <section class="filters-card">
      <div class="filters-legend">
        <div class="legend-top-row">
          <div class="legend-notes">
            <span class="legend-note">R = Has Repeats</span>
            <span class="legend-note">N = Has Job Notes</span>
          </div>
          <button
            type="button"
            class="all-jobs-button"
            :class="{ 'is-active': !activeStatusFilter }"
            @click="setStatusFilter(null)"
          >
            All Jobs
          </button>
        </div>
        <div class="legend-swatches">
          <div
            v-for="item in statusLegend"
            :key="item.key"
            class="legend-swatch"
            :class="{ 'is-active': activeStatusFilter === item.key }"
            :style="{ backgroundColor: item.color, color: item.textColor }"
            role="button"
            tabindex="0"
            :aria-pressed="activeStatusFilter === item.key"
            @click="setStatusFilter(item.key)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>

      <div class="filters-row">
        <div class="filter-field filter-field-franchise">
          <label class="filter-label" for="franchise-select">Select Franchise</label>
          <select
            id="franchise-select"
            v-model="selectedFranchise"
            class="filter-input filter-select"
          >
            <option
              v-for="franchiseOption in franchises"
              :key="franchiseOption.value"
              :value="franchiseOption.value"
            >
              {{ franchiseOption.label }}
            </option>
          </select>
        </div>

        <div class="filter-field filter-field-address">
          <label class="filter-label" for="address-input">Address</label>
          <input
            id="address-input"
            v-model="addressFilter"
            type="text"
            class="filter-input"
            placeholder="Search address"
          />
        </div>

        <div class="filter-field filter-field-status">
          <label class="filter-label" for="job-status-select">Job Status</label>
          <select
            id="job-status-select"
            v-model="jobStatusFilter"
            class="filter-input filter-select"
          >
            <option
              v-for="status in jobStatusOptions"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </option>
          </select>
        </div>

        <div class="filter-actions">
          <button type="button" class="filter-button filter-button-primary">
            Load Jobs
          </button>
          <button
            type="button"
            class="filter-button filter-button-secondary"
            @click="
              () => {
                addressFilter = ''
                jobStatusFilter = '0'
              }
            "
          >
            Clear Form
          </button>
        </div>
      </div>
    </section>

    <section class="schedule-body">
      <section class="jobs-panel">
        <header class="jobs-header">
          <div>
            <h2 class="jobs-title">
              <span v-if="viewMode === 'day'">
                {{ selectedDateLabel }}
              </span>
              <span v-else-if="viewMode === 'week'">
                Week of {{ weekRangeLabel }}
              </span>
              <span v-else>
                {{ monthRangeLabel }}
              </span>
            </h2>
            <p class="jobs-subtitle">
              <span v-if="viewMode === 'day'">
                {{
                  jobsForSelectedDate.length
                    ? `${jobsForSelectedDate.length} job${
                        jobsForSelectedDate.length > 1 ? 's' : ''
                      } scheduled`
                    : 'No jobs scheduled for this day.'
                }}
              </span>
              <span v-else-if="viewMode === 'week'">
                {{
                  jobsForCurrentWeek
                    .reduce((acc, day) => acc + day.jobs.length, 0)
                    .toString()
                }}
                jobs scheduled this week
              </span>
              <span v-else>
                {{
                  jobsForCurrentMonth
                    .reduce((acc, day) => acc + day.jobs.length, 0)
                    .toString()
                }}
                jobs scheduled this month
              </span>
            </p>
          </div>

          <div class="jobs-header-controls">
            <div class="jobs-nav" aria-label="Change period">
              <button type="button" class="jobs-nav-button" @click="goToPreviousPeriod">
                ‹
              </button>
              <span class="jobs-nav-label">
                <span v-if="viewMode === 'day'">
                  {{ selectedDateLabel }}
                </span>
                <span v-else-if="viewMode === 'week'">
                  {{ weekRangeLabel }}
                </span>
                <span v-else>
                  {{ monthRangeLabel }}
                </span>
              </span>
              <button type="button" class="jobs-nav-button" @click="goToNextPeriod">
                ›
              </button>
            </div>

            <button type="button" class="jobs-today-button" @click="resetToToday">
              Today
            </button>

            <div class="view-toggle" role="tablist" aria-label="Schedule view">
              <button
                type="button"
                class="view-toggle-button"
                :class="{ 'is-active': viewMode === 'day' }"
                role="tab"
                @click="setViewMode('day')"
              >
                Day
              </button>
              <button
                type="button"
                class="view-toggle-button"
                :class="{ 'is-active': viewMode === 'week' }"
                role="tab"
                @click="setViewMode('week')"
              >
                Week
              </button>
              <button
                type="button"
                class="view-toggle-button"
                :class="{ 'is-active': viewMode === 'month' }"
                role="tab"
                @click="setViewMode('month')"
              >
                Month
              </button>
            </div>
          </div>
        </header>

        <div class="jobs-list" v-if="viewMode === 'day'">
          <article v-for="job in jobsForSelectedDate" :key="job.id" class="job-card">
            <div class="job-status-ribbon" :style="statusStyle(job.status)">
              {{ statusLabel(job.status) }}
            </div>
            <header class="job-header">
              <div>
                <h3 class="job-title">
                  {{ job.title }}
                </h3>
                <p class="job-id">
                  {{ job.id }} • {{ job.customer }}
                </p>
              </div>

              <div class="job-meta">
                <span class="job-time">
                  {{ job.startTime }} - {{ job.endTime }}
                </span>
              </div>
            </header>

            <div class="job-body">
              <p v-if="jobCompletedLabel(job)" class="job-completed">
                {{ jobCompletedLabel(job) }}
              </p>
              <p class="job-address">
                {{ job.address }}
              </p>
              <p class="job-time-tech">
                {{ formatTime12(job.startTime) }} {{ job.technician }}
              </p>
              <div class="job-footer">
                <span class="job-priority" :class="`priority-${job.priority}`">
                  Priority: {{ job.priority }}
                </span>
              </div>
              <div class="job-meta-row">
                <span class="job-meta-chip">
                  Accepted: {{ job.startTime || '—' }}
                </span>
                <span class="job-meta-chip">
                  SSRA: {{ job.ssra || '—' }}
                </span>
                <span class="job-meta-chip">
                  Completed: {{ job.endTime || '—' }}
                </span>
              </div>
              <p v-if="job.notes" class="job-notes">
                {{ job.notes }}
              </p>
            </div>
          </article>
        </div>

        <div class="jobs-week-grid" v-else-if="viewMode === 'week'">
          <section
            v-for="day in jobsForCurrentWeek"
            :key="day.dateKey"
            class="jobs-week-column"
          >
            <header class="jobs-day-header">
              <span class="jobs-day-label">{{ day.label }}</span>
              <span class="jobs-day-count">
                {{
                  day.jobs.length
                    ? `${day.jobs.length} job${day.jobs.length > 1 ? 's' : ''}`
                    : 'No jobs'
                }}
              </span>
              <button
                type="button"
                class="jobs-add-button"
                @click="() => window.alert?.(`Add job for ${day.label}`)"
                aria-label="Add job for this day"
              >
                +
              </button>
            </header>

            <article
              v-for="job in day.jobs"
              :key="job.id"
              class="job-card job-card-condensed"
            >
              <div class="job-status-ribbon" :style="statusStyle(job.status)">
                {{ statusLabel(job.status) }}
              </div>
              <div class="job-row">
                <div>
                  <h3 class="job-title">
                    {{ job.title }}
                  </h3>
                  <p class="job-id">
                    {{ job.id }} • {{ job.customer }}
                  </p>
                </div>
                <div class="job-meta">
                  <span class="job-time">
                    {{ job.startTime }} - {{ job.endTime }}
                  </span>
                </div>
              </div>

              <div class="job-row job-row-secondary">
                <span class="job-address">
                  {{ job.address }}
                </span>
                <span class="job-technician">
                  Tech: {{ job.technician }}
                </span>
                <span class="job-priority" :class="`priority-${job.priority}`">
                  Priority: {{ job.priority }}
                </span>
              </div>
            </article>
          </section>
        </div>

        <div class="month-calendar" v-else>
          <div class="month-calendar-header-row">
            <div
              v-for="label in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
              :key="label"
              class="month-calendar-header-cell"
            >
              {{ label }}
            </div>
          </div>

          <div class="month-calendar-weeks">
            <div
              v-for="(week, weekIndex) in monthCalendarWeeks"
              :key="weekIndex"
              class="month-calendar-week-row"
            >
              <div
                v-for="day in week"
                :key="day.key"
                class="month-calendar-day-cell"
                :class="{
                  'is-outside': !day.inCurrentMonth,
                  'is-today': day.isToday
                }"
              >
                <div class="month-calendar-day-header">
                  <span class="month-calendar-day-number">
                    {{ day.dayOfMonth }}
                  </span>
                  <span v-if="day.jobs.length" class="month-calendar-day-count">
                    {{ day.jobs.length }}
                  </span>
                </div>
                <div class="month-calendar-day-jobs">
                  <div
                    v-for="job in day.jobs"
                    :key="job.id"
                    class="month-calendar-job-chip"
                    :style="statusStyle(job.status)"
                  >
                    <span class="month-calendar-job-status">
                      {{ statusLabel(job.status) }}
                    </span>
                    <span class="month-calendar-job-title">
                      {{ job.title }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.schedule-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.schedule-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--gg-color-primary);
}

.schedule-subtitle {
  color: rgba(30, 30, 30, 0.85);
  max-width: 32rem;
}

.schedule-summary {
  display: flex;
  gap: 0.75rem;
}

.summary-card {
  min-width: 7.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background-color: #ffffff;
  color: #111827;
  border: 1px solid rgba(88, 36, 136, 0.12);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.06);
}

.summary-card-small {
  min-width: 6rem;
}

.schedule-summary-month {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-month-title {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #6b7280;
}

.summary-month-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.summary-month-chip {
  min-width: 7rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: #f3f4ff;
  border: 1px solid rgba(148, 163, 184, 0.6);
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.summary-month-chip-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: #4b5563;
}

.summary-month-chip-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

.summary-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.8;
  color: rgba(88, 36, 136, 0.9);
}

.summary-value {
  margin-top: 0.25rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.schedule-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: stretch;
}

.filters-card {
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  background: #ffffff;
  border: 1px solid rgba(209, 213, 219, 0.9);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filters-legend {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.legend-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.legend-notes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.82rem;
  color: #4b5563;
}

.legend-note {
  font-weight: 500;
}

.legend-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.legend-swatch {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  white-space: normal;
  cursor: pointer;
  opacity: 0.8;
  transition: transform 0.1s ease-out, box-shadow 0.1s ease-out, opacity 0.1s ease-out;
}

.legend-swatch.is-active {
  opacity: 1;
  box-shadow: 0 0 0 2px rgba(31, 41, 55, 0.15);
  transform: translateY(-1px);
}

.all-jobs-button {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 1);
  padding: 0.3rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 500;
  background: #ffffff;
  color: #111827;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.08);
}

.all-jobs-button.is-active {
  border-color: var(--gg-color-primary);
  color: var(--gg-color-primary);
}

.filters-row {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(0, 2.3fr) minmax(0, 1.6fr) auto;
  gap: 0.75rem;
  align-items: flex-end;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.filter-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #4b5563;
}

.filter-input {
  border-radius: 0.5rem;
  border: 1px solid rgba(209, 213, 219, 1);
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
  color: #111827;
}

.filter-input:focus {
  outline: none;
  border-color: rgba(88, 36, 136, 0.7);
  box-shadow: 0 0 0 1px rgba(88, 36, 136, 0.4);
}

.filter-select {
  background-color: #ffffff;
}

.filter-actions {
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
}

.filter-button {
  border-radius: 999px;
  border: none;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
}

.filter-button-primary {
  background: var(--gg-color-primary);
  color: #ffffff;
}

.filter-button-secondary {
  background: #ede9fe;
  color: var(--gg-color-primary);
}

.calendar-panel {
  padding: 1.25rem;
  border-radius: 1rem;
  background: #ffffff;
  border: 1px solid rgba(209, 213, 219, 0.9);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.06);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.calendar-title {
  font-weight: 500;
  color: rgba(30, 30, 30, 0.95);
}

.nav-button {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  border: 1px solid rgba(209, 213, 219, 1);
  background: #ffffff;
  color: rgba(30, 30, 30, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
}

.nav-button:hover {
  background: rgba(255, 238, 0, 0.15);
  border-color: rgba(88, 36, 136, 0.4);
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.5rem;
}

.calendar-day {
  padding: 0.5rem 0.35rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  background: #f9fafb;
  color: #111827;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease,
    background 0.12s ease;
}

.calendar-day:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(88, 36, 136, 0.25);
  border-color: rgba(88, 36, 136, 0.35);
  background: #ffffff;
}

.calendar-day-name {
  font-size: 0.7rem;
  opacity: 0.8;
}

.calendar-day-number {
  font-size: 1rem;
  font-weight: 600;
}

.calendar-day-badge {
  margin-top: 0.15rem;
  padding: 0.05rem 0.35rem;
  border-radius: 999px;
  font-size: 0.65rem;
  background: rgba(255, 238, 0, 0.25);
  color: #4b0082;
}

.calendar-day.is-today {
  border-color: rgba(255, 238, 0, 0.7);
}

.calendar-day.is-selected {
  background: rgba(255, 238, 0, 0.35);
  border-color: rgba(88, 36, 136, 1);
}

.calendar-day.is-selected .calendar-day-badge {
  background: rgba(255, 238, 0, 0.4);
}

.jobs-panel {
  padding: 1.25rem;
  border-radius: 1rem;
  background: #ffffff;
  border: 1px solid rgba(209, 213, 219, 0.9);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.06);
}

.jobs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.jobs-header-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.jobs-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  background: #f3f4f6;
}

.jobs-nav-button {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  border: 1px solid rgba(209, 213, 219, 1);
  background: #ffffff;
  color: rgba(30, 30, 30, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
}

.jobs-nav-button:hover {
  background: rgba(255, 238, 0, 0.15);
  border-color: rgba(88, 36, 136, 0.4);
}

.jobs-nav-label {
  font-size: 0.8rem;
  color: #374151;
  padding: 0 0.2rem;
}

.jobs-title {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 0.15rem;
  color: #111827;
}

.jobs-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
}

.view-toggle {
  display: inline-flex;
  padding: 0.15rem;
  border-radius: 999px;
  background: #f3f0ff;
}

.view-toggle-button {
  border: none;
  background: transparent;
  padding: 0.25rem 0.9rem;
  font-size: 0.85rem;
  border-radius: 999px;
  cursor: pointer;
  color: #4b5563;
}

.view-toggle-button.is-active {
  background: var(--gg-color-secondary);
  color: var(--gg-color-primary);
  box-shadow: 0 1px 3px rgba(88, 36, 136, 0.35);
}

.jobs-today-button {
  border-radius: 999px;
  border: 1px solid rgba(209, 213, 219, 1);
  background: #ffffff;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.jobs-week-grid {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.jobs-week-column {
  min-width: 0;
  flex: 1 1 0;
  border-radius: 0.75rem;
  background: #f9fafb;
  border: 1px solid rgba(229, 231, 235, 1);
  padding: 0.6rem 0.75rem;
}

.jobs-day-group {
  border-top: 1px solid rgba(229, 231, 235, 1);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
}

.jobs-day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.jobs-day-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--gg-color-primary);
}

.jobs-day-count {
  font-size: 0.8rem;
  color: #6b7280;
}

.jobs-add-button {
  border-radius: 999px;
  border: 1px solid rgba(209, 213, 219, 1);
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  background: #ffffff;
  color: #111827;
}

.month-calendar {
  margin-top: 0.5rem;
}

.month-calendar-header-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem;
  margin-bottom: 0.35rem;
}

.month-calendar-header-cell {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
  text-align: center;
}

.month-calendar-weeks {
  display: grid;
  grid-template-rows: repeat(6, minmax(0, 1fr));
  gap: 0.25rem;
}

.month-calendar-week-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem;
}

.month-calendar-day-cell {
  min-height: 88px;
  border-radius: 0.5rem;
  border: 1px solid rgba(229, 231, 235, 1);
  background: #f9fafb;
  padding: 0.3rem 0.35rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.month-calendar-day-cell.is-outside {
  background: #f9fafb;
  opacity: 0.6;
}

.month-calendar-day-cell.is-today {
  border-color: rgba(255, 238, 0, 0.9);
  box-shadow: 0 0 0 1px rgba(255, 238, 0, 0.6);
}

.month-calendar-day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
}

.month-calendar-day-number {
  font-size: 0.75rem;
  font-weight: 600;
  color: #111827;
}

.month-calendar-day-count {
  min-width: 1.25rem;
  height: 1.25rem;
  border-radius: 999px;
  background: #e5e7eb;
  font-size: 0.7rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #374151;
}

.month-calendar-day-jobs {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-top: 0.1rem;
  overflow: hidden;
}

.month-calendar-job-chip {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 999px;
  padding: 0.1rem 0.35rem;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.month-calendar-job-status {
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.month-calendar-job-title {
  font-weight: 500;
  opacity: 0.95;
}

.job-card {
  border-radius: 0.75rem;
  padding: 0.9rem 1rem;
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 1);
  box-shadow: 0 4px 9px rgba(15, 23, 42, 0.03);
  max-width: 100%;
  box-sizing: border-box;
}

.job-card-condensed {
  padding: 0.6rem 0.8rem;
}

.job-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  margin-bottom: 0.4rem;
  min-width: 0;
}

.job-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #111827;
  word-break: break-word;
}

.job-id {
  font-size: 0.75rem;
  color: #6b7280;
  word-break: break-word;
}

.job-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  min-width: 0;
  margin-top: 0.1rem;
}

.job-time {
  font-size: 0.78rem;
  color: #111827;
}

.job-status {
  font-size: 0.7rem;
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1.1;
  max-width: 6.25rem; /* 100px */
  text-align: center;
  word-break: break-word;
}

.job-status-ribbon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.8rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.job-card-condensed .job-status-ribbon {
  margin-bottom: 0.35rem;
}

.job-completed {
  font-size: 0.78rem;
  color: #111827;
  margin-bottom: 0.25rem;
}

.job-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.job-meta-chip {
  font-size: 0.74rem;
  color: #374151;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: #f3f4f6;
}

.job-time-tech {
  font-size: 0.78rem;
  color: #111827;
  margin-bottom: 0.25rem;
}

.status-scheduled {
  background: rgba(88, 36, 136, 0.08);
  color: var(--gg-color-primary);
}

.status-in_progress {
  background: rgba(252, 185, 0, 0.12);
  color: #92400e;
}

.status-completed {
  background: rgba(97, 206, 112, 0.12);
  color: #15803d;
}

.status-cancelled {
  background: rgba(239, 68, 68, 0.08);
  color: #b91c1c;
}

.job-body {
  margin-top: 0.25rem;
}

.job-address {
  font-size: 0.82rem;
  color: #4b5563;
  margin-bottom: 0.35rem;
}

.job-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.78rem;
  color: #6b7280;
  margin-bottom: 0.3rem;
}

.job-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  min-width: 0;
}

.job-row-secondary {
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.job-priority {
  padding: 0.12rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
}

.priority-low {
  background: rgba(148, 163, 184, 0.18);
  color: #4b5563;
}

.priority-medium {
  background: rgba(252, 185, 0, 0.18);
  color: #92400e;
}

.priority-high {
  background: rgba(249, 115, 22, 0.14);
  color: #c2410c;
}

.priority-critical {
  background: rgba(239, 68, 68, 0.14);
  color: #b91c1c;
}

.job-notes {
  font-size: 0.76rem;
  color: #6b7280;
}

@media (max-width: 960px) {
  .schedule-header {
    flex-direction: column;
  }

  .schedule-body {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .schedule-summary {
    width: 100%;
    justify-content: flex-start;
  }

  .summary-card {
    flex: 1;
  }

  .calendar-week {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .jobs-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .job-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .job-meta {
    align-items: flex-start;
  }

  .job-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
