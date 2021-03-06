<?php

if (!isset($bdd)) {
	include(__DIR__ . '/connexion_sql.php');
}

$bookmarkArray = [];

$req = $bdd->query('SELECT id, url, name FROM bookmarks');
while ($data = $req->fetch()) {
	$entry = [];
	$entry['id'] = $data['id'];
	$entry['name'] = $data['name'];
	$entry['url'] = $data['url'];

	$bookmarkArray[] = $entry;
}

$req->closeCursor();

echo json_encode($bookmarkArray);
