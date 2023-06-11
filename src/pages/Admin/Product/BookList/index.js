import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { toast } from 'react-toastify';
import PaginationBookStore from "../../../../components/PaginationBookStore";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa"
import { CgImport, CgExport } from "react-icons/cg";
import BackgroundImportCSV from '../../../../assets/images/csv-import-books.jpg';
import { Row, Col, Table, Spinner, Modal, Button } from "react-bootstrap";
import bookApi from "../../../../api/bookApi";
import importCSVApi from "../../../../api/importCSVApi";
import format from "../../../../helper/format";
// eslint-disable-next-line
import { FileUploader } from "react-drag-drop-files";
import recommendApi from "../../../../api/recommendApi";
function BookList() {
  const [bookData, setBookData] = useState({});
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [bookDelete, setBookDelete] = useState({})

  const [showModal, setShowModal] = useState(false);

  const [searchInput, setSearchInput] = useState("")
  const [searchString, setSearchString] = useState("")

  //Import Export CVS Excel to MongoDB
  const [showModalImportCSV, setShowModalImportCSV] = useState(false);
  // eslint-disable-next-line
  const fileTypes = ["CSV"];

  //end


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const query = {
          name: { "$regex": searchString, "$options": "$i" }
        }
        const res = await bookApi.getAll({ query, page: page, limit: 10 });
        setLoading(false);
        setBookData({ books: res.data, totalPage: res.pagination.totalPage });
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
      const { data: orders } = await bookApi.checkIsOrdered(bookDelete._id)
      if (orders.length > 0) {
        toast.error('Sản phẩm đã được mua, không thể xóa!', {autoClose: 2000})
        return
      }
      await bookApi.delete(bookDelete._id)
      toast.success("Xóa thành công!", {autoClose: 2000})
      setShowModal(false)
      setBookData((preState) => {
        const newArray = [...preState.books];
        return {
          ...preState,
          books: newArray.filter((item) => item._id !== bookDelete._id)
        }
      });
    } catch (error) {
      alert("Xóa thất bại!")
      setShowModal(false)
    }
  }

  //Import Export CVS
  const handleImportCSV = async (e) => {
    try {
      const formData = new FormData();
      formData.append("name", fileCSV[0].name);
      formData.append("file", fileCSV[0]);
      console.log(fileCSV);
      console.log(formData);
      const res = await importCSVApi.importBookCSV(formData);
      console.log(res);
      if(res.data.status === 400) {
        toast.error('Không nhập được file Book Excel!', {autoClose: 2000})
        return
      }
      toast.success("Nhập sách thành công!", {autoClose: 2000})
      setShowModalImportCSV(false);
    } catch (error) {
      // alert("Nhập sách thất bại!");
      console.log("Nhập sách thất bại");
      setShowModalImportCSV(false);
    }
  }

  const [fileCSV, setFileCSV] = useState("");
  const handleChangeFileCSV = (fileCSV) => {
    setFileCSV(fileCSV);
  };
  //end

  //export CSV
  const handleExportCSV = async () => {
    try {
      const res = await importCSVApi.exportBookCSV();
      const resDelCache = await recommendApi.deleteAll();
      console.log(resDelCache);
      if(res.data.status === 400) {
        toast.error('Không xuất được file Book Excel!', {autoClose: 2000})
        return
      }
      toast.success("Xuất file CSV sách thành công!", {autoClose: 2000})
    } catch (error) {
      console.log("Xuất file CSV sách thất bại!");
    }
  }
  return (
    <Row>
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc xóa sách <b>{bookDelete && bookDelete?.name}</b> này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleCallApiDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal: Import Export CVS Excel to MongoDB */}
      <Modal size="md" show={showModalImportCSV} onHide={() => setShowModalImportCSV(false)}>
      {/* <form encType="multipart/form-data" onSubmit={handleImportCSV}> */}
        <Modal.Header closeButton>
          <Modal.Title>
            Nhập sách - Kéo thả file CSV vào đây?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FileUploader
              multiple={true}
              handleChange={handleChangeFileCSV}
              name="file"
              // types={fileTypes}
              type="file"
            >
              <img src={BackgroundImportCSV} style={{width: '468px', height: '400px'}} alt="background-import-cvs"/>
              <p>{fileCSV ? `File name: ${fileCSV[0].name}` : "no files uploaded yet"}</p>
            </FileUploader>
            {/* <img src={BackgroundImportCSV} style={{width: '468px', height: '400px'}} alt="background-import-cvs"/>
            <input type="file" name="file" value={fileCSV.name} onChange={handleChangeFileCSV}></input>
            <p>{fileCSV ? `Tên file: ${fileCSV}` : "Chưa có file được tải lên!"}</p> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalImportCSV(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleImportCSV}>
            Nhập sách
          </Button>
        </Modal.Footer>
      {/* </form> */}
      </Modal>
      {/* end */}
      <Col xl={12}>
        <div className="admin-content-wrapper">
          <div className="admin-content-header">Danh sách sản phẩm</div>
          <div className="admin-content-action">
            <div className="d-flex">
              <input className="form-control search" placeholder="Tìm kiếm" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
              <Button type="button" style={{color: "white"}} variant="info"
                onClick={() => {
                  setSearchString(searchInput)
                  setPage(1)
                }}
                >
                  <FaSearch />
              </Button>
              <Button type="button" style={{backgroundColor: 'green', color: "white", marginLeft: '20px', marginRight: '20px'}} variant="info"
                // onClick={() => {
                //   setSearchString(searchInput)
                //   setPage(1)
                // }}
                onClick={handleExportCSV}
                >
                  <CgImport /> Xuất Excel
              </Button>
              <Button type="button" style={{backgroundColor: 'blue', color: "white"}} variant="info"
                onClick={() => setShowModalImportCSV(true)}
                >
                  <CgExport /> Nhập Sách
              </Button>
            </div>
          </div>
          <div className="admin-content-body">
            <Table hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sách</th>
                  <th>Thể loại</th>
                  <th>Xuất bản</th>
                  <th>Giá</th>
                  <th>Khuyến mãi (%)</th>
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
                ) : bookData.books && bookData.books.length > 0 ? (
                  bookData.books.map((item, index) => {
                    return (
                      <tr key={item._id}>
                        <td>{(1 && page - 1) * 10 + (index + 1)}</td>
                        <td className="text-start" style={{width: 500}}>
                          {item.name} - {format.arrayToString(item.author || [])}
                        </td>
                        <td>
                          {format.arrayToString(item.genre || [])}
                        </td>
                        <td>
                          {item.publisher?.name} - {item.year}
                        </td>
                        <td className="price">{format.formatPrice(item.price)}</td>
                        <td>{item.discount}</td>
                        <td>
                          <Link
                            to={`/admin/book/update/${item._id}`}
                            className="btn btn-warning"
                            data-id={item._id}
                          >
                            <FaEdit />
                          </Link>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              setBookDelete(item)
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
                    <td colSpan={7}>Không có sản phẩm nào!</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className="admin-content-pagination">
              <Row>
                <Col xl={12}>
                  {bookData.totalPage > 1 ? (
                    <PaginationBookStore
                      totalPage={bookData.totalPage}
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

export default BookList;
