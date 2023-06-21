import styles from "./BookItem.module.css";
import format from "../../../helper/format";
import { Link } from "react-router-dom";

//history
import { useSelector } from "react-redux";
import { useState } from "react";
import historyApi from '../../../api/historyApi';
// import genreApi from "../../../api/genreApi";
import BookOfficial from '../../../assets/images/book-official.png';
function BookItem({data, boxShadow}) {
  const { price , discount, author, genre } = data
  // const { genre } = data
  let newPrice = price
  if (discount > 0) {
    newPrice = price - price * discount / 100
  }

  //handle click để lưu lại lịch sử
  const { userId } = useSelector((state) => state.auth);
  const [addHistory, setAddHistory] = useState({
    action: 'Xem sách' + data.name,
    type: 'Xem sách',
    title: 'Xem sách tại SmartShop',
    link: 'http://localhost:3000/chi-tiet-san-pham/' + data.slug,
    user: userId
  })

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    try {
      await historyApi.create(addHistory)
      localStorage.setItem('author', author[0].name);
      localStorage.setItem('genre', genre[0].name);
      localStorage.setItem('titlebook', data.name);
      localStorage.setItem('BOOK_ID', data._id);
    } catch (error) {
      setAddHistory()
      console.log(error);
    }
  }
  //end
  
  return (
    <div className={`${styles.bookItem} ${boxShadow && styles.shadow}`}>
       {discount && discount > 0 ?
        (
          <div className={styles.discount}>
            -{discount}%
          </div>
        ) : null }
      <div className={styles.card} onClick={handleSubmitAdd}>
        <Link to={`/chi-tiet-san-pham/${data.slug}`} className={styles.bookInfo}>
          <img variant="top" src={data.imageUrl} alt="" />
          {/* <p className={styles.name}>{data.name} - {data.author?.name || data.author[0]?.name}</p> */}
          {data.name && data.name.includes('(Original)') ? (
            <img style={{textAlign: 'left'}} src={BookOfficial} width='72' height='20' alt="book official"/>
          ): null}
          <p className={styles.name}>{data.name}</p>
        </Link>
        <div className={styles.cardFooter}>
          <span className={styles.price}>{format.formatPrice(newPrice)}</span>
          {discount > 0 && <span className={styles.oldPrice}>{format.formatPrice(data.price)}</span>}
        </div>
        {/* <div style={{textAlign: 'left'}}>
          <p>Tác giả: {data?.author[0]?.name}</p>
        </div>
        <div style={{textAlign: 'left'}}>
          <p>Thể loại: {data?.genre[0]?.name}</p>
        </div> */}
        <div style={{textAlign: 'left'}}>
          <p>Tác giả: {data.author?.name || data.author[0]?.name}</p>
        </div>
        <div style={{textAlign: 'left'}}>
          <p>Thể loại: {data.genre?.name || data.genre[0]?.name}</p>
        </div>
        {/* <div>
          <span>{genre.map( async (g) => {
                const gen = await genreApi.getById(g);
                return gen.data.name;
            })}</span>
        </div> */}
        {/* <div className={styles.bookDescription}>
            {
              data.description >= 100 && 
              <p>
                {data.description.substring(0,99).replace('<p>','').replace('<strong>','').replace('</p>','').replace('</strong>','')}
              </p>
            }
        </div> */}
      </div>
    </div>
  );
}

export default BookItem;
