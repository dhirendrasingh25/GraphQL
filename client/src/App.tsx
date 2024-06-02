import {
BrowserRouter as Router ,Routes , Route
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader } from "./components/Loader";
import NavBar from "./pages/Navbar/NavBar";
// import Project from "./pages/Project";

const Home = lazy(()=> import("./pages/Home/Home"));


const App = () => {
  return (
    <>
    <Router>
      {/* Header */}
      <NavBar />
      <Suspense fallback={<Loader/>}>    
        <Routes>
          <Route path='/' element={<Home />} ></Route>
        </Routes>
      </Suspense>
    </Router>
    </>
  )
}

export default App
