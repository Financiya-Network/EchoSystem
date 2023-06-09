import Link from 'next/link';
import React from 'react';
import Arrow from '@/icons/arrow-forward.svg';
import styles from './WelcomeBanner.module.scss';

export default function WelcomeBanner() {
  return (
    <div className={styles.container}>
      <div className={styles.heading_container}>
        <h1 className={styles.heading}>Everything you need to start building blockchain dapps</h1>
      </div>

      <div className={styles.content}>
        <Link href="ecosystem" passHref>
          <a className={styles.get_started}>
            Get started
            <Arrow />
          </a>
        </Link>
        <div className={styles.overview}>
          Explore the Blockchain ecosystem to get familiar with the landscape of hundreds of tools.
        </div>
      </div>
    </div>
  );
}
