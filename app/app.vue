<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden bg-slate-950 font-sans">
    <!-- Background layers -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#d42a2a]/15 via-[#7b2d8e]/10 to-[#2b3ea0]/15" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7b2d8e]/8 rounded-full blur-[140px]" />
    
    <!-- Animated floating orbs (using standard tailwind or custom classes if needed. We'll use static colors and blur here to avoid complex css keyframes) -->
    <div class="absolute top-[20%] left-[15%] w-[300px] h-[300px] bg-[#d42a2a]/10 rounded-full blur-[100px] animate-pulse" />
    <div class="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] bg-[#2b3ea0]/10 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s;" />

    <div class="relative w-full max-w-2xl z-10 flex flex-col gap-8">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <img
          src="/ams-logo.png"
          alt="AMS Logo"
          width="200"
          height="120"
          class="h-32 w-auto drop-shadow-[0_0_40px_rgba(123,45,142,0.4)]"
        />
      </div>

      <!-- Tagline -->
      <p class="text-center text-white/60 text-base tracking-[0.25em] uppercase mb-10 flex items-center justify-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        Link Shortener
      </p>

      <!-- Input + Button -->
      <div class="flex flex-col sm:flex-row gap-4 w-full">
        <input
          ref="inputRef"
          id="url-input"
          type="text"
          v-model="url"
          @input="error = ''"
          @keydown.enter="handleShorten"
          placeholder="Paste your long URL here..."
          :class="[
            'w-full sm:flex-1 min-h-[64px] px-6 rounded-2xl bg-white/[0.07] border text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#7b2d8e]/60 focus:border-transparent transition-all duration-300 backdrop-blur-md text-lg shadow-inner appearance-none',
            error ? 'border-red-500/60 ring-2 ring-red-500/30' : 'border-white/[0.15]'
          ]"
        />

        <button
          id="shorten-btn"
          @click="handleShorten"
          :disabled="isShortening"
          class="w-full sm:w-auto min-h-[64px] px-10 rounded-2xl bg-gradient-to-r from-[#d42a2a] via-[#7b2d8e] to-[#2b3ea0] text-white font-bold tracking-wider text-lg hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(123,45,142,0.5)] active:scale-[0.98] transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
        >
          <template v-if="isShortening">
            <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>Shortening</span>
          </template>
          <template v-else>
            Shorten
          </template>
        </button>
      </div>

      <!-- Error message -->
      <p v-if="error" class="text-red-400/90 text-base flex items-center gap-2 px-2 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        {{ error }}
      </p>

      <!-- Result card -->
      <div v-if="showResult && shortenedUrl" class="mt-4 p-8 rounded-3xl bg-white/[0.05] border border-white/[0.15] backdrop-blur-xl transition-all duration-500 shadow-2xl">
        <p class="text-white/50 text-sm uppercase tracking-widest mb-4 font-semibold">
          Shortened URL
        </p>
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <a
            :href="shortenedUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 text-2xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#f87171] via-[#c084fc] to-[#60a5fa] hover:opacity-80 transition-opacity truncate break-all"
          >
            {{ shortenedUrl }}
          </a>
          <button
            id="copy-btn"
            @click="handleCopy(shortenedUrl)"
            :class="[
              'flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 cursor-pointer w-full sm:w-auto',
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                : 'bg-white/[0.1] text-white border border-white/[0.2] hover:bg-white/[0.15] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
            ]"
          >
            <svg v-if="copied" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            {{ copied ? "Copied!" : "Copy" }}
          </button>
        </div>
        <p class="mt-6 text-white/40 text-sm truncate bg-black/20 p-4 rounded-xl border border-white/5">
          <span class="font-semibold text-white/60 mr-2">Original:</span> {{ url }}
        </p>
      </div>

      <!-- Link history -->
      <div v-if="links.length > 0" class="mt-12 space-y-6">
        <div class="flex items-center justify-between px-2">
          <h3 class="text-white/50 text-sm uppercase tracking-widest flex items-center gap-3 font-semibold">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.12] text-xs text-white shadow-inner">
              {{ links.length }}
            </span>
            Recent Links
          </h3>
          <button
            id="clear-all-btn"
            @click="handleClearAll"
            class="text-sm text-white/40 hover:text-red-400 transition-colors duration-300 cursor-pointer flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-red-500/10"
          >
            Clear all
          </button>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="link in links"
            :key="link.id"
            class="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <!-- Hex badge -->
            <span class="flex-shrink-0 px-3 py-1.5 rounded-lg bg-[#7b2d8e]/20 text-[#c084fc] text-sm font-mono font-bold tracking-widest border border-[#7b2d8e]/30 shadow-inner">
              #{{ link.hex }}
            </span>

            <!-- URL info -->
            <div class="flex-1 min-w-0 w-full">
              <a
                :href="link.short"
                target="_blank"
                rel="noopener noreferrer"
                class="text-base text-white/80 hover:text-white transition-colors font-mono truncate block"
              >
                {{ link.short }}
              </a>
              <p class="text-sm text-white/30 truncate mt-1.5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {{ link.original }}
              </p>
            </div>

            <!-- Time & Actions -->
            <div class="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
              <span class="text-sm text-white/30 sm:mr-4">
                {{ timeAgo(link.createdAt) }}
              </span>

              <div class="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  @click="handleCopy(link.short, link.id)"
                  :class="[
                    'p-2.5 rounded-xl transition-all cursor-pointer',
                    copiedId === link.id
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'hover:bg-white/[0.12] text-white/50 hover:text-white'
                  ]"
                  title="Copy link"
                >
                  <svg v-if="copiedId === link.id" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
                <button
                  @click="handleDelete(link.id)"
                  class="p-2.5 rounded-xl hover:bg-red-500/15 text-white/50 hover:text-red-400 transition-all cursor-pointer"
                  title="Delete link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-white/20 text-sm mt-32 font-medium flex flex-col gap-1">
        <p>Developed by Digital Department</p>
        <p>Copyright &copy; {{ new Date().getFullYear() }} Apsara Media Services Co., Ltd. (AMS)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const url = ref('')
