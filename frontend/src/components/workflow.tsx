import { Steps } from 'antd';
import * as React from 'react';
import { Component } from 'react';
import { UploadFile } from './upload-file';
const Step = Steps.Step;

interface State {
  current: STEP;
}

enum STEP {
  UPLOAD,
  PRICING,
  CONFIRM
}

export class Workflow extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      current: STEP.UPLOAD
    };
  }

  public render() {
    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          <Step key={STEP.UPLOAD} title="Upload .STL file" />
          <Step key={STEP.PRICING} title="Pricing" />
          <Step key={STEP.CONFIRM} title="Confirm" />
        </Steps>

        <div className="steps-content">
          {this.state.current === STEP.CONFIRM
            ? this.renderConfirmStep()
            : this.state.current === STEP.PRICING
              ? this.renderPricingStep()
              : this.renderUploadStep()}
        </div>
        {/* <div className="steps-action">
          {this.state.current < steps.length - 1 && (
            <Button type="primary" onClick={this.next}>
              Next
            </Button>
          )}
          {this.state.current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success('Processing complete!')}
            >
              Done
            </Button>
          )}
          {this.state.current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={this.prev}>
              Previous
            </Button>
          )}
        </div> */}
      </div>
    );
  }

  private renderUploadStep = () => {
    return <UploadFile onChange={this.uploadFileHandler} />;
  };

  private renderPricingStep = () => {
    return <div>PRICING</div>;
  };

  private renderConfirmStep = () => {
    return <div>COnfirm</div>;
  };

  // private next = () => {
  //   const current = this.state.current + 1;
  //   this.setState({ current });
  // };

  // private prev = () => {
  //   const current = this.state.current - 1;
  //   this.setState({ current });
  // };

  private uploadFileHandler = (info: any) => {
    const status = info.file.status;
    if (status !== 'uploading') {
      // tslint:disable-next-line:no-console
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      // tslint:disable-next-line:no-console
      console.log(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      // tslint:disable-next-line:no-console
      console.log(`${info.file.name} file upload failed.`);
    }
  };
}
