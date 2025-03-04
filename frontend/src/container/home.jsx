import Header from '../components/Header';
import ClassroomGrid from '../components/ClassroomGrid/ClassroomGrid';
import { LocalContextProvider } from '../context/context';
import './home.css';

const Home = () => {
  return (
    <LocalContextProvider>
      <div className="home-container">
        <Header />
        <main className="home-main">
          <ClassroomGrid />
        </main>
      </div>
    </LocalContextProvider>
  );
};

export default Home;