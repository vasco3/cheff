# Sync Data

> Transfer data peer-to-peer from one device to another.

As a user I would like to use the same recipes in my laptop and smartphone to avoid having to type them twice.

```mermaid
sequenceDiagram
  Note over laptop: click export
  Note over laptop: displays QR Code
  Note over iPhone: click import
  Note over iPhone: displays Scanner
  iPhone-->>laptop: scan QR Code
  Note over iPhone: import
```

#### Exporting

```mermaid
graph TB
  1(fetch recipes)
  2(stringify recipes)
  0(create webtorrent client)
  3(convert torrentId into QR)
  4(onDialogClose kill torrent)

  1-->2
  2-->0
  0-->3
  3-->4
```

#### Importing

```mermaid
graph TB
  1(open dialog)
  3(open scanner)
  0(scan QR Code)
  2(create torrent client)
  4(connect torrentId)
  5(receive recipes)
  7(parse recipes)
  6(import recipes to Cheff)

  1-->3
  3-->0
  0-->2
  2-->4
  4-->5
  5-->7
  7-->6
```
