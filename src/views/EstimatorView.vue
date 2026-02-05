<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="estimator-page">
    <div class="estimator-card">
      <header class="estimator-header">
        <h1 class="estimator-title">Estimator</h1>
        <p class="estimator-subtitle">This area is currently under construction.</p>
      </header>

      <div class="estimator-body">
        <p class="estimator-copy">
          We’re working on a new Estimator experience to help you quote and plan jobs faster.
        </p>
        <p class="estimator-copy">
          In the meantime, you can continue using the
          <RouterLink to="/" class="estimator-link">Schedule</RouterLink>
          view to manage jobs.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.estimator-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.estimator-card {
  max-width: 540px;
  width: 100%;
  padding: 1.75rem 1.5rem;
  border-radius: 1rem;
  background: #ffffff;
  border: 1px solid rgba(209, 213, 219, 0.9);
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.18);
}

.estimator-header {
  margin-bottom: 0.75rem;
}

.estimator-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.2rem;
}

.estimator-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
}

.estimator-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.92rem;
  color: #374151;
}

.estimator-copy {
  margin: 0;
}

.estimator-link {
  color: var(--gg-color-primary);
  font-weight: 500;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.estimator-link:hover {
  color: #4c1d95;
}

@media (max-width: 640px) {
  .estimator-card {
    border-radius: 0.75rem;
    padding: 1.5rem 1.25rem;
  }
}
</style>

