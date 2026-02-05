<script setup>
import { computed, ref, inject } from 'vue'
import scheduleData from '@/data/schedule.json'

const today = new Date()

const jobs = ref([...scheduleData.jobs])

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

const timeOptions = [
  { label: '', value: '' },
  { label: '12:00 AM', value: '00:00' },
  { label: '12:30 AM', value: '00:30' },
  { label: '01:00 AM', value: '01:00' },
  { label: '01:30 AM', value: '01:30' },
  { label: '02:00 AM', value: '02:00' },
  { label: '02:30 AM', value: '02:30' },
  { label: '03:00 AM', value: '03:00' },
  { label: '03:30 AM', value: '03:30' },
  { label: '04:00 AM', value: '04:00' },
  { label: '04:30 AM', value: '04:30' },
  { label: '05:00 AM', value: '05:00' },
  { label: '05:30 AM', value: '05:30' },
  { label: '06:00 AM', value: '06:00' },
  { label: '06:30 AM', value: '06:30' },
  { label: '07:00 AM', value: '07:00' },
  { label: '07:30 AM', value: '07:30' },
  { label: '08:00 AM', value: '08:00' },
  { label: '08:30 AM', value: '08:30' },
  { label: '09:00 AM', value: '09:00' },
  { label: '09:30 AM', value: '09:30' },
  { label: '10:00 AM', value: '10:00' },
  { label: '10:30 AM', value: '10:30' },
  { label: '11:00 AM', value: '11:00' },
  { label: '11:30 AM', value: '11:30' },
  { label: '12:00 PM', value: '12:00' },
  { label: '12:30 PM', value: '12:30' },
  { label: '01:00 PM', value: '13:00' },
  { label: '01:30 PM', value: '13:30' },
  { label: '02:00 PM', value: '14:00' },
  { label: '02:30 PM', value: '14:30' },
  { label: '03:00 PM', value: '15:00' },
  { label: '03:30 PM', value: '15:30' },
  { label: '04:00 PM', value: '16:00' },
  { label: '04:30 PM', value: '16:30' },
  { label: '05:00 PM', value: '17:00' },
  { label: '05:30 PM', value: '17:30' },
  { label: '06:00 PM', value: '18:00' },
  { label: '06:30 PM', value: '18:30' },
  { label: '07:00 PM', value: '19:00' },
  { label: '07:30 PM', value: '19:30' },
  { label: '08:00 PM', value: '20:00' },
  { label: '08:30 PM', value: '20:30' },
  { label: '09:00 PM', value: '21:00' },
  { label: '09:30 PM', value: '21:30' },
  { label: '10:00 PM', value: '22:00' },
  { label: '10:30 PM', value: '22:30' },
  { label: '11:00 PM', value: '23:00' },
  { label: '11:30 PM', value: '23:30' }
]

const ssraJobStepOptions = [
  { value: '0', label: '' },
  { value: '9', label: 'Goop Windows and tape sliding door sills' },
  { value: '2', label: 'Goop Windows' },
  { value: '3', label: 'Goop Bathtubs/Shower Bases' },
  { value: '4', label: 'Goop Benchtops/Cabinetry' },
  { value: '5', label: 'Goop Floors' },
  { value: '6', label: 'Goop Roof' },
  { value: '7', label: 'Goop Spraybooth' },
  { value: '8', label: 'Frames Taped' }
]

const ssraHazardOptions = [
  { value: '0', label: '' },
  { value: '2', label: 'Falling from height/tripping' },
  { value: '3', label: 'Tripping and Slipping' },
  { value: '4', label: 'Tripping' },
  { value: '5', label: 'Slipping' },
  { value: '6', label: 'Falling' },
  { value: '7', label: 'Blinding' },
  { value: '8', label: 'Others - manually type' }
]

const ssraRiskLevelOptions = [
  { value: '0', label: '' },
  {
    value: '2',
    label: 'H1: high level of harm - potential death or permanent disability '
  },
  {
    value: '3',
    label: 'M2: medium level of harm - potential temporary disability '
  },
  {
    value: '4',
    label:
      'L3: low level of harm - incident has potential for person to require first aid '
  }
]

const ssraRankingOptions = [
  { value: '0', label: '' },
  { value: '2', label: 'Likely 1- Could happen frequently ' },
  { value: '3', label: 'Moderate 2 - Could happen occasionally ' },
  {
    value: '4',
    label: 'Unlikely 3 - May occur only in exceptional circumstances '
  }
]

const ssraControlsOptions = [
  { value: '0', label: '' },
  {
    value: '4',
    label: 'Remove sliding window sashes from upper floor, Goop and replace'
  },
  { value: '6', label: 'Apply Goop on supplied scaffold' },
  { value: '5', label: 'Goop upper windows from ground with extension pole' },
  {
    value: '7',
    label: 'Look for tripping hazards, remove tripping hazard if possible'
  },
  {
    value: '8',
    label: 'Use correct PPE including safety glasses if glass is gleamingly bright'
  },
  { value: '9', label: 'Others - manually type' },
  { value: '10', label: 'Taping Frames' }
]

const ssraYesNoNaOptions = [
  { value: '', label: '' },
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'N/A', label: 'N/A' }
]

const accountCustomerOptions = [
  { value: '0', label: '' },
  { value: '10412', label: '1AA- test customer' },
  { value: '10985', label: '360 Windows H/O' },
  { value: '2053', label: '3AK Construction' },
  { value: '11597', label: '45.Fortem Projects' },
  { value: '7453', label: '4C Construction Pty Ltd T/As Hampton Homes' },
  { value: '11374', label: '5 Point Projects HO' },
  { value: '9171', label: 'A Mudnic Development' },
  { value: '10854', label: 'A S Projects' },
  { value: '2113', label: 'A.S Spano Builders Pty Ltd' },
  { value: '3825', label: 'A.S. Spano Builders Pty Ltd' },
  { value: '10781', label: 'A.S.Spano' },
  { value: '10671', label: 'AAG Constructions' },
  { value: '3959', label: 'Abbott Builders' },
  { value: '11504', label: 'Above Building' },
  { value: '9182', label: 'Abri Projects' },
  { value: '11395', label: 'ACSA' },
  { value: '2042', label: 'Adam Mason Homes' },
  { value: '8854', label: 'Adenbrook Homes' },
  { value: '10223', label: 'Advanced Building Services' }
  // ...remaining options can be loaded from DB/API later
]

