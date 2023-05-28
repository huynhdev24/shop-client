import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Table, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import PaginationBookStore from "../../components/PaginationBookStore";
import moment from "moment";
import historyApi from "../../api/historyApi";

export default function History() {
  const { userId } = useSelector((state) => state.auth);
  console.log(userId);
  const [historyData, setHistoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleChangePage = useCallback((page) => {
    setPage(page);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data, pagination } = await historyApi.getAll({
          userId: userId,
          page: page,
          limit: 5,
        });
        setLoading(false);
        setHistoryData({ histories: data, totalPage: pagination.totalPage });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (userId) {
      fetchHistory();
    }
  }, [userId, page]);

  return (
    <div>
      <div style={{border: "1px solid #ccc", fontSize: 13}}>
        <Table hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Hoạt động</th>
              <th>Kiểu</th>
              <th>Ghi chú</th>
              <th>Ngày</th>
              <th>Liên kết</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <Spinner animation="border" variant="success" />
                </td>
              </tr>
            ) : historyData?.histories && historyData?.histories?.length > 0 ? (
              historyData.histories.map((item, index) => {
                return (
                  <tr key={item._id}>
                    <td>{(1 && page - 1) * 10 + (index + 1)}</td>
                    <td className="text-start" style={{ fontSize: 14 }}>
                        <p>
                            {item.action}
                        </p>
                    </td>
                    <td>
                        <p>
                            {item.type}
                        </p>
                    </td>
                    <td>
                        <p>
                            {item.title}
                        </p>
                    </td>
                    <td style={{ fontSize: 14 }}>
                      {moment(item?.createdAt).format("DD-MM-yyyy HH:mm:ss")}
                    </td>
                    <td>
                        <Link to={item.link}>
                          <p>
                              {item.link}
                          </p>
                        </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6}>Không có lịch sử!</td>
              </tr>
            )}
          </tbody>
        </Table>
        {historyData?.totalPage > 1 ? (
          <div className="admin-content-pagination">
            <Row>
              <Col xl={12}>
                <PaginationBookStore
                  totalPage={historyData.totalPage}
                  currentPage={page}
                  onChangePage={handleChangePage}
                />
              </Col>
            </Row>
          </div>
        ) : null}
      </div>
    </div>
  );
}
