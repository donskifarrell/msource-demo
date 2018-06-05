import { Card, Icon, Spin, Steps } from 'antd';
import Button from 'antd/lib/button/button';
import * as React from 'react';
import { Component } from 'react';
import { UploadFile } from './upload-file';
const Step = Steps.Step;

import { API_ENDPOINT } from '../config';

interface State {
  current: STEP;
  jobId: number;
  hasQuote: boolean;
  quote: QuoteDetails;
}

enum STEP {
  UPLOAD,
  QUOTE
}

interface QuoteUploadResult {
  success: boolean;
  jobId: number;
}

interface QuoteDetails {
  success?: boolean;
  state?: string;
  details: {
    costs: {
      material: number;
      time: number;
      total: number;
    };
    duration?: number;
    filament: {
      layers?: number;
      length?: number;
    };
  };
}

export class Workflow extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      current: STEP.UPLOAD,
      hasQuote: false,
      jobId: -1,
      quote: {
        details: {
          costs: {
            material: 0,
            time: 0,
            total: 0
          },
          filament: {}
        }
      }
    };
  }

  public render() {
    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          <Step key={STEP.UPLOAD} title="Upload .STL file" />
          {this.state.current === STEP.QUOTE && !this.state.hasQuote ? (
            <Step
              key={STEP.QUOTE}
              title="Quote"
              icon={<Icon type="loading" />}
            />
          ) : (
            <Step key={STEP.QUOTE} title="Quote" />
          )}
        </Steps>

        <div className="steps-content">
          {this.state.current === STEP.QUOTE ? (
            this.renderPricingStep()
          ) : (
            <UploadFile onUploadComplete={this.handleUploadComplete} />
          )}
        </div>
      </div>
    );
  }

  private renderPricingStep = () => {
    return (
      <div>
        <div className="pricing-details">
          <Card>
            {this.state.current === STEP.QUOTE && !this.state.hasQuote ? (
              <Spin
                indicator={
                  <Icon type="loading" style={{ fontSize: 24 }} spin={true} />
                }
              />
            ) : (
              // UGH!!!! - Had to add the extra checks as the backend sometime returns empty data. Fixable, but this is rushed..
              <>
                <h3>Filament</h3>
                <div>
                  Layers:{' '}
                  {this.state.quote &&
                  this.state.quote.details &&
                  this.state.quote.details.filament
                    ? this.state.quote.details.filament.layers
                    : 'N/A'}
                </div>
                <div>
                  Length:{' '}
                  {this.state.quote &&
                  this.state.quote.details &&
                  this.state.quote.details.filament
                    ? this.state.quote.details.filament.length
                    : 'N/A'}
                </div>
                <br />
                <h3>Duration</h3>
                <div>
                  {this.state.quote && this.state.quote.details
                    ? this.state.quote.details.duration
                    : 'N/A'}{' '}
                  hours
                </div>
                <br />
                <h3>Costs</h3>
                <div>
                  Material Cost:{' '}
                  {this.state.quote &&
                  this.state.quote.details &&
                  this.state.quote.details.costs &&
                  this.state.quote.details.costs.material
                    ? this.state.quote.details.costs.material.toLocaleString(
                        'en-GB',
                        { style: 'currency', currency: 'GBP' }
                      )
                    : 'N/A'}
                </div>
                <div>
                  Time Cost:{' '}
                  {this.state.quote &&
                  this.state.quote.details &&
                  this.state.quote.details.costs &&
                  this.state.quote.details.costs.time
                    ? this.state.quote.details.costs.time.toLocaleString(
                        'en-GB',
                        { style: 'currency', currency: 'GBP' }
                      )
                    : 'N/A'}
                </div>
              </>
            )}
          </Card>
        </div>
        <div className="pricing-actions">
          <Button type="primary" onClick={() => this.to(STEP.UPLOAD)}>
            <Icon type="left" />Back
          </Button>

          <div className="pricing-actions__right">
            <h3>
              Latest Quote:{' '}
              <strong>
                {this.state.quote && this.state.quote.details.costs.total
                  ? this.state.quote.details.costs.total.toLocaleString(
                      'en-GB',
                      { style: 'currency', currency: 'GBP' }
                    )
                  : '£ N/A'}
              </strong>
            </h3>
          </div>
        </div>
      </div>
    );
  };

  private handleUploadComplete = (info: QuoteUploadResult) => {
    // TODO: Error handling on bad uploads
    this.setState({ current: STEP.QUOTE, jobId: info.jobId });
    this.getQuoteDetails();
  };

  private getQuoteDetails = () => {
    fetch(API_ENDPOINT + 'api/get-quote?jobId=' + this.state.jobId)
      .then(res => res.json())
      .then((data: QuoteDetails) => {
        // tslint:disable-next-line:no-console
        console.log(data);

        if (this.state.current === STEP.QUOTE && data.state !== 'SUCCESS') {
          setTimeout(this.getQuoteDetails, 1000);
        } else {
          this.setState({ quote: data, hasQuote: true });
        }
      });
  };

  private to = (step: STEP) => {
    this.setState({ current: step });
  };
}
