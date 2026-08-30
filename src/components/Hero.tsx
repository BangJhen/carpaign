import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glowBackground}></div>
      <div className={styles.content}>
        <div className={`${styles.badge} animate-fade-in`}>
          <span className={styles.badgeHighlight}></span>
          Automotive Content-to-Sales Infrastructure
        </div>
        
        <h1 className={`${styles.title} animate-fade-in delay-100`}>
          Turn Vehicle Inventory <br />
          <span className="text-gradient">Into Content.</span><br />
          Turn Content <span className="text-gradient">Into Sales.</span>
        </h1>
        
        <p className={`${styles.subtitle} animate-fade-in delay-200`}>
          Platform yang menghubungkan inventory kendaraan, production creator, 
          distribution, dan outcome sales dalam satu workflow.
        </p>
        
        <div className={`${styles.actions} animate-fade-in delay-300`}>
          <Link href="/brand" className="button-primary">
            Untuk Dealer & Brand
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
          <Link href="/creator" className="button-secondary">
            Mulai Sebagai Kreator
          </Link>
        </div>

        <div className={`${styles.stats} animate-fade-in delay-300`}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>10.6K+</span>
            <span className={styles.statLabel}>Dealer Target</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>300+</span>
            <span className={styles.statLabel}>Aset Konten</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>≥2.0x</span>
            <span className={styles.statLabel}>Target ROAS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