const shortenedUrl = ref('')
const links = ref([])
const copied = ref(false)
const copiedId = ref(null)
const error = ref('')
const isShortening = ref(false)
const showResult = ref(false)
const inputRef = ref(null)

const BASE_URL = "https://link.ams.com.kh/"

function generateHexCode() {
  return Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")
    .toUpperCase()
}

function isValidUrl(string) {
  try {
    const u = new URL(string)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

function getStoredLinks() {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem("ams_shortlinks")
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function storeLinks(l) {
  if (typeof window !== 'undefined') {
    localStorage.setItem("ams_shortlinks", JSON.stringify(l))
  }
}

function timeAgo(dateString) {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

onMounted(() => {
  links.value = getStoredLinks()
})

const handleShorten = async () => {
  error.value = ""
  copied.value = false

  if (!url.value.trim()) {
    error.value = "Please enter a URL"
    inputRef.value?.focus()
    return
  }

  if (!isValidUrl(url.value.trim())) {
    error.value = "Please enter a valid URL (include http:// or https://)"
    inputRef.value?.focus()
    return
  }

  const existing = links.value.find((l) => l.original === url.value.trim())
  if (existing) {
    shortenedUrl.value = existing.short
    showResult.value = true
    return
  }

  isShortening.value = true
  showResult.value = false

  await new Promise((resolve) => setTimeout(resolve, 600))

  let hex = generateHexCode()
  while (links.value.some((l) => l.hex === hex)) {
    hex = generateHexCode()
  }

  const shortUrl = `${BASE_URL}${hex}`
  const newLink = {
    id: Date.now(),
    original: url.value.trim(),
    short: shortUrl,
    hex,
    createdAt: new Date().toISOString(),
  }

  const updatedLinks = [newLink, ...links.value]
  links.value = updatedLinks
  storeLinks(updatedLinks)
  shortenedUrl.value = shortUrl
  isShortening.value = false
  showResult.value = true
}

const handleCopy = async (textToCopy, linkId = null) => {
  try {
    await navigator.clipboard.writeText(textToCopy)
  } catch {
    const textarea = document.createElement("textarea")
    textarea.value = textToCopy
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
  }

  if (linkId) {
    copiedId.value = linkId
    setTimeout(() => { copiedId.value = null }, 2000)
  } else {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

const handleDelete = (id) => {
  const updatedLinks = links.value.filter((l) => l.id !== id)
  links.value = updatedLinks
  storeLinks(updatedLinks)
}

const handleClearAll = () => {
  links.value = []
  storeLinks([])
  shortenedUrl.value = ""
  showResult.value = false
}
</script>

<style>
/* Any global CSS if needed */
body {
  margin: 0;
  background-color: #020617; /* slate-950 */
}
</style>
