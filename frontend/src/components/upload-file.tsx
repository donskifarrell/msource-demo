import Icon from 'antd/lib/icon';
import Dragger from 'antd/lib/upload/Dragger';
import * as React from 'react';
import { Component } from 'react';

interface Props {
  onChange: (info: any) => void;
}

interface State {
  name: string;
  multiple: boolean;
  action: string;
  accept: string;
}

export class UploadFile extends Component<Props, State> {
  public state = {
    accept: '.stl',
    action: '//jsonplaceholder.typicode.com/posts/',
    multiple: false,
    name: 'file'
  };

  public render() {
    return (
      <Dragger {...this.props} {...this.state}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">
          Click or drag a file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Only a single .stl file is supported for now
        </p>
      </Dragger>
    );
  }
}
