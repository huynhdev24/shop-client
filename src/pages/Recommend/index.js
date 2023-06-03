import { Container, Row, Col } from "react-bootstrap";
import BookItem from "../../components/Shop/BookItem";
// import bookApi from "../../api/bookApi";
import pythonApi from '../../api/pythonApi';
// eslint-disable-next-line
import { useAsyncEffect, useEffect, useState } from "react";
import styles from './Recommend.module.css'
import { useSearchParams } from "react-router-dom";
import LoadingAI from "../../components/LoadingAI"
// import { useNavigate } from 'react-router-dom';

function Recommend() {
  // const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // const [loading, setLoading] = useState(false)
  const bookinfo = searchParams.get('bookinfo')
  const [books, setBooks] = useState([])
  useEffect(() => {
    
    if (bookinfo) {
      // fetchData()
      const fetchData = async () => {
        try {
          const res = await pythonApi.testPythonShell({bookinfo})
          setBooks(res.listBookNLP_Final);
          // setLoading(true)
          console.log(res);
        } catch (error) {
          // setLoading(false)
          console.log(error)
        }
      }
      fetchData()
    }
  }, [bookinfo])

  return (
    <div className="main">
      <Container>
        <div className={styles.booksList}>
          <div className={styles.title}>
            <h2 className={styles.titleHeading}>Đề xuất cho bạn</h2>
          </div>
          <Row>
            {
              books ? (
                books.map(book => 
                  <Col xl={3} key={book._id}>
                    <BookItem boxShadow={true} data={book} />
                  </Col>)
              ) : 
                  // <div>
                  // <p className={styles.notfound}>Vui lòng đợi cho quá trình Training xong!</p>
                  // <Loading/>
                  // </div>
                  <LoadingAI/>
            }
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Recommend;
