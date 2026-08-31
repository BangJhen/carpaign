<div align="center">
  <img src="./public/carpaign-logo.png" alt="Carpaign Logo" height="60" />
  <br />
  <p><strong>Turn Vehicle Inventory Into Content</strong></p>
</div>

---

## 📌 Apa itu Carpaign?
Carpaign adalah platform inovatif yang menghubungkan Dealer Otomotif/Brand dengan Kreator Konten. Kreator dapat memilih "Campaign" (seperti Edit, Shoot, Publish, UGC) dari inventory kendaraan yang tersedia dan mendapatkan cuan dari hasil kerja mereka. Platform ini mengusung antarmuka bergaya **Dark Cinematic Editorial** yang sangat premium, terinspirasi dari estetika otomotif mewah kelas atas (Awwwards-quality).

## 🚀 Fitur Utama
- **Cinematic Landing Page**: Halaman utama (*landing page*) yang imersif dilengkapi dengan animasi *letterbox intro*, *smooth scrolling* (Lenis), efek parallax, dan komponen *glassmorphism* tingkat lanjut.
- **Creator Dashboard**: Ringkasan performa kreator, metrik *views*, dan status kampanye berjalan dengan visualisasi yang *clean* dan modern.
- **Campaign Marketplace**: Menelusuri kampanye aktif (Edit, Shoot, UGC, Publish) untuk diambil dan dikerjakan. Tampilan *card* kampanye yang informatif tanpa elemen dekoratif berlebih.
- **Dynamic Routing**: Halaman detail kampanye yang memuat instruksi, deadline, dan kriteria konten.
- **Leaderboard & Rank System**: Sistem kompetisi kreator berdasarkan view dengan sistem *tier* (Rank).
- **Pendapatan & Analitik**: Laporan analitik mendalam dan riwayat pendapatan (withdrawal).

## 📸 Demo
![Dashboard Demo](./Demo%20Photo.png)

## 🛠 Tech Stack
Proyek ini dibangun di atas teknologi frontend modern:
- **[Next.js 15 (App Router)](https://nextjs.org/)**: Framework React untuk rendering (SSR/SSG), optimasi performa, dan routing dinamis.
- **[React 19](https://react.dev/)**: Library UI dengan fitur-fitur Server Components.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility-first CSS framework untuk *styling* super cepat dengan *custom theme* (Luxury Gold & Dark Cinematic).
- **[shadcn/ui](https://ui.shadcn.com/)**: Koleksi komponen UI *accessible* yang dapat disesuaikan (Radix UI).
- **[Framer Motion](https://www.framer.com/motion/)**: Animasi *scroll*, transisi *hardware-accelerated*, *staggered reveals*, dan interaksi dinamis tingkat lanjut.
- **[Lenis](https://lenis.darkroom.engineering/)**: Mesin *smooth scroll* untuk pengalaman navigasi halaman *landing* yang sangat mulus bagai mentega.
- **[Lucide React](https://lucide.dev/)**: Ikon SVG minimalis nan elegan.

## 💻 Cara Menjalankan Proyek (Local Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan Carpaign di mesin lokal Anda:

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/USERNAME/carpaign.git
   cd carpaign
   ```

2. **Install dependensi:**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Jalankan server *development*:**
   ```bash
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda. Anda akan langsung disambut oleh halaman *Landing Page* sinematik kami. Navigasi ke `/dashboard` untuk melihat area internal kreator.

## 📁 Struktur Direktori
- `src/app/`: Berisi semua *route* halaman (Home, Dashboard, Campaigns, Leaderboard, dll).
- `src/components/landing/`: Komponen eksklusif untuk *Landing Page* (Hero, Features, How it Works, CTA, dll).
- `src/components/views/`: Berisi komponen utama *view* spesifik untuk masing-masing halaman *dashboard*.
- `src/components/ui/`: Komponen UI modular (Buttons, Cards, Dialogs) bawaan *shadcn*.
- `src/components/layout/`: Komponen tata letak utama (Sidebar, Header, DashboardLayout).
- `public/`: Aset statis seperti gambar (Backgrounds, Mockups, Logo) yang disajikan langsung.
