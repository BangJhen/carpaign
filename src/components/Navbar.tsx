import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          CARPAIGN
        </Link>

        <div className={styles.navLinks}>
          <Link href="#how-it-works" className={styles.navLink}>Cara Kerja</Link>
          <Link href="#features" className={styles.navLink}>Fitur</Link>
          <Link href="#creators" className={styles.navLink}>Untuk Kreator</Link>
        </div>

        <div className={styles.actions}>
          <Link href="/login" className="button-secondary">Masuk</Link>
          <Link href="/register" className="button-primary">Coba Sekarang</Link>
        </div>
      </div>
    </nav>
  );
}
