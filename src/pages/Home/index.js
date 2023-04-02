import { Container, Row, Col } from "react-bootstrap";
import BookItem from "../../components/Shop/BookItem";
import bookApi from "../../api/bookApi";
import { useEffect, useState } from "react";
import styles from './Home.module.css'
import Loading from "../../components/Loading"
// import styles from "./Product.module.css";

function Home() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await bookApi.getAll({page: 1, limit: 12})
        // const { data } = await bookApi.getAll()

        setBooks(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])
  
  return (
    <div className="main">
      <Container>
        <div className={styles.booksList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Đề xuất cho bạn</h2>
          </div>
          {/* begin AI Đề xuất sản phẩm*/}
          <Row style={{marginLeft: '16px', marginTop: '20px' , marginBottom: '15px'}}>
            <Col xl={4}>
              {/* <div className={styles.orderItem}> */}
              <div>
                <label htmlFor="ai-recommender" style={{marginBottom: '5px'}}>Chọn cách đề xuất - AI:</label>
                <select
                  className="form-select"
                  name="ai-recommender"
                  // value={sortString}
                  // onChange={(e) => setSortString(e.target.value)}
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
          {/* end AI Đề xuất sản phẩm */}
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
      <Container style={{marginTop: "40"}}>
        <div className={styles.booksList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Sản phẩm mới nhất</h2>
          </div>
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
      <Container style={{marginTop: "40"}}>
        <div className={styles.booksList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Sản phẩm bán chạy</h2>
          </div>
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
    </div>
  );
}

export default Home;
