import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import QRCode from 'qrcode';
import QrReader from 'react-qr-reader';
import { Button } from 'rmwc/Button';
import { SimpleDialog } from 'rmwc/Dialog';
import { Typography } from 'rmwc';

const TORRENT_FILE_NAME = 'cheff recipes';

class QrCodeExport extends Component {
  constructor(props) {
    super(props);
    this.exportRecipesToQRCode = this.exportRecipesToQRCode.bind(this);
    this.importRecipesToQRCode = this.importRecipesToQRCode.bind(this);
    this.handleScan = this.handleScan.bind(this);
    this.handleScanError = this.handleScanError.bind(this);
    this.startTorrentFetching = this.startTorrentFetching.bind(this);
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

  importRecipesToQRCode() {
    this.setState({ importDialogIsOpen: true });
  }

  startTorrentFetching() {
    const client = new WebTorrent();

    client.add(this.state.torrentId, torrent => {
      torrent.on('done', () => {
        console.log('torrent download finished');

        torrent.files
          .find(file => file.name === TORRENT_FILE_NAME)
          .getBuffer((err, buf) => {
            if (err) throw err;
            const recipesSerialized = buf.toString('ascii');
            if (recipesSerialized) {
              try {
                const recipes = JSON.parse(recipesSerialized);
                this.props.importRecipes(recipes);
              } catch (err) {
                console.error(err);
              }
            }
          });
      });
    });
  }

  handleScan(torrentId) {
    if (torrentId) {
      this.setState({ torrentId });
    }
  }

  handleScanError(err) {
    // todo show snackbar
    console.error(err);
  }

  render() {
    return (
      <React.Fragment>
        <Button onClick={this.exportRecipesToQRCode}>Export</Button>
        <Button onClick={this.importRecipesToQRCode}>Import</Button>

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

        <SimpleDialog
          title="Import Recipes"
          open={this.state.importDialogIsOpen}
          onClose={() => this.setState({ importDialogIsOpen: false })}
          acceptLabel="Save"
          onAccept={this.startTorrentFetching}
          onCancel={() => console.log('cancelled import')}
        >
          <Typography use="subtitle2">Scan QR code</Typography>
          {this.state.importDialogIsOpen && (
            <QrReader
              delay={500}
              onError={this.handleScanError}
              onScan={this.handleScan}
              style={{ width: '100%' }}
            />
          )}
          <p>{this.state.torrentId && 'Ready'}</p>
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

export default QrCodeExport;
