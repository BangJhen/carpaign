import styles from './Workflow.module.css';

export default function Workflow() {
  const steps = [
    {
      num: 1,
      title: "Demand & Brief",
      desc: "Dealer atau brand mengikat campaign ke inventory kendaraan, menetapkan budget, dan objektif (views, leads, sales).",
      role: "Demand (Dealer)",
      roleClass: styles.roleDemand,
    },
    {
      num: 2,
      title: "Production (Shoot & Edit)",
      desc: "Videografer mengambil footage di lokasi, editor mengolah raw footage, dan clipper menghasilkan variasi hook.",
      role: "Supply (Creator)",
      roleClass: styles.roleSupply,
    },
    {
      num: 3,
      title: "Distribution",
      desc: "Creator atau KOL mengambil job dan mempublikasikan konten yang telah disetujui ke audiens mereka.",
      role: "Supply (Creator)",
      roleClass: styles.roleSupply,
    },
    {
      num: 4,
      title: "Outcome & Tracking",
      desc: "Seluruh alur dilacak secara transparan dari click, lead, test drive, hingga penjualan.",
      role: "Platform",
      roleClass: "",
    },
    {
      num: 5,
      title: "Reward",
      desc: "Kreator menerima base fee, bonus performa, dan outcome reward. Dealer mendapatkan ROAS terukur.",
      role: "Platform",
      roleClass: "",
    }
  ];

  return (
    <section id="how-it-works" className={styles.workflow}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Alur <span className="text-gradient">End-to-End</span></h2>
          <p className={styles.subtitle}>
            Carpaign menjadi layer di antara Demand (Dealer) dan Supply (Creator), 
            mengubah inventory menjadi mesin konten yang menggerakkan penjualan.
          </p>
        </div>

        <div className={styles.stepper}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.step}>
              <div className={`${styles.stepContent} glass-panel`}>
                <div className={styles.roles}>
                  {step.role && <span className={`${styles.roleBadge} ${step.roleClass}`}>{step.role}</span>}
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
              <div className={styles.stepNumber}>{step.num}</div>
              {/* Empty div to balance flex space */}
              <div className={styles.stepContent} style={{ opacity: 0, pointerEvents: 'none', height: 0, padding: 0 }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
