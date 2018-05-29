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
  QUOTE
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
          <Step key={STEP.QUOTE} title="Quote" />
        </Steps>

        <div className="steps-content">
          {this.state.current === STEP.QUOTE ? (
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
        </div>
      </div>
    );
  };

  private uploadFileHandler = (info: any) => {
    // TODO: Error handling on bad uploads
    this.setState({ current: STEP.QUOTE });
  };

  private getPricingQuote = () => {
    this.setState({ quotePrice: 100.97 });
  };

  private to = (step: STEP) => {
    this.setState({ current: step });
  };
}
