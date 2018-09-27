import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import QRCode from 'qrcode';
import { Button } from 'rmwc/Button';
import { SimpleDialog } from 'rmwc/Dialog';
import { Typography } from 'rmwc';

import { TORRENT_FILE_NAME } from './constants';

class Exporter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  exportRecipesToQRCode = () => {
    const self = this;
    const recipesSerialized = JSON.stringify(this.props.recipes);

    const recipesBuffer = Buffer.from(recipesSerialized, 'ascii');

    const client = new WebTorrent();

    client.seed(recipesBuffer, { name: TORRENT_FILE_NAME }, torrent => {
      console.log('Client is seeding ' + torrent.magnetURI);
      self.setState({ magnetURI: torrent.magnetURI });

      QRCode.toDataURL(torrent.magnetURI)
        .then(url => {
          this.setState({
            exportDialogIsOpen: true,
            qrCodeDataUrl: url,
            torrentClient: client,
          });
        })
        .catch(err => {
          client.destroy();
          // TODO show snackbar
          console.error(err);
        });
    });
  };

  render() {
    return (
      <React.Fragment>
        <Button onClick={this.exportRecipesToQRCode}>Export</Button>

        <SimpleDialog
          title="Export Recipes"
          open={this.state.exportDialogIsOpen}
          onClose={() => this.setState({ exportDialogIsOpen: false })}
          onAccept={() => console.log('accepted')}
          acceptLabel="Stop Seeding"
          onCancel={() => console.log('cancelled')}
        >
          <Typography use="subtitle2">QR code generated</Typography>
          <img src={this.state.qrCodeDataUrl} className="qrImage" />
        </SimpleDialog>

        {this.state.magnetURI && `Seeding ${this.state.magnetURI}`}

        {this.state.error}

        <style jsx>{`
          .qrImage {
            width: 16rem;
            margin: 0 auto;
            display: block;
          }
        `}</style>
      </React.Fragment>
    );
  }
}

export default Exporter;