const supervisorOptions = [
  { value: '', label: '' },
  { value: 'Teish France', label: 'Teish France' },
  { value: 'Alex Lee', label: 'Alex Lee' },
  { value: 'Morgan Diaz', label: 'Morgan Diaz' },
  { value: 'Taylor Brown', label: 'Taylor Brown' },
  { value: 'Jordan Smith', label: 'Jordan Smith' }
]

const technicianOptions = [
  { value: '', label: '' },
  { value: 'Alex Lee', label: 'Alex Lee' },
  { value: 'Morgan Diaz', label: 'Morgan Diaz' },
  { value: 'Taylor Brown', label: 'Taylor Brown' },
  { value: 'Jordan Smith', label: 'Jordan Smith' },
  { value: 'Back Office', label: 'Back Office' }
]

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

const statusCodeToKey = {
  '7': 'accepted',
  '15': 'awaiting_reschedule',
  '12': 'cancelled',
  '1': 'completed',
  '9': 'incomplete',
  '28': 'incomplete_uppers',
  '14': 'inv_head_office',
  '11': 'invoiced',
  '8': 'rejected',
  '6': 'scheduled',
  '4': 'tentative'
}

const statusKeyToCode = Object.entries(statusCodeToKey).reduce((acc, [code, key]) => {
  acc[key] = code
  return acc
}, {})

const franchiseBase = [
  { value: '0', name: 'All' },
  { value: '1', name: 'Goop Guys Head Office' },
  { value: '3', name: 'Goop Guys Mornington Peninsula' },
  { value: '6', name: 'Goop Guys Sunshine Coast South' },
  { value: '8', name: 'Goop Guys Toowoomba' },
  { value: '14', name: 'Goop Guys - TESTER' },
  { value: '1014', name: 'Goop Guys Sunshine Coast North' },
  { value: '1015', name: 'Goop Guys Gold Coast H/O' },
  { value: '1016', name: 'Goop Guys Northern Rivers' },
  { value: '1017', name: 'Goop Guys Sydney North' },
  { value: '1021', name: 'Goop Guys Melbourne South East' },
  { value: '1022', name: 'Goop Guys Adelaide' },
  { value: '1027', name: 'Goop Guys Sydney South' },
  { value: '1031', name: 'Goop Guys Wollongong' },
  { value: '1040', name: 'Goop Guys Albury Wodonga Wagga' },
  { value: '1051', name: 'Goop Guys Newcastle' },
  { value: '1052', name: 'Goop Guys Central Coast' },
  { value: '1058', name: 'Goop Guys Melbourne West' },
  { value: '1060', name: 'Goop Guys Bendigo' },
  { value: '1062', name: 'Goop Guys Ballarat' },
  { value: '1065', name: 'Goop Guys Melbourne North' },
  { value: '1066', name: 'Goop Guys Sydney North West' },
  { value: '1067', name: 'Goop Guys Brisbane South' },
  { value: '1068', name: 'Goop Guys Shepparton' },
  { value: '1072', name: 'Goop Guys Brisbane North' },
  { value: '1085', name: 'Goop Guys Sydney South West' },
  { value: '1091', name: 'Goop Guys Brisbane West' },
  { value: '1092', name: 'Goop Guys Geelong' },
  { value: '1099', name: 'Goop Guys Gold Coast North' }
]

const franchiseNameById = franchiseBase.reduce((acc, item) => {
  if (item.value !== '0') {
    acc[item.value] = item.name
  }
  return acc
}, {})

