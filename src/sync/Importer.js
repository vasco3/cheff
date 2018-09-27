import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import QrReader from 'react-qr-reader';
import { Button } from 'rmwc/Button';
import { SimpleDialog } from 'rmwc/Dialog';
import { Typography } from 'rmwc';

import { TORRENT_FILE_NAME } from './constants';

class Importer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  importRecipesToQRCode = () => {
    this.setState({ importDialogIsOpen: true });
  };

  startTorrentFetching = () => {
    const self = this;
    const client = new WebTorrent();

    if (this.state.torrentId) {
      client.add(this.state.torrentId, torrent => {
        torrent.on('done', () => {
          console.log('torrent download finished');

          torrent.files
            .find(file => file.name === TORRENT_FILE_NAME)
            .getBuffer((err, buf) => {
              if (err) {
                const { message } = err || {};
                console.error(err);
                self.setState({ error: message });
              }
              const recipesSerialized = buf.toString('ascii');
              if (recipesSerialized) {
                try {
                  const recipes = JSON.parse(recipesSerialized);
                  self.props.importRecipes(recipes);
                  self.setState({ done: 'Import complete!' });
                } catch (err) {
                  console.error(err);
                }
              }
            });
        });
      });
    } else {
      self.setState({ error: 'missing torrentId' });
    }
  };

  handleScan = torrentId => {
    if (torrentId) {
      this.setState({ torrentId });
    }
  };

  handleScanError = err => {
    // todo show snackbar
    console.error(err);
    const { message } = err || {};
    this.setState({ error: message });
  };

  render() {
    return (
      <React.Fragment>
        <Button onClick={this.importRecipesToQRCode}>Import</Button>

        <SimpleDialog
          title="Import Recipes"
          open={this.state.importDialogIsOpen}
          onClose={() => this.setState({ importDialogIsOpen: false })}
          acceptLabel="Start"
          onAccept={this.startTorrentFetching}
          onCancel={() => console.log('cancelled import')}
        >
          <Typography use="subtitle2">Scan QR code</Typography>
          {this.state.importDialogIsOpen && (
            <QrReader
              delay={500}
              onError={this.handleScanError}
              onScan={this.handleScan}
              style={{ maxWidth: 300, width: '90%' }}
            />
          )}
          <p>{this.state.torrentId && 'Ready'}</p>
        </SimpleDialog>

        {this.state.error}
        {this.state.done}

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
