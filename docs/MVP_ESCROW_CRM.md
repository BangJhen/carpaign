# Modul buku besar simulasi dan prospek WhatsApp

Modul ini menerapkan buku besar simulasi, pembayaran kampanye melalui Midtrans Snap Redirect, dan pencatatan klik prospek. Pembayaran Midtrans tidak otomatis berarti dana berada dalam rekening escrow resmi.

## Menjalankan

1. Jalankan `npm run db:migrate:mvp` untuk membuat tabel tambahan. Skrip ini aman dijalankan ulang dan tidak mengubah tabel lama.
2. Pada pengembangan lokal, simulasi dana aktif. Pada lingkungan lain, set `CARPAIGN_DEMO_FINANCE=true` jika simulasi perlu ditampilkan.
3. Dealer menambahkan kredit uji di **Keuangan**, lalu mencadangkannya saat mengaktifkan kampanye draf. Biaya layanan simulasi adalah 10% dari bujet kampanye.
4. Dealer mengisi nomor WhatsApp di **Profil**, lalu menyalin tautan kampanye aktif dari **Prospek WhatsApp**.
5. Untuk pembayaran Midtrans, atur `MIDTRANS_SERVER_KEY` pada server. Secara bawaan API sandbox dipakai; set `MIDTRANS_IS_PRODUCTION=true` hanya bersama kunci produksi. Daftarkan URL notifikasi HTTPS `https://domain-anda/api/payments/midtrans` pada dashboard Midtrans. Kunci server jangan dikirim ke browser.
6. Dealer dapat memilih **Bayar melalui Midtrans** pada kampanye draf. Server membuat transaksi Snap dan mengarahkan dealer ke halaman pembayaran. Kampanye aktif setelah webhook bertanda tangan sah diverifikasi lagi melalui API status Midtrans, dengan jumlah bayar sesuai.

## Batas kemampuan saat ini

- Buku besar demo menyimpan kredit uji, dana dicadangkan, dan pengembalian saat kampanye demo dibatalkan. Saldo ini bukan dana bank, uang elektronik, atau escrow resmi.
- Pembayaran Midtrans tersimpan pada tabel terpisah. Aplikasi belum memindahkan dana ke rekening terpisah, belum memiliki mekanisme pelepasan dana ke kreator, serta belum mengotomatiskan pengembalian dana. Kampanye dengan transaksi Midtrans yang masih berjalan tidak dapat dibatalkan langsung dari antarmuka.
- Kredensial Midtrans belum tersedia di workspace, sehingga alur transaksi nyata belum bisa diuji sampai akun merchant dan kunci sandbox disediakan.
- Tautan `/go/{id-kampanye}` mencatat **klik keluar** lalu mengarahkan pengunjung ke WhatsApp dealer. Klik tidak membuktikan bahwa pesan terkirim atau penjualan terjadi.
- Status prospek sesudah klik diperbarui oleh dealer secara manual. Integrasi WhatsApp Business API dan verifikasi prospek belum tersedia.
- Parameter `?c={kode-referral-kreator}` dapat dipakai untuk mencatat sumber kreator ketika kode itu ada. Pembatasan atribusi hanya kepada kreator yang telah diterima dalam kampanye memerlukan data pengajuan tersimpan.
- Database proyek ini tidak memiliki riwayat Drizzle migrasi lama. Oleh karena itu, tabel baru diterapkan dengan skrip SQL tersendiri, bukan `drizzle-kit migrate`.
