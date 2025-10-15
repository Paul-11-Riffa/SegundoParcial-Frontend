import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/dashboard/Header'; // Asegúrate de que este componente exista
import styles from '../styles/MainLayout.module.css';

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      {/* Este 'div' es el panel principal que organiza todo a la derecha */}
      <div className={styles.mainPanel}>
        <Header /> {/* 1. El Header va primero, en la parte de arriba */}
        <main className={styles.content}>
          <Outlet /> {/* 2. El contenido de la página va después, debajo del Header */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;