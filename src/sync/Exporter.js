import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import QRCode from 'qrcode';
import { Button } from 'rmwc/Button';
import { SimpleDialog } from 'rmwc/Dialog';
import { Typography } from 'rmwc';

const TORRENT_FILE_NAME = 'cheff recipes';

class Exporter extends Component {
  constructor(props) {
    super(props);
    this.exportRecipesToQRCode = this.exportRecipesToQRCode.bind(this);
    this.state = {};
  }

  exportRecipesToQRCode() {
    const recipesSerialized = JSON.stringify(this.props.recipes);

    const recipesBuffer = Buffer.from(recipesSerialized, 'ascii');

    const client = new WebTorrent();

    client.seed(recipesBuffer, { name: TORRENT_FILE_NAME }, torrent => {
      console.log('Client is seeding ' + torrent.magnetURI);

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
  }

  render() {
    return (
      <React.Fragment>
        <Button onClick={this.exportRecipesToQRCode}>Export</Button>

        <SimpleDialog
          title="Export Recipes"
          open={this.state.exportDialogIsOpen}
          onClose={() => this.setState({ exportDialogIsOpen: false })}
          onAccept={() => console.log('accepted')}
          acceptLabel="Done"
          onCancel={() => console.log('cancelled')}
        >
          <Typography use="subtitle2">QR code generated</Typography>
          <img src={this.state.qrCodeDataUrl} className="qrImage" />
        </SimpleDialog>

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
