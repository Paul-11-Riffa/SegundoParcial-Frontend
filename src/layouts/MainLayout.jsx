import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import styles from '../styles/MainLayout.module.css';

const MainLayout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <TopNavbar />
      <main className={styles.content}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;