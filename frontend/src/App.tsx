import * as React from 'react';

import { Breadcrumb, Layout } from 'antd';
const { Header, Content, Footer } = Layout;

import { Uploads } from './components/uploads';
import { Workflow } from './components/workflow';

import logo from './app-logo-black.png';
import './App.css';

class App extends React.Component {
  public render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo">
            <img src={logo} />
          </div>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>3D Printing</Breadcrumb.Item>
            <Breadcrumb.Item>Get a Quote</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Uploads
              render={prevUploads => {
                return (
                  <>
                    <Workflow />
                    {/* TODO: List of previous uploads */}
                    {/* <Divider orientation="left">Previous uploads</Divider> */}
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
