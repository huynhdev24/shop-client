import { memo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './NavBar.module.css';
import voucher from '../../../assets/images/voucher.png';
import book from '../../../assets/images/books.png';
import home from '../../../assets/images/house.png';

function NavBar() {
    return (
        <div className={`navbar ${styles.navbar}`}>
            <div className={styles.navItem}>
                <NavLink to="/" className={({isActive}) => isActive ? `${styles.active}` : null}>
                    <img src={home} style={{width : '16px', height : '16px', marginRight: '2px'}} alt="book" />
                    Trang chủ
                </NavLink>
            </div>
            <div className={styles.navItem}>
                <NavLink to="/san-pham" className={({isActive}) => isActive ? `${styles.active}` : null}>
                    <img src={book} style={{width : '16px', height : '16px', marginRight: '2px'}} alt="book" />
                    Sản phẩm
                </NavLink>
            </div>
            <div className={styles.navItem}>
                <NavLink to="/khuyen-mai" className={({isActive}) => isActive ? `${styles.active}` : null}>
                    <img src={voucher} style={{width : '16px', height : '16px', marginRight: '2px'}} alt="voucher" />
                    Khuyến mãi
                </NavLink>
            </div>
        </div>
    )
}

export function NavBarMobile() {

    const [show, setShow] = useState(false)

    return (
        <div className={`navbar ${styles.navbarMobile}`}>
            <div className={styles.iconBar} onClick={() => setShow(!show)}>{show ? <FaTimes /> : <FaBars />}</div>
            <div className={`${styles.menu} ${show && styles.active}`} onClick={() => setShow(false)}>
                <div className={styles.navItem}>
                    <NavLink to="/" className={({isActive}) => isActive ? `${styles.active}` : null}>Trang chủ</NavLink>
                </div>
                <div className={styles.navItem}>
                    <NavLink to="/san-pham" className={({isActive}) => isActive ? `${styles.active}` : null}>Sản phẩm</NavLink>
                </div>
                <div className={styles.navItem}>
                    <NavLink to="/khuyen-mai" className={({isActive}) => isActive ? `${styles.active}` : null}>Khuyến mãi</NavLink>
                </div>
           </div>
        </div>
    )
}

export default memo(NavBar);