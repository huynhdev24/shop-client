/* eslint-disable no-undef */
import { Container, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import OAuth2Login from 'react-simple-oauth2-login';
import faceIO from '@faceio/fiojs'
import authApi from '../../api/authApi';
import { login } from '../../redux/actions/auth';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

import styles from './Auth.module.css';
const faceio = new faceIO('app-public-id');
function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  const [showModal, setShowModal] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const responseSuccessGoogle = async (response) => {
   try {
    const accessToken = response?.access_token
    const { token, user } = await authApi.loginWithGoogle(accessToken)
    console.log(token, user)
    localStorage.setItem('accessToken', token)
    const { email, fullName, phoneNumber, userId, avatar, role } = user
    dispatch(login({ email, fullName, phoneNumber, avatar, userId, role }))
    navigate({ pathname: '/' })
   } catch (error) {
     console.log(error)
   }
  }

  const responseFailureGoogle = (response) => {
    console.log(response)
  }

  const responseSuccessFacebook = async (response) => {
    const accessToken = response.access_token
    // Lay Profile Facebook thong qua AccessToken

    const result = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`)
    const data = await result.json()
    console.log(data)
    const { email, id, name } = data
    const avatarFB = data?.picture?.data.url

    const { token, user } = await authApi.loginWithFacebook({email, id, name, avatar: avatarFB})
    localStorage.setItem('accessToken', token)
    const { userId, role, phoneNumber, avatar } = user
    dispatch(login({ email, fullName: name, phoneNumber, avatar, userId, role }))
    navigate({ pathname: '/' })
  }

  const responseFailureFacebook = (response) => {
    console.log(response)
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      navigate({ pathname: '/' })
    }
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await authApi.login({email, password})
      setLoading(false)
     
      // Nhan token tu server
      const { token, user } = res
      localStorage.setItem('accessToken', token)
      const { fullName, phoneNumber, userId, avatar, role } = user
      dispatch(login({ email, fullName, phoneNumber, avatar, userId, role }))
      navigate({ pathname: '/' })
      
    } catch (error) {
      setLoading(false)
      console.log(error.response.data.error)
      if (error.response.data.error === 2) {
        setShowModal(true)
      }
      console.log(error)
    }
   
  }

  const handleSendEmail = async () => {
    try {
      const { error } = await authApi.requestActiveAccount({email})
      if (!error) {
        alert("Vui lòng kiểm tra email để kích hoạt tài khoản!")
        setShowModal(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  //Login with FaceID
  let faceioInstance = null;

  useEffect(() => {
    const faceIoScript = document.createElement('script')
    faceIoScript.src = '//cdn.faceio.net/fio.js'
    faceIoScript.async = true
    faceIoScript.onload = () => faceIoScriptLoaded()
    document.body.appendChild(faceIoScript)

    return () => {
      document.body.removeChild(faceIoScript)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const faceIoScriptLoaded = () => {
    console.log(faceIO)
    if (faceIO && !faceioInstance) {
      faceioInstance = new faceIO('9fde8dac01043a497388b3546e843ac0')
    }
  }

  // Đăng ký khuôn mặt mới vào hệ thống
  const faceRegistration = async () => {
    try {
      const userInfo = await faceioInstance.enroll({
        locale: "auto",
        payload: {
          email: "huynh.it.24@gmail.com",
          userId: "2357-id-huynhit24",
          username: "huynhit24",
          website: "http://localhost:3000"
        },
      })
      console.log(userInfo)
      console.log('Unique Facial ID: ', userInfo.facialId)
      console.log('Enrollment Date: ', userInfo.timestamp)
      console.log('Gender: ', userInfo.details.gender)
      console.log('Age Approximation: ', userInfo.details.age)
    } catch (errorCode) {
      console.log(errorCode)
      handleError(errorCode)
    }
  }

  // Xác thực một khuôn mặt đã có vào hệ thống
  const faceSignIn = async () => {
    try {
      console.log(faceioInstance)
      const userData = await faceioInstance.authenticate({
        locale: "auto",
      })
      console.log(userData)
  
      console.log('Unique Facial ID: ', userData.facialId)
      console.log('PayLoad: ', userData.payload)
    } catch (errorCode) {
      console.log(errorCode)
      handleError(errorCode)
    }
  }

  const handleError = (errCode) => {
    // Log all possible error codes during user interaction..
    // Refer to: https://faceio.net/integration-guide#error-codes
    // for a detailed overview when these errors are triggered.
    // const fioErrCode={PERMISSION_REFUSED:1,NO_FACES_DETECTED:2,UNRECOGNIZED_FACE:3,MANY_FACES:4,PAD_ATTACK:5,FACE_MISMATCH:6,NETWORK_IO:7,WRONG_PIN_CODE:8,PROCESSING_ERR:9,UNAUTHORIZED:10,TERMS_NOT_ACCEPTED:11,UI_NOT_READY:12,SESSION_EXPIRED:13,TIMEOUT:14,TOO_MANY_REQUESTS:15,EMPTY_ORIGIN:16,FORBIDDDEN_ORIGIN:17,FORBIDDDEN_COUNTRY:18,UNIQUE_PIN_REQUIRED:19,SESSION_IN_PROGRESS:20}
    switch (errCode) {
      case fioErrCode.PERMISSION_REFUSED:
        console.log("Access to the Camera stream was denied by the end user")
        break
      case fioErrCode.NO_FACES_DETECTED:
        console.log("No faces were detected during the enroll or authentication process")
        break
      case fioErrCode.UNRECOGNIZED_FACE:
        console.log("Unrecognized face on this application's Facial Index")
        break
      case fioErrCode.MANY_FACES:
        console.log("Two or more faces were detected during the scan process")
        break
      case fioErrCode.PAD_ATTACK:
        console.log("Presentation (Spoof) Attack (PAD) detected during the scan process")
        break
      case fioErrCode.FACE_MISMATCH:
        console.log("Calculated Facial Vectors of the user being enrolled do not matches")
        break
      case fioErrCode.WRONG_PIN_CODE:
        console.log("Wrong PIN code supplied by the user being authenticated")
        break
      case fioErrCode.PROCESSING_ERR:
        console.log("Server side error")
        break
      case fioErrCode.UNAUTHORIZED:
        console.log("Your application is not allowed to perform the requested operation (eg. Invalid ID, Blocked, Paused, etc.). Refer to the FACEIO Console for additional information")
        break
      case fioErrCode.TERMS_NOT_ACCEPTED:
        console.log("Terms & Conditions set out by FACEIO/host application rejected by the end user")
        break
      case fioErrCode.UI_NOT_READY:
        console.log("The FACEIO Widget code could not be (or is being) injected onto the client DOM")
        break
      case fioErrCode.SESSION_EXPIRED:
        console.log("Client session expired. The first promise was already fulfilled but the host application failed to act accordingly")
        break
      case fioErrCode.TIMEOUT:
        console.log("Ongoing operation timed out (eg, Camera access permission, ToS accept delay, Face not yet detected, Server Reply, etc.)")
        break
      case fioErrCode.TOO_MANY_REQUESTS:
        console.log("Widget instantiation requests exceeded for freemium applications. Does not apply for upgraded applications")
        break
      case fioErrCode.EMPTY_ORIGIN:
        console.log("Origin or Referer HTTP request header is empty or missing")
        break
      case fioErrCode.FORBIDDDEN_ORIGIN:
        console.log("Domain origin is forbidden from instantiating fio.js")
        break
      case fioErrCode.FORBIDDDEN_COUNTRY:
        console.log("Country ISO-3166-1 Code is forbidden from instantiating fio.js")
        break
      case fioErrCode.SESSION_IN_PROGRESS:
        console.log("Another authentication or enrollment session is in progress")
        break
      case fioErrCode.NETWORK_IO:
      default:
        console.log("Error while establishing network connection with the target FACEIO processing node")
        break
    }
  }
  //


  return (
    <div className="main">
      <div className={styles.loginPage}>
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tài khoản của bạn chưa được xác minh.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleSendEmail}>
            Gửi lại Email
          </Button>
        </Modal.Footer>
      </Modal>
        <Container>
          <div className="auth-wrapper">
            <h2 className="title text-center">ĐĂNG NHẬP</h2>
            <form className="form-login" onSubmit={handleLogin}>
              <div className={`form-group ${styles.formGroup}`}>
                <input required type="text" name="email" className="form-control" placeholder="Email..."
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={`form-group ${styles.formGroup}`}>
                <input required type="password" name="password" className="form-control" autoComplete="on" placeholder="Mật khẩu..." 
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Link className={styles.forgotPassword} to="/quen-mat-khau">Quên mật khẩu?</Link>
              <button className={`bookstore-btn ${styles.submitBtn}`} disabled={loading}>{loading ? "Đăng nhập..." : "Đăng nhập"}</button>
            </form>
            <div id="faceio-modal"></div>
            <button onClick={faceSignIn} style={{backgroundColor: 'red'}} className={`bookstore-btn ${styles.submitBtn}`} disabled={loading}>{loading ? "Đăng nhập bằng FaceID..." : "Đăng nhập bằng FaceID"}</button>
            <button onClick={faceRegistration} style={{backgroundColor: 'blue'}} className={`bookstore-btn ${styles.submitBtn}`} disabled={loading}>{loading ? "Đăng ký FaceID..." : "Đăng ký FaceID"}</button>
            <p style={{textAlign: 'center'}}>
              Bạn chưa có tài khoản? <Link to="/dang-ki" style={{color: '#0074da'}}>Đăng ký tại đây</Link>
            </p>
            <p style={{color: '#ccc', textAlign: 'center'}}>HOẶC</p>
          
            <div className="d-flex justify-content-between">
              <div className={styles.boxLoginThirdParty}>
                <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png" alt="" />
                <OAuth2Login  
                    className="bookstore-btn"
                    buttonText="Login with Google"
                    authorizationUrl="https://accounts.google.com/o/oauth2/auth"
                    responseType="token"
                    // clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    // redirectUri={process.env.REACT_APP_REDIRECT_LOGIN_GOOGLE}
                    clientId="379825254848-oo4egknuid91d1rna590rtbibnpk1615.apps.googleusercontent.com"
                    redirectUri="http://localhost:3000"
                    scope="email profile"
                    onSuccess={responseSuccessGoogle}
                    onFailure={responseFailureGoogle}
                ></OAuth2Login>
              </div>

              <div className={styles.boxLoginThirdParty}>
                <img src="https://cdn.pixabay.com/photo/2015/05/17/10/51/facebook-770688_1280.png" alt="" />
                <OAuth2Login
                  className="bookstore-btn"
                  buttonText="Login with Facebook"
                  authorizationUrl="https://www.facebook.com/dialog/oauth"
                  responseType="token"
                  clientId="990086591697823"
                  redirectUri={process.env.REACT_APP_REDIRECT_LOGIN_FACEBOOK}
                  scope="public_profile"
                  onSuccess={responseSuccessFacebook}
                  onFailure={responseFailureFacebook}
                ></OAuth2Login>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Login;
