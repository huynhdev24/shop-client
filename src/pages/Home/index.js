import { Container, Row, Col } from "react-bootstrap";
import BookItem from "../../components/Shop/BookItem";
import bookApi from "../../api/bookApi";
import { useEffect, useState } from "react";
import styles from './Home.module.css'
import Loading from "../../components/Loading"
// import styles from "./Product.module.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import BookBanner1 from '../../assets/images/BannerBlock09_NgoaiVan_350x415.jpg';
import BookBanner2 from '../../assets/images/BannerBlock10_KinhTe350x415.jpg';
import BookBanner3 from '../../assets/images/BannerBlock10_TamLyKyNang_350x415.jpg';
import BookBanner4 from '../../assets/images/BannerBlock10_VanHoc_350x415.jpg';
import BookBanner5 from '../../assets/images/BannerBlock10_ThieuNhi_350x415.jpg';
import TrackIcon1 from '../../assets/images/track-icon-1.png';
import TrackIcon2 from '../../assets/images/track-icon-2.png';
import TrackIcon3 from '../../assets/images/track-icon-3.png';
import Icon1 from '../../assets/icons/IconT4_F3.png';
import Icon2 from '../../assets/icons/Icon_FlashSale_Hot_8px_1.png';
import Icon3 from '../../assets/icons/Icon_KinhTe_8px_1.png';
import Icon4 from '../../assets/icons/Icon_MaGiamGia_8px_1.png';
import Icon5 from '../../assets/icons/Icon_MangaCommic_8px_1.png';
import Icon6 from '../../assets/icons/Icon_PhienChoCu_8px_1.png';
import Icon7 from '../../assets/icons/Icon_SanPhamMoi_8px_1.png';
import Icon8 from '../../assets/icons/Icon_Trending_Hot_8px_1.png';
import Icon9 from '../../assets/icons/Icon_VanHoc_50.png';
import Icon10 from '../../assets/icons/TamLyKyNang_50.png';
import Cate1 from '../../assets/categories/8935246917176.jpg';
import Cate2 from '../../assets/categories/Manga.jpg';
import Cate3 from '../../assets/categories/T_m_linh.jpg';
import Cate4 from '../../assets/categories/Th_c_T_nh.jpg';
import Cate5 from '../../assets/categories/Thao_t_ng.jpg';
import Cate6 from '../../assets/categories/Ti_u_Thuy_t.jpg';
import Cate7 from '../../assets/categories/_am_m_.jpg';
import Cate8 from '../../assets/categories/lightnovel.jpg';
import Cate9 from '../../assets/categories/8935246917176.jpg';
import Cate10 from '../../assets/categories/8935246917176.jpg';


