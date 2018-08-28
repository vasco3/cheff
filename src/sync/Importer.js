import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import QrReader from 'react-qr-reader';
import { Button } from 'rmwc/Button';
import { SimpleDialog } from 'rmwc/Dialog';
import { Typography } from 'rmwc';

const TORRENT_FILE_NAME = 'cheff recipes';

class Importer extends Component {
  constructor(props) {
    super(props);
    this.importRecipesToQRCode = this.importRecipesToQRCode.bind(this);
    this.handleScan = this.handleScan.bind(this);
    this.handleScanError = this.handleScanError.bind(this);
    this.startTorrentFetching = this.startTorrentFetching.bind(this);
    this.state = {};
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
        <Button onClick={this.importRecipesToQRCode}>Import</Button>

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

export default Importer;
