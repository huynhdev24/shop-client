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
import { toast } from 'react-toastify';
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
          // const res = await pythonApi.testPythonShell({bookinfo})

          //Cách 1
          // const id = bookinfo;
          // const res = await recommendApi.getById(id)
          // setBooks(res.listBookNLP_Final);

          // setBooks(resCheck.data.product);
          // if(!resCheck){
          //   const res = await pythonApi.testPythonShell({bookinfo})
          //   setBooks(res.listBookNLP_Final);
          //   console.log(res);
          // }
          // if(resCheck){
          //   setBooks(resCheck.data.product);
          //   // return
          // }
          // else{
          //     const res = await pythonApi.testPythonShell({bookinfo})
          //     setBooks(res.listBookNLP_Final);
          //   // console.log(res);
          // }
          //Cách 2
          // const res = await pythonApi.testPythonShell({bookinfo})
          // setBooks(res.listBookNLP_Final);
          // console.log(res);
          // setLoading(true)
          // console.log(res);
          
          //Cách 3
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
  }, [bookinfo])

  //recommend Cache
  // const [recommendData, setRecommendData] = useState([])
  const handleSaveRecommendCache = async () => {
    try {
      // setRecommendData();
      // if(bookinfo === null || books === null) {
      //   toast.error("Danh sách Training rỗng!", {autoClose: 2000})
      //   return
      // }
      if(bookinfo){
        const res = await recommendApi.create({productRecommendId: bookinfo, product: books});
        if(res.status === 400) {
          toast.error(res.message, {autoClose: 2000})
        }else{
          if(res.status === 201) {
            toast.success(res.message, {autoClose: 2000})
          }
        }
      }else{
        toast.error("Danh sách Training rỗng!", {autoClose: 2000})
      }
      // const res = await ratingApi.getAverage({user: currentUser.userId, product: bookData._id});
      // setAverageRatings(res.data)
    } catch (error) {
      console.log(error);
    }
  }

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
                  // (
                  //   <div>
                  //     <button style={{backgroundColor: 'red'}} className={styles.buyBtn} onClick={handleSaveRecommendCache}>
                  //       <AiOutlineSave className={styles.buyBtn} />
                  //       Lưu kết quả training
                  //     </button>
                  //   </div>
                  // )
              ) : 
                  // <div>
                  // <p className={styles.notfound}>Vui lòng đợi cho quá trình Training xong!</p>
                  // <Loading/>
                  // </div>
                  <Loading/>
            }
          </Row>
        </div>
        <div style={{alignItems: 'center', textAlign: 'center'}}>
          <button style={{backgroundColor: 'red', borderRadius: '4px', color: 'white', padding: '10px', fontWeight: 'bold'}} onClick={handleSaveRecommendCache}>
            <span>Lưu kết quả training ✅</span>
            {/* <AiFillSave style={{marginRight: '10px', height: '24px', width: '24px'}}></AiFillSave>  */}
          </button>
        </div>
      </Container>
    </div>
  );
}

export default Recommend;
