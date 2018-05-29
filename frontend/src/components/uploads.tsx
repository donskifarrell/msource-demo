import { Component } from 'react';

interface Props {
  render: (prevUploads: string[]) => {};
}

export class Uploads extends Component<Props> {
  // Potentially previous uploads can appear
  public render() {
    return this.props.render([]);
  }
}
