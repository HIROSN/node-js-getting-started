'use strict';

var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
  noteBody: 'String',
  email: 'String',
  time: 'Number'
});

var Note = mongoose.model('Note', noteSchema);

Note.schema.path('noteBody').validate(function(value) {
  return value && value.length <= 140;
}, 'Invalid post');

module.exports = Note;
