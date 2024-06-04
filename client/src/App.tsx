import {
BrowserRouter as Router ,Routes , Route
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader } from "./components/Loader";
import NavBar from "./pages/Navbar/NavBar";


const Clients= lazy(()=> import("./pages/Home/Clients"));
const Projects= lazy(()=> import("./pages/Home/Projects"))


const App = () => {
  return (
    <>
    <Router>
      {/* Header */}
      <NavBar />
      <Suspense fallback={<Loader/>}>    
        <Routes>
          <Route path='/' element={<Clients />} ></Route>
          <Route path='/projects' element={<Projects />} ></Route>
        </Routes>
      </Suspense>
    </Router>
    </>
  )
}

export default App
