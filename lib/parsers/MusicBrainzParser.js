const merge = require('deepmerge');
const NodeBrainz = require('nodebrainz');

const JsonParser = require('./JsonParser');
const Util = require('../Util');

const inc = [
  'artists', 'labels', 'recordings',
  'artist-rels', 'release-rels', 'url-rels', 'work-rels',
  'recording-level-rels', 'work-level-rels'
];

const nb = new NodeBrainz({
  userAgent: 'mb2thw/0.0.1 (https://github.com/TehTotalPwnage/mb2thw)'
})

class MusicBrainzParser extends JsonParser {
  static async prepare(args) {
    if (!args.musicbrainz) {
      return new MusicBrainzParser();
    }
    let data = await new Promise(function(resolve, reject) {
      nb.release(args.musicbrainz, {
        inc: inc.join('+')
      }, function(error, response) {
        if (error) {
          reject(error)
        } else {
          resolve(response);
        }
      });
    });
    return new MusicBrainzParser(data);
  }

  constructor(data) {
    super(data);
    if (this.data) {
      this.relations = this.__parseRelations(data);
    }
  }

  async __loadKey(args) {
    if (!args) {
      return undefined;
    }
    return (args.key || args).split('/./').reduce(function(prev, curr) {
      return prev ? prev[curr] : undefined;
    }, (args.data === 'relations' ? this.relations : this.data));
  }

  async get(args) {
    if (typeof args === 'function') {
      return await args();
    }
    return await this.__loadKey(args);
  }

  __loadRelations(relations, album, recur) {
    let data = {
      arrangers: [],
      designers: [],
      illustrators: [],
      lyricists: [],
      masterers: [],
      otherStaff: {},
      producers: [],
      vocalists: [],
      urls: {}
    };

    for (let relation of relations) {
      switch(relation['target-type']) {
        case 'artist': {
          switch(relation.type) {
            case 'arranger': {
              data.arrangers.push(relation['target-credit'] || relation.artist.name);
              break;
            }
            case 'lyricist': {
              data.lyricists.push(relation['target-credit'] || relation.artist.name);
              break;
            }
            case 'vocal': {
              data.vocalists.push(relation['target-credit'] || relation.artist.name);
              break;
            }
            /* eslint-disable no-fallthrough */
            case 'design/illustration': {
              if (album) {
                break;
              }
            }
            case 'mastering': {
              if (album) {
                data.masterers.push(relation['target-credit'] || relation.artist.name);
                break;
              }

            }
            case 'producer': {
              if (album) {
                data.producers.push(relation['target-credit'] || relation.artist.name);
                break;
              }
            }
            case 'composer': {
              if (relation.artist.name === "ZUN") {
                break;
              }
            }
            default: {
              if (!data.otherStaff[relation.type]) {
                data.otherStaff[relation.type] = []
              }
              data.otherStaff[relation.type].push(relation['target-credit'] || relation.artist.name);
            }
            /* eslint-enable no-fallthrough */
          }
          break;
        }
        case 'url': {
          if (!data.urls[relation.type]) {
            data.urls[relation.type] = [];
          }
          data.urls[relation.type].push(relation.url.resource);
          break;
        }
        case 'work': {
          if (!recur) {
            data = merge(data, this.__loadRelations(relation.work.relations, false, true))
          }
        }
      }
    }
    for (let item in data) {
      if (Array.isArray(data[item])) {
        data[item] = Util.filterDuplicates(data[item]);
      } else {
        for (let subItem in data[item]) {
          data[item][subItem] = Util.filterDuplicates(data[item][subItem]);
        }
      }
    }
    return data;
  }

  __parseRelations(data) {
    let relations = {
      album: {},
      tracks: []
    }
    relations.album = this.__loadRelations(data.relations, true);
    for (let track of data.media[0].tracks) {
      let trackData = this.__loadRelations(track.recording.relations);
      relations.tracks.push(trackData);
      relations.album = merge(relations.album, trackData)
    }
    for (let item in relations.album) {
      if (Array.isArray(relations.album[item])) {
        relations.album[item] = Util.filterDuplicates(relations.album[item]);
      } else {
        for (let subItem in relations.album[item]) {
          relations.album[item][subItem] = Util.filterDuplicates(relations.album[item][subItem]);
        }
      }
    }
    return relations;
  }
}

module.exports = MusicBrainzParser;
