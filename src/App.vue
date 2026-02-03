<script setup>
import { RouterLink, RouterView } from 'vue-router'

const todayLabel = new Date().toLocaleDateString(undefined, {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric'
})

// Static placeholders for now – wire these to real data later.
const userName = 'Teish France'
const franchise = 'Goop Guys Gold Coast H/O'
const userLevel = 'Administrator'
</script>

<template>
  <div class="app-shell">
    <header class="gg-header">
      <div class="gg-header-top">
        <div class="gg-header-left">
          <a
            href="https://goopguys.com"
            target="_blank"
            rel="noreferrer"
            class="gg-logo-link"
          >
            <img
              class="gg-logo"
              src="https://goopguys.com/wp-content/uploads/2022/01/Goop-Guys-25yrs-Logo.png"
              alt="Goop Guys logo"
            />
          </a>
          <div class="gg-header-text">
            <div class="gg-app-name">Scheduler</div>
          </div>
        </div>

        <div class="gg-header-meta" aria-label="User session details">
          <span class="gg-meta-label">Date:</span>
          <span class="gg-meta-value">{{ todayLabel }}</span>
          <span class="gg-meta-separator">|</span>
          <span class="gg-meta-label">Login:</span>
          <span class="gg-meta-value">{{ userName }}</span>
          <span class="gg-meta-separator">|</span>
          <span class="gg-meta-label">Franchise:</span>
          <span class="gg-meta-value">{{ franchise }}</span>
          <span class="gg-meta-separator">|</span>
          <span class="gg-meta-label">User level:</span>
          <span class="gg-meta-value">{{ userLevel }}</span>
        </div>
      </div>

      <nav class="gg-nav" aria-label="Main navigation">
        <ul class="gg-nav-list">
          <li class="gg-nav-item">
            <RouterLink to="/" class="gg-nav-link">Schedule</RouterLink>
          </li>
          <li class="gg-nav-item">
            <a href="#" class="gg-nav-link">Jobs</a>
          </li>
          <li class="gg-nav-item">
            <a href="#" class="gg-nav-link">Invoicing</a>
          </li>
          <li class="gg-nav-item">
            <a href="#" class="gg-nav-link">Administration</a>
          </li>
          <li class="gg-nav-item">
            <a href="#" class="gg-nav-link">Support Log</a>
          </li>
          <li class="gg-nav-item gg-nav-item-right">
            <a href="#" class="gg-nav-link gg-nav-link-logout">Log Out</a>
          </li>
        </ul>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.gg-header {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.25);
}

.gg-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: var(--gg-color-secondary);
  color: #111827;
}

.gg-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.gg-logo-link {
  display: inline-flex;
  align-items: center;
}

.gg-logo {
  height: 40px;
  display: block;
  object-fit: contain;
}

.gg-header-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.gg-app-name {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--gg-color-primary);
}

.gg-header-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
}

.gg-meta-label {
  font-weight: 600;
}

.gg-meta-value {
  font-weight: 400;
}

.gg-meta-separator {
  opacity: 0.7;
  margin: 0 0.25rem;
}

.gg-nav {
  background: #222831;
}

.gg-nav-list {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1.75rem;
  margin: 0;
  padding: 0.6rem 1.75rem;
}

.gg-nav-item {
  position: relative;
}

.gg-nav-item-right {
  margin-left: auto;
}

.gg-nav-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: #e5e7eb;
  text-decoration: none;
  padding-bottom: 0.15rem;
}

.gg-nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: var(--gg-color-secondary);
  transition: width 0.18s ease-out;
}

.gg-nav-link:hover::after {
  width: 100%;
}

.gg-nav-link-logout {
  color: #fca5a5;
}

.app-main {
  flex: 1;
}

@media (max-width: 768px) {
  .gg-header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .gg-header-meta {
    font-size: 0.78rem;
  }

  .gg-nav-list {
    overflow-x: auto;
    padding: 0.5rem 1.25rem;
    gap: 1.25rem;
  }
}
</style>
