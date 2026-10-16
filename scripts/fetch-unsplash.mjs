#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Read UNSPLASH_ACCESS_KEY from .env or .env.local
function getEnvKey() {
  if (process.env.UNSPLASH_ACCESS_KEY) {
    return process.env.UNSPLASH_ACCESS_KEY.trim();
  }
  const envPaths = [path.join(rootDir, ".env"), path.join(rootDir, ".env.local")];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.startsWith("UNSPLASH_ACCESS_KEY=")) {
          return trimmed.substring("UNSPLASH_ACCESS_KEY=".length).replace(/["']/g, "").trim();
        }
      }
    }
  }
  return null;
}

const ACCESS_KEY = getEnvKey();
if (!ACCESS_KEY) {
  console.error("❌ Error: UNSPLASH_ACCESS_KEY not found in .env or environment.");
  console.error("Please add UNSPLASH_ACCESS_KEY=your_key to .env (see .env.example)");
  process.exit(1);
}

// 2. Target Topics
export const TOPICS = {
  stays: [
    "beachfront villa",
    "mountain cabin",
    "luxury villa pool",
    "city penthouse",
    "countryside estate",
    "boutique hotel room",
    "infinity pool",
    "glamping",
    "ryokan",
    "treehouse",
  ],
  experiences: [
    "private chef dining",
    "snorkeling and diving",
    "hot air balloon",
    "spa and wellness",
    "cultural tour",
    "food market",
    "sunset cruise",
    "hiking adventure",
    "cooking class",
    "wine tasting",
  ],
  destinations: [
    "Cebu",
    "Palawan",
    "Siargao",
    "Bohol",
    "Baguio",
    "Tokyo",
    "Bali",
    "Santorini",
    "Kyoto",
    "Amalfi Coast",
    "Zermatt",
    "Tulum",
    "Maldives",
    "Tuscany",
    "Phuket",
    "Aspen",
  ],
};

const ALL_TOPICS = [
  ...TOPICS.stays,
  ...TOPICS.experiences,
  ...TOPICS.destinations,
];

const DATA_DIR = path.join(rootDir, "src", "data");
const PHOTOS_FILE = path.join(DATA_DIR, "photos.json");
const PROGRESS_FILE = path.join(rootDir, "scripts", ".progress.json");
const DOWNLOADS_PROGRESS_FILE = path.join(rootDir, "scripts", ".downloads-progress.json");

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(path.join(rootDir, "scripts"))) fs.mkdirSync(path.join(rootDir, "scripts"), { recursive: true });

// Load existing data if available
function loadExistingPhotos() {
  if (fs.existsSync(PHOTOS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PHOTOS_FILE, "utf-8"));
    } catch {
      return { topics: {}, photos: [] };
    }
  }
  return { topics: {}, photos: [] };
}

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
    } catch {
      return { completedTopics: [] };
    }
  }
  return { completedTopics: [] };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), "utf-8");
}

