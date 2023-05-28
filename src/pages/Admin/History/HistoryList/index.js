import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom"
// import { toast } from 'react-toastify';
import PaginationBookStore from "../../../../components/PaginationBookStore";
import { FaTrashAlt, FaSearch } from "react-icons/fa"
import moment from 'moment'; // xử lý ngày tháng

import { Row, Col, Table, Spinner, Modal, Button } from "react-bootstrap";
import historyApi from "../../../../api/historyApi";
// import format from "../../../../helper/format";

function HistoryList() {
  const [historyData, setHistoryData] = useState({});
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [historyDelete, setHistoryDelete] = useState({})

  const [showModal, setShowModal] = useState(false);

  const [searchInput, setSearchInput] = useState("")
  const [searchString, setSearchString] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const query = {
          action: { "$regex": searchString, "$options": "$i" }
        }
        const res = await historyApi.getAll({ query, page: page, limit: 10 });
        console.log(res.data);
        console.log('history list: ' + JSON.stringify(res));
        setLoading(false);
        setHistoryData({ history: res.data, totalPage: res.pagination.totalPage });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchData();
  }, [page, searchString]);


  const handleChangePage = useCallback((page) => {
    setPage(page);
  }, []);

  const handleCallApiDelete = async (e) => {
    try {
      await historyApi.delete(historyDelete._id)
      setShowModal(false)
      setHistoryData((preState) => {
        const newArray = [...preState.history];
        return {
          ...preState,
          history: newArray.filter((item) => item._id !== historyDelete._id)
        }
      });
    } catch (error) {
      alert("Xóa thất bại!")
      setShowModal(false)
    }
  }

  // const handleCallApiDeleteAll = async (e) => {
  //   try {
  //     await historyApi.delete(historyDelete._id)
  //     setHistoryData((preState) => {
  //       const newArray = [...preState.history];
  //       return {
  //         ...preState,
  //         history: newArray.filter((item) => item._id !== historyDelete._id)
  //       }
  //     });
  //   } catch (error) {
  //     alert("Xóa thất bại!")
  //   }
  // }

  return (
    <Row>
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa lịch sử</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc xóa lịch sử <b>{historyDelete && historyDelete?.name}</b> này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleCallApiDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <div className="admin-content-wrapper">
          <div className="admin-content-header">Lịch sử Hệ thống</div>
          <div className="admin-content-action">
            <div className="d-flex">
              <input className="form-control search" placeholder="Tìm kiếm ..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
              <Button type="button" style={{color: "white"}} variant="info"
                onClick={() => {
                  setSearchString(searchInput)
                  setPage(1)
                }}
                >
                  <FaSearch />
              </Button>
              {/* <Button type="button" style={{color: "white"}} variant="info"
                onClick={() => {
                  handleCallApiDeleteAll()
                }}
                >
                  <FaTrashAlt />
              </Button> */}
            </div>
          </div>
          <div className="admin-content-body">
            <Table hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Hoạt động</th>
                  <th>Kiểu</th>
                  <th>Ghi chú</th>
                  <th>Ngày</th>
                  <th>Liên kết</th>
                  <th>UserID</th>
                  <th colSpan="2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <Spinner
                        animation="border"
                        variant="success"
                      />
                    </td>
                  </tr>
                ) : historyData.history && historyData.history.length > 0 ? (
                  historyData.history.map((item, index) => {
                    return (
                      <tr key={item._id}>
                        <td>{(1 && page - 1) * 10 + (index + 1)}</td>
                        <td className="text-start" style={{width: 500}}>
                          {item.action}
                        </td>
                        <td>
                          {item.type}
                        </td>
                        <td>
                          {item.title}
                        </td>
                        <td>
                          <p>{moment(item?.createdAt).format('DD-MM-yyyy HH:mm:ss')}</p>
                          {moment(item.createdAt).isSame(moment(), 'day') && (
                             <span style={{backgroundColor: "#ff709e"}} className="badge">{moment(item?.createdAt).fromNow()}</span>
                          )}
                        </td>
                        <td>
                          <Link to={item.link}>
                            <p>
                                {item.link}
                            </p>
                          </Link>
                        </td>
                        <td>{item.user}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              setHistoryDelete(item)
                              setShowModal(true)
                            }}
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7}>Không có dòng lịch sử thao tác nào!</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className="admin-content-pagination">
              <Row>
                <Col xl={12}>
                  {historyData.totalPage > 1 ? (
                    <PaginationBookStore
                      totalPage={historyData.totalPage}
                      currentPage={page}
                      onChangePage={handleChangePage}
                    />
                  ) : null}
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default HistoryList;
