# CARPAIGN — Visual Context & Design System Prompting Guide
*(Panduan Ringkas Konteks Proyek & Sistem Desain untuk AI Image Generation: Midjourney, DALL-E 3, Flux, Imagen)*

Dokumen ini dirancang khusus untuk Anda *copy-paste* langsung ke mesin AI Image Generation (atau AI Chat seperti ChatGPT/Claude saat meminta dibuatkan gambar). Format ini memuat konteks bisnis, palet warna presisi, estetika sinematik, serta formula *prompt* siap pakai.

---

## 🏎️ 1. Project Context Summary (Konteks Inti Proyek)

* **Product Name**: **CARPAIGN**
* **Core Mission**: *"Transforming Automotive Inventory into Content, and Content into Sales."*
* **Product Type**: **Vertical SaaS-Enabled Marketplace** untuk industri pemasaran otomotif.
* **The Two Actors**:
  1. **Automotive Dealerships (Showroom Mobil)**: Memiliki inventaris mobil fisik, mengalokasikan bujet promosi, memantau *holding cost*, dan menerima prospek calon pembeli riil via WhatsApp.
  2. **Content Creators (Kreator Video)**: Memproduksi video pendek (Clip, UGC ulasan POV, dan Shoot sinematik showroom) dengan kepastian pembayaran aman via *Escrow Ledger*.
* **Key Visual Elements**: Showroom mobil mewah modern, mobil sport/SUV eksotis dengan pantulan cahaya studio, kamera sinematik, smartphone yang menampilkan dashboard analitik, antarmuka SaaS gelap beraksen emas, dan lencana performa mesin otomotif (V4 s.d. V12).

---

## 🎨 2. Design System & Visual Identity

### Aesthetic Mood & Vibe:
* **Style**: **Dark Cinematic Luxury Editorial** (kombinasi *Awwwards Luxury Showcase*, *Porsche/McLaren modern branding*, dan *Linear/Apple-level high-tech UI*).
* **Atmosphere**: Moody, eksklusif, canggih, berkontras tinggi, bersih, dan profesional.

### Color Palette (Hex Codes):
* **Primary Luxury Gold**: `#C5A880` (Aksen utama, lencana tombol, grafik performa, dan garis pendar).
* **Gold Glow Accent**: `#DFBA84` / `rgba(197, 168, 128, 0.35)` (Efek pendaran neon halus pada border).
* **Obsidian Deep Black (Background)**: `#09090B` hingga `#050507` (Latar belakang gelap pekat tanpa gradasi pastel hambar).
* **Surface Glass/Card**: `#121215` hingga `#18181B` dengan transparansi `backdrop-blur-md` dan garis batas tepi setipis rambut (*1px solid hairline*) `rgba(255, 255, 255, 0.1)`.
* **High-Contrast Text**: Pure Crisp White (`#FFFFFF`) untuk judul dan Platinum Silver (`#A1A1AA`) untuk label data.
* **Status Indicators**:
  * Verified / Success / Escrow Safe: Emerald Neon (`#10B981`)
  * Attribution / Traffic / Lead Link: Electric Cobalt Blue (`#3B82F6`)

### Lighting & Materials:
* **Lighting**: *Moody rim lighting*, *anamorphic subtle flare*, *low-key studio lighting*, pantulan lantai showroom epoksi gelap mengkilap (*glossy reflective floor*).
* **Materials**: Matte anodized aluminum, tinted dark glass, forged carbon accents, dan bodi mobil dengan pantulan cahaya presisi.

### 🚫 Negative Prompts Wajib (Anti AI-Slop):
```text
cartoonish, 3d glossy clay plastic, bubbly pill cards, neumorphism, cute mascot, pastel blue foggy gradient, blurry background, cheap stock photo, deformed steering wheel, floating golden coins, lightbulbs, generic corporate people smiling fake, low-resolution UI, messy typography, distorted text
```

---

## 📋 3. Ready-to-Use Prompt Templates (Siap Salin)

### Template 1: UI/UX Dashboard Platform CARPAIGN (Desktop Display)
> **Gunakan untuk**: Presentasi mockup dashboard dealer, halaman analitik, atau proposal bisnis.