const jobStatusOptions = [
  { value: '0', label: 'All' },
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

const selectedFranchise = ref('0')
const addressFilter = ref('')
const isHeaderCollapsed = inject('isHeaderCollapsed', ref(false))
const jobStatusFilter = computed({
  get() {
    if (!activeStatusFilter.value) return '0'
    return statusKeyToCode[activeStatusFilter.value] || '0'
  },
  set(value) {
    if (value === '0') {
      activeStatusFilter.value = null
      return
    }
    const key = statusCodeToKey[value]
    activeStatusFilter.value = key || null
  }
})

const jobsMatchingFiltersNoFranchise = computed(() => {
  return jobs.value.filter((job) => {
    if (activeStatusFilter.value) {
      let jobStatusKey = String(job.status).toLowerCase()
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

const filteredJobs = computed(() => {
  return jobsMatchingFiltersNoFranchise.value.filter((job) => {
    if (selectedFranchise.value !== '0') {
      if (!job.franchiseId || job.franchiseId !== selectedFranchise.value) {
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

const jobsInCurrentView = computed(() => {
  if (viewMode.value === 'day') {
    return jobsForSelectedDate.value
  }

  if (viewMode.value === 'week') {
    return jobsForCurrentWeek.value.flatMap((day) => day.jobs)
  }

  // month
  return jobsForCurrentMonth.value.flatMap((group) => group.jobs)
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

const weekNumberLabel = computed(() => {
  const start = currentWeekStart.value
  const startOfYear = new Date(start.getFullYear(), 0, 1)
  const diffDays = Math.floor((start - startOfYear) / (1000 * 60 * 60 * 24))
  const weekNumber = Math.floor(diffDays / 7) + 1
  return weekNumber.toString()
})

const monthRangeLabel = computed(() => {
  const parts = selectedDate.value.split('-')
  if (parts.length !== 3) return currentMonthLabel.value
  const [year, month] = parts
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
})

const jobsInCurrentScope = computed(() => {
  return jobsMatchingFiltersNoFranchise.value.filter((job) => {
    const jobDate = new Date(job.date)
    if (Number.isNaN(jobDate.getTime())) return false

    if (viewMode.value === 'day') {
      return job.date === selectedDate.value
    }

    if (viewMode.value === 'week') {
      const start = currentWeekStart.value
      const end = addDays(currentWeekStart.value, 5)
      return jobDate >= start && jobDate <= end
    }

    // month
    const parts = selectedDate.value.split('-')
    if (parts.length !== 3) return false
    const [yearStr, monthStr] = parts
    const year = Number(yearStr)
    const monthIndex = Number(monthStr) - 1
    return jobDate.getFullYear() === year && jobDate.getMonth() === monthIndex
  })
})

const franchiseCounts = computed(() => {
  const counts = {}
  jobsInCurrentView.value.forEach((job) => {
    const id = job.franchiseId || '0'
    counts[id] = (counts[id] || 0) + 1
  })
  return counts
})

const franchises = computed(() => {
  return franchiseBase.map((item) => {
    if (item.value === '0') {
      const total = jobsInCurrentView.value.length
      return { value: item.value, label: `All (${total})` }
    }
    const count = franchiseCounts.value[item.value] || 0
    return {
      value: item.value,
      label: `${item.name} (${count})`
    }
  })
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

const jobsCountLabel = (count) => {
  if (!count) return '0 jobs'
  return `${count} job${count === 1 ? '' : 's'}`
}

const smsAlertsDueForDate = (dateKey) => {
  const jobs = jobsByDate.value[dateKey] || []
  // Simple heuristic: SMS alerts due for non-completed jobs
  return jobs.filter((job) => {
    const status = String(job.status).toLowerCase()
    return !['completed', 'cancelled', 'rejected'].includes(status)
  }).length
}

const smsAlertsDueInCurrentScope = computed(() => {
  const jobs = jobsInCurrentScope.value
  return jobs.filter((job) => {
    const status = String(job.status).toLowerCase()
    return !['completed', 'cancelled', 'rejected'].includes(status)
  }).length
})

const formatSmsSummary = (count, scope) => {
  const base = `${count} SMS Alert${count === 1 ? '' : 's'} Due`
  return `${base}`
}

const formatJobsSummary = (count, scope) => {
  const statusKey = activeStatusFilter.value
  let statusPrefix = ''
  if (statusKey) {
    const legendItem = statusLegend.find((item) => item.key === statusKey)
    if (legendItem?.label) {
      statusPrefix = `${legendItem.label.toUpperCase()} `
    }
  }

  if (!count) {
    const jobsWord = 'Jobs'
    return `No ${statusPrefix}${jobsWord}`
  }

  const jobWord = count === 1 ? 'Job' : 'Jobs'
  return `${count} ${statusPrefix}${jobWord}`
}

const handleAddJobForCurrentView = () => {
  if (viewMode.value === 'day') {
    window.alert?.(`Add job for ${selectedDateLabel.value}`)
  } else if (viewMode.value === 'week') {
    window.alert?.(`Add job for Week ${weekNumberLabel.value}`)
  } else {
    window.alert?.(`Add job for ${monthRangeLabel.value}`)
  }
}

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

  jobs.value.forEach((job) => {
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

const formatPriority = (priority) => {
  if (!priority) return ''
  const str = String(priority)
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const setStatusFilter = (key) => {
  if (key === null) {
    activeStatusFilter.value = null
    return
  }
  activeStatusFilter.value = activeStatusFilter.value === key ? null : key
}

const resetFilters = () => {
  addressFilter.value = ''
  jobStatusFilter.value = '0'
  selectedFranchise.value = '0'
}

const showAllJobs = () => {
  selectedFranchise.value = '0'
  addressFilter.value = ''
  activeStatusFilter.value = null
}

const nextJobSequence = ref(
  jobs.value.reduce((max, job) => {
    const numeric = Number(String(job.id || '').replace('JOB-', '')) || 0
    return Math.max(max, numeric)
  }, 1000) + 1
)

const createEmptyJobDraft = () => ({
  id: '',
  title: '',
  customer: '',
  address: '',
  date: '',
  startTime: '',
  endTime: '',
  status: 'scheduled',
  technician: '',
  priority: 'medium',
  ssra: 'N',
  franchiseId: '',
  notes: '',
  contactName: '',
  contactPhone: '',
  poNumber: '',
  batchNumber: '',
  createdDate: formatDateKey(today),
  orderDate: formatDateKey(today),
  scheduledBy: 'Teish France',
  rejectedReason: '',
  repeatJob: false,
  accountCustomer: '',
  supervisor: '',
  technicianNotes: '',
  ssraEmail: '',
  ssraDetail: {
    storey: '',
    risk1JobStep: '',
    risk1Hazard: '',
    risk1RiskLevel: '',
    risk1Ranking: '',
    risk2JobStep: '',
    risk2Hazard: '',
    risk2RiskLevel: '',
    risk2Ranking: '',
    risk3JobStep: '',
    risk3Hazard: '',
    risk3RiskLevel: '',
    risk3Ranking: '',
    q2SignsInPlace: '',
    q3SiteAccessible: '',
    q4EdgeProtectionEncompassArea: '',
    q5ScaffoldCondition: '',
    q6PpeBeingWorn: '',
    q7AccessBetweenLevelsSecure: '',
    q8DropEdgesBarricaded: '',
    q9FallingMaterialsControlled: '',
    q10HousekeepingMaintained: '',
    q11ManualHandlingFollowed: '',
    q12MaterialStoredSafely: '',
    q13AccessClearOfHazards: '',
    q14SafetyDataSheetsAvailable: '',
    q15LaddersUsedCorrectly: '',
    q16OnsiteToiletProvided: '',
    q17FirstAidKitAvailable: '',
    q18CopyOfSwmsAvailable: '',
    q19NearOpenTrench: '',
    q20NearUnprotectedFallZones: '',
    q21MobilePlantOperating: '',
    q22SecurityFenceSecured: '',
    checklistNotes: '',
    controlsPreset: '',
    controlsOther: '',
    controlsAdditional: '',
    siteManagerContacted: '',
    siteManagerWhy: '',
    allActionsImplemented: '',
    swmsVersion: 'AUG 2025',
    ssraCompleted: false,
    ssraSigned: false
  }
})

const showAddJobModal = ref(false)
const addJobContext = ref({
  dateKey: formatDateKey(today)
})
const newJobDraft = ref(createEmptyJobDraft())
const addJobTab = ref('details')

const openAddJobModalForDate = (dateKey) => {
  addJobContext.value = {
    dateKey
  }

  newJobDraft.value = {
    ...createEmptyJobDraft(),
    date: dateKey,
    franchiseId: selectedFranchise.value !== '0' ? selectedFranchise.value : ''
  }

  showAddJobModal.value = true
}

const closeAddJobModal = () => {
  showAddJobModal.value = false
}

const buildJobPayload = () => {
  const base = newJobDraft.value
  const idNumber = nextJobSequence.value
  nextJobSequence.value += 1

  return {
    id: `JOB-${String(idNumber).padStart(4, '0')}`,
    date: base.date,
    title: base.title || 'New Job',
    customer: base.customer,
    address: base.address,
    startTime: base.startTime || '',
    endTime: base.endTime || '',
    status: base.status || 'scheduled',
    technician: base.technician || '',
    priority: base.priority || 'medium',
    ssra: base.ssra || 'N',
    franchiseId:
      base.franchiseId || (selectedFranchise.value !== '0' ? selectedFranchise.value : '0'),
    notes: base.notes || '',
    contactName: base.contactName || '',
    contactPhone: base.contactPhone || '',
    poNumber: base.poNumber || '',
    batchNumber: base.batchNumber || '',
    createdDate: base.createdDate || formatDateKey(today),
    orderDate: base.orderDate || formatDateKey(today),
    scheduledBy: base.scheduledBy || 'Teish France',
    rejectedReason: base.rejectedReason || '',
    repeatJob: Boolean(base.repeatJob),
    accountCustomer: base.accountCustomer || '',
    supervisor: base.supervisor || '',
    technicianNotes: base.technicianNotes || '',
    ssraEmail: base.ssraEmail || '',
    ssraDetail: {
      storey: base.ssraDetail?.storey || '',
      risk1JobStep: base.ssraDetail?.risk1JobStep || '',
      risk1Hazard: base.ssraDetail?.risk1Hazard || '',
      risk1RiskLevel: base.ssraDetail?.risk1RiskLevel || '',
      risk1Ranking: base.ssraDetail?.risk1Ranking || '',
      risk2JobStep: base.ssraDetail?.risk2JobStep || '',
      risk2Hazard: base.ssraDetail?.risk2Hazard || '',
      risk2RiskLevel: base.ssraDetail?.risk2RiskLevel || '',
      risk2Ranking: base.ssraDetail?.risk2Ranking || '',
      risk3JobStep: base.ssraDetail?.risk3JobStep || '',
      risk3Hazard: base.ssraDetail?.risk3Hazard || '',
      risk3RiskLevel: base.ssraDetail?.risk3RiskLevel || '',
      risk3Ranking: base.ssraDetail?.risk3Ranking || '',
      q2SignsInPlace: base.ssraDetail?.q2SignsInPlace || '',
      q3SiteAccessible: base.ssraDetail?.q3SiteAccessible || '',
      q4EdgeProtectionEncompassArea: base.ssraDetail?.q4EdgeProtectionEncompassArea || '',
      q5ScaffoldCondition: base.ssraDetail?.q5ScaffoldCondition || '',
      q6PpeBeingWorn: base.ssraDetail?.q6PpeBeingWorn || '',
      q7AccessBetweenLevelsSecure: base.ssraDetail?.q7AccessBetweenLevelsSecure || '',
      q8DropEdgesBarricaded: base.ssraDetail?.q8DropEdgesBarricaded || '',
      q9FallingMaterialsControlled: base.ssraDetail?.q9FallingMaterialsControlled || '',
      q10HousekeepingMaintained: base.ssraDetail?.q10HousekeepingMaintained || '',
      q11ManualHandlingFollowed: base.ssraDetail?.q11ManualHandlingFollowed || '',
      q12MaterialStoredSafely: base.ssraDetail?.q12MaterialStoredSafely || '',
      q13AccessClearOfHazards: base.ssraDetail?.q13AccessClearOfHazards || '',
      q14SafetyDataSheetsAvailable: base.ssraDetail?.q14SafetyDataSheetsAvailable || '',
      q15LaddersUsedCorrectly: base.ssraDetail?.q15LaddersUsedCorrectly || '',
      q16OnsiteToiletProvided: base.ssraDetail?.q16OnsiteToiletProvided || '',
      q17FirstAidKitAvailable: base.ssraDetail?.q17FirstAidKitAvailable || '',
      q18CopyOfSwmsAvailable: base.ssraDetail?.q18CopyOfSwmsAvailable || '',
      q19NearOpenTrench: base.ssraDetail?.q19NearOpenTrench || '',
      q20NearUnprotectedFallZones: base.ssraDetail?.q20NearUnprotectedFallZones || '',
      q21MobilePlantOperating: base.ssraDetail?.q21MobilePlantOperating || '',
      q22SecurityFenceSecured: base.ssraDetail?.q22SecurityFenceSecured || '',
      checklistNotes: base.ssraDetail?.checklistNotes || '',
      controlsPreset: base.ssraDetail?.controlsPreset || '',
      controlsOther: base.ssraDetail?.controlsOther || '',
      controlsAdditional: base.ssraDetail?.controlsAdditional || '',
      siteManagerContacted: base.ssraDetail?.siteManagerContacted || '',
      siteManagerWhy: base.ssraDetail?.siteManagerWhy || '',
      allActionsImplemented: base.ssraDetail?.allActionsImplemented || '',
      swmsVersion: base.ssraDetail?.swmsVersion || 'AUG 2025',
      ssraCompleted: Boolean(base.ssraDetail?.ssraCompleted),
      ssraSigned: Boolean(base.ssraDetail?.ssraSigned)
    }
  }
}

const saveNewJob = () => {
  const draft = newJobDraft.value

  if (
    !draft.date ||
    !draft.franchiseId ||
    !draft.status ||
    !draft.orderDate ||
    !draft.accountCustomer ||
    !draft.contactName ||
    !draft.address
  ) {
    window.alert?.('Please fill in all required fields (marked with *).')
    return
  }

  const payload = buildJobPayload()
  jobs.value.push(payload)
  showAddJobModal.value = false
}
</script>

<template>
  <main class="schedule-page">
    <section v-if="!isHeaderCollapsed" class="schedule-header">
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
          <div class="legend-actions">
            <button
              type="button"
              class="all-jobs-button"
              :class="{ 'is-active': !activeStatusFilter }"
              @click="showAllJobs"
            >
              All Jobs
            </button>
            <button
              type="button"
              class="reset-filters-button"
              @click="resetFilters"
            >
              Reset filters
            </button>
          </div>
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

      </div>
    </section>

    <section class="schedule-body">
      <section class="jobs-panel">
        <header class="jobs-header">
          <div class="jobs-heading-row">
            <h2 class="jobs-title">
              <span v-if="viewMode === 'day'">
                {{ selectedDateLabel }}
              </span>
              <span v-else-if="viewMode === 'week'">
                Week {{ weekNumberLabel }}
              </span>
              <span v-else>
                {{ monthRangeLabel }}
              </span>
            </h2>

            <span class="jobs-heading-divider">•</span>

            <span class="jobs-subtitle jobs-subtitle-inline">
              <span v-if="viewMode === 'day'">
                {{ formatJobsSummary(jobsForSelectedDate.length, 'day') }}
              </span>
              <span v-else-if="viewMode === 'week'">
                {{
                  formatJobsSummary(
                    jobsForCurrentWeek.reduce((acc, day) => acc + day.jobs.length, 0),
                    'week'
                  )
                }}
              </span>
              <span v-else>
                {{
                  formatJobsSummary(
                    jobsForCurrentMonth.reduce((acc, day) => acc + day.jobs.length, 0),
                    'month'
                  )
                }}
              </span>
            </span>

            <span
              v-if="smsAlertsDueInCurrentScope"
              class="jobs-subtitle jobs-subtitle-secondary jobs-subtitle-inline jobs-subtitle-secondary--sms"
            >
              {{
                formatSmsSummary(
                  smsAlertsDueInCurrentScope,
                  viewMode === 'day' ? 'day' : viewMode === 'week' ? 'week' : 'month'
                )
              }}
            </span>
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
          <div class="jobs-day-add-row">
            <button
              type="button"
              class="jobs-add-button"
              aria-label="Add job for this day"
              @click="openAddJobModalForDate(selectedDate)"
            >
              +
            </button>
          </div>
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
                  Priority: {{ formatPriority(job.priority) }}
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

            <div class="job-franchise-footer">
              {{ franchiseNameById[job.franchiseId] || 'Franchise: N/A' }}
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
              <div class="jobs-day-metrics">
                <span class="jobs-day-count">
                  {{
                    day.jobs.length ? jobsCountLabel(day.jobs.length) : 'No jobs'
                  }}
                </span>
                <span
                  v-if="day.jobs.length && smsAlertsDueForDate(day.dateKey)"
                  class="jobs-day-sms"
                >
                  {{
                    `${smsAlertsDueForDate(day.dateKey)} SMS Alert${
                      smsAlertsDueForDate(day.dateKey) === 1 ? '' : 's'
                    } Due`
                  }}
                </span>
              </div>
              <button
                type="button"
                class="jobs-add-button"
                @click="openAddJobModalForDate(day.dateKey)"
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
                    Priority: {{ formatPriority(job.priority) }}
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

              <div class="job-franchise-footer">
                {{ franchiseNameById[job.franchiseId] || 'Franchise: N/A' }}
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
                  <div class="month-calendar-day-metrics">
                    <span v-if="day.jobs.length" class="month-calendar-day-count">
                      {{ jobsCountLabel(day.jobs.length) }}
                    </span>
                    <span
                      v-if="smsAlertsDueForDate(day.key)"
                      class="month-calendar-sms-count"
                    >
                      {{
                        `${smsAlertsDueForDate(day.key)} SMS Alert${
                          smsAlertsDueForDate(day.key) === 1 ? '' : 's'
                        } Due`
                      }}
                    </span>
                  </div>
                  <button
                    type="button"
                    class="month-add-button"
                    aria-label="Add job for this day"
                    @click="openAddJobModalForDate(day.key)"
                  >
                    +
                  </button>
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

                    <div class="month-job-tooltip">
                      <div class="month-job-tooltip-title">
                        {{ job.title }}
                      </div>
                      <div class="month-job-tooltip-line">
                        <strong>{{ statusLabel(job.status) }}</strong>
                        • {{ job.id }}
                      </div>
                      <div class="month-job-tooltip-line">
                        {{ job.startTime }} - {{ job.endTime }} &nbsp;•&nbsp;
                        {{ formatTime12(job.startTime) }} {{ job.technician }}
                      </div>
                      <div class="month-job-tooltip-line">
                        {{ job.address }}
                      </div>
                      <div class="month-job-tooltip-line">
                        Franchise:
                        {{ franchiseNameById[job.franchiseId] || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>

    <div v-if="showAddJobModal" class="add-job-backdrop" @click.self="closeAddJobModal">
      <section class="add-job-modal" role="dialog" aria-modal="true">
        <header class="add-job-header">
          <h2 class="add-job-title">Add Job</h2>
          <button type="button" class="add-job-close" @click="closeAddJobModal">
            ×
          </button>
        </header>

        <form class="add-job-form" @submit.prevent="saveNewJob">
          <div class="add-job-tabs" role="tablist">
            <button
              type="button"
              class="add-job-tab-button"
              :class="{ 'is-active': addJobTab === 'details' }"
              role="tab"
              @click="addJobTab = 'details'"
            >
              Details
            </button>
            <button
              type="button"
              class="add-job-tab-button"
              :class="{ 'is-active': addJobTab === 'checklist' }"
              role="tab"
              @click="addJobTab = 'checklist'"
            >
              Site Conditions
            </button>
            <button
              type="button"
              class="add-job-tab-button"
              :class="{ 'is-active': addJobTab === 'risks' }"
              role="tab"
              @click="addJobTab = 'risks'"
            >
              Job Risks &amp; Controls
            </button>
          </div>

          <div v-if="addJobTab === 'details'" class="add-job-tab-panel">
            <div class="add-job-grid">
              <div class="add-job-field">
                <label class="add-job-label">
                  Job Date <span class="add-job-required">*</span>
                </label>
                <div class="add-job-static">
                  {{ addJobContext.dateKey }}
                </div>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  Order Date <span class="add-job-required">*</span>
                </label>
                <input v-model="newJobDraft.orderDate" type="date" class="add-job-input" />
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  Franchise <span class="add-job-required">*</span>
                </label>
                <select v-model="newJobDraft.franchiseId" class="add-job-input">
                  <option value="">Select franchise</option>
                  <option
                    v-for="f in franchiseBase.filter((item) => item.value !== '0')"
                    :key="f.value"
                    :value="f.value"
                  >
                    {{ f.name }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  Job Status <span class="add-job-required">*</span>
                </label>
                <select v-model="newJobDraft.status" class="add-job-input">
                  <option
                    v-for="item in statusLegend"
                    :key="item.key"
                    :value="item.key"
                  >
                    {{ item.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">If Rejected-Reason Why</label>
                <textarea
                  v-model="newJobDraft.rejectedReason"
                  rows="2"
                  class="add-job-input"
                ></textarea>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Scheduled By</label>
                <input
                  v-model="newJobDraft.scheduledBy"
                  type="text"
                  class="add-job-input"
                />
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Job No.</label>
                <div class="add-job-static">
                  (auto)
                </div>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">Job Times</label>
                <div class="add-job-times-row">
                  <select
                    v-model="newJobDraft.startTime"
                    class="add-job-input add-job-input-inline"
                  >
                    <option
                      v-for="opt in timeOptions"
                      :key="`start-${opt.label}`"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                  <span class="add-job-times-separator">to</span>
                  <select
                    v-model="newJobDraft.endTime"
                    class="add-job-input add-job-input-inline"
                  >
                    <option
                      v-for="opt in timeOptions"
                      :key="`end-${opt.label}`"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Repeat Job</label>
                <div class="add-job-static add-job-static-inline">
                  <input
                    id="add-job-repeat"
                    v-model="newJobDraft.repeatJob"
                    type="checkbox"
                  />
                  <label for="add-job-repeat">Repeat Job</label>
                </div>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">
                  Account Customers <span class="add-job-required">*</span>
                </label>
                <select v-model="newJobDraft.accountCustomer" class="add-job-input">
                  <option
                    v-for="cust in accountCustomerOptions"
                    :key="cust.value"
                    :value="cust.value"
                  >
                    {{ cust.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Supervisor</label>
                <select v-model="newJobDraft.supervisor" class="add-job-input">
                  <option
                    v-for="sup in supervisorOptions"
                    :key="sup.value"
                    :value="sup.value"
                  >
                    {{ sup.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Technician</label>
                <select v-model="newJobDraft.technician" class="add-job-input">
                  <option
                    v-for="tech in technicianOptions"
                    :key="tech.value"
                    :value="tech.value"
                  >
                    {{ tech.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  Job Contact <span class="add-job-required">*</span>
                </label>
                <input v-model="newJobDraft.contactName" type="text" class="add-job-input" />
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Job Phone</label>
                <input v-model="newJobDraft.contactPhone" type="tel" class="add-job-input" />
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">
                  Job Address <span class="add-job-required">*</span>
                </label>
                <textarea
                  v-model="newJobDraft.address"
                  rows="2"
                  class="add-job-input"
                ></textarea>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">Job Notes</label>
                <textarea
                  v-model="newJobDraft.notes"
                  rows="3"
                  class="add-job-input"
                ></textarea>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">Technician Notes</label>
                <textarea
                  v-model="newJobDraft.technicianNotes"
                  rows="3"
                  class="add-job-input"
                ></textarea>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Priority</label>
                <select v-model="newJobDraft.priority" class="add-job-input">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">SSRA Email Address</label>
                <input v-model="newJobDraft.ssraEmail" type="email" class="add-job-input" />
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Purchase Order No.</label>
                <input v-model="newJobDraft.poNumber" type="text" class="add-job-input" />
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Batch No.</label>
                <input v-model="newJobDraft.batchNumber" type="text" class="add-job-input" />
              </div>

            </div>
          </div>

          <div v-else-if="addJobTab === 'checklist'" class="add-job-tab-panel">
            <div class="add-job-grid">
              <div class="add-job-field">
                <label class="add-job-label">1. Storey</label>
                <select v-model="newJobDraft.ssraDetail.storey" class="add-job-input">
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="multi">Multi</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">2. Are signs in place?</label>
                <select v-model="newJobDraft.ssraDetail.q2SignsInPlace" class="add-job-input">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">3. Is the job site accessible</label>
                <select v-model="newJobDraft.ssraDetail.q3SiteAccessible" class="add-job-input">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  4. Does edge protection fully encompass work area?
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.q4EdgeProtectionEncompassArea"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  5. Are the scaffold/trestle/planks in good condition?
                </label>
                <select v-model="newJobDraft.ssraDetail.q5ScaffoldCondition" class="add-job-input">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  6. Is the required personal protective equipment being worn?
                </label>
                <select v-model="newJobDraft.ssraDetail.q6PpeBeingWorn" class="add-job-input">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">7. Is access between levels secure?</label>
                <select
                  v-model="newJobDraft.ssraDetail.q7AccessBetweenLevelsSecure"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  8. Are all drop edges near working area and access barricaded?
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.q8DropEdgesBarricaded"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  9. Is potential fall of materials onto persons working below controlled?
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.q9FallingMaterialsControlled"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">10. Is housekeeping maintained?</label>
                <select
                  v-model="newJobDraft.ssraDetail.q10HousekeepingMaintained"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  11. Are manual handling procedures e.g. lifting, being followed?
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.q11ManualHandlingFollowed"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">12. Is material stored in a safe place?</label>
                <select
                  v-model="newJobDraft.ssraDetail.q12MaterialStoredSafely"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  13. Is access kept clear and free of trip hazards/overhead projections?
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.q13AccessClearOfHazards"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">14. Are Safety Data Sheets available?</label>
                <select
                  v-model="newJobDraft.ssraDetail.q14SafetyDataSheetsAvailable"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  15. Are ladders being used correctly and in good condition?
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.q15LaddersUsedCorrectly"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">16. Is an on-site toilet provided?</label>
                <select
                  v-model="newJobDraft.ssraDetail.q16OnsiteToiletProvided"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">17. Do you have a first aid kit?</label>
                <select
                  v-model="newJobDraft.ssraDetail.q17FirstAidKitAvailable"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">18. Do you have a copy of the SWMS?</label>
                <select
                  v-model="newJobDraft.ssraDetail.q18CopyOfSwmsAvailable"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  19. Are you working in close proximity to an open trench/excavation?
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.q19NearOpenTrench"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  20. Are you going to work near any unprotected fall zones?
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.q20NearUnprotectedFallZones"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  21. Is there any mobile powered plant operating on the site?
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.q21MobilePlantOperating"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  22. Security fence is in place, and secured/locked on leaving site
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.q22SecurityFenceSecured"
                  class="add-job-input"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A</option>
                </select>
              </div>
            </div>
          </div>

          <div v-else class="add-job-tab-panel">
            <div class="add-job-grid">
              <div class="add-job-field">
                <label class="add-job-label">
                  Job Steps <span class="add-job-required">*</span>
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.risk1JobStep"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraJobStepOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  Hazards <span class="add-job-required">*</span>
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.risk1Hazard"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraHazardOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  Risk Level <span class="add-job-required">*</span>
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.risk1RiskLevel"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraRiskLevelOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">
                  Ranking <span class="add-job-required">*</span>
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.risk1Ranking"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraRankingOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">Risk 2</label>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Job Steps</label>
                <select
                  v-model="newJobDraft.ssraDetail.risk2JobStep"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraJobStepOptions" :key="`r2-js-${opt.value}`" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Hazards</label>
                <select
                  v-model="newJobDraft.ssraDetail.risk2Hazard"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraHazardOptions" :key="`r2-h-${opt.value}`" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Risk Level</label>
                <select
                  v-model="newJobDraft.ssraDetail.risk2RiskLevel"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraRiskLevelOptions" :key="`r2-rl-${opt.value}`" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Ranking</label>
                <select
                  v-model="newJobDraft.ssraDetail.risk2Ranking"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraRankingOptions" :key="`r2-rk-${opt.value}`" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">Risk 3</label>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Job Steps</label>
                <select
                  v-model="newJobDraft.ssraDetail.risk3JobStep"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraJobStepOptions" :key="`r3-js-${opt.value}`" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Hazards</label>
                <select
                  v-model="newJobDraft.ssraDetail.risk3Hazard"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraHazardOptions" :key="`r3-h-${opt.value}`" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Risk Level</label>
                <select
                  v-model="newJobDraft.ssraDetail.risk3RiskLevel"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraRiskLevelOptions" :key="`r3-rl-${opt.value}`" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field">
                <label class="add-job-label">Ranking</label>
                <select
                  v-model="newJobDraft.ssraDetail.risk3Ranking"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraRankingOptions" :key="`r3-rk-${opt.value}`" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">
                  Controls <span class="add-job-required">*</span>
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.controlsPreset"
                  class="add-job-input"
                >
                  <option v-for="opt in ssraControlsOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">
                  Other Job Steps,Hazards,Risk Level,Ranking
                </label>
                <textarea
                  v-model="newJobDraft.ssraDetail.controlsOther"
                  rows="2"
                  class="add-job-input"
                ></textarea>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">Additional Controls</label>
                <textarea
                  v-model="newJobDraft.ssraDetail.controlsAdditional"
                  rows="2"
                  class="add-job-input"
                ></textarea>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">
                  Have you contacted  site manager regarding identified hazards?
                  <span class="add-job-required">*</span>
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.siteManagerContacted"
                  class="add-job-input"
                >
                  <option
                    v-for="opt in ssraYesNoNaOptions"
                    :key="`sm-${opt.value}`"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">Why</label>
                <input
                  v-model="newJobDraft.ssraDetail.siteManagerWhy"
                  type="text"
                  class="add-job-input"
                />
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">
                  Have you implemented all action items?
                  <span class="add-job-required">*</span>
                </label>
                <select
                  v-model="newJobDraft.ssraDetail.allActionsImplemented"
                  class="add-job-input"
                >
                  <option
                    v-for="opt in ssraYesNoNaOptions"
                    :key="`aa-${opt.value}`"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">SWMS Version</label>
                <input
                  v-model="newJobDraft.ssraDetail.swmsVersion"
                  type="text"
                  class="add-job-input"
                  disabled
                />
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">
                  The risk assessment has been completed in conjunction with our SWMS.
                </label>
                <div class="add-job-static add-job-static-inline">
                  <input
                    id="add-job-ssra-completed"
                    v-model="newJobDraft.ssraDetail.ssraCompleted"
                    type="checkbox"
                    disabled
                  />
                  <label for="add-job-ssra-completed">Yes</label>
                </div>
              </div>

              <div class="add-job-field add-job-field-full">
                <label class="add-job-label">Signed</label>
                <div class="add-job-static add-job-static-inline">
                  <input
                    id="add-job-ssra-signed"
                    v-model="newJobDraft.ssraDetail.ssraSigned"
                    type="checkbox"
                    disabled
                  />
                  <label for="add-job-ssra-signed">Yes</label>
                </div>
              </div>
            </div>
          </div>

          <footer class="add-job-footer">
            <button
              type="button"
              class="add-job-button add-job-button-secondary"
              @click="closeAddJobModal"
            >
              Cancel
            </button>
            <button type="submit" class="add-job-button add-job-button-primary">
              Save job
            </button>
          </footer>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.add-job-required {
  color: #e02424;
}
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

.legend-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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
  border: 2px solid transparent;
  transition:
    transform 0.1s ease-out,
    box-shadow 0.1s ease-out,
    opacity 0.1s ease-out,
    border-color 0.1s ease-out;
}

.legend-swatch.is-active {
  opacity: 1;
  box-shadow: 0 0 0 2px rgba(31, 41, 55, 0.18);
  border-color: var(--gg-color-secondary);
  transform: translateY(-1px) scale(1.08);
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

.all-jobs-button:hover {
  background: #f3f4ff;
  border-color: var(--gg-color-primary);
  color: var(--gg-color-primary);
}

.reset-filters-button {
  border-radius: 999px;
  border: none;
  padding: 0.3rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 500;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
}

.reset-filters-button:hover {
  background: #f3f4ff;
  color: #4b5563;
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

.filter-button-primary:hover {
  background: #4c1d95;
}

.filter-button-secondary:hover {
  background: #e0e7ff;
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

.jobs-heading-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.jobs-heading-divider {
  font-size: 0.75rem;
  color: #d1d5db;
}

.jobs-title {
  font-size: 1.15rem;
  font-weight: 500;
  margin-bottom: 0;
  color: #111827;
}

.jobs-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0;
}

.jobs-subtitle-inline {
  display: inline-flex;
  align-items: baseline;
}

.jobs-subtitle-secondary {
  font-size: 0.8rem;
  color: #b91c1c;
  margin-top: 0;
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

.view-toggle-button:not(.is-active):hover {
  background: #e5e7eb;
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

.jobs-today-button:hover {
  background: #f3f4ff;
  border-color: rgba(88, 36, 136, 0.6);
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
  align-items: flex-start;
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

.jobs-day-metrics {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.05rem;
}

.jobs-day-sms {
  font-size: 0.78rem;
  color: #b91c1c;
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
  position: relative;
}

.jobs-add-button:hover {
  background: rgba(255, 238, 0, 0.18);
  border-color: rgba(88, 36, 136, 0.6);
}

.jobs-add-button::after {
  content: 'Add Job';
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translate(-50%, 4px);
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: #111827;
  color: #f9fafb;
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.35);
  transition:
    opacity 0.12s ease-out,
    transform 0.12s ease-out;
}

.jobs-add-button:hover::after,
.jobs-add-button:focus-visible::after {
  opacity: 1;
  transform: translate(-50%, 0);
}

.jobs-day-add-row {
  display: flex;
  justify-content: flex-end;
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

.month-calendar-day-metrics {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.05rem;
}

.month-calendar-day-count {
  min-width: auto;
  height: auto;
  border-radius: 0;
  background: transparent;
  font-size: 0.72rem;
  font-weight: 500;
  display: inline-block;
  color: #6b7280;
}

.month-calendar-sms-count {
  font-size: 0.7rem;
  color: #b91c1c;
}

.month-add-button {
  border-radius: 999px;
  border: 1px solid rgba(209, 213, 219, 1);
  width: 1.4rem;
  height: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  cursor: pointer;
  background: #ffffff;
  color: #111827;
  position: relative;
}

.month-add-button:hover {
  background: rgba(255, 238, 0, 0.18);
  border-color: rgba(88, 36, 136, 0.6);
}

.month-add-button::after {
  content: 'Add Job';
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translate(-50%, 4px);
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: #111827;
  color: #f9fafb;
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.35);
  transition:
    opacity 0.12s ease-out,
    transform 0.12s ease-out;
}

.month-add-button:hover::after,
.month-add-button:focus-visible::after {
  opacity: 1;
  transform: translate(-50%, 0);
}

.month-calendar-day-jobs {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-top: 0.25rem;
  overflow: visible;
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
  overflow: visible;
  position: relative;
  cursor: pointer;
}

.month-calendar-job-status {
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.month-calendar-job-title {
  font-weight: 500;
  opacity: 0.95;
  max-width: 6.5rem;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.month-calendar-job-franchise {
  font-weight: 400;
  opacity: 0.85;
}

.month-job-tooltip {
  position: absolute;
  top: 125%;
  left: 0;
  z-index: 20;
  min-width: 220px;
  max-width: 320px;
  padding: 0.6rem 0.8rem;
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.2);
  border: 1px solid rgba(209, 213, 219, 0.9);
  font-size: 0.75rem;
  color: #111827;
  line-height: 1.35;
  opacity: 0;
  pointer-events: none;
  transform: translateY(4px);
  transition:
    opacity 0.12s ease-out,
    transform 0.12s ease-out;
  background-clip: padding-box;
}

.month-calendar-job-chip:hover .month-job-tooltip,
.month-calendar-job-chip:focus-within .month-job-tooltip {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.month-job-tooltip-title {
  font-weight: 600;
  margin-bottom: 0.1rem;
}

.month-job-tooltip-line {
  color: #4b5563;
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

.job-franchise-chip {
  background: #eef2ff;
}

.job-franchise-footer {
  margin-top: 0.4rem;
  margin-left: -1rem;
  margin-right: -1rem;
  margin-bottom: -0.9rem;
  padding: 0.35rem 1rem;
  border-radius: 0 0 0.75rem 0.75rem;
  background: #eef2ff;
  border-top: 1px solid rgba(209, 213, 219, 0.9);
  font-size: 0.72rem;
  color: #4b5563;
}

.job-card-condensed .job-franchise-footer {
  margin-left: -0.8rem;
  margin-right: -0.8rem;
  margin-bottom: -0.6rem;
  padding-inline: 0.8rem;
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

.add-job-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.add-job-modal {
  width: min(680px, 100% - 2rem);
  max-height: 90vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 0.9rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.35);
  padding: 1rem 1.25rem 1.1rem;
}

.add-job-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.add-job-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.add-job-close {
  border: none;
  background: transparent;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  color: #4b5563;
}

.add-job-tabs {
  display: inline-flex;
  padding: 0.15rem;
  border-radius: 999px;
  background: #f3f4f6;
  margin-bottom: 0.75rem;
}

.add-job-tab-button {
  border: none;
  background: transparent;
  padding: 0.25rem 0.9rem;
  font-size: 0.85rem;
  border-radius: 999px;
  cursor: pointer;
  color: #4b5563;
}

.add-job-tab-button.is-active {
  background: var(--gg-color-secondary);
  color: var(--gg-color-primary);
  box-shadow: 0 1px 3px rgba(88, 36, 136, 0.35);
}

.add-job-tab-panel {
  margin-top: 0.25rem;
}

.add-job-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 0.75rem;
}

.add-job-field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.add-job-field-full {
  grid-column: 1 / -1;
}

.add-job-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: #4b5563;
}

.add-job-input {
  border-radius: 0.5rem;
  border: 1px solid rgba(209, 213, 219, 1);
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
  color: #111827;
}

.add-job-input:focus {
  outline: none;
  border-color: rgba(88, 36, 136, 0.7);
  box-shadow: 0 0 0 1px rgba(88, 36, 136, 0.35);
}

.add-job-static {
  border-radius: 0.5rem;
  border: 1px solid rgba(209, 213, 219, 0.9);
  background: #f9fafb;
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
  color: #111827;
}

.add-job-static-inline {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.add-job-times-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.add-job-input-inline {
  flex: 1 1 auto;
}

.add-job-times-separator {
  font-size: 0.8rem;
  color: #4b5563;
}

.add-job-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.add-job-button {
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.add-job-button-primary {
  background: var(--gg-color-primary);
  color: #ffffff;
}

.add-job-button-primary:hover {
  background: #4c1d95;
}

.add-job-button-secondary {
  background: #ffffff;
  border-color: rgba(209, 213, 219, 1);
  color: #374151;
}

.add-job-button-secondary:hover {
  background: #f3f4ff;
  border-color: rgba(88, 36, 136, 0.6);
}

@media (max-width: 960px) {
  .schedule-header {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .schedule-summary {
    width: 100%;
    justify-content: space-between;
  }

  .summary-card {
    flex: 1;
  }

  .filters-row {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    justify-content: flex-start;
  }

  .calendar-week {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .jobs-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .jobs-header-controls {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .jobs-nav {
    width: 100%;
    justify-content: space-between;
  }

  .jobs-today-button {
    align-self: flex-start;
  }

  .view-toggle {
    width: 100%;
    justify-content: space-between;
  }

  .jobs-week-grid {
    flex-direction: column;
    overflow-x: visible;
  }

  .jobs-week-column {
    width: 100%;
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

@media (max-width: 640px) {
  .add-job-modal {
    width: 100%;
    max-width: 100%;
    max-height: 100vh;
    height: 100%;
    border-radius: 0;
  }

  .add-job-grid {
    grid-template-columns: 1fr;
  }
}
</style>
