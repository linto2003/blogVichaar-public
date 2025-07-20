import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from './Navbar';
const MainLayout = () => {
    return (
    <>
    <Navbar/>
        <main className="App">
            <Outlet/>
        </main>
    <Footer/>
    </>
    )
}

export default MainLayout