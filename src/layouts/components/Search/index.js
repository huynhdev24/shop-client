import { memo, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BsSearch } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { Container, Spinner } from "react-bootstrap";
import SearchResultItem from "./SearchResultItem.js";
import useDebounce from "../../../hooks/useDebounce"
import bookApi from "../../../api/bookApi"
import styles from "./Search.module.css"
import { Row, Col} from 'react-bootstrap';
// import { Link } from "react-router-dom";
// import Icon1 from '../../../assets/icons/IconT4_F3.png';
// import Icon2 from '../../../assets/icons/Icon_FlashSale_Hot_8px_1.png';
// import Icon3 from '../../../assets/icons/Icon_KinhTe_8px_1.png';
// import Icon4 from '../../../assets/icons/Icon_MaGiamGia_8px_1.png';
// import Icon5 from '../../../assets/icons/Icon_MangaCommic_8px_1.png';
// import Icon6 from '../../../assets/icons/Icon_PhienChoCu_8px_1.png';
// import Icon7 from '../../../assets/icons/Icon_SanPhamMoi_8px_1.png';
// import Icon8 from '../../../assets/icons/Icon_Trending_Hot_8px_1.png';
// import Icon9 from '../../../assets/icons/Icon_VanHoc_50.png';
// import Icon10 from '../../../assets/icons/TamLyKyNang_50.png';
// import Cate1 from '../../../assets/categories/8935246917176.jpg';
// import Cate2 from '../../../assets/categories/Manga.jpg';
// import Cate3 from '../../../assets/categories/T_m_linh.jpg';
// import Cate4 from '../../../assets/categories/Th_c_T_nh.jpg';
// import Cate5 from '../../../assets/categories/Thao_t_ng.jpg';
// import Cate6 from '../../../assets/categories/Ti_u_Thuy_t.jpg';
// import Cate7 from '../../../assets/categories/_am_m_.jpg';
// import Cate8 from '../../../assets/categories/lightnovel.jpg';
// import Cate9 from '../../../assets/categories/8935246917176.jpg';
// import Cate10 from '../../../assets/categories/8935246917176.jpg';

function Search() {

  const navigate = useNavigate()

  const [key, setKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchResult, setSearchResult] = useState([])
  const [showResult, setShowResult] = useState(false)
  const debounced = useDebounce(key, 1000)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!debounced.trim()) {
          setSearchResult([])
          return
        }
        setLoading(true)
        const res = await bookApi.search({key: debounced, limit: 10})
        let resRev = null;
        setLoading(false)
        if(res === null || res === undefined) {
          resRev = await bookApi.search({key: reverse(debounced), limit: 10})
          setSearchResult(resRev.data)
        } else {
          setSearchResult(res.data)
        }
        setShowResult(true)
        console.log(res.data)
        //localstorage
        // const listTokenFromKeySearch = key.split(" ");
        localStorage.setItem('ListTokenKeySearch', debounced);
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    fetchData()
  }, [debounced])

  const handleSubmitSearch = (e) => {
    e.preventDefault()
    setShowResult(false)
    if (!key.trim()) {
      return
    }
    navigate({
      pathname: '/tim-kiem',
      search: `key=${key}`
    })
   
  }

  function reverse(s){
    return s.split("").reverse().join("");
  }

  return (
    <>
      <form onSubmit={handleSubmitSearch}>
        <div className={styles.searchWrapper}>
          <button className={`bookstore-btn ${styles.searchBtn}`}>
            <BsSearch />
          </button>
          <button type="button" onClick={() => setKey("")} className={`bookstore-btn ${styles.resetKey} ${key && !loading ? styles.active : ""}`}>
            <IoClose />
          </button>
          {loading && <div className={styles.loading}>
            <Spinner animation="border" variant="success" size="sm" />
          </div>}
          <div className="form-group">
            <input
              type="text"
              className={`form-control ${styles.formControl}`}
              placeholder="Tìm kiếm sản phẩm..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onBlur={() => setShowResult(false)}
              onFocus={() => setShowResult(true && searchResult.length > 0)}
            />
          </div>
          {showResult && searchResult && searchResult.length > 0 && (
            <div className={styles.resultSearch} onMouseDown={(e) => {e.preventDefault()}}
              onClick={() => setShowResult(false)}
            >
              {/* witdh: '1000px'} */}
              <Container style={{overflowY: 'scroll', height: '500px'}}>
                <Row>
                  <Col style={{borderRight: '1px solid red'}}>
                    {searchResult.map(book => <SearchResultItem key={book._id} data={book} />)}
                  </Col>
                  {/* <Col className={styles.hiddenRecommend}>
                    <p style={{margin: '10px', fontWeight: 'bold', fontSize: '20px', textAlign: 'center'}}>Các cuốn sách đề xuất cho bạn</p>
                    <Row style={{marginTop: '28px' ,marginBottom: '28px', textAlign: 'center'}}>
                      <Col xl={3} style={{margin: '10px'}}>
                        <Link to='/'>
                          <img src={Cate1} alt='icon 1'/>
                          Mind map English Grammar
                        </Link>
                      </Col>
                      <Col xl={3} style={{margin: '10px'}}>
                        <Link to='/'>
                          <img src={Cate2} alt='icon 2'/>
                          Manga Conan
                        </Link>
                      </Col>
                      <Col xl={3} style={{margin: '10px'}}>
                        <Link to='/'>
                          <img src={Cate3} alt='icon 3'/>
                          Muôn kiếp nhân sinh
                        </Link>
                      </Col>
                      <Col xl={3} style={{margin: '10px'}}>
                        <Link to='/'>
                          <img src={Cate4} alt='icon 4'/>
                          Hành trình của 1 kẻ nghĩ nhiều
                        </Link>
                      </Col>
                      <Col xl={3} style={{margin: '10px'}}>
                        <Link to='/'>
                          <img src={Cate5} alt='icon 5'/>
                          Tâm lý học tội phạm
                        </Link>
                      </Col>
                      <Col xl={3} style={{margin: '10px'}}>
                        <Link to='/'>
                          <img src={Cate6} alt='icon 6'/>
                          Cây cam mới của tôi
                        </Link>
                      </Col>
                    </Row>
                  </Col> */}
                </Row>
              </Container>
            </div>
          )}
        </div>
      </form>
    </>
  );
}

export default memo(Search);