function savePhotos(data) {
  fs.writeFileSync(PHOTOS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Track Downloads mode: calls download_location endpoints in batches <= 40
async function runTrackDownloads() {
  console.log("📥 Running --track-downloads mode to comply with Unsplash API guidelines...");
  const photosData = loadExistingPhotos();
  const allPhotos = photosData.photos || [];

  if (allPhotos.length === 0) {
    console.log("No photos in src/data/photos.json to track.");
    return;
  }

  let doneIds = [];
  if (fs.existsSync(DOWNLOADS_PROGRESS_FILE)) {
    try {
      doneIds = JSON.parse(fs.readFileSync(DOWNLOADS_PROGRESS_FILE, "utf-8")).doneIds || [];
    } catch {
      doneIds = [];
    }
  }

  const pending = allPhotos.filter((p) => p.download_location && !doneIds.includes(p.id));
  console.log(`Found ${pending.length} pending photo download triggers.`);

  // Limit to batches of 40 to stay comfortably within the 50/hr rate limit
  const batch = pending.slice(0, 40);
  if (batch.length === 0) {
    console.log("✅ All used photos have already been tracked.");
    return;
  }

  console.log(`Tracking ${batch.length} photos in this run...`);
  let successCount = 0;

  for (const photo of batch) {
    try {
      const res = await fetch(photo.download_location, {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
          "User-Agent": "HavenStays/1.0",
        },
      });
      if (res.ok) {
        doneIds.push(photo.id);
        successCount++;
      } else {
        console.warn(`Failed tracking for ${photo.id}: HTTP ${res.status}`);
      }
      // Brief delay between calls
      await new Promise((r) => setTimeout(r, 120));
    } catch (err) {
      console.warn(`Error tracking download for photo ${photo.id}:`, err.message);
    }
  }

  fs.writeFileSync(DOWNLOADS_PROGRESS_FILE, JSON.stringify({ doneIds, lastUpdated: new Date().toISOString() }, null, 2));
  console.log(`✅ Successfully tracked ${successCount} downloads. ${pending.length - batch.length} remaining.`);
}

// Standard Photo Fetching
async function runFetchPhotos() {
  console.log("📸 Starting Unsplash photo fetch for Haven luxury stays...");
  const existing = loadExistingPhotos();
  const progress = loadProgress();
  const completed = new Set(progress.completedTopics || []);

  const topicsMap = existing.topics || {};
  let totalSaved = Object.values(topicsMap).reduce((acc, arr) => acc + (arr?.length || 0), 0);

  console.log(`Loaded ${completed.size} previously completed topics. Total photos: ${totalSaved}`);

  let remainingQuota = 50;

  for (const topic of ALL_TOPICS) {
    if (completed.has(topic) && topicsMap[topic]?.length >= 8) {
      console.log(`✓ [Skip] "${topic}" already fetched (${topicsMap[topic].length} photos).`);
      continue;
    }

    const searchQuery = topic === "private chef dining" ? "private chef" : topic;
    console.log(`🔍 Fetching topic: "${topic}" (query: "${searchQuery}")...`);
    const endpoint = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      searchQuery
    )}&orientation=landscape&per_page=30`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
          "User-Agent": "HavenStays/1.0",
          "Accept-Version": "v1",
        },
      });

      // Read rate limit headers
      const ratelimitRemaining = response.headers.get("x-ratelimit-remaining");
      if (ratelimitRemaining !== null) {
        remainingQuota = parseInt(ratelimitRemaining, 10);
        console.log(`   [RateLimit] Remaining hourly requests: ${remainingQuota}`);
      }

      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          console.warn(`⚠️ Rate limit reached (${response.status}). Saving current progress and exiting politely.`);
          break;
        }
        console.error(`❌ HTTP Error ${response.status} for "${topic}".`);
        continue;
      }

      const json = await response.json();
      const rawResults = json.results || [];

      // Keep the 8-12 best results per topic
      const filtered = rawResults
        .filter((p) => p && p.urls && p.urls.raw)
        .slice(0, 12)
        .map((p) => {
          // Keep raw base URL without query parameters so our imageUrl helper can append width/quality
          const rawBaseUrl = p.urls.raw.split("?")[0];
          const photographerName = p.user?.name || "Unsplash Contributor";
          const username = p.user?.username || "unsplash";
          const profileUrl = p.user?.links?.html
            ? `${p.user.links.html}?utm_source=haven&utm_medium=referral`
            : `https://unsplash.com/@${username}?utm_source=haven&utm_medium=referral`;
          const photoPageUrl = p.links?.html
            ? `${p.links.html}?utm_source=haven&utm_medium=referral`
            : `https://unsplash.com/photos/${p.id}?utm_source=haven&utm_medium=referral`;

          return {
            id: p.id,
            topic,
            alt_text: p.alt_description || p.description || `${topic} luxury travel`,
            color: p.color || "#18181b",
            width: p.width,
            height: p.height,
            urls: {
              raw: rawBaseUrl,
            },
            photographer_name: photographerName,
            photographer_profile_url: profileUrl,
            photo_page_url: photoPageUrl,
            download_location: p.links?.download_location,
          };
        });

      if (filtered.length > 0) {
        topicsMap[topic] = filtered;
        completed.add(topic);
        console.log(`   ✓ Saved ${filtered.length} curated photos for "${topic}".`);
      } else {
        console.warn(`   ⚠️ No photos returned for "${topic}".`);
      }

      // Recompute flattened photos array with deduplication by ID
      const photoMapById = new Map();
      for (const t of Object.keys(topicsMap)) {
        for (const photo of topicsMap[t]) {
          if (!photoMapById.has(photo.id)) {
            photoMapById.set(photo.id, photo);
          }
        }
      }

      const outputData = {
        updated_at: new Date().toISOString(),
        topics: topicsMap,
        photos: Array.from(photoMapById.values()),
      };

      savePhotos(outputData);
      saveProgress({ completedTopics: Array.from(completed), lastUpdated: new Date().toISOString() });

      // If rate limit remaining is critically low (<= 2), stop politely
      if (remainingQuota <= 2) {
        console.log("🛑 Rate limit remaining is 2 or less. Stopping politely to preserve quota.");
        break;
      }

      // Polite pacing delay between calls
      await new Promise((resolve) => setTimeout(resolve, 350));
    } catch (err) {
      console.error(`❌ Error fetching "${topic}":`, err.message);
    }
  }

  const finalPhotos = loadExistingPhotos();
  const finalCount = finalPhotos.photos?.length || 0;
  console.log(`🎉 Photo fetch run completed. Total unique photos in src/data/photos.json: ${finalCount}`);
}

// CLI entry point
const args = process.argv.slice(2);
if (args.includes("--track-downloads")) {
  runTrackDownloads().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else {
  runFetchPhotos().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

