'use strict';

$(function() {
  var $cmds = $('#cmds');

  var apiNote = function(type, note, id) {
    var dfd = $.Deferred();
    var url = '/api/notes' + (id ? '/' + id : '');
    var data = note ? {noteBody: note} : null;

    $.ajax({
      type: type,
      data: data && JSON.stringify(data),
      contentType: data && 'application/json; charset=utf-8',
      url: url,
      dataType: 'json',
      success: dfd.resolve,
      error: dfd.reject
    });

    return dfd.promise();
  };

  var showNotes = function(type, note) {
    apiNote(type, note).then(function(results) {
      var template = Handlebars.compile(
        $('#notes-template').html());

      $(template(results)).
        hide().
        appendTo($('#notes')).
        slideDown('fast');
    });
  };

  var fixEditorWidth = function() {
    var $editors = $('.editor');
    var cs = window.getComputedStyle(document.body, null);

    var bodyWidth = $(document.body).width() -
      parseInt(cs.marginLeft) - parseInt(cs.marginRight);

    $editors.removeAttr('style');

    if ($('#editor').width() >= bodyWidth) {
      $editors.width(bodyWidth);
    }
  };

  showNotes();

  $(document.body).on('keydown', '.editor', function(event) {
    if ($(this).text().length >= 140 && event.which !== 8) {
      event.preventDefault();
    }
  });

  $('#post').on('click', function() {
    var $editor = $('#editor');
    var note = $editor.text();

    if (note) {
      showNotes('POST', note);
      $editor.text('');
    }
  });

  $('#notes').on('click', '.note', function() {
    var $this = $(this);

    $('.note').
      removeClass('editor').
      removeAttr('contenteditable');

    $this.
      attr('contenteditable', true).
      focus().
      addClass('editor');

    $cmds.insertAfter($this).slideDown('fast');
    fixEditorWidth();
  });

  $('#delete').on('click', function() {
    var $note = $('#notes .editor');

    apiNote('DELETE', null, $note.attr('id')).then(function() {
      $cmds.slideUp('fast', function() {
        $note.slideUp('fast', function() {
          $note.remove();
        });
      });
    });
  });

  $('#update').on('click', function() {
    var $note = $('#notes .editor');
    var note = $note.text();

    if (note) {
      apiNote('PUT', note, $note.attr('id')).done(function() {
        $cmds.slideUp('fast', function() {
          $note.
            removeClass('editor').
            removeAttr('contenteditable');
        });
      });
    }
  });

  $(window).on('resize', function() {
    fixEditorWidth();
  });

  fixEditorWidth();
});
