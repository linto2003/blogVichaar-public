import './css/App.css';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import {Routes, Route} from 'react-router-dom';
import RequireAuth from './pages/RequireAuth.jsx';
import Layout from './components/Layout.jsx';
import UserProfile from './pages/User.jsx';
import PersistentLogin from './components/PersistentLogin.jsx';
import MainLayout from './components/MainLayout.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import CreateBlog from './pages/CreateBlog.jsx';
import MyBlogs from './pages/MyBlogs.jsx';
import EditBlogSections from './pages/EditBlog.jsx';
import SearchResults from './pages/SearchResult.jsx';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2197482294942971";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    }, []);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/>
      </Route>

      <Route  element={<MainLayout/>}>
        <Route element={<PersistentLogin/>}>
          <Route path='/' element={<Home />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/srch" element={<SearchResults />} />
            <Route element={<RequireAuth/>}>
              <Route path="profile" element={<UserProfile />} />
              <Route path="blog/edit/:id" element={<EditBlogSections/>}/>
              <Route path="write" element={<CreateBlog/>}/>
              <Route path="my-blogs" element={<MyBlogs/>}/>
            </Route>
          </Route>
      </Route>
      
    </Routes>
  );
}

export default App;
