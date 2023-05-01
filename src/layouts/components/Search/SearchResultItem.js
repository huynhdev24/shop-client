import { Link } from "react-router-dom";
import styles from "./Search.module.css";

//history
import { useSelector } from "react-redux";
import { useState } from "react";
import historyApi from '../../../api/historyApi';

export default function SearchResultItem({ data }) {

  //handle click để lưu lại lịch sử
  const { userId } = useSelector((state) => state.auth);
  const [addHistory, setAddHistory] = useState({
    action: 'Tìm sách' + data.name,
    type: 'Tìm hiếm sách',
    title: 'Tìm kiếm sách tại SmartShop',
    link: 'http://localhost:3000/chi-tiet-san-pham/' + data.slug,
    user: userId
  })

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    try {
      await historyApi.create(addHistory)
    } catch (error) {
      setAddHistory()
      console.log(error);
    }
  }
  //end

  return (
    <div onClick={handleSubmitAdd}>
      <Link to={`/chi-tiet-san-pham/${data.slug}`}>
      <div className={styles.resultItem}>
        <div className={styles.img}>
          <img src={data.imageUrl} alt="" />
        </div>
        <div className={styles.bookInfo}>
          <p className={styles.name}>{data.name}</p>
          <p>{data?.author[0]?.name}</p>
        </div>
      </div>
    </Link>
    </div>
  );
}
