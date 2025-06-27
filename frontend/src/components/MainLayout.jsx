import { Outlet } from 'react-router-dom';
import NavigationComponent from './Navigation/NavigationComponent'

const MainLayout = () => {
  return (
    <div className="app">
      <header className="header">
          <NavigationComponent></NavigationComponent>
      </header>

      <main className="content">
        <Outlet /> 
      </main>

      <footer className="footer">
        
      </footer>
    </div>
  );
};

export default MainLayout;