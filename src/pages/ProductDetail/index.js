import React, {useEffect, useState} from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart, AiOutlineHeart, AiFillHeart, AiOutlineSearch } from 'react-icons/ai'
// eslint-disable-next-line
import { toast } from 'react-toastify';

import DetailedBookInfo from '../../components/Shop/DetailedBookInfo'
import Loading from "../../components/Loading"

import { useNavigate, useParams } from 'react-router-dom';
import bookApi from "../../api/bookApi";
import userApi from "../../api/userApi";
import { addToCart } from "../../redux/actions/cart"
import { useDispatch, useSelector } from "react-redux"
import format from "../../helper/format";
import styles from './ProductDetail.module.css'

//history
import historyApi from '../../api/historyApi';

//rating
import StarRatings from 'react-star-ratings';
import ratingApi from '../../api/ratingApi';

//pythons
// import pythonApi from '../../api/pythonApi';
import BookItem from '../../components/Shop/BookItem';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// eslint-disable-next-line
import { stripHtml } from "string-strip-html";
// Bowjs
import recommendApi from '../../api/recommendApi';
export default function ProductDetail() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const { slug } = params

  const cartData = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.auth);

  const [bookData, setBookData] = useState({})
  const [loading, setLoading] = useState(false)

  let bookDataName = '';
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1024 },
      items: 6,
      slidesToSlide: 1,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    const addToCart = async() => {
      try {
        const { list } = cartData
        const newList = list.map(item => {
          return { product: item.product._id, quantity: item.quantity }
        })
        await userApi.updateCart(currentUser.userId, {cart: newList})
      } catch (error) {
        console.log(error)
      }
    }
    if (currentUser && currentUser.userId) {
      addToCart()
    }
  }, [cartData, currentUser])

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const res = await bookApi.getBySlug(slug);
        setLoading(false)
        // eslint-disable-next-line
        bookDataName = res.data.name;
        setBookData(res.data)
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetchBook();
  }, [slug]);
  //#region code
  const [quantity, setQuantity] = useState(1);
  const [fav, setFav]= useState(false);

  const decQuantity = () => {
    if(quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const incQuantity = () => {
    setQuantity(parseInt(quantity + 1))
  }

  const handleChange = (e) => {
    console.log(e.target.value);
    // /^[0-9]+$/.test(newQuantity)
    //sai khi them chu
    const newQuantity = parseInt(e.target.value)
    if(newQuantity){
      setQuantity(newQuantity)
    }
    else {
      setQuantity('')
    }
  }

  const handleFav = () => {
    setFav(!fav)
  }

  const handleAddToCart = () => {

    if (currentUser && currentUser.userId) {
      const { _id: productId, name, imageUrl, slug, price, discount } = bookData
      let newPrice = price
      if (discount > 0) {
        newPrice = price - price * discount / 100
      }
      const action = addToCart({quantity, productId, name, imageUrl, slug, 
        price: newPrice, 
        totalPriceItem: newPrice * quantity})
      dispatch(action)
      toast.success('Thêm sản phẩm vào giỏ hàng thành công!', {autoClose: 2000})
    } else {
      toast.info('Vui lòng đăng nhập để thực hiện!', {autoClose: 2000})
    }
  }

  const handleBuyNow = () => {
    
    if (currentUser && currentUser.userId) {
      const { _id: productId, name, imageUrl, slug, price, discount } = bookData
      let newPrice = price
      if (discount > 0) {
        newPrice = price - price * discount / 100
      }
      const action = addToCart({quantity, productId, name, imageUrl, slug, 
        price: newPrice, 
        totalPriceItem: newPrice * quantity})
      dispatch(action)
      navigate({ pathname: "/gio-hang" });
    } else {
      toast.info('Vui lòng đăng nhập để thực hiện!', {autoClose: 2000})
    }
  }

  //Add History click to cart or checkout
  const { userId } = useSelector((state) => state.auth);
  const [addHistoryCart, setAddHistoryCart] = useState({
    action: 'Thêm sách vào giỏ hàng ' + bookDataName,
    type: 'Thêm giỏ hàng',
    title: 'Lịch sử thêm vào giỏ hàng',
    link: 'http://localhost:3000/chi-tiet-san-pham/' + slug,
    user: userId
  });
  const [addHistoryCheckout, setAddHistoryCheckout] = useState({
    action: 'Đặt sách ' + bookDataName,
    type: 'Đặt sách muốn thanh toán',
    title: 'Lịch sử đặt sách',
    link: 'http://localhost:3000/chi-tiet-san-pham/' + slug,
    user: userId
  });

  const HandleSubmitAddHistory_Cart = async (e, bookData) => {
    e.preventDefault()
    
    try {
      await historyApi.create(addHistoryCart)
    } catch (error) {
      setAddHistoryCart({});
      console.log(error);
    }
  }

  const HandleSubmitAddHistory_Checkout = async (e, bookData) => {
    e.preventDefault()
    
    try {
      await historyApi.create(addHistoryCheckout)
    } catch (error) {
      setAddHistoryCheckout({});
      console.log(error);
    }
  }
  //end

  //rating
  const [ratingData, setRatingData] = useState(3)
  const changeRating = async (newRating, name) => {
    setRatingData(newRating);
    await ratingApi.create({user: currentUser.userId, product: bookData._id, rating: newRating})
    // const res = await ratingApi.getAverage({user: currentUser.userId, product: bookData._id});
    // setAverageRatings(res.data)
  }

  //average rating
  // const [averageRatings, setAverageRatings] = useState(3);
  // useEffect(() => {
  //   const fetchAverageRatings = async () => {
  //     try {
  //       const res = await ratingApi.getAverage({user: currentUser.userId, product: bookData._id});
  //       setAverageRatings(res.data)
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchAverageRatings();
  // }, [averageRatings, currentUser.userId, bookData._id]);
  // const [ratingVoteData, setRatingVoteData] = useState({})
  // const HandleSubmitAddRating = async (ratingVoteData) => {    
  //   try {
  //     setRatingVoteData({
  //       user: currentUser.userId,
  //       product: bookData._id,
  //       rating: ratingData
  //     })
  //     await ratingApi.create(ratingVoteData)
  //   } catch (error) {
  //     setRatingVoteData({
  //       user: currentUser.userId,
  //       product: bookData._id,
  //       rating: ratingData
  //     })
  //     console.log(error);
  //   }
  // }
  //end
  // const [key, setKey] = useState("")
  const handleRecommend = async (limit) => {
    try {
      // let name = bookDataName;
      // await pythonApi.testPythonShell()
      navigate({
        pathname: '/de-xuat',
        // search: `bookinfo=${bookData._id}|___|${bookData.name}|___|${bookData.description}`,
        search: `bookinfo=${bookData._id}&limit=${limit}`,
      })
    } catch (error) {
      console.log(error);
    }
  }
  //#endregion
  
  //#region recommend
  // eslint-disable-next-line
  // const [titlesBooks, setTitlesBooks] = useState([]);
  // const _titlebook = localStorage.getItem('titlebook');
  // eslint-disable-next-line
  // const [titleBook, setTitleBook] = useState(_titlebook);
  const [titlesBooks, setTitlesBooks] = useState([]);
  useEffect(() => {
    const fetchTitleBookData = async () => {
      try {
        // const { data } = await bookApi.getAll({page: 1, limit: 12})
        // const key = titleBook;
        // let listTitle = {};
        // const key = localStorage.getItem('titlebook');
        // const { data } = await bookApi.searchNLP({key})
        // console.log(data);
        // if(data.length <= 6) {
        //   // eslint-disable-next-line
        //   Array.prototype.random = function () {
        //     return this[Math.floor((Math.random()*this.length))];
        //   }
        //   const { data } = await bookApi.getAll({page: 1, limit: 12, sort : [{ createdAt: -1 },{ updatedAt: -1 }].random() })
        //   listTitle = data
        //   setTitlesBooks(listTitle)
        // }else{
        //   setTitlesBooks(data)
        // }
        const key = localStorage.getItem('BOOK_ID');
        // const limit = 12;
        // eslint-disable-next-line
        const res = await recommendApi.getDataNLPById({key})
        setTitlesBooks(res.listBookNLP_Final);
      } catch (error) {
        console.log(error)
      }
    }

    fetchTitleBookData()
    // eslint-disable-next-line
  }, [localStorage.getItem('titlebook')])
  // eslint-disable-next-line
  const [genreBooks, setGenreBooks] = useState([]);
  useEffect(() => {
    const fetchGenreBookData = async () => {
      try {
        // const { data } = await bookApi.getAll({page: 1, limit: 12})
        const key = localStorage.getItem('genre')
        const { data } = await bookApi.searchNLP({key})
        console.log(data);
        setGenreBooks(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchGenreBookData()
  }, [bookData?.genre])
  // function get_random (list) {
  //   return list[Math.floor((Math.random()*list.length))];
  // }
  const [authorBooks, setAuthorBooks] = useState([]);
  useEffect(() => {
    const fetchAuthorBookData = async () => {
      try {
        // const { data } = await bookApi.getAll({page: 1, limit: 12})
        let listAuthor = {};
        const key = localStorage.getItem('author')
        const { data } = await bookApi.searchNLP({key})
        console.log(data);
        if(data.length <= 6) {
          // eslint-disable-next-line
          Array.prototype.random = function () {
            return this[Math.floor((Math.random()*this.length))];
          }
          const { data } = await bookApi.getAll({page: 1, limit: 12, sort : [{ createdAt: -1 },{ updatedAt: -1 }].random() })
          listAuthor = data
          setAuthorBooks(listAuthor)
        }else{
          setAuthorBooks(data)
        }
        // setAuthorBooks(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAuthorBookData()
  }, [])
  //#endregion
  return (
    <div className="main">
      <Container>
        {!loading ?
        <Row className={styles.productBriefing}>
           <Col xl={4} xs={12}>
            <div className={styles.imgBriefing}>
                <img src={bookData && bookData.imageUrl} alt="" />
              </div>
            </Col>

            <Col xl={8}>
              <div className={styles.infoBriefing}>
                <div>
                  <h2>{bookData && bookData.name}</h2>
                  <div className={styles.price}>
                    {bookData.discount > 0 ? 
                    (<p>
                      <span>{format.formatPrice(bookData.price - bookData.price * bookData.discount / 100)}</span>
                      <span className={styles.oldPrice}>{format.formatPrice(bookData.price)}</span>
                    </p>)
                    : format.formatPrice(bookData.price)}
                  </div>
                  <div className={`d-flex ${styles.itemBriefing}`}>
                    <div>Tác giả: &nbsp;</div>
                    <div className={styles.author}>{bookData && format.arrayToString(bookData?.author || [])}</div>
                  </div>

                  <div className={`d-flex ${styles.itemBriefing}`}>
                    <div>Nhà xuất bản: &nbsp;</div>
                    <div className={styles.author}>
                      {bookData && bookData.publisher?.name} - {bookData && bookData.year} 
                    </div>
                  </div>

                  <div className={`d-flex ${styles.itemBriefing} ${styles.description}`}>
                    <div dangerouslySetInnerHTML={{__html:bookData?.description}} />
                    {/* <div dangerouslySetInnerHTML={{__html:stripHtml(bookData.description.substring(0,199)).result}} /> */}
                    {/* <div dangerouslySetInnerHTML={{__html:bookData.description.substring(0,999)}} /> */}
                    {/* <span>...</span> */}
                  </div>

                  <div className={`d-flex ${styles.itemBriefing}`}>
                    <div className={styles.textBold}>Số lượng: </div>
                    <div className='d-flex'>
                      <button className={styles.descreaseBtn} onClick={decQuantity}>
                        <AiOutlineMinus />
                      </button>
                      <input type="text" className={styles.quantityInput} value={quantity} onChange={handleChange} />
                      <button className={styles.increaseBtn} onClick={incQuantity}>
                        <AiOutlinePlus />
                      </button>
                    </div>
                  </div>

                  <div className={styles.actions}>
                      <button className={styles.fav_btn} onClick={handleFav}>
                        {fav ? <AiFillHeart className={styles.fav_icon} /> : <AiOutlineHeart className={styles.fav_icon}/> }
                        Yêu thích
                      </button>
                      <div style={{marginTop: '16px', marginBottom: '16px', fontSize: '20px'}}>
                        <p>Đánh giá: {ratingData} ⭐</p>
                        <StarRatings
                          rating={ratingData}
                          starRatedColor="orange"
                          changeRating={changeRating}
                          numberOfStars={5}
                          name='rating'
                          starDimension='28px'
                          styles={{marginTop: '24px'}}
                          // onClick={HandleSubmitAddRating}
                        />
                      </div>
                      
                    

                    <div className={styles.actions_bottom}>
                      <div onClick={ (e,bookData) => HandleSubmitAddHistory_Cart(e,bookData) }>
                        <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                          <AiOutlineShoppingCart className={styles.addToCartIcon} />
                          Thêm vào giỏ hàng
                        </button>
                      </div>
                      <div onClick={ (e,bookData) => HandleSubmitAddHistory_Checkout(e,bookData) }>
                        <button className={styles.buyBtn} onClick={handleBuyNow}>Mua ngay</button>
                      </div>
                      {/* Recommendation Button */}
                      <div>
                        {/* <button style={{backgroundColor: 'red'}} className={styles.buyBtn} onClick={handleRecommend(12)}>
                          <AiOutlineSearch className={styles.addToCartIcon} />
                          Đề xuất 12
                        </button> */}
                        <button style={{backgroundColor: 'red'}} className={styles.buyBtn} onClick={handleRecommend}>
                          <AiOutlineSearch className={styles.addToCartIcon} />
                          Đề xuất 30 cuốn
                        </button>
                        {/* <button style={{backgroundColor: 'red'}} className={styles.buyBtn} onClick={handleRecommend(50)}>
                          <AiOutlineSearch className={styles.addToCartIcon} />
                          Đề xuất 50
                        </button> */}
                      </div>
                      {/* Recommendation Button */}
                    </div>
                  </div>
                </div>
             </div> 
            </Col>
          <DetailedBookInfo data={bookData} /> 
        </Row> : <Loading />}
      </Container>
      {/* Disabled UI */}
      <Container style={{marginTop: "40"}}>
        <div className={styles.booksList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Các cuốn sách có tên liên quan</h2>
          </div>
          <Row className={styles.row}>
          <Carousel showDots={true} responsive={responsive}>
            {titlesBooks && titlesBooks.length > 0 ? (
               titlesBooks.map(bestBook => 
                <Col xl={10} xs={6} key={bestBook._id}>
                  <BookItem data={bestBook} />
                </Col>)
            ) : <Loading />}
          </Carousel>
          </Row>
        </div>
      </Container>
      {/* Disabled UI */}
      {/* Disabled UI */}
      <Container style={{marginTop: "40"}}>
        <div className={styles.booksList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Các cuốn sách liên quan đến chủ đề "{bookData && format.arrayToString(bookData?.genre || [])}"</h2>
          </div>
          <Row className={styles.row}>
          <Carousel showDots={true} responsive={responsive}>
            {genreBooks && genreBooks.length > 0 ? (
               genreBooks.map(bestBook => 
                <Col xl={10} xs={6} key={bestBook._id}>
                  <BookItem data={bestBook} />
                </Col>)
            ) : <Loading />}
          </Carousel>
          </Row>
        </div>
      </Container>
      {/* Disabled UI */}
      {/* Disabled UI */}
      <Container style={{marginTop: "40"}}>
        <div className={styles.booksList}>
          <div className={styles.title}>
            {/* <h2 className={styles.titleHeading}>Các cuốn sách liên quan đến tác giả "{bookData && format.arrayToString(bookData?.author || [])}"</h2> */}
            <h2 className={styles.titleHeading}>Các cuốn sách khác của các tác giả khác có thể bạn sẽ thích</h2>
          </div>
          <Row className={styles.row}>
          <Carousel showDots={true} responsive={responsive}>
            {authorBooks && authorBooks.length > 0 ? (
               authorBooks.map(bestBook => 
                <Col xl={10} xs={6} key={bestBook._id}>
                  <BookItem data={bestBook}/>
                </Col>)
            ) : <Loading />}
          </Carousel>
          </Row>
        </div>
      </Container>
      {/* Disabled UI */}
    </div>
  )
}
