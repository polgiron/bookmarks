<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">

	<title>Bookmarks</title>

	<!-- FAVICON -->
	<!-- <link rel="icon" href="favicon.ico"> -->

	<!-- RESPONSIVE -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

	<!-- CSS -->
	<link rel="stylesheet" href="css/home.min.css">

	<!-- LIB -->
	<script src="//use.fontawesome.com/a5176dbf70.js"></script>
	<script src="common/js/jquery-2.1.1.min.js"></script>

	<!-- JS -->
	<script type="text/javascript" src="common/js/common.js"></script>
	<script type="text/javascript" src="home.js"></script>
</head>
<body>
	<?php print_r($bookmarkArray); ?>

	<!-- MAIN WRAPPER -->
	<div id="main-wrapper">
		
		<!-- HEADER -->
		<header>
			<a href="./">
				<h1>Bookmarks</h1>
			</a>
		</header>

		<!-- ADD NEW BOOKMARK -->
		<div id="add-bookmark-wrapper">
			<div class="content">
				<input type="text" class="name" placeholder="name...">
				<input type="text" class="url" placeholder="url...">
				<button id="add-bookmark">
					<i class="fa fa-plus-circle"></i> Add a bookmark
				</button>
			</div>
			<div class="error">
				Error message
			</div>
		</div>

		<!-- BOOKMARKS -->
		<div id="bookmarks-list">
			
		</div>

		<!-- PAGINATION -->
		<div id="pagination">
			<div class="content">
				<div id="prev">prev</div>
				<ul id="paginationList"></ul>
				<div id="next">next</div>
			</div>
		</div>
	</div>
</body>
