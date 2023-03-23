import Header from './components/layout/Header';
import { Layout } from 'antd';
import Footer from './components/layout/Footer';
import { Outlet } from 'react-router-dom';
import './App.scss';
import { useEffect, useState } from 'react';
import { getRequest } from './api';

function App() {
  const [user, setUser] = useState({ first_name: '' });

  const fetchUser = async () => {
    const { data } = await getRequest('/api/users/me');
    setUser(data);
  };

  useEffect(() => {
    if (!localStorage.getItem('access')) return;

    fetchUser();
  }, []);

  return (
    <>
      <Layout className="layout">
        <Header user={user} setUser={setUser} />
        <Layout.Content className="main-section">
          <Outlet context={{ setUser, user }} />
        </Layout.Content>
        <Footer />
      </Layout>
    </>
  );
}

export default App;
