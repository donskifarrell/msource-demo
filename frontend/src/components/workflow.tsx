import { Icon, Steps } from 'antd';
import Button from 'antd/lib/button/button';
import * as React from 'react';
import { Component } from 'react';
import { UploadFile } from './upload-file';
const Step = Steps.Step;

interface State {
  current: STEP;
  updatingPrice: boolean;
  quotePrice: number;
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
      current: STEP.UPLOAD,
      quotePrice: 0,
      updatingPrice: false
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
          {this.state.current === STEP.CONFIRM ? (
            this.renderConfirmStep()
          ) : this.state.current === STEP.PRICING ? (
            this.renderPricingStep()
          ) : (
            <UploadFile onChange={this.uploadFileHandler} />
          )}
        </div>
      </div>
    );
  }

  private renderPricingStep = () => {
    return (
      <div className="pricing-actions">
        <Button type="primary" onClick={() => this.to(STEP.UPLOAD)}>
          <Icon type="left" />Back
        </Button>

        <div className="pricing-actions__right">
          <h3>
            Latest Quote:{' '}
            <strong>
              {this.state.quotePrice.toLocaleString(
                'en-GB',
                { style: 'currency', currency: 'GBP' }
              )}
            </strong>
          </h3>
          <Button
            type="danger"
            loading={this.state.updatingPrice}
            onClick={this.getPricingQuote}
          >
            Refresh Quote
          </Button>

          <Button type="primary" onClick={() => this.to(STEP.CONFIRM)}>
            Confrm<Icon type="right" />
          </Button>
        </div>
      </div>
    );
  };

  private renderConfirmStep = () => {
    return (
      <div className="pricing-actions">
        <Button type="primary" onClick={() => this.to(STEP.PRICING)}>
          <Icon type="left" />Back
        </Button>
      </div>
    );
  };

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
    this.setState({ current: STEP.PRICING });
  };

  private getPricingQuote = () => {
    this.setState({ quotePrice: 100.97 });
  };

  private to = (step: STEP) => {
    this.setState({ current: step });
  };
}
