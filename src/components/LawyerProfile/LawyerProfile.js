import styles from './LawyerProfile.module.css';

function LawyerProfile({ lawyer, onClose }) {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.popupContent}>
        <button onClick={onClose} className={styles.closeButton}>✕</button>
        <h1 className={styles.title}>Lawyer Profile</h1>
        <hr />
        <div className={styles.profileDetails}>
          <p><strong>Username:</strong> {lawyer.username}</p>
          <p><strong>Department:</strong> {lawyer.department}</p>
          <p><strong>Experience:</strong> {lawyer.experience} years</p>
          <p><strong>Rating:</strong>  {lawyer.rating}/5</p>
        </div>
      </div>
    </div>
  );
}

export default LawyerProfile;