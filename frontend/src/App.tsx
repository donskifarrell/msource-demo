import * as React from 'react';

import { Breadcrumb, Layout } from 'antd';
const { Header, Content, Footer } = Layout;

import Divider from 'antd/lib/divider';
import { Uploads } from './components/uploads';
import { Workflow } from './components/workflow';

import './App.css';

class App extends React.Component {
  public render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo">
            <img src={process.env.PUBLIC_URL + '/app-logo-black.png'} />
          </div>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>3D Printing</Breadcrumb.Item>
            <Breadcrumb.Item>Pricing</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Uploads
              render={prevUploads => {
                return (
                  <>
                    <Workflow />
                    <Divider orientation="left">Previous uploads</Divider>
                    {/* TODO: List of previous uploads */}
                  </>
                );
              }}
            />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Manufacturing Source Demo ©2018 Created by Donal Farrell
        </Footer>
      </Layout>
    );
  }
}

export default App;