```text
A stunning, ultra-modern SaaS web dashboard interface for "CARPAIGN" automotive marketing platform, displayed on a high-end matte Apple Studio Display monitor. Dark cinematic theme, luxury gold accents (#C5A880), deep obsidian black background (#09090B), semi-transparent glassmorphic cards with crisp 1px borders. The screen shows sleek automotive inventory cards with a red Honda HR-V and black Fortuner, interactive revenue analytics charts with golden glowing line graphs, campaign status badges (Clipping, UGC, Shoot), and a WhatsApp closed-loop lead pipeline counter. Clean typography, Swiss editorial layout, Figma Awwwards-winning design, premium studio rim lighting, 8k resolution, photorealistic mockup --ar 16:9 --v 6.1 --style raw
```

---

### Template 2: Mobile App Interface / Creator Portal (iPhone 16 Pro Mockup)
> **Gunakan untuk**: Menampilkan aplikasi mobile kreator, saldo escrow, dan katalog lowongan kampanye.

```text
An iPhone 16 Pro Titanium displaying the sleek mobile app interface of CARPAIGN for automotive content creators. Dark luxury editorial mode, deep graphite background with champagne gold accents (#C5A880). The screen showcases creator performance stats: 'V6 Class Creator Badge', verified escrow wallet balance 'Rp 4.250.000', and a feed of available car video jobs with high-res car thumbnails. Glassmorphic top navigation bar, crisp micro-typography, minimal icons. Phone floating elegantly over a dark glossy carbon fiber surface with subtle warm gold rim light reflection, cinematic studio photography, hyper-detailed, 8k --ar 9:16 --v 6.1
```

---

### Template 3: Cinematic Hero Image (Showroom & Content Creator in Action)
> **Gunakan untuk**: Banner cover proposal, seksi hero website, atau thumbnail video pitch deck.

```text
Cinematic low-angle medium shot inside a luxury modern car showroom at night. A young professional Indonesian automotive videographer holding a sleek gimbal camera stabilizer with a glowing LED panel, professionally filming the front grille of an immaculate modern sports car. Showroom environment features dark polished concrete floors with mirror-like reflections, dark minimalist interior, soft golden overhead linear strip lighting (#C5A880). High-contrast moody cinematic lighting, 35mm film aesthetic, anamorphic lens flare, sharp focus, photorealistic, commercial automotive advertising quality --ar 16:9 --v 6.1 --style raw
```

---

### Template 4: Editorial Infographic / Flow Diagram (Pitch Deck Style)
> **Gunakan untuk**: Gambar visualisasi arsitektur 3 pilar (Clip, UGC, Shoot) atau rantai pasok pemasaran.

```text
A high-end editorial tech infographic diagram illustrating an automotive digital marketing workflow. Strict modern layout with 3 horizontal modular steps: 1. Car Inventory Data (SaaS), 2. Content Creators Network (UGC & Video), 3. Closed-Loop WhatsApp Inbound Sales Leads. Dark carbon background (#09090B), ultra-sharp vector lines in liquid gold (#C5A880) and neon emerald (#10B981), glassmorphic data cards with real numerical metrics. High-contrast typography, no cheesy icons, no cartoonish elements, clean McKinsey/Stripe corporate data visualization, 8k resolution --ar 16:9 --v 6.1
```

---

## 💡 4. Prompt Generator Helper (Format Ringkas untuk ChatGPT)

Jika Anda ingin meminta ChatGPT membuatkan prompt gambar baru yang spesifik, gunakan formula singkat ini:

> *"Buatkan prompt Midjourney v6 dengan gaya **CARPAIGN Design System**: Tema Dark Cinematic Luxury Automotive, palet warna Deep Obsidian Black (`#09090B`) dengan aksen Liquid Gold (`#C5A880`) dan Glassmorphism, estetika Awwwards editorial kelas atas tanpa elemen kartun/AI-slop. Objek visual yang diinginkan adalah: [Sebutkan objek yang Anda inginkan, misal: alur penguncian saldo rekening bersama Escrow Ledger]."*

