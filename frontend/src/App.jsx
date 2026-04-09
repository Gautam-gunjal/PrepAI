import AppRoutes from "./AppRoutes"
import AuthProvider from "./features/auth/auth.context"
import { InterviewProvider } from "./features/interview/interview.context"
import { ToastContainer } from "react-toastify";

function App() {


  return (
    <>
      <AuthProvider>
        <InterviewProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="dark"
          />
          <AppRoutes></AppRoutes>
        </InterviewProvider>
      </AuthProvider>
    </>
  )
}

export default App
