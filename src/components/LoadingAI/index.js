import loading from '../../assets/images/loading-3.gif';

import styles from './LoadingAI.module.css';

export default function LoadingAI() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* <h2>Loading...</h2> */}
                <img src={loading} alt="Loading..." />
            </div>
        </div>
    );
}
