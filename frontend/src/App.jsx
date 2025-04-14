import { Route } from "react-router";
import { Routes } from "react-router";
import { BrowserRouter } from "react-router";
import { Suspense, lazy } from "react";
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Signin = lazy(() => import("./pages/Signin.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const SendMoney = lazy(() => import("./pages/SendMoney.jsx"));
import Loading from "./components/Loading";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <RecoilRoot>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/send" element={<SendMoney />} />
            </Routes>
          </RecoilRoot>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
