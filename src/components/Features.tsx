import styles from './Features.module.css';

export default function Features() {
  const jobs = [
    {
      title: "SHOOT",
      desc: "Videografer mengambil footage langsung di dealer atau lokasi inventory kendaraan.",
      icon: "🎥",
    },
    {
      title: "UGC",
      desc: "Kreator membuat review otentik atau membagikan pengalaman personal dengan kendaraan.",
      icon: "📱",
    },
    {
      title: "EDIT",
      desc: "Editor profesional mengolah raw footage menjadi konten yang siap didistribusikan.",
      icon: "✂️",
    },
    {
      title: "CLIP",
      desc: "Clipper menghasilkan puluhan variasi hook dari satu aset raw untuk A/B testing konten.",
      icon: "🎬",
    },
    {
      title: "PUBLISH",
      desc: "Creator atau KOL mempublikasikan dan mendistribusikan konten melalui channel sosial media mereka.",
      icon: "🚀",
    },
    {
      title: "PERFORMANCE",
      desc: "Sistem mengoptimasi performa berdasarkan click, lead, test drive, dan konversi outcome.",
      icon: "📈",
    }
  ];

  return (
    <section id="features" className={styles.features}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Marketplace <span className="text-gradient">Job Types</span></h2>
        </div>

        <div className={styles.bentoGrid}>
          {jobs.map((job, idx) => (
            <div key={idx} className={`${styles.card} glass-panel`}>
              <div className={styles.icon}>{job.icon}</div>
              <h3 className={styles.cardTitle}>{job.title}</h3>
              <p className={styles.cardDesc}>{job.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
