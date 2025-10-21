import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, getSalesHistory } from '../services/api';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import UserFormModal from '../components/admin/UserFormModal';
import styles from '../styles/ManageUsersPage.module.css';
import { FaPlus, FaSearch, FaTimes, FaUser, FaUserShield, FaUsers, FaChartLine, FaEye } from 'react-icons/fa';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Estados para los modales
    const [userToEdit, setUserToEdit] = useState(null);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedUserHistory, setSelectedUserHistory] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Estados para filtros
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        status: ''
    });

    // Estadísticas
    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        totalClients: 0,
        totalAdmins: 0,
        activeUsers: 0
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            const usersData = response.data.results || response.data;
            setUsers(usersData);
            setFilteredUsers(usersData);
            calculateStatistics(usersData);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('Error al cargar usuarios.');
        } finally {
            setLoading(false);
        }
    };

    // Calcular estadísticas
    const calculateStatistics = (usersData) => {
        const totalUsers = usersData.length;
        const totalClients = usersData.filter(u => u.profile?.role === 'CLIENT' || u.role === 'CLIENT').length;
        const totalAdmins = usersData.filter(u => u.profile?.role === 'ADMIN' || u.role === 'ADMIN').length;
        const activeUsers = usersData.filter(u => u.is_active).length;

        setStatistics({
            totalUsers,
            totalClients,
            totalAdmins,
            activeUsers
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Aplicar filtros
    useEffect(() => {
        let filtered = [...users];

        // Filtro de búsqueda
        if (filters.search) {
            filtered = filtered.filter(u =>
                u.username?.toLowerCase().includes(filters.search.toLowerCase()) ||
                u.first_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                u.last_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                u.email?.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Filtro de rol
        if (filters.role) {
            filtered = filtered.filter(u => 
                u.profile?.role === filters.role || u.role === filters.role
            );
        }

        // Filtro de estado
        if (filters.status === 'active') {
            filtered = filtered.filter(u => u.is_active);
        } else if (filters.status === 'inactive') {
            filtered = filtered.filter(u => !u.is_active);
        }

        setFilteredUsers(filtered);
    }, [filters, users]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            role: '',
            status: ''
        });
    };

    // --- Lógica para abrir los modales ---
    const handleOpenAddModal = () => {
        setUserToEdit(null);
        setFormModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setUserToEdit(user);
        setFormModalOpen(true);
    };

    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleViewHistory = async (user) => {
        setSelectedUserHistory(user);
        setShowHistoryModal(true);
        setLoadingHistory(true);
        try {
            const response = await getSalesHistory({ customer: user.id });
            const ordersData = response.data.results || response.data;
            setUserOrders(ordersData);
        } catch (err) {
            console.error('Error al cargar historial:', err);
            setUserOrders([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    // --- Lógica para cerrar los modales ---
    const handleCloseModals = () => {
        setFormModalOpen(false);
        setShowDeleteModal(false);
        setShowHistoryModal(false);
        setUserToEdit(null);
        setUserToDelete(null);
        setSelectedUserHistory(null);
        setUserOrders([]);
    };

    // --- Lógica de acciones ---
    const handleUserSaved = (isEdit) => {
        handleCloseModals();
        fetchUsers();
        setSuccessMessage(`¡Usuario ${isEdit ? 'actualizado' : 'creado'} exitosamente!`);
        setTimeout(() => setSuccessMessage(''), 4000);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.id);
            handleCloseModals();
            fetchUsers();
            setSuccessMessage(`Usuario '${userToDelete.username}' eliminado exitosamente.`);
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            setError('Error al eliminar usuario.');
            setTimeout(() => setError(''), 4000);
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    if (error && users.length === 0) {
        return (
            <div className={styles.page}>
                <p className={styles.error}>{error}</p>
            </div>
        );
    }

    return (
        <>
            <div className={styles.page}>
                <header className={styles.header}>
                    <h1>Gestión de Clientes y Usuarios</h1>
                    <button className={styles.addButton} onClick={handleOpenAddModal}>
                        <FaPlus /> Agregar Usuario
                    </button>
                </header>

                {/* --- TARJETAS DE ESTADÍSTICAS --- */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#e7f3ff' }}>
                            <FaUsers style={{ color: '#007bff' }} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Total Usuarios</span>
                            <span className={styles.statValue}>{statistics.totalUsers}</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#e8f5e9' }}>
                            <FaUser style={{ color: '#28a745' }} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Clientes</span>
                            <span className={styles.statValue}>{statistics.totalClients}</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#fff3e0' }}>
                            <FaUserShield style={{ color: '#ff9800' }} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Administradores</span>
                            <span className={styles.statValue}>{statistics.totalAdmins}</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#f3e5f5' }}>
                            <FaChartLine style={{ color: '#9c27b0' }} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Usuarios Activos</span>
                            <span className={styles.statValue}>{statistics.activeUsers}</span>
                        </div>
                    </div>
                </div>

                {successMessage && (
                    <div className={styles.successMessage}>
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {/* --- BÚSQUEDA Y FILTROS --- */}
                <div className={styles.searchAndFilters}>
                    <div className={styles.searchBar}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            name="search"
                            placeholder="Buscar por nombre, usuario o email..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filtersRow}>
                        <div className={styles.filterGroup}>
                            <label>Rol:</label>
                            <select
                                name="role"
                                value={filters.role}
                                onChange={handleFilterChange}
                                className={styles.selectInput}
                            >
                                <option value="">Todos los roles</option>
                                <option value="CLIENT">Cliente</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Estado:</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className={styles.selectInput}
                            >
                                <option value="">Todos</option>
                                <option value="active">Activos</option>
                                <option value="inactive">Inactivos</option>
                            </select>
                        </div>

                        <button className={styles.clearButton} onClick={handleClearFilters}>
                            <FaTimes /> Limpiar
                        </button>
                    </div>
                </div>

                {/* --- TABLA DE USUARIOS --- */}
                <div className={styles.tableContainer}>
                    {filteredUsers.length === 0 ? (
                        <p className={styles.noResults}>
                            No se encontraron usuarios que coincidan con los filtros.
                        </p>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className={styles.userCell}>
                                                <div className={styles.avatar}>
                                                    {user.first_name?.charAt(0) || user.username?.charAt(0) || '?'}
                                                </div>
                                                <div className={styles.userInfo}>
                                                    <span className={styles.userName}>
                                                        {user.first_name} {user.last_name}
                                                    </span>
                                                    <span className={styles.username}>@{user.username}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email || 'N/A'}</td>
                                        <td>
                                            {user.profile?.role || user.role ? (
                                                <span className={`${styles.roleBadge} ${styles[(user.profile?.role || user.role).toLowerCase()]}`}>
                                                    {user.profile?.role || user.role}
                                                </span>
                                            ) : (
                                                <span className={styles.roleBadge}>Sin Rol</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={user.is_active ? styles.statusActive : styles.statusInactive}>
                                                {user.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                {(user.profile?.role === 'CLIENT' || user.role === 'CLIENT') && (
                                                    <button
                                                        className={styles.viewButton}
                                                        onClick={() => handleViewHistory(user)}
                                                        title="Ver historial de compras"
                                                    >
                                                        <FaEye /> Historial
                                                    </button>
                                                )}
                                                <button
                                                    className={styles.editButton}
                                                    onClick={() => handleOpenEditModal(user)}
                                                    title="Editar usuario"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDeleteModal(user)}
                                                    className={styles.deleteButton}
                                                    title="Eliminar usuario"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <UserFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseModals}
                onUserSaved={handleUserSaved}
                editingUser={userToEdit}
            />

            {showDeleteModal && (
                <ConfirmationModal
                    title="Confirmar Eliminación"
                    onConfirm={handleDeleteUser}
                    onCancel={handleCloseModals}
                >
                    ¿Estás seguro de que deseas eliminar al usuario{' '}
                    <strong>{userToDelete?.username}</strong>? Esta acción no se puede deshacer.
                </ConfirmationModal>
            )}

            {/* Modal de Historial de Compras */}
            {showHistoryModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModals}>
                    <div className={styles.historyModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>
                                Historial de Compras - {selectedUserHistory?.first_name} {selectedUserHistory?.last_name}
                            </h2>
                            <button className={styles.closeButton} onClick={handleCloseModals}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            {loadingHistory ? (
                                <div className={styles.loading}>
                                    <div className={styles.spinner}></div>
                                    <p>Cargando historial...</p>
                                </div>
                            ) : userOrders.length === 0 ? (
                                <p className={styles.noOrders}>
                                    Este cliente aún no ha realizado compras.
                                </p>
                            ) : (
                                <>
                                    <div className={styles.ordersSummary}>
                                        <div className={styles.summaryItem}>
                                            <span>Total de Órdenes:</span>
                                            <strong>{userOrders.length}</strong>
                                        </div>
                                        <div className={styles.summaryItem}>
                                            <span>Total Gastado:</span>
                                            <strong>
                                                ${userOrders.reduce((sum, order) => 
                                                    sum + parseFloat(order.total || order.total_price || 0), 0
                                                ).toFixed(2)}
                                            </strong>
                                        </div>
                                    </div>
                                    <div className={styles.ordersTable}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>N° Orden</th>
                                                    <th>Fecha</th>
                                                    <th>Total</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userOrders.map(order => (
                                                    <tr key={order.id}>
                                                        <td>{order.order_number || `#${order.id}`}</td>
                                                        <td>
                                                            {new Date(order.created_at).toLocaleDateString('es-ES')}
                                                        </td>
                                                        <td className={styles.orderTotal}>
                                                            ${parseFloat(order.total || order.total_price || 0).toFixed(2)}
                                                        </td>
                                                        <td>
                                                            <span className={`${styles.orderStatus} ${styles[order.status?.toLowerCase()]}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageUsersPage;