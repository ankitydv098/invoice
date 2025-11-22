import Link from 'next/link';
import { useState } from 'react';
import styles from '../app/Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`${styles.navbar} glassmorphism`}>
      <div className={styles['flex-container']}>
        <Link href="/" className={styles['navbar-brand']}>
          InvoiceGen
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles['navbar-toggle']}
        >
          <svg
            className={styles.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            )}
          </svg>
        </button>
      </div>

      <ul
        className={`${styles['navbar-menu']} ${isOpen ? styles.block : styles.hidden}`}
      >
        <li>
          <Link href="/invoices" className={styles['navbar-link']}>
            Invoices
          </Link>
        </li>
        <li>
          <Link href="/clients" className={styles['navbar-link']}>
            Clients
          </Link>
        </li>
        <li>
          <Link href="/settings" className={styles['navbar-link']}>
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
