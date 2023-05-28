import { Container, Row, Col } from "react-bootstrap";
import BookItem from "../../components/Shop/BookItem";
import bookApi from "../../api/bookApi";
import pythonApi from '../../api/pythonApi';
import { useEffect, useState } from "react";
import styles from './Recommend.module.css'
import { useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading"

function Recommend() {

  const [searchParams] = useSearchParams()

  const bookname = searchParams.get('bookname')

  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await bookApi.search({bookname})
        // list bookRec = [];
        const res = await pythonApi.testPythonShell({bookname})
        const { name, index, data } = res.data;
        let listBookNLP = [];const limit = 1;
        const listBooksFinalTrain = async () => {
          await data.array.forEach(key => {
            const getBooksNLP = bookApi.search({key, limit});
            listBookNLP.push(getBooksNLP);
          });
          return listBookNLP;
        }
        // const resListBooks = await bookApi.getAll();
        // resListBooks.map((book) => {
        //   res.map((book2) => {
        //     if(book2.data. == book) bookRec.push();
        //   })
        // })
        // console.log(res)
        console.log(res);
        console.log(listBooksFinalTrain)
        setBooks(listBooksFinalTrain.data)
        
      } catch (error) {
        console.log(error)
      }
    }
    if (bookname) {
      fetchData()
    }
  }, [bookname])
  
  return (
    <div className="main">
      <Container>
        <div className={styles.booksList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Kết quả</h2>
          </div>
          <Row>
            {books && books.length > 0 ? (
               books.map(book => 
                <Col xl={3} key={book._id}>
                  <BookItem boxShadow={true} data={book} />
                </Col>)
            ) :
              <Loading/>}
            {/* <p className={styles.notfound}>Không tìm thấy kết quả phù hợp với từ khóa "<span className={styles.keyword}>{bookname}</span>"</p>} */}
          </Row>
        </div>
      </Container>
      {/* Disabled UI */}
      {/* <Container>
        <div className={styles.booksList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Đề xuất cho bạn</h2>
          </div>
          <Row>
            {books && books.length > 0 ? (
               books.map(book => 
                <Col xl={3} key={book._id}>
                  <BookItem boxShadow={true} data={book} />
                </Col>)
            ) :
            <p className={styles.notfound}>Không tìm thấy kết quả phù hợp với từ khóa "<span className={styles.keyword}>{key}</span>"</p>}
          </Row>
        </div>
      </Container> */}
      {/* Disabled UI */}
    </div>
  );
}

export default Recommend;
