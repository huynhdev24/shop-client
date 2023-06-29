import { Container, Row, Col } from "react-bootstrap";
import BookItem from "../../components/Shop/BookItem";
// import bookApi from "../../api/bookApi";
// eslint-disable-next-line
import pythonApi from '../../api/pythonApi';
// eslint-disable-next-line
import { useAsyncEffect, useEffect, useState } from "react";
import styles from './Recommend.module.css'
import { useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading"
// import { useNavigate } from 'react-router-dom';

//recommend 
// eslint-disable-next-line
import recommendApi from '../../api/recommendApi';
// import { AiFillSave } from 'react-icons/ai';
// eslint-disable-next-line
import { toast } from 'react-toastify';
function Recommend() {
  // const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // const [loading, setLoading] = useState(false)
  const bookinfo = searchParams.get('bookinfo')
  const limit = searchParams.get('limit')
  const [books, setBooks] = useState([])
  useEffect(() => {
    
    if (bookinfo) {
      // fetchData()
      const fetchData = async () => {
        try {
          // const res = await pythonApi.testPythonShell({bookinfo})

          //Cách 1: Dùng Python
          // const id = bookinfo;
          // const res = await recommendApi.getById(id)
          // setBooks(res.listBookNLP_Final);
          
          //Cách 2: Dùng Javascript
          const key = bookinfo;
          const res = await recommendApi.getDataNLPById({key})
          setBooks(res.listBookNLP_Final);
        } catch (error) {
          // setLoading(false)
          console.log(error)
        }
      }
      fetchData()
    }
  }, [bookinfo, limit])

  //recommend Cache
  // const [recommendData, setRecommendData] = useState([])
  // const handleSaveRecommendCache = async () => {
  //   try {
  //     if(bookinfo){
  //       const res = await recommendApi.create({productRecommendId: bookinfo, product: books});
  //       if(res.status === 400) {
  //         toast.error(res.message, {autoClose: 2000})
  //       }else{
  //         if(res.status === 201) {
  //           toast.success(res.message, {autoClose: 2000})
  //         }
  //       }
  //     }else{
  //       toast.error("Danh sách Training rỗng!", {autoClose: 2000})
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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
                  <Loading/>
            }
          </Row>
        </div>
        {/* <div style={{alignItems: 'center', textAlign: 'center'}}>
          <button style={{backgroundColor: 'red', borderRadius: '4px', color: 'white', padding: '10px', fontWeight: 'bold'}} onClick={handleSaveRecommendCache}>
            <span>Lưu kết quả training ✅</span>
          </button>
        </div> */}
      </Container>
    </div>
  );
}

export default Recommend;