import { Link } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([])
  // const [bestBooks, setBestBooks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await bookApi.getAll({page: 1, limit: 12 * 4})
        // const { data } = await bookApi.getAll()
        console.log(data);
        setBooks(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()

    // const fetchBestBookData = async () => {
    //   try {
    //     const { data } = await bookApi.getAll({page: 1, limit: 12 * 4})
    //     console.log(data);
    //     setBestBooks(data)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // fetchBestBookData()
  }, [])
  
  return (
    <div className="main">
      <Container style={{marginBottom: '12px'}} className={styles.hiddenTracking}>
        <Row className={styles.row}>
          <Col xl={3}>
            <Row>
              <Col style={{textAlign: 'right'}}>
                <img src={TrackIcon1} alt="track icon 1" style={{marginLeft: '8px', height: '50px', width: '50px'}}/>
              </Col>
              <Col>
                <p style={{fontSize: '14px', fontWeight: 'bold'}}>7 ngày miễn phí trả hàng</p>
                <p style={{fontSize: '10px'}}>Trả hàng miễn phí trong 7 ngày</p>
              </Col>
            </Row>          
          </Col>
          <Col xl={4}>
            <Row>
              <Col style={{textAlign: 'right'}}>
                <img src={TrackIcon2} alt="track icon 2" style={{marginLeft: '8px', height: '50px', width: '50px'}}/>
              </Col>
              <Col>
                <p style={{fontSize: '14px', fontWeight: 'bold'}}>Hàng chính hãng 100%</p>
                <p style={{fontSize: '10px'}}>Đảm bảo hàng chính hãng hoặc hoàn tiền gấp đôi</p>
              </Col>
            </Row>
          </Col>
          <Col xl={4}>
            <Row>
              <Col style={{textAlign: 'right'}}>
                <img src={TrackIcon3} alt="track icon 3" style={{marginLeft: '8px', height: '50px', width: '50px'}}/>
              </Col>
              <Col>
                <p style={{fontSize: '14px', fontWeight: 'bold'}}>Miễn phí vận chuyển</p>
                <p style={{fontSize: '10px'}}>Giao hàng miễn phí toàn quốc</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Container>
        <div className={styles.booksList}>
          <div className={styles.title}>
            {/* <h2 className={styles.titleHeading}>Đề xuất cho bạn</h2> */}
            <h2 className={styles.titleHeading}>Tùy chọn nhanh</h2>
          </div>
          {/* Icons */}
          <Row className={styles.hiddenTracking} style={{marginTop: '28px' ,marginBottom: '28px', textAlign: 'center'}}>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Icon1} alt='icon 1'/>
                Sale Thứ 3
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Icon2} alt='icon 2'/>
                Flash Sale
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Icon3} alt='icon 3'/>
                Kinh Tế
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Icon4} alt='icon 4'/>
                Mã giảm giá
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Icon5} alt='icon 5'/>
                Manga - Comic
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Icon6} alt='icon 6'/>
                Phiên chợ sách cũ
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Icon7} alt='icon 7'/>
                Sản phẩm mới
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Icon8} alt='icon 8'/>
                Xu hướng
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Icon9} alt='icon 9'/>
                Văn Học
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Icon10} alt='icon 10'/>
                Tâm Lý Kỹ Năng
              </Link>
            </Col>
          </Row>
          <Row className={styles.hiddenTracking} style={{marginTop: '28px' ,marginBottom: '28px', textAlign: 'center'}}>
            <Col xl={2}>
              <Link to='/' style={{padding: '12px', borderRadius: '8px', borderColor: 'red', borderStyle: 'solid', borderWidth: '2px'}}>
                Văn học - Giảm Sốc
              </Link>
            </Col>
            <Col xl={2}>
              <Link to='/'>
                Văn Học Mới
              </Link>
            </Col>
            <Col xl={2}>
              <Link to='/'>
                SmartShop Khuyên Đọc
              </Link>
            </Col>
            <Col xl={2}>
              <Link to='/'>
                Tiểu thuyết
              </Link>
            </Col>
            <Col xl={2}>
              <Link to='/'>
                Truyện ngắn - Tản văn
              </Link>
            </Col>
            <Col xl={2}>
              <Link to='/'>
                Ngôn Tình
              </Link>
            </Col>
          </Row>
          {/* Disabled UI */}
          {/* <Row style={{marginLeft: '16px', marginTop: '20px' , marginBottom: '15px'}}>
            <Col xl={4}>
              <div>
                <label htmlFor="ai-recommender" style={{marginBottom: '5px'}}>Chọn cách đề xuất - AI:</label>
                <select
                  className="form-select"
                  name="ai-recommender"
                >
                  <option value="createdAt|-1">Mới nhất</option>
                  <option value="createdAt|1">Các cuốn sách nhiều người mua nhất</option>
                  <option value="price|1">Các cuốn sách tương tự mua gần đây</option>
                  <option value="price|-1">Các cuốn sách được nhiều người quan tâm, yêu thích</option>
                  <option value="discount|-1">Các cuốn sách giá rẻ tương tự</option>
                </select>
              </div>
            </Col>
          </Row>
          <Row className={styles.row}>
            {books && books.length > 0 ? (
               books.map(book => 
                <Col xl={2} xs={6} key={book._id}>
                  <BookItem data={book} />
                </Col>)
            ) : <Loading />}
          </Row> */}
          {/* Disabled UI */}
        </div>
      </Container>
      <Container style={{marginTop: "40"}}>
        <div className={styles.booksList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Sản phẩm mới nhất</h2>
          </div>
          {/* Categories */}
          <Row className={styles.hiddenTracking} style={{marginTop: '28px' ,marginBottom: '28px', textAlign: 'center'}}>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Cate1} alt='icon 1'/>
                Sách Học Ngoại Ngữ
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Cate2} alt='icon 2'/>
                Manga
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Cate3} alt='icon 3'/>
                Tâm Linh Luân Hồi
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Cate4} alt='icon 4'/>
                Đối Mặt Thức Tỉnh
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Cate5} alt='icon 5'/>
                Tâm Lý Thao Túng
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Cate6} alt='icon 6'/>
                Tiểu Thuyết
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Cate7} alt='icon 7'/>
                Ngôn Tình Đam Mỹ
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Cate8} alt='icon 8'/>
                Xu hướng
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Cate9} alt='icon 9'/>
                Văn Học
              </Link>
            </Col>
            <Col xl={1} style={{margin: '10px'}}>
              <Link to='/'>
                <img src={Cate10} alt='icon 10'/>
                Tâm Lý Kỹ Năng
              </Link>
            </Col>
          </Row>
          <Row className={styles.row}>
            {books && books.length > 0 ? (
               books.map(book => 
                <Col xl={2} xs={6} key={book._id}>
                  <BookItem data={book} />
                </Col>)
            ) : <Loading />}
          </Row>
        </div>
      </Container>
      {/* Test */}
      {/* <Container style={{marginTop: "40"}}>
        <div className={styles.booksList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Sản phẩm nổi bật</h2>
          </div>
          <Row className={styles.row}>
            {bestBooks && bestBooks.length > 0 ? (
               bestBooks.map(bestBook => 
                <Col xl={2} xs={6} key={bestBook._id}>
                  <BookItem data={bestBook} />
                </Col>)
            ) : <Loading />}
          </Row>
        </div>
      </Container> */}
      {/* Test */}
      <Container>
        <hr/>
        <Row className={styles.hiddenTracking} style={{marginTop: '28px' ,marginBottom: '28px', textAlign: 'center'}}>
          <Col xl={2}>
            <Link to='/' style={{padding: '12px', borderRadius: '8px', borderColor: 'red', borderStyle: 'solid', borderWidth: '2px'}}>
              Văn học - Giảm Sốc
            </Link>
          </Col>
          <Col xl={2}>
            <Link to='/'>
              Văn Học Mới
            </Link>
          </Col>
          <Col xl={2}>
            <Link to='/'>
              SmartShop Khuyên Đọc
            </Link>
          </Col>
          <Col xl={2}>
            <Link to='/'>
              Tiểu thuyết
            </Link>
          </Col>
          <Col xl={2}>
            <Link to='/'>
              Truyện ngắn - Tản văn
            </Link>
          </Col>
          <Col xl={2}>
            <Link to='/'>
              Ngôn Tình
            </Link>
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col xl={4}>
            <Carousel>
              <Col xl={2} xs={12}>
                <div>
                    <img src={BookBanner1} style={{width: '400px', heigth: '500px'}} alt="banner 1"/>
                </div>
              </Col>
              <Col xl={2} xs={12}>
                <div>
                    <img src={BookBanner2} style={{width: '400px', heigth: '500px'}} alt="banner 2"/>
                </div>
              </Col>
              <Col xl={2} xs={12}>
                <div>
                    <img src={BookBanner3} style={{width: '400px', heigth: '500px'}} alt="banner 3"/>
                </div>
              </Col>     
            </Carousel>
          </Col>
          <Col xl={4}>
            <Carousel>
                <Col xl={2} xs={12}>
                  <div>
                      <img src={BookBanner4} style={{width: '400px', heigth: '500px'}} alt="banner 4"/>
                  </div>
                </Col>
                <Col xl={2} xs={12}>
                  <div>
                      <img src={BookBanner2} style={{width: '400px', heigth: '500px'}} alt="banner 2"/>
                  </div>
                </Col>
                <Col xl={2} xs={12}>
                  <div>
                      <img src={BookBanner3} style={{width: '400px', heigth: '500px'}} alt="banner 3"/>
                  </div>
                </Col>     
              </Carousel>
          </Col>
          <Col xl={4}>
            <Carousel>
                <Col xl={2} xs={12}>
                  <div>
                      <img src={BookBanner5} style={{width: '400px', heigth: '500px'}} alt="banner 5"/>
                  </div>
                </Col>
                <Col xl={2} xs={12}>
                  <div>
                      <img src={BookBanner2} style={{width: '400px', heigth: '500px'}} alt="banner 2"/>
                  </div>
                </Col>
                <Col xl={2} xs={12}>
                  <div>
                      <img src={BookBanner4} style={{width: '400px', heigth: '500px'}} alt="banner 4"/>
                  </div>
                </Col>     
              </Carousel>
          </Col>
        </Row>
      </Container>
      <Container className={styles.hiddenTracking}>
        <Row className={styles.row}>
          <Col xl={3}>
            <Row>
              <Col style={{textAlign: 'right'}}>
                <img src={TrackIcon1} alt="track icon 1" style={{marginLeft: '12px', height: '54px', width: '54px'}}/>
              </Col>
              <Col>
                <p style={{fontSize: '20px', fontWeight: 'bold'}}>7 ngày miễn phí trả hàng</p>
                <p style={{fontSize: '16px'}}>Trả hàng miễn phí trong 7 ngày</p>
              </Col>
            </Row>          
          </Col>
          <Col xl={4}>
            <Row>
              <Col style={{textAlign: 'right'}}>
                <img src={TrackIcon2} alt="track icon 2" style={{marginLeft: '12px', height: '54px', width: '54px'}}/>
              </Col>
              <Col>
                <p style={{fontSize: '20px', fontWeight: 'bold'}}>Hàng chính hãng 100%</p>
                <p style={{fontSize: '16px'}}>Đảm bảo hàng chính hãng hoặc hoàn tiền gấp đôi</p>
              </Col>
            </Row>
          </Col>
          <Col xl={4}>
            <Row>
              <Col style={{textAlign: 'right'}}>
                <img src={TrackIcon3} alt="track icon 3" style={{marginLeft: '12px', height: '54px', width: '54px'}}/>
              </Col>
              <Col>
                <p style={{fontSize: '20px', fontWeight: 'bold'}}>Miễn phí vận chuyển</p>
                <p style={{fontSize: '16px'}}>Giao hàng miễn phí toàn quốc</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
