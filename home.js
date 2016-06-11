var AJAX_POST_PATH = 'common/scripts/ajax_post_db.php';
var AJAX_GET_PATH = 'common/scripts/ajax_get_bookmarks.php';

// TEMPLATE
var $bookmarkEntryTemplate = $('<li>')
								.addClass('bookmarkEntry')
								.append(
									$('<div>')
                    .addClass('content')
                    .append(
                      $('<input>')
                        .addClass('name')
                        .attr('type', 'text')
                        .attr('disabled', true),
                      $('<input>')
                        .addClass('url')
                        .attr('type', 'url')
                        .attr('disabled', true),
                      $('<div>')
                        .addClass('tools-wrapper')
                        .append(
                          $('<i>')
                            .addClass('fa fa-fw fa-save save-bookmark'),
                          $('<i>')
                            .addClass('fa fa-fw fa-pencil edit-bookmark'),
                          $('<i>')
                            .addClass('fa fa-fw fa-trash delete-bookmark'),
                          $('<a>')
                            .addClass('open-bookmark')
                            .attr('target', '_blank')
                            .append(
                              $('<i>')
                                .addClass('fa fa-fw fa-external-link')
                            )
                        )
                    ),
                  $('<div>')
                    .addClass('error')
                    .text('This is an error')
								);


// ****************************
// SIZE OBJECT

Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};


// ****************************
// VALIDATE URL

var validateURL = function(textval) {
  var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}


// ****************************
// ADD BOOKMARK DOM

var addBookmarkDOM = function(id, name, url, pageId) {
	var $bookmarkEntry = $bookmarkEntryTemplate.clone();

  // Data id
	$bookmarkEntry.data('id', id);

  // Variables
  $bookmarkEntry.find('.name').val(name);
	$bookmarkEntry.find('.name').attr('title', name);
  $bookmarkEntry.find('.url').val(url);
  $bookmarkEntry.find('.url').attr('title', url);

  // Link
	$bookmarkEntry.find('.open-bookmark').attr('href', url);

  // Add DOM
  // $bookmarkEntry.prependTo('#bookmarks-list .page[data-id=' + pageId + ']');
	$bookmarkEntry.appendTo('#bookmarks-list .page[data-id=' + pageId + ']');
}


// ****************************
// GET BOOKMARK FROM DB

var bookmarkArray = {};

var addPage = function(id){
  // Page
  var $page = $('<ul>')
                    .attr('data-id', id)
                    .addClass('page');

  $page.appendTo('#bookmarks-list');

  // Pagination
  var $pagination = $('<li>')
                        .attr('data-id', id)
                        .addClass('pageLink')
                        .text(id + 1);

  $pagination.appendTo('#paginationList');
}

var showPage = function(id){
  // Display this page
  $('.page').hide();
  $('.page[data-id=' + id + ']').show();

  // Pagination
  $('.pageLink').removeClass('active');
  $('.pageLink[data-id=' + id + ']').addClass('active');

  // Display prev or next?
  $('#next, #prev').show();
  if($('.pageLink').first().data('id') == id){
    $('#prev').hide();
  }
  if($('.pageLink').last().data('id') == id){
    $('#next').hide();
  }
}

var displayBookmarks = function(){
  var numberBookmarks = Object.size(bookmarkArray);
  var numberPages = Math.ceil(numberBookmarks / 3);
  // console.log(numberPages);

  // Reset old entries
  $('#bookmarks-list').empty();
  $('#paginationList').empty();

  // Add the pages
  for (var i = 0; i < numberPages; i++) {
    addPage(i);
  }

  // Add one page if empty
  if(numberPages == 0) addPage(0);

  // Add bookmarks to the pages
  var i = 0;
  var pageId = 0;
  $.each(bookmarkArray, function(id, data) {
    // var pageId = page;
    // console.log(i % 3);
    // console.log(pageId);

    if(i % 3 == 0 && i != 0) pageId++;

    addBookmarkDOM(id, data.name, data.url, pageId);
    
    i++;
  });

  // We display the first page
  showPage(0);
}

var getBookmarks = function(){
	$.get(AJAX_GET_PATH, function(data) {
		bookmarkArray = JSON.parse(data);
		// console.log(data);
		console.log(bookmarkArray);

    displayBookmarks();
	});
}

// Click on a pagination link
$(document).on('click', '.pageLink', function(event) {
  var id = $(this).data('id');
  showPage(id);
});

