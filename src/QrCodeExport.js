import React, { Component } from 'react';
import QRCode from 'qrcode';
import QrReader from 'react-qr-reader';
import { CardAction, CardActions, CardActionButtons } from 'rmwc/Card';
import { SimpleDialog } from 'rmwc/Dialog';
import { Typography } from 'rmwc';

class QrCodeExport extends Component {
  constructor(props) {
    super(props);
    this.exportRecipesToQRCode = this.exportRecipesToQRCode.bind(this);
    this.importRecipesToQRCode = this.importRecipesToQRCode.bind(this);
    this.handleScan = this.handleScan.bind(this);
    this.handleScanError = this.handleScanError.bind(this);
    this.importScanedRecipes = this.importScanedRecipes.bind(this);
    this.state = {};
  }

  exportRecipesToQRCode() {
    const { props } = this;
    const recipesSerialized = JSON.stringify(props.recipes);

    QRCode.toDataURL(recipesSerialized)
      .then(url => {
        this.setState({ exportDialogIsOpen: true, qrCodeDataUrl: url });
      })
      .catch(err => {
        // TODO show snackbar
        console.error(err);
      });
  }

  importRecipesToQRCode() {
    this.setState({ importDialogIsOpen: true });
  }

  importScanedRecipes() {
    const { recipesScanned } = this.state;
    if (recipesScanned) {
      try {
        const recipes = JSON.parse(recipesScanned);
        this.props.importRecipes(recipes);
      } catch (err) {
        console.error(err);
      }
    }
  }

  handleScan(recipesScanned) {
    if (recipesScanned) {
      this.setState({ recipesScanned });
    }
  }

  handleScanError(err) {
    // todo show snackbar
    console.error(err);
  }

  render() {
    return (
      <React.Fragment>
        <CardActions>
          <CardActionButtons>
            <CardAction onClick={this.exportRecipesToQRCode}>Export</CardAction>
            <CardAction onClick={this.importRecipesToQRCode}>Import</CardAction>
          </CardActionButtons>
        </CardActions>

        <SimpleDialog
          title="Import Recipes"
          open={this.state.importDialogIsOpen}
          onClose={() => this.setState({ importDialogIsOpen: false })}
          acceptLabel="Save"
          onAccept={this.importScanedRecipes}
          onCancel={() => console.log('Cancelled')}
        >
          <Typography use="subtitle2">Scan QR code</Typography>
          <QrReader
            delay={500}
            onError={this.handleScanError}
            onScan={this.handleScan}
            style={{ width: '100%' }}
          />
          <p>{this.state.recipesScanned && 'Ready'}</p>
        </SimpleDialog>

        <SimpleDialog
          title="Export Recipes"
          open={this.state.exportDialogIsOpen}
          onClose={() => this.setState({ exportDialogIsOpen: false })}
          onAccept={() => console.log('Accepted')}
          acceptLabel="Done"
          onCancel={() => console.log('Cancelled')}
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

export default QrCodeExport;
