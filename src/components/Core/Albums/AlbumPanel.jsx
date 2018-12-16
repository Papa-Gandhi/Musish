import React from 'react';

import classes from './AlbumPanel.scss';
import {artworkForMediaItem, humanifyMillis} from "../common/Utils";
import SongList from "../common/SongList/SongList";
import Loader from "../../common/Loader";

export default class AlbumsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      album: null,
    };

    this.ref = React.createRef();
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const album = await music.api.library.album(this.props.album.id);

    const albumLength = album.relationships.tracks.data.reduce((totalDuration, track) => (totalDuration + track.attributes.durationInMillis), 0);

    this.setState({
      album,
      runtime: humanifyMillis(albumLength),
    });
  }

  render() {
    const {album, runtime} = this.state;

    if (!album) {
      return <Loader />;
    }

    const artworkURL = artworkForMediaItem(album, 220);

    return (
      <div className={classes.panel}>
        <div className={classes.aside}>
          <div className={classes.artworkWrapper}>
            <img src={artworkURL}/>
          </div>
          <span className={classes.albumRuntimeDescription}>{album.attributes.trackCount} songs, {runtime}</span>
        </div>
        <div className={classes.main} ref={this.ref}>
          <span className={classes.title}>{album.attributes.name}</span>
          <span className={classes.subtitle}>{album.attributes.artistName}</span>
          <SongList scrollElement={this.ref} load={() => album.relationships.tracks.data} album={true}/>
        </div>
      </div>
    );
  }
}
