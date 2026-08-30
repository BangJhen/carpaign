import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border-light)',
      padding: '4rem 2rem',
      background: 'var(--color-black-mute)',
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--font-outfit), sans-serif',
          fontSize: '1.5rem',
          fontWeight: 800,
        }}>
          <span style={{ color: 'var(--color-accent-amber)' }}>⬡</span> CARPAIGN
        </div>
        <p style={{ color: 'var(--color-white-mute)', maxWidth: '400px', fontSize: '0.9rem' }}>
          Platform yang menghubungkan inventory kendaraan, production creator, 
          distribution, dan outcome sales dalam satu workflow.
        </p>
        <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-white-mute)', fontSize: '0.9rem' }}>
          <Link href="#">Tentang Kami</Link>
          <Link href="#">Kebijakan Privasi</Link>
          <Link href="#">Syarat Ketentuan</Link>
        </div>
        <p style={{ color: 'var(--color-border-light)', fontSize: '0.8rem', marginTop: '2rem' }}>
          © {new Date().getFullYear()} Carpaign. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
