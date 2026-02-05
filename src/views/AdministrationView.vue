<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="uc-page">
    <div class="uc-card">
      <header class="uc-header">
        <h1 class="uc-title">Administration</h1>
        <p class="uc-subtitle">The Administration section is currently under construction.</p>
      </header>

      <div class="uc-body">
        <p class="uc-copy">
          This area will centralise configuration and administration tools for your Goop Guys
          account.
        </p>
        <p class="uc-copy">
          For now, you can continue working from the
          <RouterLink to="/" class="uc-link">Schedule</RouterLink>
          view.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.uc-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uc-card {
  max-width: 540px;
  width: 100%;
  padding: 1.75rem 1.5rem;
  border-radius: 1rem;
  background: #ffffff;
  border: 1px solid rgba(209, 213, 219, 0.9);
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.18);
}

.uc-header {
  margin-bottom: 0.75rem;
}

.uc-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.2rem;
}

.uc-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
}

.uc-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.92rem;
  color: #374151;
}

.uc-copy {
  margin: 0;
}

.uc-link {
  color: var(--gg-color-primary);
  font-weight: 500;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.uc-link:hover {
  color: #4c1d95;
}

@media (max-width: 640px) {
  .uc-card {
    border-radius: 0.75rem;
    padding: 1.5rem 1.25rem;
  }
}
</style>

