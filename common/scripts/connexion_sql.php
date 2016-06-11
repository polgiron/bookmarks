<?php
	$pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;

	// $bdd = new PDO('mysql:host=mysql.internet-hebergeur.com;dbname=H0396_ov', 'H0396', 'i6J3ZKcfTJQFE00f', $pdo_options);
	$bdd = new PDO('mysql:host=localhost;dbname=bookmarks', 'root', 'p', $pdo_options);

	$bdd->exec("SET CHARACTER SET utf8");
