<?php
$zip = new ZipArchive;
$res = $zip->open('incoltec-web-deploy.zip');
if ($res === TRUE) {
  $zip->extractTo('./');
  $zip->close();
  echo 'ok';
} else {
  echo 'failed';
}
?>
