import Link from 'next/link';
import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.box}>
          <h2 className={styles.title}>
            Siap Mengubah <span className="text-gradient">Inventory</span> Menjadi Penjualan?
          </h2>
          <p className={styles.subtitle}>
            Bergabunglah dengan Carpaign. Tempatkan campaign Anda atau ambil job sebagai kreator otomotif sekarang juga.
          </p>
          <div className={styles.actions}>
            <Link href="/brand" className="button-primary">Untuk Dealer</Link>
            <Link href="/creator" className="button-secondary">Untuk Kreator</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
