import * as React from 'react';
import { Component } from 'react';
import Dropzone from 'react-dropzone';

import { API_ENDPOINT } from '../config';

import * as request from 'superagent';

interface Props {
  onUploadComplete: (info: any) => void;
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
    action: API_ENDPOINT + 'api/upload',
    headers: {
      'content-type': 'multipart/form-data'
    },
    multiple: false,
    name: 'file'
  };

  public render() {
    return (
      <Dropzone style={{ width: '100%' }} onDrop={this.handleFileDrop}>
        <div className="ant-upload ant-upload-drag">
          <span className="ant-upload ant-upload-btn" role="button">
            <div className="ant-upload-drag-container">
              <p className="ant-upload-drag-icon">
                <i className="anticon anticon-inbox" />
              </p>
              <p className="ant-upload-text">
                Click or drag a file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Only a single .stl file is supported for now
              </p>
            </div>
          </span>
        </div>
      </Dropzone>
    );
  }

  private handleFileDrop = (acceptedFiles: any[]) => {
    // Basic file check
    if (!acceptedFiles || acceptedFiles.length === 0) {
      return;
    }

    if (!acceptedFiles[0].name.endsWith('.stl')) {
      return;
    }

    this.performUpload(acceptedFiles[0]);
  };

  private performUpload = (file: any) => {
    request
      .post(API_ENDPOINT + 'api/upload')
      .set({ 'Access-Control-Allow-Origin': '*' })
      .attach('stl', file)
      .then(response => JSON.parse(response.text))
      .then(info => this.props.onUploadComplete(info));
  };
}
