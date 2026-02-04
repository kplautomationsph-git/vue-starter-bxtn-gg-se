<script setup>
import { ref } from 'vue'
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

const isMobileNavOpen = ref(false)

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

const closeMobileNav = () => {
  isMobileNavOpen.value = false
}
</script>

<template>
  <div class="app-shell container-fluid px-2 px-md-3 px-lg-4 py-2">
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

        <div class="gg-header-right">
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

          <button
            type="button"
            class="gg-mobile-toggle d-inline-flex d-md-none"
            :aria-expanded="isMobileNavOpen ? 'true' : 'false'"
            aria-label="Toggle navigation menu"
            @click="toggleMobileNav"
          >
            <span class="gg-mobile-toggle-bar"></span>
            <span class="gg-mobile-toggle-bar"></span>
            <span class="gg-mobile-toggle-bar"></span>
          </button>
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

    <transition name="gg-mobile-nav">
      <div
        v-if="isMobileNavOpen"
        class="gg-mobile-nav-backdrop d-md-none"
        @click="closeMobileNav"
      >
        <nav
          class="gg-mobile-nav-panel"
          aria-label="Main navigation"
          @click.stop
        >
          <button
            type="button"
            class="gg-mobile-nav-close"
            aria-label="Close navigation"
            @click="closeMobileNav"
          >
            ×
          </button>
          <ul class="gg-mobile-nav-list">
            <li class="gg-mobile-nav-item">
              <RouterLink
                to="/"
                class="gg-mobile-nav-link"
                @click="closeMobileNav"
              >
                Schedule
              </RouterLink>
            </li>
            <li class="gg-mobile-nav-item">
              <a href="#" class="gg-mobile-nav-link">Jobs</a>
            </li>
            <li class="gg-mobile-nav-item">
              <a href="#" class="gg-mobile-nav-link">Invoicing</a>
            </li>
            <li class="gg-mobile-nav-item">
              <a href="#" class="gg-mobile-nav-link">Administration</a>
            </li>
            <li class="gg-mobile-nav-item">
              <a href="#" class="gg-mobile-nav-link">Support Log</a>
            </li>
            <li class="gg-mobile-nav-item">
              <a href="#" class="gg-mobile-nav-link gg-mobile-nav-link-logout">Log Out</a>
            </li>
          </ul>
        </nav>
      </div>
    </transition>

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

.gg-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

.gg-mobile-toggle {
  border: 1px solid rgba(31, 41, 55, 0.2);
  border-radius: 999px;
  padding: 0.35rem 0.45rem;
  background: #111827;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.18rem;
}

.gg-mobile-toggle-bar {
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: #f9fafb;
}

.gg-mobile-nav-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  justify-content: flex-end;
  z-index: 40;
}

.gg-mobile-nav-panel {
  width: 260px;
  max-width: 80%;
  background: #111827;
  color: #e5e7eb;
  padding: 1rem 1.25rem;
  box-shadow: -8px 0 24px rgba(15, 23, 42, 0.6);
}

.gg-mobile-nav-close {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.5rem;
  padding: 0;
  margin-left: auto;
  display: block;
}

.gg-mobile-nav-list {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.gg-mobile-nav-link {
  display: block;
  width: 100%;
  padding: 0.55rem 0.35rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #e5e7eb;
  font-size: 0.95rem;
}

.gg-mobile-nav-link:hover {
  background: rgba(249, 250, 251, 0.06);
}

.gg-mobile-nav-link-logout {
  color: #fecaca;
}

.gg-mobile-nav-enter-active,
.gg-mobile-nav-leave-active {
  transition:
    opacity 0.18s ease-out,
    transform 0.18s ease-out;
}

.gg-mobile-nav-enter-from,
.gg-mobile-nav-leave-to {
  opacity: 0;
}

.gg-mobile-nav-enter-from .gg-mobile-nav-panel,
.gg-mobile-nav-leave-to .gg-mobile-nav-panel {
  transform: translateX(100%);
}

.gg-mobile-nav-enter-to .gg-mobile-nav-panel,
.gg-mobile-nav-leave-from .gg-mobile-nav-panel {
  transform: translateX(0%);
}

.app-main {
  flex: 1;
}

@media (max-width: 768px) {
  .gg-header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    position: relative;
  }

  .gg-header-meta {
    font-size: 0.78rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
  }

  .gg-header-right {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .gg-meta-separator {
    display: none;
  }

  .gg-nav {
    display: none;
  }

  .gg-mobile-toggle {
    display: inline-flex;
    position: absolute;
    top: 0.55rem;
    right: 1rem;
    z-index: 45;
  }
}
</style>
