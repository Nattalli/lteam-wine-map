import Header from './components/layout/Header';
import { Layout } from 'antd';
import Footer from './components/layout/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <Layout>
        <Header />
        <Layout.Content>
          <Outlet />
        </Layout.Content>
        <Footer />
      </Layout>
    </>
  );
}

export default App;