// Click on prev
$(document).on('click', '#prev', function(event) {
  var id = $('.pageLink.active').data('id');
  showPage(id - 1);
});

// Click on next
$(document).on('click', '#next', function(event) {
  var id = $('.pageLink.active').data('id');
  showPage(id + 1);
});


// ****************************
// ADD BOOKMARK

var isInt = function(value) {
	return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

var addBookmarkDB = function(name, url){
	console.log(name, url);
	$.post(AJAX_POST_PATH, {
			ajaxType: 1,
			name: name,
			url: url
		}
	).done(function(data){
		if(isInt(data)){
			console.log('Bookmark added successfully');
			// console.log(data);

			// Remove DOM
			// addBookmarkDOM(data, name, url, 0);

      bookmarkArray[data] = {
        name: name,
        url: url,
      }

      console.log(bookmarkArray);

      // displayBookmarks();
      getBookmarks();
		}
		else{
			alert('Error : ' + data);
		}
	});
}

// Add a bookmark entry
$(document).on('click', '#add-bookmark', function(event) {
	var $addBookmarkWrapper = $(this).parents('#add-bookmark-wrapper');
	var name = $addBookmarkWrapper.find('.name').val();
	var url = $addBookmarkWrapper.find('.url').val();
  var $error = $addBookmarkWrapper.find('.error');

  // Check URL
  if(!validateURL(url)){
    $error.text('Please enter a valid URL (http://www.example.com)');
    $error.show();
    $addBookmarkWrapper.find('.url').focus();
  }
  else{
    // Hide error
    $error.hide();
    // Add bookmark
    addBookmarkDB(name, url);
  }
});


// ****************************
// DELETE BOOKMARK

var deleteBookmark = function(id, $bookmarkEntry){
  $.post(AJAX_POST_PATH, {
      ajaxType: 2,
      id: id,
    }
  ).done(function(data){
    if(data == 1){
      console.log('Bookmark deleted successfully');
      console.log(data);

      // Remove DOM
      // $bookmarkEntry.remove();

      delete bookmarkArray[id]; 

      displayBookmarks();
    }
    else{
      alert('Error : ' + data);
    }
  });
}

// Delete a bookmark entry
$(document).on('click', '.bookmarkEntry .delete-bookmark', function(event) {
  var $bookmarkEntry = $(this).parents('.bookmarkEntry');
  var id = $bookmarkEntry.data('id');

  deleteBookmark(id, $bookmarkEntry);
});


// ****************************
// EDIT BOOKMARK

var editBookmark = function(id, name, url, $bookmarkEntry){
	$.post(AJAX_POST_PATH, {
			ajaxType: 3,
      id: id,
      name: name,
			url: url,
		}
	).done(function(data){
		if(data == 1){
			console.log('Bookmark edited successfully');
			console.log(data);

      // Disable inputs
      $bookmarkEntry.find('input').attr('disabled', true);
      $bookmarkEntry.find('input').removeClass('edit');

      // Show save button
      $bookmarkEntry.find('.save-bookmark').hide();
      $bookmarkEntry.find('.edit-bookmark').show();
		}
		else{
			alert('Error : ' + data);
		}
	});
}

// Edit a bookmark entry
$(document).on('click', '.bookmarkEntry .edit-bookmark', function(event) {
  var $bookmarkEntry = $(this).parents('.bookmarkEntry');

  // Enable inputs
  $bookmarkEntry.find('input').removeAttr('disabled');
  $bookmarkEntry.find('input').addClass('edit');

  // Focus name input
  $bookmarkEntry.find('.name').focus();

  // Show save button
  $(this).hide();
  $bookmarkEntry.find('.save-bookmark').show();
});

// Save a bookmark entry
$(document).on('click', '.bookmarkEntry .save-bookmark', function(event) {
	var $bookmarkEntry = $(this).parents('.bookmarkEntry');
	var id = $bookmarkEntry.data('id');
  var name = $bookmarkEntry.find('.name').val();
  var url = $bookmarkEntry.find('.url').val();
  var $error = $bookmarkEntry.find('.error');

  // Check URL
  if(!validateURL(url)){
    $error.text('Please enter a valid URL (http://www.example.com)');
    $error.show();
    $bookmarkEntry.find('.url').focus();
  }
  else{
    // Hide error
    $error.hide();
    // Edit bookmark
    editBookmark(id, name, url, $bookmarkEntry);
  }
});






// Document ready, load bookmarks
$(document).ready(function() {

	getBookmarks();

});
