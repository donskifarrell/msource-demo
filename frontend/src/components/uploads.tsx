import { Component } from 'react';

interface Props {
  render: (prevUploads: string[]) => {};
}

export class Uploads extends Component<Props> {
  public render() {
    return this.props.render(['upload first', 'second upload']);
  }
}
