import { Link } from "react-router-dom";
import styles from "./Search.module.css";

//history
import { useSelector } from "react-redux";
import { useState } from "react";
import historyApi from '../../../api/historyApi';
import { stripHtml } from "string-strip-html";
import Highlighter from "react-highlight-words";

export default function SearchResultItem({ data }) {
  const ListTokenKeySearch = localStorage.getItem('ListTokenKeySearch');
  const ListSearch = ListTokenKeySearch.split(' ');
  console.log(ListTokenKeySearch.split(' '))
  console.log([...ListTokenKeySearch])
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
    <div onClick={handleSubmitAdd} style={{marginBottom: '20px'}}>
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
      {/* <div>
          {
              data.description.length >= 200 && 
              <p>
                {stripHtml(data.description.substring(0,199)).result}
              </p>
          }
      </div> */}
      <div>
          {
              data.description.length >= 200 && 
              <Highlighter
                highlightClassName={styles.YourHighlightClass}
                // className={styles.YourHighlightClass}
                // searchWords={['truyện', 'tranh']}
                searchWords={ListSearch}
                autoEscape={true}
                textToHighlight={stripHtml(data.description.substring(0,199)).result}
              />
          }
      </div>
    </Link>
    </div>
  );
}
