import styles from './Features.module.css';
import { Camera, Smartphone, Film, Scissors, Share2, TrendingUp } from 'lucide-react';

export default function Features() {
  const jobs = [
    {
      title: "SHOOT",
      desc: "Videografer mengambil footage langsung di dealer atau lokasi inventory kendaraan.",
      Icon: Camera,
    },
    {
      title: "UGC",
      desc: "Kreator membuat review otentik atau membagikan pengalaman personal dengan kendaraan.",
      Icon: Smartphone,
    },
    {
      title: "EDIT",
      desc: "Editor profesional mengolah raw footage menjadi konten yang siap didistribusikan.",
      Icon: Scissors,
    },
    {
      title: "CLIP",
      desc: "Clipper menghasilkan puluhan variasi hook dari satu aset raw untuk A/B testing konten.",
      Icon: Film,
    },
    {
      title: "PUBLISH",
      desc: "Creator atau KOL mempublikasikan dan mendistribusikan konten melalui channel sosial media mereka.",
      Icon: Share2,
    },
    {
      title: "PERFORMANCE",
      desc: "Sistem mengoptimasi performa berdasarkan click, lead, test drive, dan konversi outcome.",
      Icon: TrendingUp,
    }
  ];

  return (
    <section id="features" className={styles.features}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Marketplace <span className="text-gradient">Job Types</span></h2>
        </div>

        <div className={styles.bentoGrid}>
          {jobs.map((job, idx) => {
            const IconComponent = job.Icon;
            return (
              <div key={idx} className={`${styles.card} glass-panel`}>
                <div className={styles.icon}>
                  <IconComponent className="size-6 text-primary" />
                </div>
                <h3 className={styles.cardTitle}>{job.title}</h3>
                <p className={styles.cardDesc}>{job.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
