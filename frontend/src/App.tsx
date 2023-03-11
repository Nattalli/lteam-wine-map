import Header from './components/layout/Header';
import { Layout } from 'antd';
import Footer from './components/layout/Footer';
import { Outlet } from 'react-router-dom';
import './App.scss';

function App() {
  return (
    <>
      <Layout className="layout">
        <Header />
        <Layout.Content className="main-section">
          <Outlet />
        </Layout.Content>
        <Footer />
      </Layout>
    </>
  );
}

export default App;
